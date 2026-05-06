# public-skills

这个仓库用于保存可以公开复用的 Codex skills。它的作用不是存放某个单一项目的私有知识，而是把已经整理过、可以脱敏公开、可以由其他项目按需挑选引用的 skill 集中管理起来。

本仓库完全由 Codex 维护。用户只需要说明要新增、修改、发布或引用哪些 skill，Codex 负责文件修改、版本记录、校验、提交、tag 和推送。

## 目录结构

```text
public-skills/
├── AGENTS.md
├── CONVENTIONS.md
├── README.md
├── web/
└── skills/
    ├── associations.json
    ├── catalog.json
    ├── categories.json
    ├── README.md
    └── <skill-name>/
        ├── .env.<skill-name>.example
        ├── .gitignore
        ├── SKILL.md
        ├── README.md
        ├── SOURCE.md
        ├── RELEASE.md
        ├── scripts/
        ├── references/
        └── examples/
```

具体目录要求、版本规则、Release 规则、环境变量规则、artifact 上传规则、skill 分类规则和关联规则集中记录在 [CONVENTIONS.md](./CONVENTIONS.md)。机器可读目录位于 [skills/catalog.json](./skills/catalog.json)，分类清单位于 [skills/categories.json](./skills/categories.json)，关联清单位于 [skills/associations.json](./skills/associations.json)，Web 预览内容位于 [skills/skill-previews.json](./skills/skill-previews.json)，评分数据位于 [skills/skill-scores.json](./skills/skill-scores.json)。

## Skills DNA 预览

网页端预览位于 [web/](./web/)，使用 React + TypeScript + Vite 构建。它优先读取 OSS 上的 JSON 数据：

```text
https://public-skills.jeronasand.cn/skills-dna/data/catalog.json
https://public-skills.jeronasand.cn/skills-dna/data/categories.json
https://public-skills.jeronasand.cn/skills-dna/data/associations.json
https://public-skills.jeronasand.cn/skills-dna/data/skill-previews.json
https://public-skills.jeronasand.cn/skills-dna/data/skill-scores.json
```

本地运行：

```bash
cd web
npm install
npm run dev
```

每次修改 `skills/*.json` 后，先同步本地预览数据并上传 OSS：

```bash
cd web
npm run sync:data
npm run upload:data:dry-run
npm run upload:data
```

如需使用 DeepSeek V4 Pro 评分，复制本地 env 模板并填写密钥：

```bash
cp web/.env.skills-dna-scoring.example web/.env.skills-dna-scoring
```

密钥只允许被 `web/scripts/sync-data.mjs` 在本机或服务端读取，默认模型为 `deepseek-v4-pro`。评分请求会使用 JSON Output 并关闭 thinking，以便生成稳定的结构化评分。密钥不能放进前端代码、Vite public env、仓库文件或 OSS JSON。

打包后，网页产物需要直接上传到 `public-skills` bucket 根目录：

```bash
cd web
npm run build
npm run upload:web:dry-run
npm run upload:web
```

## 其他项目如何引用

其他项目不需要引用整个 skill 集合，而是在自己的仓库里声明需要哪些 skill 和版本。这个流程由目标仓库里的 Codex 自动完成，用户只需要授权安装计划，不需要手动 clone、checkout 或 symlink。

推荐在目标仓库创建或维护：

```text
.codex/public-skills.yaml
```

示例：

```yaml
skills:
  - name: git-commit-convention
    repo: git@github.com:Jeronasand/public-skills.git
    ref: git-commit-convention/v1.0.0
```

当 Codex 判断当前任务需要某个 public skill 时，应先向用户说明：

- 需要安装的 skill 名称。
- 来源仓库。
- 固定版本 tag。
- 将写入或创建的目标路径。
- 是否需要 env 文件或额外本地配置。

用户授权后，Codex 自动安装。安装逻辑如下，由 Codex 执行，不要求用户手动操作：

```bash
mkdir -p .codex/vendor/public-skills/git-commit-convention .codex/skills

git clone git@github.com:Jeronasand/public-skills.git \
  .codex/vendor/public-skills/git-commit-convention/v1.0.0

cd .codex/vendor/public-skills/git-commit-convention/v1.0.0
git checkout git-commit-convention/v1.0.0
cd -

ln -s ../vendor/public-skills/git-commit-convention/v1.0.0/skills/git-commit-convention \
  .codex/skills/git-commit-convention
```

安装后，Codex 应更新 `.codex/public-skills.yaml` 并提交到目标仓库，除非用户明确只想临时使用。

## 自动安装授权流程

目标仓库需要使用 public skill 时，Codex 按这个流程执行：

1. 检查 `.codex/skills/<skill-name>/SKILL.md` 是否已存在。
2. 如果不存在，读取或创建 `.codex/public-skills.yaml`。
3. 选择匹配任务的 skill 和固定版本。
4. 向用户请求授权，说明来源、版本、安装路径和影响范围。
5. 用户授权后自动 clone 到 `.codex/vendor/public-skills/<skill-name>/<version>/`。
6. checkout 指定 tag。
7. symlink 到 `.codex/skills/<skill-name>`。
8. 如有 `.env.<skill-name>.example`，提示用户是否需要复制本地 env；真实 env 不提交。
9. 更新 `.codex/public-skills.yaml`。
10. 继续执行原任务。

如果用户拒绝授权，Codex 不安装该 skill，并用当前已有能力继续处理或说明缺失能力。

## 指定版本引用

公开 skill 使用 tag 记录版本，tag 格式：

```text
<skill-name>/v<major>.<minor>.<patch>
```

例如：

```text
git-commit-convention/v1.0.0
```

多个 skill 时，在清单里增加多条记录。每个 skill 都可以独立指定版本：

```yaml
skills:
  - name: git-commit-convention
    repo: git@github.com:Jeronasand/public-skills.git
    ref: git-commit-convention/v1.0.0

  - name: another-skill
    repo: git@github.com:Jeronasand/public-skills.git
    ref: another-skill/v1.0.0
```

## 维护约定

新增 skill、更新版本、创建 Release、记录来源、配置 env、上传 artifact 和提交信息都以 [CONVENTIONS.md](./CONVENTIONS.md) 为准。

## 提交规范摘要

提交内容使用：

```text
type: subject
```

例如：

```text
docs: add repository guide
feat: add oss upload skill
fix: update skill install command
```
