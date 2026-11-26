// Loads the single-file widget HTML produced by `npm run build:widgets`.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "widgets");
const cache = new Map();

export function loadWidget(name) {
  if (process.env.NODE_ENV === "production" && cache.has(name)) return cache.get(name);
  const file = join(distDir, name, "index.html");
  const html = existsSync(file)
    ? readFileSync(file, "utf8")
    : `<!doctype html><html><body style="font-family:Segoe UI,sans-serif;padding:16px">Widget <b>${name}</b> is not built yet. Run <code>npm run build:widgets</code> and restart the server.</body></html>`;
  cache.set(name, html);
  return html;
}
