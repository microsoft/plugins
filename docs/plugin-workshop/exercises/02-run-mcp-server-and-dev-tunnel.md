# Exercise 2: Run the Leave MCP server locally with MCP Apps and a dev tunnel (30 min)

**Goal:** The ready-made server runs on `localhost:3001`, both widgets are built, and a persistent dev tunnel exposes it over HTTPS. Auth is **off** here (`AUTH_MODE=none`). Exercise 3 adds it.

## 2.1 Install, build and test

```bash
cd mcp-server
npm install
cp .env.sample .env          # Windows: copy .env.sample .env
npm run build:widgets        # widgets/* -> dist/widgets/*/index.html (single file each)
npm run seed                 # data/seed.json -> data/db.json
npm test                     # leave-logic unit tests
npm run dev
```

Expected output:
```
Fabrikam Leave MCP server on http://localhost:3001  (AUTH_MODE=none)
  /mcp         -> get_leave_balance, get_working_days, create_leave_request, delete_leave_request, approve_leave_request
  /mcp/quick   -> get_leave_balance, get_working_days
  /mcp/manage  -> create_leave_request, delete_leave_request, approve_leave_request
```

## 2.2 Code tour (5 min, read along)

| File | Look for |
|---|---|
| `src/server.js` | A **stateless** `McpServer` per request, Streamable HTTP transport, and the three endpoints (one per *profile*). |
| `src/tools.js` | `registerTool(...)` for the 5 tools. The two UI tools carry `_meta.ui.resourceUri`. `registerResource(...)` serves the HTML with MIME `text/html;profile=mcp-app`. |
| `src/tools.js` → `create_leave_request` | **One tool, two modes:** missing fields → `mode: "form"` (widget shows a form), all fields → creates the request. The widget submits by calling the **same tool** with `callServerTool`. |
| `widgets/shared/bridge.js` | `new App(...)`, `ontoolresult`, `connect()`, `callServerTool()` from `@modelcontextprotocol/ext-apps`. |
| `src/auth.js` | In `AUTH_MODE=none` the caller is taken from the `x-demo-user` header (`E1001`, `E1002`, `M2001`). |

## 2.3 Try it with MCP Inspector

```bash
npx @modelcontextprotocol/inspector
```
- Transport **Streamable HTTP**, URL `http://localhost:3001/mcp`
- Add the header `x-demo-user: E1001` (Alex) and **Connect**.
- **Tools → List**. Run `get_leave_balance`, then `get_working_days` with `financialYear = 2025-26`.
- Run `create_leave_request` with **no arguments**. Note `structuredContent.mode = "form"`, and that the tool declares `ui://fabrikam-leave/leave-request.html`.
- **Resources → read** `ui://fabrikam-leave/leave-request.html`. You'll see the self-contained HTML.
- Run `approve_leave_request` as Alex (blocked), then switch the header to `M2001` (Jordan) and run it again (lists pending requests).

Prefer the terminal? Here's a raw JSON-RPC call:
```bash
curl -s http://localhost:3001/mcp -H "content-type: application/json" -H "accept: application/json, text/event-stream" -H "x-demo-user: E1002" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_leave_balance","arguments":{}}}'
```

## 2.4 Create a persistent dev tunnel

A **persistent** tunnel keeps the same URL across restarts. That matters because the URL goes into your plugin manifest.

```bash
devtunnel create fabrikam-leave --allow-anonymous
devtunnel port create fabrikam-leave -p 3001
devtunnel host fabrikam-leave
```
Copy the URL, for example `https://abcd1234-3001.aue.devtunnels.ms`, and set it in `.env`:
```
PUBLIC_BASE_URL=https://abcd1234-3001.aue.devtunnels.ms
```
Test it: open `https://<tunnel>/healthz` in a browser, then point Inspector at `https://<tunnel>/mcp`.

> ⚠️ The tunnel is anonymous **and** the server has no auth yet, so anyone with the URL can call it. It only holds fictional seed data, and Exercise 3 locks it down. Stop hosting when you take a break.

## 2.5 Stretch
- Add `TODAY=2027-07-15` to `.env` and ask for working days in `2026-27` (a full year with your new leave).
- Change the widget colours in `widgets/shared/styles.css`, rebuild and re-read the resource.

## ✅ Checkpoint
- `https://<tunnel>/healthz` returns `{"ok":true,"authMode":"none"}`.
- `tools/list` on `/mcp/quick` returns exactly 2 tools, and on `/mcp/manage` exactly 3.
