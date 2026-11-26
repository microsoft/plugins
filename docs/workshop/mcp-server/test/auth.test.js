import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { authenticate, singleAccountDemo, userFromToken } from "../src/auth.js";
import { registerLeaveServer } from "../src/tools.js";

const keys = ["AUTH_MODE", "SINGLE_ACCOUNT_DEMO", "TEST_USER_UPN", "DEMO_PERSONA", "NODE_ENV",
  "EMPLOYEE_UPN", "SECOND_EMPLOYEE_UPN", "MANAGER_UPN", "APPROVER_ROLE"];
let original;
beforeEach(() => {
  original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];
  Object.assign(process.env, {
    AUTH_MODE: "entra", SINGLE_ACCOUNT_DEMO: "true",
    TEST_USER_UPN: "tester@example.com", DEMO_PERSONA: "user"
  });
});
afterEach(() => {
  for (const key of keys) {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  }
});

function toolsFor(user) {
  const tools = new Map();
  registerLeaveServer({
    registerResource() {},
    registerTool(name, _config, handler) { tools.set(name, handler); }
  }, user, "manage");
  return tools;
}

test("one account switches personas and approval permissions without changing its token", async () => {
  const claims = { preferred_username: "TESTER@EXAMPLE.COM", roles: ["Leave.Approve"] };
  const user = userFromToken(claims);
  assert.equal(user.employee.id, "E1001");
  assert.equal(user.upn, "tester@example.com");
  assert.equal(user.isDemo, true);
  assert.equal(user.isManager, false);
  const denied = await toolsFor(user).get("approve_leave_request")({});
  assert.equal(denied.isError, true);
  assert.match(denied.content[0].text, /Only managers/);

  process.env.DEMO_PERSONA = "manager";
  const manager = userFromToken(claims);
  assert.equal(manager.employee.id, "M2001");
  assert.equal(manager.isManager, true);
  const pending = await toolsFor(manager).get("approve_leave_request")({});
  assert.equal(pending.structuredContent.mode, "pending");
  assert.deepEqual(new Set(pending.structuredContent.requests.map((r) => r.employeeId)), new Set(["E1001", "E1002"]));

  const ownLeave = await toolsFor(manager).get("approve_leave_request")({ requestId: "LR-1005" });
  assert.equal(ownLeave.isError, true);
  assert.match(ownLeave.content[0].text, /not from one of your direct reports/);
  const otherLeave = await toolsFor(user).get("delete_leave_request")({ requestId: "LR-1004" });
  assert.equal(otherLeave.isError, true);
  assert.match(otherLeave.content[0].text, /only delete your own/);
});

test("demo manager gets a simulated role even when the token has no roles", () => {
  process.env.DEMO_PERSONA = "manager";
  process.env.APPROVER_ROLE = "Custom.Approve";
  const user = userFromToken({ preferred_username: "tester@example.com" });
  assert.deepEqual(user.roles, ["Custom.Approve"]);
  assert.equal(user.isManager, true);
});

test("demo override is restricted to the configured sign-in account", () => {
  process.env.DEMO_PERSONA = "manager";
  process.env.SECOND_EMPLOYEE_UPN = "other@example.com";
  const user = userFromToken({ preferred_username: "other@example.com" });
  assert.equal(user.employee.id, "E1002");
  assert.equal(user.isDemo, false);
  assert.equal(user.isManager, false);
  assert.equal(userFromToken({ preferred_username: "unknown@example.com" }), null);
});

test("disabled demo restores ordinary mapping and token-based authorization", () => {
  process.env.SINGLE_ACCOUNT_DEMO = "false";
  process.env.EMPLOYEE_UPN = "tester@example.com";
  assert.equal(userFromToken({ preferred_username: "tester@example.com" }).isManager, false);
  const user = userFromToken({ preferred_username: "tester@example.com", roles: ["Leave.Approve"] });
  assert.equal(user.employee.id, "E1001");
  assert.equal(user.isManager, true);
  assert.equal(user.isDemo, false);
  delete process.env.EMPLOYEE_UPN;
  assert.equal(userFromToken({ preferred_username: "tester@example.com" }), null);
});

test("anonymous workshop mode keeps its existing employee and manager behavior", async () => {
  process.env.SINGLE_ACCOUNT_DEMO = "false";
  process.env.AUTH_MODE = "none";
  for (const [id, isManager] of [["E1001", false], ["M2001", true]]) {
    const req = { get: () => id };
    let accepted = false;
    await authenticate()(req, {}, () => { accepted = true; });
    assert.equal(accepted, true);
    assert.equal(req.user.employee.id, id);
    assert.equal(req.user.isManager, isManager);
    assert.equal(req.user.authMode, "none");
  }
});

test("unsafe or incomplete demo configuration fails explicitly", () => {
  process.env.NODE_ENV = "production";
  assert.throws(() => authenticate(), /not allowed in production/);
  delete process.env.NODE_ENV;
  process.env.AUTH_MODE = "none";
  assert.throws(() => singleAccountDemo(), /requires AUTH_MODE=entra/);
  process.env.AUTH_MODE = "entra";
  delete process.env.TEST_USER_UPN;
  assert.throws(() => singleAccountDemo(), /Set TEST_USER_UPN/);
  process.env.TEST_USER_UPN = "tester@example.com";
  process.env.DEMO_PERSONA = "invalid";
  assert.throws(() => singleAccountDemo(), /DEMO_PERSONA must/);
  process.env.SINGLE_ACCOUNT_DEMO = "yes";
  assert.throws(() => singleAccountDemo(), /must be true or false/);
});

test("demo mode still rejects missing and malformed bearer tokens, ignoring demo headers", async () => {
  process.env.DEMO_PERSONA = "manager";
  for (const token of [undefined, "Bearer invalid-token"]) {
    let status, body, challenge;
    const req = {
      path: "/mcp/manage",
      get: (key) => key === "authorization" ? token : "M2001"
    };
    const res = {
      set(_key, value) { challenge = value; return this; },
      status(value) { status = value; return this; },
      json(value) { body = value; return this; }
    };
    await authenticate()(req, res, () => assert.fail("Unauthenticated call reached tools"));
    assert.equal(status, 401);
    assert.match(challenge, /resource_metadata=/);
    assert.equal(body.error.code, -32001);
    assert.equal(req.user, undefined);
  }
});
