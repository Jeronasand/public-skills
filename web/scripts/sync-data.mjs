import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { uploadDirectory } from "./oss-upload-lib.mjs";

const currentDir = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(currentDir, "..");
const repoDir = resolve(webDir, "..");
const sourceDir = resolve(repoDir, "skills");
const publicDataDir = resolve(webDir, "public", "data");
const uploadDir = resolve(repoDir, "artifact-upload", "skills-dna", "data");
const envFile = resolve(repoDir, "skills", "oss-upload-folder", ".env.oss-upload-folder");
const files = ["catalog.json", "categories.json", "associations.json"];

mkdirSync(publicDataDir, { recursive: true });
mkdirSync(uploadDir, { recursive: true });

for (const file of files) {
  copyFileSync(resolve(sourceDir, file), resolve(publicDataDir, file));
  copyFileSync(resolve(sourceDir, file), resolve(uploadDir, file));
}

console.log(`synced ${files.length} JSON files`);
console.log(`local preview: ${publicDataDir}`);
console.log(`oss upload source: ${uploadDir}`);

if (process.argv.includes("--upload") || process.argv.includes("--dry-run")) {
  uploadDirectory({
    localDir: uploadDir,
    ossUrl: "oss://public-skills/skills-dna/data/",
    envFile,
    dryRun: process.argv.includes("--dry-run"),
  }).catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
}
