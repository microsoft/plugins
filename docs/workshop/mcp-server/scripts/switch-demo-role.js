import { readFileSync, writeFileSync } from "node:fs";
import { singleAccountDemo } from "../src/auth.js";

const role = process.argv[2];
if (process.argv.length !== 3 || !["user", "manager", "off"].includes(role)) {
  console.error("Usage: npm run demo:role -- user|manager|off");
  process.exit(1);
}

const changes = { SINGLE_ACCOUNT_DEMO: role === "off" ? "false" : "true" };
if (role !== "off") changes.DEMO_PERSONA = role;
Object.assign(process.env, changes);
singleAccountDemo();

let contents = readFileSync(".env", "utf8");
const newline = contents.includes("\r\n") ? "\r\n" : "\n";
for (const [key, value] of Object.entries(changes)) {
  const line = new RegExp(`^(?:export[ \\t]+)?${key}[ \\t]*=[^\\r\\n]*`, "gm");
  if (line.test(contents)) contents = contents.replace(line, `${key}=${value}`);
  else contents += `${contents && !contents.endsWith("\n") ? newline : ""}${key}=${value}${newline}`;
}
writeFileSync(".env", contents);
console.log(role === "off"
  ? "Single-account demo disabled. Normal UPN mappings and Entra token roles apply."
  : `Workshop persona set to ${role}. Only TEST_USER_UPN gets simulated permissions; OAuth is still required.`);
console.log("Restart the MCP server to load .env. No Entra role change or connector sign-in refresh is needed.");
