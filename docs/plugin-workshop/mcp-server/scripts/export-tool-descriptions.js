// Calls tools/list on /mcp/quick and /mcp/manage and writes the result as the
// mcpToolDescription files a plugin connector packages (Exercises 5 and 7).
// Usage: npm run export:tools -- ../my-plugin/appPackage/tools   (server must be running with AUTH_MODE=none)
import { writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const base = `http://localhost:${process.env.PORT || 3001}`;
const outDir = resolve(process.argv[2] || "../plugin-solution/appPackage/tools");
mkdirSync(outDir, { recursive: true });

async function rpc(path, method, params = {}, id = 1) {
  const res = await fetch(base + path, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "x-demo-user": "M2001" },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params })
  });
  if (!res.ok) throw new Error(`${path} ${method} -> HTTP ${res.status}. Is the server running with AUTH_MODE=none?`);
  return (await res.json()).result;
}

for (const [path, file] of [["/mcp/quick", "quick-tools.json"], ["/mcp/manage", "manage-tools.json"]]) {
  await rpc(path, "initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "export", version: "1.0.0" } });
  const { tools } = await rpc(path, "tools/list", {}, 2);
  writeFileSync(join(outDir, file), JSON.stringify({ tools }, null, 2));
  console.log(`Wrote ${tools.length} tool(s) from ${path} -> ${join(outDir, file)}`);
}
