// Thin wrapper around the MCP Apps client (@modelcontextprotocol/ext-apps).
// The host (Microsoft 365 Copilot / Cowork) renders this HTML in a sandboxed iframe and
// talks to it over postMessage. `App` hides that protocol from us.
import { App } from "@modelcontextprotocol/ext-apps";

export async function startWidget(name, onData) {
  const app = new App({ name, version: "1.0.0" });
  // 1) The tool result that caused this widget to open arrives here.
  app.ontoolresult = (result) => onData(result?.structuredContent ?? {});
  await app.connect();
  return {
    // 2) The widget can call tools on the SAME MCP server (same user, same auth).
    async callTool(toolName, args) {
      const r = await app.callServerTool({ name: toolName, arguments: args });
      const text = r?.content?.find?.((c) => c.type === "text")?.text;
      if (r?.isError) throw new Error(text || "The request failed.");
      return r?.structuredContent ?? {};
    }
  };
}

export const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function weekdaysBetween(start, end) {
  if (!start || !end || end < start) return 0;
  let n = 0;
  for (let d = new Date(`${start}T00:00:00Z`); d <= new Date(`${end}T00:00:00Z`); d = new Date(d.getTime() + 864e5)) {
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) n++;
  }
  return n;
}

export const fmtDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
