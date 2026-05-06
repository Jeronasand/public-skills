import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
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
  RefreshCcw,
  Search,
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
    ])
      .then(([catalog, categories, associations, previews, scores]) => {
        if (alive) setData({ status: "ready", catalog, categories, associations, previews, scores, error: null });
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
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(skill.installPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <article className={`skillCard ${active ? "activeSkill" : ""}`}>
      <div className="cardTop">
        <div>
          <h3>{skill.title}</h3>
          <p className="skillName">{skill.name}</p>
        </div>
        <span className="tag">{skill.tag}</span>
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

      <div className={`scoreBar ${scoreClass(score?.score)}`}>
        <div>
          <strong>{score?.score ?? 100}</strong>
          <span>/100</span>
        </div>
        <p>
          {score?.openIssueCount || 0} open issue · 已修复 {score?.closedIssueCount || 0}
        </p>
      </div>

      <div className="dateGrid">
        <span>创建 {skill.createdAt || "未知"}</span>
        <span>更新 {skill.updatedAt || "未知"}</span>
      </div>

      <label className="promptBox">
        <span>Agent 安装 Prompt</span>
        <textarea readOnly value={skill.installPrompt} />
      </label>

      <div className="cardActions">
        <button className="copyButton" type="button" onClick={copyPrompt}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "已复制" : "复制 Prompt"}
        </button>
        <button className="selectButton" type="button" onClick={() => onPreview(skill.name)}>
          <FileText size={16} aria-hidden="true" />
          {active ? "正在预览" : "预览内容"}
        </button>
        <a className="issueButton" href={githubIssueUrl(skill)} target="_blank" rel="noreferrer">
          <ExternalLink size={16} aria-hidden="true" />
          提交 Issue
        </a>
      </div>
    </article>
  );
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  return `${(size / 1024).toFixed(1)} KB`;
}

function SkillPreviewPanel({ skill, preview, score }: { skill: Skill; preview?: SkillPreview; score?: SkillScore }) {
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

  return (
    <section className="panel previewPanel">
      <div className="panelHeader">
        <div>
          <h2>{skill.title}</h2>
          <p>
            {skill.name} · {skill.tag} · 创建 {preview?.createdAt || skill.createdAt || "未知"} · 更新{" "}
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

          <div className="previewLayout">
            <aside className="fileRail">
              {mode === "history" && (
                <label className="versionSelect">
                  <span>历史 tag</span>
                  <select value={activeHistory?.tag || ""} onChange={(event) => setActiveHistoryTag(event.target.value)}>
                    {preview.history.map((item) => (
                      <option key={item.tag} value={item.tag}>
                        {item.tag} · {item.createdAt}
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
                    <span>{mode === "latest" ? "latest" : activeHistory?.tag}</span>
                  </div>
                  <pre>
                    <code>{activeFile.content}</code>
                  </pre>
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
  const [activeSkillName, setActiveSkillName] = useState("");

  const filteredSkills = useMemo(() => {
    if (data.status !== "ready") return [];
    const normalizedQuery = query.trim().toLowerCase();
    return data.catalog.skills.filter((skill) => {
      if (activeCategory !== "all" && !skill.categories.includes(activeCategory)) return false;
      if (envOnly && !skill.requiresEnv) return false;
      if (scriptsOnly && !skill.hasScripts) return false;
      if (examplesOnly && !skill.hasExamples) return false;
      if (!normalizedQuery) return true;
      return [
        skill.name,
        skill.title,
        skill.tag,
        skill.description,
        skill.author,
        skill.sourceType,
        ...(skill.categories || []),
        ...(skill.keywords || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [activeCategory, data, envOnly, examplesOnly, query, scriptsOnly]);

  function resetFilters() {
    setActiveCategory("all");
    setQuery("");
    setEnvOnly(false);
    setScriptsOnly(false);
    setExamplesOnly(false);
  }

  const isReady = data.status === "ready";
  const statusText = data.status === "ready" ? "目录已加载" : data.status === "error" ? "加载失败" : "正在加载";
  const activeSkill = isReady
    ? data.catalog.skills.find((skill) => skill.name === activeSkillName) || filteredSkills[0] || data.catalog.skills[0]
    : undefined;
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
      <div className="shell">
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

        <main className="layout">
          <aside className="sidebar" aria-label="Skills filters">
            <label className="search">
              <span>
                <Search size={14} aria-hidden="true" />
                搜索
              </span>
              <input
                type="search"
                placeholder="skill、tag、关键词..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

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
                <section className="metrics">
                  <Metric value={data.catalog.skills.length} label={metricLabels.total} icon={Boxes} />
                  <Metric value={data.categories.categories.length} label={metricLabels.categories} icon={Braces} />
                  <Metric value={data.catalog.skills.filter((skill) => skill.requiresEnv).length} label={metricLabels.env} icon={Settings2} />
                  <Metric value={averageScore} label={metricLabels.averageScore} icon={Star} />
                  <Metric value={openIssueCount} label={metricLabels.openIssues} icon={Link2} />
                </section>

                {activeSkill && <SkillPreviewPanel skill={activeSkill} preview={activePreview} score={activeScore} />}

                <section className="panel">
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
                          onPreview={setActiveSkillName}
                          key={skill.name}
                        />
                      ))
                    ) : (
                      <div className="empty">当前筛选条件下没有匹配的 skill。</div>
                    )}
                  </div>
                </section>

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
