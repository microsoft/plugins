// Fabrikam People Hub - Leave MCP server (Streamable HTTP, stateless).
import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { authenticate, protectedResourceMetadata, singleAccountDemo } from "./auth.js";
import { registerLeaveServer, PROFILES } from "./tools.js";

const PORT = Number(process.env.PORT || 3001);
const demo = singleAccountDemo();
if (demo) console.warn(`WARNING: Single-account workshop demo enabled: ${demo.upn} acts as ${demo.employee.id}. Entra app roles are simulated for this account. Do not share or publish this server.`);
const app = express();
app.use(cors({ exposedHeaders: ["WWW-Authenticate", "Mcp-Session-Id"] }));
app.use(express.json({ limit: "1mb" }));

app.get("/healthz", (_req, res) => res.json({ ok: true, authMode: process.env.AUTH_MODE || "none" }));

// OAuth 2.0 Protected Resource Metadata (RFC 9728). Served for the root and for each MCP path.
app.get(/^\/\.well-known\/oauth-protected-resource(\/.*)?$/, (req, res) => {
  res.json(protectedResourceMetadata(req.params[0] || "/mcp"));
});

const ENDPOINTS = { "/mcp": "all", "/mcp/quick": "quick", "/mcp/manage": "manage" };

for (const [path, profile] of Object.entries(ENDPOINTS)) {
  app.post(path, authenticate(), async (req, res) => {
    // Stateless: a fresh MCP server per request, scoped to the signed-in user.
    const server = new McpServer({ name: `fabrikam-leave-${profile}`, version: "1.0.0" });
    registerLeaveServer(server, req.user, profile);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    res.on("close", () => { transport.close(); server.close(); });
    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      console.error(`[${path}]`, err);
      if (!res.headersSent) res.status(500).json({ jsonrpc: "2.0", error: { code: -32603, message: "Internal server error" }, id: null });
    }
  });
  // Stateless server: no SSE stream or session teardown.
  app.get(path, (_req, res) => res.status(405).set("Allow", "POST").json({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed" }, id: null }));
  app.delete(path, (_req, res) => res.status(405).set("Allow", "POST").end());
}

app.listen(PORT, () => {
  console.log(`Fabrikam Leave MCP server on http://localhost:${PORT}  (AUTH_MODE=${process.env.AUTH_MODE || "none"})`);
  for (const [path, profile] of Object.entries(ENDPOINTS)) console.log(`  ${path.padEnd(12)} -> ${PROFILES[profile].join(", ")}`);
});
