import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { uploadDirectory } from "./oss-upload-lib.mjs";

const currentDir = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(currentDir, "..");
const repoDir = resolve(webDir, "..");
const distDir = resolve(webDir, "dist");
const envFile = resolve(repoDir, "skills", "oss-upload-folder", ".env.oss-upload-folder");
const dryRun = process.argv.includes("--dry-run");

if (!existsSync(distDir)) {
  console.error("Error: web/dist does not exist. Run npm run build first.");
  process.exit(1);
}

uploadDirectory({
  localDir: distDir,
  ossUrl: "oss://public-skills/",
  envFile,
  dryRun,
}).catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
