import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(new URL("../scripts/switch-demo-role.js", import.meta.url));
const envKeys = ["AUTH_MODE", "TEST_USER_UPN", "SINGLE_ACCOUNT_DEMO", "DEMO_PERSONA", "NODE_ENV"];
function run(dir, role) {
  const env = { ...process.env };
  for (const key of envKeys) delete env[key];
  return spawnSync(process.execPath, ["--env-file=.env", script, role], { cwd: dir, env, encoding: "utf8" });
}

test("role script persists user/manager/off, preserving unrelated settings and CRLF", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "leave-demo-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const envFile = join(dir, ".env");
  writeFileSync(envFile, "AUTH_MODE=entra\r\nTEST_USER_UPN=tester@example.com\r\n# Keep this\r\nPORT=4321\r\n");

  for (const role of ["user", "manager", "user", "off"]) {
    const result = run(dir, role);
    assert.equal(result.status, 0, result.stderr);
    const contents = readFileSync(envFile, "utf8");
    assert.ok(contents.includes("# Keep this\r\nPORT=4321\r\n"));
    assert.ok(contents.includes(`SINGLE_ACCOUNT_DEMO=${role === "off" ? "false" : "true"}\r\n`));
    assert.ok(contents.includes(`DEMO_PERSONA=${role === "off" ? "user" : role}\r\n`));
    assert.equal(contents.match(/^SINGLE_ACCOUNT_DEMO=/gm).length, 1);
    assert.equal(contents.match(/^DEMO_PERSONA=/gm).length, 1);
    assert.match(result.stdout, /Restart the MCP server/);
  }
});

test("role script rejects invalid arguments, missing account and production without writing .env", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "leave-demo-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const [role, contents, error] of [
    ["invalid", "AUTH_MODE=entra\nTEST_USER_UPN=tester@example.com\n", /Usage:/],
    ["manager", "AUTH_MODE=entra\n", /Set TEST_USER_UPN/],
    ["manager", "AUTH_MODE=entra\nTEST_USER_UPN=tester@example.com\nNODE_ENV=production\n", /not allowed in production/]
  ]) {
    writeFileSync(join(dir, ".env"), contents);
    const result = run(dir, role);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, error);
    assert.equal(readFileSync(join(dir, ".env"), "utf8"), contents);
  }
});
