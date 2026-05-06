import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  Boxes,
  Braces,
  Check,
  CircleDot,
  Copy,
  ExternalLink,
  FileText,
  GitBranch,
  History,
  Link2,
  PlusCircle,
  RefreshCcw,
  Search,
  Send,
  Settings2,
  Star,
  TerminalSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "./styles.css";

type Skill = {
  name: string;
  title: string;
  latestVersion: string;
  createdAt?: string;
  updatedAt?: string;
  tag: string;
  path: string;
  skillFile: string;
  readme: string;
  source: string;
  release: string;
  categories: string[];
  author: string;
  sourceType: string;
  requiresEnv: boolean;
  hasScripts: boolean;
  hasExamples: boolean;
  description: string;
  keywords: string[];
  installPrompt: string;
};

type Catalog = {
  version: number;
  generatedAt: string;
  repository: string;
  skills: Skill[];
};

type Category = {
  id: string;
  name: string;
  description: string;
  skills: string[];
};

type Categories = {
  version: number;
  categories: Category[];
};

type Association = {
  id: string;
  type: string;
  primary: string;
  related: string[];
  prompt: string;
  installDefault: boolean;
  reason: string;
};

type Associations = {
  version: number;
  associations: Association[];
};

type PreviewFile = {
  path: string;
  language: string;
  size: number;
  content: string;
};

type SkillHistory = {
  tag: string;
  version: string;
  createdAt: string;
  files: PreviewFile[];
};

type SkillPreview = {
  name: string;
  title: string;
  tag: string;
  latestVersion: string;
  createdAt: string;
  updatedAt: string;
  latest: {
    files: PreviewFile[];
  };
  history: SkillHistory[];
};

type SkillPreviews = {
  version: number;
  generatedAt: string;
  skills: SkillPreview[];
};

type SkillIssue = {
  number: number;
  title: string;
  state: "OPEN" | "CLOSED";
  url: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  penalty: number;
};

type SkillScore = {
  name: string;
  tag: string;
  score: number;
  method: "deepseek" | "issue-fallback";
  model: string | null;
  summary: string;
  deductions: Array<{
    reason: string;
    points: number;
  }>;
  recommendations: string[];
  openIssueCount: number;
  closedIssueCount: number;
  totalDeduction: number;
  updatedAt: string;
  issues: SkillIssue[];
};

type SkillSearchRecommendation = {
  name: string;
  method: "deepseek" | "fallback";
  model: string | null;
  aliases: string[];
  intents: string[];
  useCases: string[];
  priorityTerms: string[];
};

type SkillSearchRecommendations = {
  version: number;
  generatedAt: string;
  repository: string;
  skills: SkillSearchRecommendation[];
};

type LiveSearchSuggestion = {
  name: string;
  reason: string;
};

type SkillRequestFormState = {
  title: string;
  slug: string;
  scenario: string;
  trigger: string;
  workflow: string;
  inputsOutputs: string;
  dependencies: string;
  relatedSkills: string;
  source: string;
  notes: string;
  requiresEnv: boolean;
  needsExamples: boolean;
  hasArtifacts: boolean;
};

type ViewMode = "list" | "detail";

type SkillScores = {
  version: number;
  generatedAt: string;
  repository: string;
  scoring: {
    base: number;
    rule: string;
    minScore: number;
  };
  skills: SkillScore[];
};

type SkillsData =
  | { status: "loading"; error: null }
  | { status: "error"; error: Error }
  | {
      status: "ready";
      catalog: Catalog;
      categories: Categories;
      associations: Associations;
      previews: SkillPreviews;
      scores: SkillScores;
      recommendations: SkillSearchRecommendations;
      error: null;
    };

const metricLabels = {
  total: "Skills 总数",
  categories: "分类",
  env: "需要环境变量",
  associations: "关联规则",
  averageScore: "平均评分",
  openIssues: "Open Issues",
};

const jsonFiles = {
  catalog: "catalog.json",
  categories: "categories.json",
  associations: "associations.json",
  previews: "skill-previews.json",
  scores: "skill-scores.json",
  recommendations: "skill-search-recommendations.json",
};

const remoteDataBase =
  import.meta.env.VITE_SKILLS_DNA_DATA_BASE_URL || "https://public-skills.jeronasand.cn/skills-dna/data";
const localDataBase = "/data";

function DnaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    const canvasEl = canvas;
    const context = ctx;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    let frameId = 0;

    function resize() {
      canvasEl.width = Math.floor(window.innerWidth * dpr);
      canvasEl.height = Math.floor(window.innerHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time: number) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width * 0.72;
      const amplitude = Math.min(130, width * 0.16);
      const phase = time / 900;
      const step = 26;

      context.clearRect(0, 0, width, height);
      for (let y = -40; y < height + 60; y += step) {
        const t = y / 82 + phase;
        const x1 = centerX + Math.sin(t) * amplitude;
        const x2 = centerX + Math.sin(t + Math.PI) * amplitude;
        context.strokeStyle = "rgba(49, 95, 159, 0.12)";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x1, y);
        context.lineTo(x2, y + 10);
        context.stroke();

        context.fillStyle = "rgba(15, 118, 110, 0.24)";
        context.beginPath();
        context.arc(x1, y, 3.5, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = "rgba(180, 83, 9, 0.2)";
        context.beginPath();
        context.arc(x2, y + 10, 3.5, 0, Math.PI * 2);
        context.fill();
      }
      frameId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    frameId = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="dnaCanvas" aria-hidden="true" />;
}

async function loadJsonFrom<T>(baseUrl: string, file: string): Promise<T> {
  const path = `${baseUrl.replace(/\/$/, "")}/${file}`;
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

async function loadJson<T>(file: string): Promise<T> {
  try {
    return await loadJsonFrom<T>(remoteDataBase, file);
  } catch (remoteError) {
    console.warn(remoteError);
    return loadJsonFrom<T>(localDataBase, file);
  }
}

function useSkillsData() {
  const [data, setData] = useState<SkillsData>({ status: "loading", error: null });

  useEffect(() => {
    let alive = true;
    Promise.all([
      loadJson<Catalog>(jsonFiles.catalog),
      loadJson<Categories>(jsonFiles.categories),
      loadJson<Associations>(jsonFiles.associations),
      loadJson<SkillPreviews>(jsonFiles.previews),
      loadJson<SkillScores>(jsonFiles.scores),
      loadJson<SkillSearchRecommendations>(jsonFiles.recommendations),
    ])
      .then(([catalog, categories, associations, previews, scores, recommendations]) => {
        if (alive) {
          setData({ status: "ready", catalog, categories, associations, previews, scores, recommendations, error: null });
        }
      })
      .catch((error) => {
        if (alive) setData({ status: "error", error });
      });
    return () => {
      alive = false;
    };
  }, []);

  return data;
}

function categoryName(categories: Categories, id: string) {
  return categories.categories.find((category) => category.id === id)?.name || id;
}

function Metric({ value, label, icon: Icon }: { value: number; label: string; icon: LucideIcon }) {
  return (
    <div className="metric">
      <Icon size={18} aria-hidden />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function githubIssueUrl(skill: Skill) {
  const title = `[skill:${skill.name}] 问题反馈：`;
  const body = [
    `## Skill`,
    ``,
    `- Name: ${skill.name}`,
    `- Tag: ${skill.tag}`,
    `- Source: Skills DNA Web`,
    ``,
    `## 问题类型`,
    ``,
    `- [ ] bug / 失效`,
    `- [ ] 文档问题`,
    `- [ ] 示例或测试问题`,
    `- [ ] 能力建议`,
    ``,
    `## 现象或建议`,
    ``,
    `请描述你遇到的问题、复现步骤或建议。`,
    ``,
    `## 期望结果`,
    ``,
    `请描述修复后应该达到的效果。`,
  ].join("\n");
  return `https://github.com/Jeronasand/public-skills/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

const emptySkillRequestForm: SkillRequestFormState = {
  title: "",
  slug: "",
  scenario: "",
  trigger: "",
  workflow: "",
  inputsOutputs: "",
  dependencies: "",
  relatedSkills: "",
  source: "",
  notes: "",
  requiresEnv: false,
  needsExamples: true,
  hasArtifacts: false,
};

function skillRequestIssueUrl(form: SkillRequestFormState) {
  const title = `[skill-request] ${form.title.trim() || "新增 skill 需求"}`;
  const body = [
    `## Skill 需求`,
    ``,
    `- 标题：${form.title.trim() || "未填写"}`,
    `- 建议 slug：${form.slug.trim() || "由 Codex 根据仓库规范生成"}`,
    `- 来源/作者：${form.source.trim() || "需求提交者 / 待确认"}`,
    `- 相关 skills：${form.relatedSkills.trim() || "无"}`,
    ``,
    `## 使用场景`,
    ``,
    form.scenario.trim() || "请补充这个 skill 要解决的问题、适用项目或典型任务。",
    ``,
    `## 触发条件`,
    ``,
    form.trigger.trim() || "请补充用户说什么、出现什么任务时应该启用这个 skill。",
    ``,
    `## 期望工作流`,
    ``,
    form.workflow.trim() || "请补充希望 Codex 如何执行、需要哪些步骤、是否需要 dry-run 或人工确认。",
    ``,
    `## 输入与输出`,
    ``,
    form.inputsOutputs.trim() || "请补充输入文件、配置、命令参数，以及最终希望产出的内容。",
    ``,
    `## 依赖工具与环境变量`,
    ``,
    `- 需要独立 env：${form.requiresEnv ? "是，需要 .env.<skill-name>.example" : "否或暂不确定"}`,
    form.dependencies.trim() || "请补充 CLI、Node/Python 包、云服务、账号权限或本地工具依赖。",
    ``,
    `## 验证与 examples`,
    ``,
    `- 需要 examples / 人工测试记录：${form.needsExamples ? "是" : "否或暂不确定"}`,
    ``,
    `## Artifact / OSS / S3`,
    ``,
    `- 涉及大文件、图片、PDF、二进制或对象存储：${form.hasArtifacts ? "是，需要走 bucket-upload-policy" : "否或暂不确定"}`,
    ``,
    `## 备注`,
    ``,
    form.notes.trim() || "无",
  ].join("\n");
  return `https://github.com/Jeronasand/public-skills/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

function skillPath(name: string) {
  return `/skills/${encodeURIComponent(name)}`;
}

function skillNameFromPath(pathname: string) {
  const match = pathname.match(/^\/skills\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : "";
}

function displayVersion(tag: string) {
  return tag.split("/").pop() || tag;
}

function searchTextFor(skill: Skill, recommendation?: SkillSearchRecommendation) {
  return [
    skill.name,
    skill.title,
    skill.tag,
    displayVersion(skill.tag),
    skill.description,
    skill.author,
    skill.sourceType,
    ...(skill.categories || []),
    ...(skill.keywords || []),
    ...(recommendation?.aliases || []),
    ...(recommendation?.intents || []),
    ...(recommendation?.useCases || []),
    ...(recommendation?.priorityTerms || []),
  ]
    .join(" ")
    .toLowerCase();
}

function searchRank(skill: Skill, query: string, recommendation?: SkillSearchRecommendation) {
  if (!query) return 0;
  let rank = 0;
  if (skill.name.toLowerCase().includes(query)) rank += 80;
  if (skill.title.toLowerCase().includes(query)) rank += 70;
  if ((recommendation?.priorityTerms || []).join(" ").toLowerCase().includes(query)) rank += 55;
  if ((recommendation?.intents || []).join(" ").toLowerCase().includes(query)) rank += 40;
  if ((recommendation?.useCases || []).join(" ").toLowerCase().includes(query)) rank += 30;
  if (searchTextFor(skill, recommendation).includes(query)) rank += 10;
  return rank;
}

async function fetchDeepSeekSearchSuggestions({
  apiKey,
  query,
  skills,
  recommendations,
}: {
  apiKey: string;
  query: string;
  skills: Skill[];
  recommendations: SkillSearchRecommendation[];
}) {
  const catalog = skills.map((skill) => {
    const recommendation = recommendations.find((item) => item.name === skill.name);
    return {
      name: skill.name,
      title: skill.title,
      version: displayVersion(skill.tag),
      categories: skill.categories,
      description: skill.description,
      keywords: skill.keywords,
      aliases: recommendation?.aliases || [],
      intents: recommendation?.intents || [],
      useCases: recommendation?.useCases || [],
      priorityTerms: recommendation?.priorityTerms || [],
    };
  });
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-v4-pro",
      messages: [
        {
          role: "system",
          content:
            "You recommend the best public Codex skills for a user search query. Return only valid JSON. Do not include secrets.",
        },
        {
          role: "user",
          content: JSON.stringify({
            query,
            rules: [
              "Pick at most 3 skills from the given catalog.",
              "Only return skill names that exist in the catalog.",
              "Explain each recommendation in short Chinese.",
              "Return JSON schema: {\"suggestions\":[{\"name\":\"skill-name\",\"reason\":\"中文理由\"}]}",
            ],
            catalog,
          }),
        },
      ],
      temperature: 0.1,
      max_tokens: 1200,
      thinking: { type: "disabled" },
      response_format: { type: "json_object" },
    }),
  });
  if (!response.ok) throw new Error(`DeepSeek search failed: ${response.status}`);
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  const parsed = JSON.parse(content);
  return Array.isArray(parsed.suggestions) ? (parsed.suggestions as LiveSearchSuggestion[]) : [];
}

function scoreClass(score?: number) {
  if (score === undefined) return "";
  if (score >= 90) return "good";
  if (score >= 70) return "warn";
  return "bad";
}

function SkillCard({
  skill,
  categories,
  active,
  score,
  onPreview,
}: {
  skill: Skill;
  categories: Categories;
  active: boolean;
  score?: SkillScore;
  onPreview: (name: string) => void;
}) {
  return (
    <article
      className={`skillCard ${active ? "activeSkill" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => onPreview(skill.name)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onPreview(skill.name);
      }}
    >
      <div className="cardTop">
        <div>
          <h3>{skill.title}</h3>
          <p className="skillName">{skill.name}</p>
        </div>
        <span className="tag">{displayVersion(skill.tag)}</span>
      </div>

      <div className={`scoreBar ${scoreClass(score?.score)}`}>
        <div>
          <strong>{score?.score ?? 100}</strong>
          <span>/100</span>
        </div>
        <p>
          {score?.method === "deepseek" ? "DeepSeek V4 Pro" : "Issue fallback"} · {score?.openIssueCount || 0} open
        </p>
      </div>

      <p className="description">{skill.description}</p>

      <div className="chips">
        {skill.categories.map((id) => (
          <span className="chip" key={id}>
            {categoryName(categories, id)}
          </span>
        ))}
        {skill.keywords.slice(0, 4).map((keyword) => (
          <span className="chip mutedChip" key={keyword}>
            {keyword}
          </span>
        ))}
      </div>

      <div className="flags">
        {skill.requiresEnv && <span className="flag env">需要 env</span>}
        {skill.hasScripts && <span className="flag script">包含脚本</span>}
        {skill.hasExamples && <span className="flag">包含 examples</span>}
        {!skill.requiresEnv && !skill.hasScripts && !skill.hasExamples && <span className="flag">无需本地配置</span>}
        <span className="flag inherit">可继承</span>
      </div>

      <div className="cardTelemetry">
        <span>
          <strong>{skill.createdAt || "未知"}</strong>
          创建
        </span>
        <span>
          <strong>{skill.updatedAt || "未知"}</strong>
          更新
        </span>
        <span>
          <strong>{score?.closedIssueCount || 0}</strong>
          已修复
        </span>
      </div>

      <div className="cardActions">
        <button
          className="selectButton"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPreview(skill.name);
          }}
        >
          <FileText size={16} aria-hidden="true" />
          {active ? "正在预览" : "查看详情"}
        </button>
        <a
          className="issueButton"
          href={githubIssueUrl(skill)}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          <ExternalLink size={16} aria-hidden="true" />
          提交 Issue
        </a>
      </div>
    </article>
  );
}

function SkillRequestPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<SkillRequestFormState>(emptySkillRequestForm);
  const canSubmit = form.title.trim().length > 0 && form.scenario.trim().length > 0;

  function updateField<K extends keyof SkillRequestFormState>(field: K, value: SkillRequestFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    window.open(skillRequestIssueUrl(form), "_blank", "noopener,noreferrer");
  }

  return (
    <section className={`panel requestPanel ${isOpen ? "open" : ""}`}>
      <div className="requestSummary">
        <div>
          <span className="eyebrow">Skill Request</span>
          <h2>没有找到合适的 skill？</h2>
          <p>提交一个结构化需求 issue，Codex 会按仓库规范拆成可公开复用的 skill，再由维护者开发、发布和记录版本。</p>
        </div>
        <button className="requestToggle" type="button" onClick={() => setIsOpen((value) => !value)}>
          <PlusCircle size={17} aria-hidden="true" />
          {isOpen ? "收起表单" : "创建 Skill 需求"}
        </button>
      </div>

      {isOpen ? (
        <form className="skillRequestForm" onSubmit={submitRequest}>
          <div className="formGrid">
            <label>
              <span>Skill 标题 *</span>
              <input
                type="text"
                placeholder="例如：微信素材批量发布"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                required
              />
            </label>
            <label>
              <span>建议 slug</span>
              <input
                type="text"
                placeholder="例如：wechat-material-publish"
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
              />
            </label>
            <label>
              <span>来源 / 作者</span>
              <input
                type="text"
                placeholder="原创、某个公开 skill、某篇文档或作者名"
                value={form.source}
                onChange={(event) => updateField("source", event.target.value)}
              />
            </label>
            <label>
              <span>相关 skills</span>
              <input
                type="text"
                placeholder="例如：oss-upload-folder, git-commit-convention"
                value={form.relatedSkills}
                onChange={(event) => updateField("relatedSkills", event.target.value)}
              />
            </label>
          </div>

          <label className="wideField">
            <span>使用场景 *</span>
            <textarea
              placeholder="这个 skill 要解决什么问题？用户通常在什么项目或任务里需要它？"
              value={form.scenario}
              onChange={(event) => updateField("scenario", event.target.value)}
              required
            />
          </label>

          <div className="formGrid">
            <label>
              <span>触发条件</span>
              <textarea
                placeholder="用户说什么、遇到什么文件或流程时应该启用？"
                value={form.trigger}
                onChange={(event) => updateField("trigger", event.target.value)}
              />
            </label>
            <label>
              <span>期望工作流</span>
              <textarea
                placeholder="希望 Codex 检查什么、运行什么命令、是否需要 dry-run？"
                value={form.workflow}
                onChange={(event) => updateField("workflow", event.target.value)}
              />
            </label>
            <label>
              <span>输入与输出</span>
              <textarea
                placeholder="输入文件、参数、配置，以及最终产物。"
                value={form.inputsOutputs}
                onChange={(event) => updateField("inputsOutputs", event.target.value)}
              />
            </label>
            <label>
              <span>依赖工具</span>
              <textarea
                placeholder="CLI、Node/Python 包、云服务、账号权限或本地工具。"
                value={form.dependencies}
                onChange={(event) => updateField("dependencies", event.target.value)}
              />
            </label>
          </div>

          <label className="wideField">
            <span>备注</span>
            <textarea
              placeholder="补充限制、参考链接、人工验收方式或不希望包含的内容。"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
            />
          </label>

          <div className="requestChecks">
            <label>
              <input
                type="checkbox"
                checked={form.requiresEnv}
                onChange={(event) => updateField("requiresEnv", event.target.checked)}
              />
              <span>需要独立 env 模板</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.needsExamples}
                onChange={(event) => updateField("needsExamples", event.target.checked)}
              />
              <span>需要 examples 测试记录</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.hasArtifacts}
                onChange={(event) => updateField("hasArtifacts", event.target.checked)}
              />
              <span>涉及 OSS/S3 artifact</span>
            </label>
          </div>

          <div className="formActions">
            <button className="ghostButton" type="button" onClick={() => setForm(emptySkillRequestForm)}>
              清空
            </button>
            <button className="submitIssueButton" type="submit" disabled={!canSubmit}>
              <Send size={16} aria-hidden="true" />
              提交 GitHub Issue
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  return `${(size / 1024).toFixed(1)} KB`;
}

function isMarkdownFile(file?: PreviewFile) {
  return Boolean(file && (file.language === "markdown" || file.path.toLowerCase().endsWith(".md")));
}

function renderInlineMarkdown(text: string) {
  const nodes: React.ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith("`")) {
      nodes.push(<code key={`${match.index}-code`}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={`${match.index}-strong`}>{token.slice(2, -2)}</strong>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      nodes.push(
        <a key={`${match.index}-link`} href={link?.[2] || "#"} target="_blank" rel="noreferrer">
          {link?.[1] || token}
        </a>,
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function MarkdownPreview({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const elements: React.ReactNode[] = [];
  let index = 0;
  let key = 0;

  if (lines[0] === "---") {
    const end = lines.slice(1).findIndex((line) => line === "---");
    if (end !== -1) {
      index = end + 2;
    }
  }

  function paragraphStart(line: string) {
    return (
      /^#{1,6}\s+/.test(line) ||
      /^```/.test(line) ||
      /^[-*]\s+/.test(line) ||
      /^\d+\.\s+/.test(line) ||
      /^>\s?/.test(line) ||
      /^---+$/.test(line)
    );
  }

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (/^```/.test(line)) {
      const fence = line.replace(/^```/, "").trim();
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      elements.push(
        <pre className="markdownCode" key={`code-${key++}`}>
          <code data-language={fence}>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = Math.min(heading[1].length, 4);
      const headingContent = renderInlineMarkdown(heading[2]);
      if (level === 1) elements.push(<h1 key={`heading-${key++}`}>{headingContent}</h1>);
      else if (level === 2) elements.push(<h2 key={`heading-${key++}`}>{headingContent}</h2>);
      else if (level === 3) elements.push(<h3 key={`heading-${key++}`}>{headingContent}</h3>);
      else elements.push(<h4 key={`heading-${key++}`}>{headingContent}</h4>);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^[-*]\s+/, ""));
        index += 1;
      }
      elements.push(
        <ul key={`ul-${key++}`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      elements.push(
        <ol key={`ol-${key++}`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quotes: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quotes.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      elements.push(<blockquote key={`quote-${key++}`}>{quotes.map((item) => renderInlineMarkdown(item))}</blockquote>);
      continue;
    }

    if (/^---+$/.test(line)) {
      elements.push(<hr key={`hr-${key++}`} />);
      index += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !paragraphStart(lines[index])) {
      paragraph.push(lines[index]);
      index += 1;
    }
    elements.push(<p key={`p-${key++}`}>{renderInlineMarkdown(paragraph.join(" "))}</p>);
  }

  return <div className="markdownPreview">{elements}</div>;
}

function SkillPreviewPanel({
  skill,
  preview,
  score,
  onBack,
}: {
  skill: Skill;
  preview?: SkillPreview;
  score?: SkillScore;
  onBack: () => void;
}) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [mode, setMode] = useState<"latest" | "history">("latest");
  const [activeHistoryTag, setActiveHistoryTag] = useState("");
  const [activeFilePath, setActiveFilePath] = useState("");

  const latestHistory = preview?.history[preview.history.length - 1];
  const activeHistory = preview?.history.find((item) => item.tag === activeHistoryTag) || latestHistory;
  const files: PreviewFile[] = mode === "latest" ? preview?.latest.files || [] : activeHistory?.files || [];
  const activeFile = files.find((file) => file.path === activeFilePath) || files[0];

  useEffect(() => {
    setMode("latest");
    setActiveHistoryTag("");
    setActiveFilePath("");
  }, [skill.name]);

  useEffect(() => {
    setActiveFilePath("");
  }, [mode, activeHistoryTag]);

  async function copyPrompt() {
    await navigator.clipboard.writeText(skill.installPrompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1200);
  }

  return (
    <section className="panel previewPanel">
      <div className="panelHeader">
        <div>
          <button className="backButton" type="button" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            返回技能库
          </button>
          <h2>{skill.title}</h2>
          <p>
            {skill.name} · {displayVersion(skill.tag)} · 创建 {preview?.createdAt || skill.createdAt || "未知"} · 更新{" "}
            {preview?.updatedAt || skill.updatedAt || "未知"}
          </p>
        </div>
        <div className={`scoreBadge ${scoreClass(score?.score)}`}>
          <Star size={18} aria-hidden="true" />
          <strong>{score?.score ?? 100}</strong>
          <span>/100</span>
        </div>
        <div className="modeSwitch">
          <button className={mode === "latest" ? "active" : ""} type="button" onClick={() => setMode("latest")}>
            最新内容
          </button>
          <button className={mode === "history" ? "active" : ""} type="button" onClick={() => setMode("history")}>
            <History size={15} aria-hidden="true" />
            历史版本
          </button>
        </div>
      </div>

      {!preview ? (
        <div className="empty">当前 skill 还没有生成预览数据，请运行 web 的数据同步流程。</div>
      ) : (
        <>
          <div className="issueSummary">
            <div>
              <strong>{score?.openIssueCount || 0}</strong>
              <span>Open issues</span>
            </div>
            <div>
              <strong>{score?.closedIssueCount || 0}</strong>
              <span>已修复 issues</span>
            </div>
            <div>
              <strong>{score?.totalDeduction || 0}</strong>
              <span>当前扣分</span>
            </div>
            <div>
              <strong>{score?.method === "deepseek" ? "DS" : "Fallback"}</strong>
              <span>评分方式</span>
            </div>
            <a href={githubIssueUrl(skill)} target="_blank" rel="noreferrer">
              <ExternalLink size={16} aria-hidden="true" />
              提交 GitHub Issue
            </a>
          </div>

          {score?.summary ? <p className="scoreSummary">{score.summary}</p> : null}

          {score?.recommendations.length ? (
            <div className="recommendations">
              {score.recommendations.slice(0, 3).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : null}

          {score?.issues.length ? (
            <div className="issueList">
              {score.issues.slice(0, 5).map((issue) => (
                <a href={issue.url} target="_blank" rel="noreferrer" key={issue.number}>
                  <span>#{issue.number}</span>
                  <strong>{issue.title}</strong>
                  <em>{issue.state === "OPEN" ? `扣 ${issue.penalty} 分` : "已修复"}</em>
                </a>
              ))}
            </div>
          ) : null}

          <div className="promptAction">
            <div>
              <strong>Agent 安装 Prompt</strong>
              <span>{skill.installPrompt}</span>
            </div>
            <button className="copyButton" type="button" onClick={copyPrompt}>
              {copiedPrompt ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copiedPrompt ? "已复制" : "复制 Prompt"}
            </button>
          </div>

          <div className="previewLayout">
            <aside className="fileRail">
              {mode === "history" && (
                <label className="versionSelect">
                  <span>历史 tag</span>
                  <select value={activeHistory?.tag || ""} onChange={(event) => setActiveHistoryTag(event.target.value)}>
                    {preview.history.map((item) => (
                      <option key={item.tag} value={item.tag}>
                        {displayVersion(item.tag)} · {item.createdAt}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className="fileList">
                {files.map((file) => (
                  <button
                    className={activeFile?.path === file.path ? "active" : ""}
                    type="button"
                    key={file.path}
                    onClick={() => setActiveFilePath(file.path)}
                  >
                    <span>{file.path}</span>
                    <small>
                      {file.language} · {formatBytes(file.size)}
                    </small>
                  </button>
                ))}
              </div>
            </aside>
            <article className="filePreview">
              {activeFile ? (
                <>
                  <div className="filePreviewHeader">
                    <strong>{activeFile.path}</strong>
                    <span>{mode === "latest" ? "latest" : activeHistory ? displayVersion(activeHistory.tag) : ""}</span>
                  </div>
                  {isMarkdownFile(activeFile) ? (
                    <MarkdownPreview content={activeFile.content} />
                  ) : (
                    <pre>
                      <code>{activeFile.content}</code>
                    </pre>
                  )}
                </>
              ) : (
                <div className="empty">当前版本没有可预览的文本文件。</div>
              )}
            </article>
          </div>
        </>
      )}
    </section>
  );
}

function AssociationList({ associations }: { associations: Associations }) {
  return (
    <div className="associationList">
      {associations.associations.map((item) => (
        <article className="association" key={item.id}>
          <div>
            <strong>{item.type}</strong>
            <p>
              <code>{item.primary}</code>
              {" -> "}
              <code>{item.related.join(", ")}</code>
            </p>
          </div>
          <div>
            <p>{item.prompt}</p>
            <p>{item.reason}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function App() {
  const data = useSkillsData();
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [envOnly, setEnvOnly] = useState(false);
  const [scriptsOnly, setScriptsOnly] = useState(false);
  const [examplesOnly, setExamplesOnly] = useState(false);
  const [activeSkillName, setActiveSkillName] = useState(() => skillNameFromPath(window.location.pathname));
  const [deepSeekKey, setDeepSeekKey] = useState(() => window.localStorage.getItem("skills-dna-deepseek-key") || "");
  const [liveSuggestions, setLiveSuggestions] = useState<LiveSearchSuggestion[]>([]);
  const [liveSearchState, setLiveSearchState] = useState<"idle" | "loading" | "error">("idle");
  const viewMode: ViewMode = activeSkillName ? "detail" : "list";

  useEffect(() => {
    function handlePopstate() {
      setActiveSkillName(skillNameFromPath(window.location.pathname));
    }
    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  useEffect(() => {
    if (deepSeekKey) window.localStorage.setItem("skills-dna-deepseek-key", deepSeekKey);
    else window.localStorage.removeItem("skills-dna-deepseek-key");
  }, [deepSeekKey]);

  useEffect(() => {
    if (data.status !== "ready") return undefined;
    const normalizedQuery = query.trim();
    if (!deepSeekKey || normalizedQuery.length < 2) {
      setLiveSuggestions([]);
      setLiveSearchState("idle");
      return undefined;
    }
    let cancelled = false;
    setLiveSearchState("loading");
    const timer = window.setTimeout(() => {
      fetchDeepSeekSearchSuggestions({
        apiKey: deepSeekKey,
        query: normalizedQuery,
        skills: data.catalog.skills,
        recommendations: data.recommendations.skills,
      })
        .then((suggestions) => {
          if (!cancelled) {
            setLiveSuggestions(suggestions);
            setLiveSearchState("idle");
          }
        })
        .catch((error) => {
          console.warn(error);
          if (!cancelled) {
            setLiveSuggestions([]);
            setLiveSearchState("error");
          }
        });
    }, 450);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [data, deepSeekKey, query]);

  const filteredSkills = useMemo(() => {
    if (data.status !== "ready") return [];
    const normalizedQuery = query.trim().toLowerCase();
    const recommendationByName = new Map(data.recommendations.skills.map((item) => [item.name, item]));
    return data.catalog.skills
      .filter((skill) => {
        if (activeCategory !== "all" && !skill.categories.includes(activeCategory)) return false;
        if (envOnly && !skill.requiresEnv) return false;
        if (scriptsOnly && !skill.hasScripts) return false;
        if (examplesOnly && !skill.hasExamples) return false;
        if (!normalizedQuery) return true;
        return searchTextFor(skill, recommendationByName.get(skill.name)).includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (!normalizedQuery) return 0;
        return (
          searchRank(b, normalizedQuery, recommendationByName.get(b.name)) -
          searchRank(a, normalizedQuery, recommendationByName.get(a.name))
        );
      });
  }, [activeCategory, data, envOnly, examplesOnly, query, scriptsOnly]);

  const suggestedSkills = useMemo(() => {
    if (data.status !== "ready") return [];
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];
    const recommendationByName = new Map(data.recommendations.skills.map((item) => [item.name, item]));
    if (liveSuggestions.length) {
      return liveSuggestions
        .map((suggestion) => {
          const skill = data.catalog.skills.find((item) => item.name === suggestion.name);
          return skill
            ? {
                skill,
                rank: 100,
                recommendation: recommendationByName.get(skill.name),
                reason: suggestion.reason,
                source: "live" as const,
              }
            : null;
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .slice(0, 3);
    }
    return filteredSkills
      .map((skill) => ({
        skill,
        rank: searchRank(skill, normalizedQuery, recommendationByName.get(skill.name)),
        recommendation: recommendationByName.get(skill.name),
        reason: recommendationByName.get(skill.name)?.useCases[0] || skill.description,
        source: "local" as const,
      }))
      .filter((item) => item.rank > 0)
      .slice(0, 3);
  }, [data, filteredSkills, liveSuggestions, query]);

  function resetFilters() {
    setActiveCategory("all");
    setQuery("");
    setEnvOnly(false);
    setScriptsOnly(false);
    setExamplesOnly(false);
  }

  function previewSkill(name: string) {
    setActiveSkillName(name);
    const nextPath = skillPath(name);
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, "", nextPath);
    }
  }

  function backToList() {
    setActiveSkillName("");
    if (window.location.pathname !== "/") {
      window.history.pushState(null, "", "/");
    }
  }

  const isReady = data.status === "ready";
  const statusText = data.status === "ready" ? "目录已加载" : data.status === "error" ? "加载失败" : "正在加载";
  const activeSkill = isReady && activeSkillName ? data.catalog.skills.find((skill) => skill.name === activeSkillName) : undefined;
  const activePreview =
    isReady && activeSkill ? data.previews.skills.find((preview) => preview.name === activeSkill.name) : undefined;
  const activeScore =
    isReady && activeSkill ? data.scores.skills.find((score) => score.name === activeSkill.name) : undefined;
  const averageScore = isReady
    ? Math.round(data.scores.skills.reduce((sum, item) => sum + item.score, 0) / Math.max(data.scores.skills.length, 1))
    : 0;
  const openIssueCount = isReady ? data.scores.skills.reduce((sum, item) => sum + item.openIssueCount, 0) : 0;

  return (
    <>
      <DnaCanvas />
      <div className={`shell view-${viewMode}`}>
        <header className="topbar">
          <div className="brandBlock">
            <img
              className="brandLogo"
              src="/logo.png"
              alt="Skills DNA logo"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <div>
              <h1>Skills DNA</h1>
              <p>公开 Codex skills 的分类图谱、关联链路、版本目录和可复制的 Agent 安装 Prompt。</p>
            </div>
          </div>
          <div className="status">
            <CircleDot size={15} aria-hidden="true" />
            {statusText}
          </div>
        </header>

        <main className={`layout ${viewMode === "detail" ? "detailLayout" : ""}`}>
          <aside className="sidebar" aria-label="Skills filters">
            <section className="filterGroup">
              <h2>分类</h2>
              <div className="categoryList">
                <button
                  className={`categoryButton ${activeCategory === "all" ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveCategory("all")}
                >
                  <strong>全部 Skills</strong>
                  <span>{isReady ? data.catalog.skills.length : 0} 个 skill</span>
                </button>
                {isReady &&
                  data.categories.categories.map((category) => (
                    <button
                      className={`categoryButton ${activeCategory === category.id ? "active" : ""}`}
                      type="button"
                      title={category.description}
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <strong>{category.name}</strong>
                      <span>{category.skills.length} 个 skill</span>
                    </button>
                  ))}
              </div>
            </section>

            <section className="filterGroup">
              <h2>筛选信号</h2>
              <label className="checkRow">
                <input type="checkbox" checked={envOnly} onChange={(event) => setEnvOnly(event.target.checked)} />
                <span>需要 env</span>
              </label>
              <label className="checkRow">
                <input type="checkbox" checked={scriptsOnly} onChange={(event) => setScriptsOnly(event.target.checked)} />
                <span>包含脚本</span>
              </label>
              <label className="checkRow">
                <input type="checkbox" checked={examplesOnly} onChange={(event) => setExamplesOnly(event.target.checked)} />
                <span>包含 examples</span>
              </label>
            </section>
          </aside>

          <section className="content">
            {data.status === "error" && (
              <div className="empty">
                {data.error.message}。请在 web 目录通过本地 dev server 运行 React 应用。
              </div>
            )}

            {isReady && (
              <>
                {viewMode === "list" ? (
                  <section className="searchDock">
                    <div className="searchDockInner">
                      <label className="search searchHero">
                        <span>
                          <Search size={16} aria-hidden="true" />
                          搜索 Skills DNA
                        </span>
                        <input
                          type="search"
                          placeholder="输入目标，例如：git 提交、OSS 上传、刷新 CDN..."
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                        />
                      </label>
                      <label className="search dsKey">
                        <span>{deepSeekKey ? "DeepSeek 实时推荐已启用" : "可选：输入 DeepSeek API Key 启用实时推荐"}</span>
                        <input
                          type="password"
                          placeholder="留空则使用已打包的 DS 推荐数据"
                          value={deepSeekKey}
                          onChange={(event) => setDeepSeekKey(event.target.value)}
                        />
                      </label>
                      {suggestedSkills.length ? (
                        <div className="searchSuggest">
                          <div className="suggestHeader">
                            <strong>{liveSuggestions.length ? "DS 实时推荐" : "已打包推荐"}</strong>
                            {liveSearchState === "loading" ? <span>DeepSeek 正在检索...</span> : null}
                            {liveSearchState === "error" ? <span>DeepSeek 请求失败，已回退本地推荐。</span> : null}
                          </div>
                          <div className="suggestList">
                            {suggestedSkills.map(({ skill, reason }) => (
                              <button type="button" key={skill.name} onClick={() => previewSkill(skill.name)}>
                                <strong>{skill.title}</strong>
                                <span>{reason}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </section>
                ) : null}

                {viewMode === "list" ? <SkillRequestPanel /> : null}

                <section className="metrics">
                  <Metric value={data.catalog.skills.length} label={metricLabels.total} icon={Boxes} />
                  <Metric value={data.categories.categories.length} label={metricLabels.categories} icon={Braces} />
                  <Metric value={data.catalog.skills.filter((skill) => skill.requiresEnv).length} label={metricLabels.env} icon={Settings2} />
                  <Metric value={averageScore} label={metricLabels.averageScore} icon={Star} />
                  <Metric value={openIssueCount} label={metricLabels.openIssues} icon={Link2} />
                </section>

                {viewMode === "detail" && activeSkill ? (
                  <SkillPreviewPanel skill={activeSkill} preview={activePreview} score={activeScore} onBack={backToList} />
                ) : null}

                {viewMode === "detail" && !activeSkill ? (
                  <div className="empty">路径中的 skill 不存在，请从下方卡片重新选择。</div>
                ) : null}

                {viewMode === "list" || !activeSkill ? (
                  <section className="panel skillListPanel">
                    <div className="panelHeader">
                      <div>
                        <h2>Skill 分子</h2>
                        <p>匹配到 {filteredSkills.length} 个 skill</p>
                      </div>
                      <button className="ghostButton" type="button" onClick={resetFilters}>
                        <RefreshCcw size={16} aria-hidden="true" />
                        重置
                      </button>
                    </div>

                    <div className="skillsGrid">
                      {filteredSkills.length ? (
                        filteredSkills.map((skill) => (
                          <SkillCard
                            skill={skill}
                            categories={data.categories}
                            active={activeSkill?.name === skill.name}
                            score={data.scores.skills.find((score) => score.name === skill.name)}
                            onPreview={previewSkill}
                            key={skill.name}
                          />
                        ))
                      ) : (
                        <div className="empty">当前筛选条件下没有匹配的 skill。</div>
                      )}
                    </div>
                  </section>
                ) : null}

                {viewMode === "list" ? (
                  <section className="panel">
                    <div className="panelHeader">
                      <div>
                        <h2>关联链路</h2>
                        <p>可选安装、后续动作、同类能力和业务链路。</p>
                      </div>
                      <GitBranch size={22} aria-hidden="true" />
                    </div>
                    <AssociationList associations={data.associations} />
                  </section>
                ) : null}

                {viewMode === "list" ? (
                  <section className="panel">
                    <div className="panelHeader">
                      <div>
                        <h2>目录数据源</h2>
                        <p>官网优先读取 OSS 数据，失败后回退到本地快照。</p>
                      </div>
                      <TerminalSquare size={22} aria-hidden="true" />
                    </div>
                    <div className="sourceGrid">
                      {Object.entries(jsonFiles).map(([name, file]) => (
                        <code key={name}>{`${remoteDataBase}/${file}`}</code>
                      ))}
                    </div>
                  </section>
                ) : null}
              </>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing root element");
}

createRoot(root).render(<App />);
