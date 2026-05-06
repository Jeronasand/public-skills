import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { uploadDirectory } from "./oss-upload-lib.mjs";

const currentDir = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(currentDir, "..");
const repoDir = resolve(webDir, "..");
const sourceDir = resolve(repoDir, "skills");
const publicDataDir = resolve(webDir, "public", "data");
const uploadDir = resolve(repoDir, "artifact-upload", "skills-dna", "data");
const envFile = resolve(repoDir, "skills", "oss-upload-folder", ".env.oss-upload-folder");
const files = ["catalog.json", "categories.json", "associations.json", "skill-previews.json"];

const textExtensions = new Set([
  ".example",
  ".gitignore",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".sh",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const corePreviewFiles = ["SKILL.md", "README.md", "SOURCE.md", "RELEASE.md"];

function git(args, fallback = "") {
  try {
    return execFileSync("git", args, { cwd: repoDir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return fallback;
  }
}

function gitDate(args) {
  return git(args).slice(0, 10);
}

function isTextPreviewFile(filePath) {
  const name = basename(filePath);
  if (name.startsWith(".env.") && !name.endsWith(".example")) return false;
  if (name === ".DS_Store") return false;
  const ext = extname(filePath);
  return textExtensions.has(ext) || textExtensions.has(name);
}

function listTextFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listTextFiles(full));
      continue;
    }
    if (entry.isFile() && isTextPreviewFile(full)) out.push(full);
  }
  return out;
}

function languageFor(filePath) {
  const name = basename(filePath);
  const ext = extname(filePath);
  if (name === ".gitignore") return "gitignore";
  if (name.endsWith(".example")) return "dotenv";
  if (ext === ".json") return "json";
  if (ext === ".md") return "markdown";
  if (ext === ".mjs" || ext === ".js") return "javascript";
  if (ext === ".sh") return "bash";
  if (ext === ".ts" || ext === ".tsx") return "typescript";
  if (ext === ".yaml" || ext === ".yml") return "yaml";
  return "text";
}

function readLatestSkillFiles(skillPath) {
  const absDir = resolve(repoDir, skillPath);
  return listTextFiles(absDir)
    .map((file) => {
      const rel = relative(absDir, file).split("/").join("/");
      return {
        path: rel,
        language: languageFor(file),
        size: statSync(file).size,
        content: readFileSync(file, "utf8"),
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}

function readFileAtTag(tag, skillPath, file) {
  const content = git(["show", `${tag}:${skillPath}${file}`], null);
  if (content === null || content === "") return null;
  return {
    path: file,
    language: languageFor(file),
    size: Buffer.byteLength(content, "utf8"),
    content,
  };
}

function skillTags(name) {
  return git(["tag", "--list", `${name}/v*`, "--sort=creatordate"])
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildPreviewData(catalog) {
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    skills: catalog.skills.map((skill) => {
      const commits = git(["log", "--date=short", "--format=%ad", "--", skill.path])
        .split(/\r?\n/)
        .filter(Boolean);
      const createdAt = commits.at(-1) || catalog.generatedAt;
      const updatedAt = commits[0] || catalog.generatedAt;
      const tags = skillTags(skill.name);
      return {
        name: skill.name,
        title: skill.title,
        tag: skill.tag,
        latestVersion: skill.latestVersion,
        createdAt,
        updatedAt,
        latest: {
          files: readLatestSkillFiles(skill.path),
        },
        history: tags.map((tag) => ({
          tag,
          version: tag.replace(`${skill.name}/`, ""),
          createdAt: gitDate(["log", "-1", "--date=short", "--format=%ad", tag]),
          files: corePreviewFiles
            .map((file) => readFileAtTag(tag, skill.path, file))
            .filter(Boolean),
        })),
      };
    }),
  };
}

function syncCatalogTimestamps(catalog, previews) {
  const previewByName = new Map(previews.skills.map((skill) => [skill.name, skill]));
  return {
    ...catalog,
    skills: catalog.skills.map((skill) => {
      const preview = previewByName.get(skill.name);
      return preview
        ? {
            ...skill,
            createdAt: preview.createdAt,
            updatedAt: preview.updatedAt,
          }
        : skill;
    }),
  };
}

mkdirSync(publicDataDir, { recursive: true });
mkdirSync(uploadDir, { recursive: true });

const catalogPath = resolve(sourceDir, "catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const previews = buildPreviewData(catalog);
const nextCatalog = syncCatalogTimestamps(catalog, previews);
writeFileSync(catalogPath, `${JSON.stringify(nextCatalog, null, 2)}\n`);
writeFileSync(resolve(sourceDir, "skill-previews.json"), `${JSON.stringify(previews, null, 2)}\n`);

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
