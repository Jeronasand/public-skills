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
const scoringEnvFile = resolve(webDir, ".env.skills-dna-scoring");
const files = ["catalog.json", "categories.json", "associations.json", "skill-previews.json", "skill-scores.json"];
const githubRepo = "Jeronasand/public-skills";

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

function gh(args, fallback = "") {
  try {
    return execFileSync("gh", args, { cwd: repoDir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return fallback;
  }
}

function loadLocalEnv(file) {
  if (!existsSync(file)) return;
  const text = readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
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

function issuePenalty(issue) {
  const labelNames = (issue.labels || []).map((label) => label.name.toLowerCase());
  const title = issue.title.toLowerCase();
  const text = [...labelNames, title].join(" ");
  if (text.includes("security") || text.includes("critical") || text.includes("blocker")) return 40;
  if (text.includes("bug") || text.includes("broken") || text.includes("regression")) return 20;
  if (text.includes("fix") || text.includes("error")) return 16;
  if (text.includes("docs") || text.includes("documentation")) return 8;
  if (text.includes("enhancement") || text.includes("feature") || text.includes("question")) return 5;
  return 10;
}

function issueMatchesSkill(issue, skillName) {
  const title = issue.title.toLowerCase();
  const labels = (issue.labels || []).map((label) => label.name.toLowerCase());
  const normalizedName = skillName.toLowerCase();
  return (
    title.includes(`[skill:${normalizedName}]`) ||
    title.includes(`skill:${normalizedName}`) ||
    title.includes(normalizedName) ||
    labels.includes(`skill:${normalizedName}`) ||
    labels.includes(normalizedName)
  );
}

function fetchIssues() {
  const output = gh([
    "issue",
    "list",
    "--repo",
    githubRepo,
    "--state",
    "all",
    "--limit",
    "500",
    "--json",
    "number,title,state,labels,url,createdAt,updatedAt,closedAt",
  ]);
  if (!output) return [];
  try {
    return JSON.parse(output);
  } catch {
    return [];
  }
}

function coreFilesForScoring(preview) {
  return preview.latest.files
    .filter((file) => ["SKILL.md", "README.md", "SOURCE.md", "RELEASE.md"].includes(file.path))
    .map((file) => ({
      path: file.path,
      content: file.content.slice(0, 12000),
    }));
}

function deepseekUrl() {
  const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  return baseUrl.endsWith("/chat/completions") ? baseUrl : `${baseUrl.replace(/\/$/, "")}/chat/completions`;
}

function parseJsonObject(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("No JSON object returned");
  return JSON.parse(raw.slice(start, end + 1));
}

async function scoreWithDeepSeek({ skill, preview, issues }) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-pro";
  const openIssues = issues.filter((issue) => issue.state === "OPEN");
  const closedIssues = issues.filter((issue) => issue.state === "CLOSED");
  const prompt = {
    scoringTask: "Score a reusable public Codex skill from 0 to 100.",
    scoringRules: [
      "Start from 100.",
      "Deduct for unclear trigger conditions, incomplete workflow, unsafe secret/env handling, missing source/release docs, missing dry-run for risky scripts, missing tests/examples when behavior requires validation, or inconsistent version/install metadata.",
      "Open GitHub issues must reduce the score according to severity. Closed issues do not reduce the score because they are already fixed.",
      "Do not reward popularity. Score only current usability, safety, maintainability, and unresolved issues.",
      "Return strict JSON only. No markdown.",
    ],
    outputSchema: {
      score: "integer 0-100",
      summary: "short Chinese summary",
      deductions: [{ reason: "Chinese reason", points: "integer" }],
      recommendations: ["Chinese action item"],
    },
    skill: {
      name: skill.name,
      title: skill.title,
      tag: skill.tag,
      categories: skill.categories,
      requiresEnv: skill.requiresEnv,
      hasScripts: skill.hasScripts,
      hasExamples: skill.hasExamples,
      description: skill.description,
      files: coreFilesForScoring(preview),
    },
    issues: {
      open: openIssues.map((issue) => ({
        number: issue.number,
        title: issue.title,
        labels: (issue.labels || []).map((label) => label.name),
      })),
      closedCount: closedIssues.length,
    },
  };

  const response = await fetch(deepseekUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a strict software quality reviewer for public Codex skills. Return only valid JSON matching the requested schema.",
        },
        {
          role: "user",
          content: JSON.stringify(prompt),
        },
      ],
      temperature: 0.1,
      max_tokens: 4096,
      thinking: { type: "disabled" },
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek scoring failed: ${response.status} ${await response.text()}`);
  }
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  const result = parseJsonObject(content);
  return {
    model,
    score: Math.max(0, Math.min(100, Number.parseInt(result.score, 10) || 0)),
    summary: String(result.summary || ""),
    deductions: Array.isArray(result.deductions) ? result.deductions : [],
    recommendations: Array.isArray(result.recommendations) ? result.recommendations.map(String) : [],
  };
}

function fallbackScore(skill, matched, generatedAt) {
  const openIssues = matched.filter((issue) => issue.state === "OPEN");
  const closedIssues = matched.filter((issue) => issue.state === "CLOSED");
  const deductions = openIssues.map((issue) => ({
    issueNumber: issue.number,
    title: issue.title,
    url: issue.url,
    penalty: issuePenalty(issue),
  }));
  const totalDeduction = deductions.reduce((sum, item) => sum + item.penalty, 0);
  const score = Math.max(0, 100 - totalDeduction);
  return {
    method: "issue-fallback",
    model: null,
    score,
    summary: openIssues.length ? "根据 open GitHub issues 进行扣分；未调用 DeepSeek。" : "暂无 open GitHub issues，使用 fallback 评分。",
    deductions: deductions.map((item) => ({ reason: `#${item.issueNumber} ${item.title}`, points: item.penalty })),
    recommendations: openIssues.length ? ["修复或关闭 open issues 后重新同步评分。"] : [],
    openIssues,
    closedIssues,
    totalDeduction,
  };
}

async function buildScoreData(catalog, previews) {
  loadLocalEnv(scoringEnvFile);
  const issues = fetchIssues();
  const generatedAt = new Date().toISOString();
  return {
    version: 1,
    generatedAt,
    repository: githubRepo,
    scoring: {
      base: 100,
      rule: "DeepSeek scores each skill with the provided scoring prompt when DEEPSEEK_API_KEY is configured. Open GitHub issues are included as deductions. Closed issues do not reduce the score after the next data sync. Without a key, issue-based fallback scoring is used.",
      minScore: 0,
    },
    skills: await Promise.all(catalog.skills.map(async (skill) => {
      const preview = previews.skills.find((item) => item.name === skill.name);
      const matched = issues.filter((issue) => issueMatchesSkill(issue, skill.name));
      let scoring = fallbackScore(skill, matched, generatedAt);
      if (preview) {
        try {
          const deepseekScore = await scoreWithDeepSeek({ skill, preview, issues: matched });
          if (deepseekScore) {
            const openIssues = matched.filter((issue) => issue.state === "OPEN");
            const closedIssues = matched.filter((issue) => issue.state === "CLOSED");
            scoring = {
              ...deepseekScore,
              method: "deepseek",
              openIssues,
              closedIssues,
              totalDeduction: deepseekScore.deductions.reduce((sum, item) => sum + (Number(item.points) || 0), 0),
            };
          }
        } catch (error) {
          console.warn(`DeepSeek scoring fallback for ${skill.name}: ${error.message}`);
        }
      }
      return {
        name: skill.name,
        tag: skill.tag,
        score: scoring.score,
        method: scoring.method,
        model: scoring.model,
        summary: scoring.summary,
        deductions: scoring.deductions,
        recommendations: scoring.recommendations,
        openIssueCount: scoring.openIssues.length,
        closedIssueCount: scoring.closedIssues.length,
        totalDeduction: scoring.totalDeduction,
        updatedAt: generatedAt,
        issues: matched.map((issue) => ({
          number: issue.number,
          title: issue.title,
          state: issue.state,
          url: issue.url,
          labels: (issue.labels || []).map((label) => label.name),
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
          closedAt: issue.closedAt,
          penalty: issue.state === "OPEN" ? issuePenalty(issue) : 0,
        })),
      };
    })),
  };
}

mkdirSync(publicDataDir, { recursive: true });
mkdirSync(uploadDir, { recursive: true });

const catalogPath = resolve(sourceDir, "catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const previews = buildPreviewData(catalog);
const nextCatalog = syncCatalogTimestamps(catalog, previews);
const scores = await buildScoreData(nextCatalog, previews);
writeFileSync(catalogPath, `${JSON.stringify(nextCatalog, null, 2)}\n`);
writeFileSync(resolve(sourceDir, "skill-previews.json"), `${JSON.stringify(previews, null, 2)}\n`);
writeFileSync(resolve(sourceDir, "skill-scores.json"), `${JSON.stringify(scores, null, 2)}\n`);

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
