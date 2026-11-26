// Builds each widget folder into ONE self-contained HTML file (MCP Apps requirement: no external assets).
import { build } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const name of ["leave-request", "manage-requests"]) {
  await build({
    root: join(root, "widgets", name),
    configFile: false,
    logLevel: "warn",
    plugins: [viteSingleFile()],
    build: { outDir: join(root, "dist", "widgets", name), emptyOutDir: true, target: "es2020" }
  });
  console.log(`Built widget: dist/widgets/${name}/index.html`);
}
