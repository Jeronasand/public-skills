# public-skills Agent Instructions

## 项目定位

这个仓库用于记录和维护用户通过 Codex 创建、整理、验证过，并且可以公开复用的 Codex skills。目标是把零散的一次性 skill 沉淀为可选择、可复制、可导入到其他项目的公开技能库。

## 维护方式

- 本仓库完全由 Codex 维护；用户只需要描述要新增、修改、发布或引用的 skill 需求。
- Codex 负责创建 skill、补充索引、写版本记录、运行校验、提交、打 tag 和推送。
- 不要求用户手动编辑仓库文件；如果需要用户在其他项目执行命令，Codex 应优先给出可复制的最小命令序列。
- 其他仓库引用本仓库 skill 时，应由目标仓库内的 Codex 根据清单挑选需要的 skill，并固定到指定版本。

## 内容边界

- 只收录可以公开使用的 skill，不提交私有业务密钥、账号凭证、客户数据、运行日志中的敏感 payload。
- 每个 skill 必须能独立理解用途、触发条件、输入要求、输出预期和注意事项。
- 优先沉淀通用工作流，例如部署、文档处理、批处理、仓库维护、第三方工具集成。
- 和单个私有项目强绑定、无法脱敏复用的内容不要直接放入本仓库；需要先抽象为公开版。
- 如果 skill 涉及 PDF、图片、视频、压缩包、二进制样例或较大的非代码/非 Markdown 文档资产，默认上传到 OSS/S3，并在仓库中只保留链接、来源、大小和校验信息。
- 本仓库默认 OSS artifact 目标为 `oss-cn-shenzhen` 地区的 `public-skills` bucket，对外域名为 `publick-skills.jeronasand.cn`。

## 目录约定

- `skills/<skill-name>/SKILL.md`：每个 skill 的主说明文件。
- `skills/<skill-name>/README.md`：每个 skill 的中文说明文件，必须存在。
- `skills/<skill-name>/SOURCE.md`：每个 skill 的来源和作者记录文件，必须存在。
- `skills/<skill-name>/scripts/`：可选，放置该 skill 需要复用的脚本。
- `skills/<skill-name>/references/`：可选，放置该 skill 的补充参考文档。
- `skills/<skill-name>/examples/`：可选但涉及测试时必需，放置人工测试记录、样例输入输出和验证说明。
- `skills/<skill-name>/.env.<skill-name>.example`：可选但有环境变量时必需，记录该 skill 需要的环境变量模板。
- `skills/<skill-name>/.gitignore`：可选但有本地 env、临时产物、测试产物或工具缓存时必需，由每个 skill 自己维护忽略规则。
- `skills/README.md`：公开 skill 索引，新增 skill 时同步更新。

## 版本约定

- 单个 skill 使用 `<skill-name>/v<major>.<minor>.<patch>` 作为 tag。
- 新增公开 skill 的首个稳定版本从 `v1.0.0` 开始。
- 修复同一 skill 的错误递增 patch，新增兼容能力递增 minor，破坏性变更递增 major。
- 每次发布新 tag 前，必须同步更新 `skills/README.md` 中的当前版本和版本记录。

## 编写要求

- `SKILL.md` 使用清晰的触发条件开头，说明什么时候应该使用该 skill。
- `README.md` 必须使用中文，面向人类使用者说明用途、安装/引用方式、环境变量、常用命令、版本和注意事项。
- `SOURCE.md` 必须记录作者、来源类型、源 skill 地址或说明、当前维护者和使用要求。
- 自己创建的 skill，作者写 `Jeronasand & Codex`，来源类型写 `original`。
- 来自其他作者或其他 skill 源的 skill，必须注明原作者、源地址、原始版本或引用时间；使用时应优先使用源 skill，不要把来源不明的副本当作自建内容。
- 操作步骤要可执行，避免只写概念解释。
- 示例命令使用占位符，不能包含真实 token、私钥、cookie、账号或内部 URL。
- 如果 skill 依赖本地工具，写清楚依赖名称、检查命令和失败时的处理方式。
- 如果 skill 包含脚本，脚本默认先提供 dry-run 或预览能力，再执行有副作用操作。
- 如果 skill 涉及测试、验证或人工确认流程，必须补充 `examples/` 目录记录测试样例、人工测试结果和必要的复现步骤。
- `examples/` 中的记录必须脱敏，不写真实密钥、账号、私有 payload 或不可公开的业务数据。
- 如果 skill 会产生本地配置、临时文件、测试输出或工具缓存，必须在该 skill 目录下补充 `.gitignore`，不要依赖仓库根 `.gitignore` 处理 skill 内部细节。

## 环境变量约定

- 如果 skill 需要环境变量，必须在对应 skill 目录内提供 `skills/<skill-name>/.env.<skill-name>.example`。
- example 文件只写变量名、注释和安全占位值，不写真实密钥、token、cookie、账号或私有 endpoint。
- skill 目录内的 `.gitignore` 必须忽略 `.env.<skill-name>`，但保留 `.env.<skill-name>.example` 可提交。
- `SKILL.md` 必须明确要求使用者在目标仓库的 skill 目录复制一份本地配置，例如 `cp .codex/skills/<skill-name>/.env.<skill-name>.example .codex/skills/<skill-name>/.env.<skill-name>`。
- skill 执行时应优先读取目标仓库 `.codex/skills/<skill-name>/.env.<skill-name>`，避免直接使用宿主环境或通用 `.env` 中的同名变量。
- 如果缺少必需变量，skill 应停止并提示用户补全 `.env.<skill-name>`，不要静默回退到宿主环境。

## Artifact 上传约定

- 非代码、非 Markdown 文档的大文件或二进制文件不要直接提交到仓库。
- 优先使用 `bucket-upload-policy` 判断是否需要上传到对象存储。
- OSS 上传优先使用 `oss-upload-folder` skill，目标默认是 `oss://public-skills/skills/<skill-name>/<version>/`，endpoint 使用 `oss-cn-shenzhen.aliyuncs.com`。
- S3 上传优先使用 `aws-s3-upload-folder` skill，目标路径同样使用 `skills/<skill-name>/<version>/` 结构。
- OSS 密钥通过本机 OSS CLI 配置，例如 `ossutil config` 生成的用户目录配置；AWS 密钥通过本机 AWS CLI profile/config。任何密钥都不能写入仓库。
- 上传后在对应 skill 的 `references/` 或 `examples/` 中记录 artifact manifest，而不是提交原始大文件。

## Git 提交规范

提交信息按照仓库规范使用：

```text
type: subject
```

常用 `type`：

- `feat`：新增 skill 或新增公开能力。
- `fix`：修复已有 skill 的错误、命令或说明。
- `docs`：更新 README、索引、使用说明或协作规则。
- `chore`：仓库维护、目录整理、配置调整。
- `refactor`：重组 skill 内容但不改变对外行为。
- `test`：新增或调整验证脚本、示例检查。

示例：

```text
docs: add public skills repository guide
feat: add oss upload skill
fix: correct spreadsheet skill validation command
```
