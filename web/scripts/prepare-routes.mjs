import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const webDir = resolve(__dirname, "..");
const repoDir = resolve(webDir, "..");
const distDir = resolve(webDir, "dist");
const indexFile = resolve(distDir, "index.html");
const catalogFile = resolve(repoDir, "skills", "catalog.json");

if (!existsSync(indexFile)) {
  throw new Error("web/dist/index.html does not exist. Run vite build first.");
}

const catalog = JSON.parse(readFileSync(catalogFile, "utf8"));
const routeRoot = resolve(distDir, "skills");
mkdirSync(routeRoot, { recursive: true });

for (const skill of catalog.skills || []) {
  if (!skill.name) continue;
  copyFileSync(indexFile, resolve(routeRoot, skill.name));
}

console.log(`Prepared ${(catalog.skills || []).length} skill route aliases in web/dist/skills`);
