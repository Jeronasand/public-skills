# public-skills 约定

这个文件集中记录本仓库的 skill 维护、目录、版本、发布、环境变量、artifact 和 git 提交约定。`README.md` 面向使用者介绍仓库，`AGENTS.md` 面向 Codex 协作，具体规则以本文件为准。

## 内容边界

- 只收录可以公开使用的 skill，不提交私有业务密钥、账号凭证、客户数据、运行日志中的敏感 payload。
- 每个 skill 必须能独立理解用途、触发条件、输入要求、输出预期和注意事项。
- 优先沉淀通用工作流，例如部署、文档处理、批处理、仓库维护、第三方工具集成。
- 和单个私有项目强绑定、无法脱敏复用的内容不要直接放入本仓库；需要先抽象为公开版。
- 如果 skill 涉及 PDF、图片、视频、压缩包、二进制样例或较大的非代码/非 Markdown 文档资产，默认上传到 OSS/S3，并在仓库中只保留链接、来源、大小和校验信息。

## 目录约定

```text
public-skills/
├── AGENTS.md
├── CONVENTIONS.md
├── README.md
└── skills/
    ├── associations.json
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

- `skills/<skill-name>/SKILL.md`：每个 skill 的主说明文件。
- `skills/<skill-name>/README.md`：每个 skill 的中文说明文件，必须存在。
- `skills/<skill-name>/SOURCE.md`：每个 skill 的来源和作者记录文件，必须存在。
- `skills/<skill-name>/RELEASE.md`：每个 skill 的独立发布记录文件，必须存在。
- `skills/<skill-name>/scripts/`：可选，放置该 skill 需要复用的脚本。
- `skills/<skill-name>/references/`：可选，放置该 skill 的补充参考文档。
- `skills/<skill-name>/examples/`：可选但涉及测试时必需，放置人工测试记录、样例输入输出和验证说明。
- `skills/<skill-name>/.env.<skill-name>.example`：可选但有环境变量时必需，记录该 skill 需要的环境变量模板。
- `skills/<skill-name>/.gitignore`：可选但有本地 env、临时产物、测试产物或工具缓存时必需，由每个 skill 自己维护忽略规则。
- `skills/associations.json`：skill 关联清单，记录可选联动、替代实现、前置依赖、后续动作和同源关系。
- `skills/README.md`：公开 skill 索引，新增 skill 时同步更新。

## 新增 skill 流程

1. 在 `skills/<skill-name>/` 下创建 `SKILL.md`。
2. 在 `skills/<skill-name>/README.md` 下写中文使用说明。
3. 在 `skills/<skill-name>/SOURCE.md` 下记录作者和来源。
4. 在 `skills/<skill-name>/RELEASE.md` 下记录独立发布信息。
5. 如需脚本，放到 `scripts/`；如需补充文档，放到 `references/`。
6. 如果需要环境变量，在 skill 目录内创建 `skills/<skill-name>/.env.<skill-name>.example`。
7. 如果 skill 会产生本地 env、临时文件、测试输出或工具缓存，在 skill 目录内创建 `.gitignore`。
8. 如果涉及测试或人工验证，在 `skills/<skill-name>/examples/` 下补充测试记录。
9. 确认内容不包含密钥、账号、私有 payload 或不可公开的内部信息。
10. 如果和其他 skill 存在关联，更新 `skills/associations.json`。
11. 更新 `skills/README.md` 索引和版本记录。
12. 按仓库提交规范提交。
13. 使用 `<skill-name>/v<major>.<minor>.<patch>` 打 tag 并推送。
14. 如果 GitHub Release 可用，为该 tag 单独创建 GitHub Release。

## 编写约定

- `SKILL.md` 使用清晰的触发条件开头，说明什么时候应该使用该 skill。
- `README.md` 必须使用中文，面向人类使用者说明用途、安装/引用方式、环境变量、常用命令、版本和注意事项。
- `SOURCE.md` 必须记录作者、来源类型、源 skill 地址或说明、当前维护者和使用要求。
- `RELEASE.md` 必须记录当前版本、上一版本、发布类型、变更内容、artifact、验证项和 GitHub Release 状态。
- 如果 skill 和其他 skill 指向同一类能力、同一来源、同一外部工具，或存在可选业务联动，`README.md` 和 `SKILL.md` 必须说明相关 skill 名称、关系类型和是否建议一起安装。
- 操作步骤要可执行，避免只写概念解释。
- 示例命令使用占位符，不能包含真实 token、私钥、cookie、账号或内部 URL。
- 如果 skill 依赖本地工具，写清楚依赖名称、检查命令和失败时的处理方式。
- 如果 skill 包含脚本，脚本默认先提供 dry-run 或预览能力，再执行有副作用操作。
- 如果 skill 涉及测试、验证或人工确认流程，必须补充 `examples/` 目录记录测试样例、人工测试结果和必要的复现步骤。
- `examples/` 中的记录必须脱敏，不写真实密钥、账号、私有 payload 或不可公开的业务数据。
- 如果 skill 会产生本地配置、临时文件、测试输出或工具缓存，必须在该 skill 目录下补充 `.gitignore`，不要依赖仓库根 `.gitignore` 处理 skill 内部细节。

## 来源和作者约定

每个 skill 必须提供：

```text
skills/<skill-name>/SOURCE.md
```

自建 skill 的作者写：

```text
Jeronasand & Codex
```

自建 skill 的来源类型写：

```text
original
```

如果 skill 来自其他作者、其他仓库或其他 skill 源，必须记录原作者、源地址、原始版本或引用时间。目标仓库使用时，应优先使用源 skill；本仓库只维护清晰注明来源的公开副本或索引，不把外部来源不明的 skill 当作自建内容。

## Skill 关联与可选安装约定

如果出现多个 skill 指向同一个上游来源、同一类能力、同一个外部工具，或 skill 之间存在可选业务关联，必须用 `skills/associations.json` 记录。

`skills/associations.json` 是机器可读清单，用于目标仓库里的 Codex 在安装前判断是否需要主动询问用户安装相关 skill。Markdown 说明可以补充背景，但自动提示以 JSON 为准。

推荐结构：

```json
{
  "version": 1,
  "associations": [
    {
      "id": "object-storage-upload-policy",
      "type": "optional-precheck",
      "primary": "oss-upload-folder",
      "related": ["bucket-upload-policy"],
      "prompt": "上传对象存储前，是否同时安装 bucket-upload-policy 来判断哪些文件应该上传到 OSS/S3？",
      "installDefault": false,
      "reason": "bucket-upload-policy 可先判断大文件或二进制 artifact 是否应该进入对象存储。"
    }
  ]
}
```

字段约定：

- `id`：关联规则唯一标识，使用 kebab-case。
- `type`：关联类型，例如 `same-capability`、`optional-precheck`、`optional-followup`、`alternative-implementation`、`shared-source`、`business-chain`。
- `primary`：触发安装判断的主 skill。
- `related`：需要提示用户可选安装的相关 skill 数组。
- `prompt`：Codex 询问用户时可以直接使用或改写的问题。
- `installDefault`：是否建议默认一起安装。即使为 `true`，也必须获得用户确认。
- `reason`：说明关联原因和不安装的影响。

安装时，Codex 不能静默只安装其中一个。只要 `skills/associations.json` 中存在匹配 `primary` 或 `related` 的规则，Codex 必须在安装前主动向用户说明：

- 当前任务需要安装的主 skill。
- 相关 skill 或 skill 组的名称。
- JSON 中记录的关联类型。
- 不安装相关 skill 的影响。
- 是否建议同时安装多个 skill。

用户确认后，Codex 才能把相关 skill 一起加入安装计划。未经确认，不应自动安装额外 skill。

## 版本约定

- 单个 skill 使用 `<skill-name>/v<major>.<minor>.<patch>` 作为 tag。
- 新增公开 skill 的首个稳定版本从 `v1.0.0` 开始。
- 修复同一 skill 的错误递增 patch。
- 新增兼容能力递增 minor。
- 破坏性变更递增 major。
- 每次发布新 tag 前，必须同步更新 `skills/README.md` 中的当前版本和版本记录。

## Release 约定

每个 skill 必须提供：

```text
skills/<skill-name>/RELEASE.md
```

每次发布 skill 版本时，都要同步更新：

- `skills/<skill-name>/RELEASE.md`
- `skills/<skill-name>/README.md` 中的当前版本
- `skills/README.md` 中的索引和版本记录

每个 skill 独立使用 `<skill-name>/v<major>.<minor>.<patch>` tag。不要用一个全局 release 代替多个 skill 的独立 release。如果 GitHub CLI 已登录或 GitHub Release API 可用，Codex 还要为每个 tag 单独创建 GitHub Release；如果不可用，应在 `RELEASE.md` 和最终回复中说明阻塞原因。

## 环境变量约定

如果 skill 需要环境变量，必须在对应 skill 目录内提供 example 文件：

```text
skills/<skill-name>/.env.<skill-name>.example
```

example 文件只写变量名、注释和安全占位值，不写真实密钥、token、cookie、账号或私有 endpoint。

使用者在目标仓库的 skill 目录内自己复制一份本地配置：

```bash
cp .codex/skills/<skill-name>/.env.<skill-name>.example \
  .codex/skills/<skill-name>/.env.<skill-name>
```

skill 执行时应优先读取目标仓库 `.codex/skills/<skill-name>/.env.<skill-name>`，避免直接使用宿主环境或通用 `.env` 中的同名变量。缺少必需变量时，skill 应停止并提示用户补全 `.env.<skill-name>`，不要静默回退到宿主环境。

如果 skill 使用 env 文件，该 skill 目录内还应提供 `.gitignore`，至少包含：

```gitignore
.env.<skill-name>
```

## 测试记录约定

如果 skill 涉及测试、验证或人工确认流程，必须提供：

```text
skills/<skill-name>/examples/
```

该目录用于记录人工测试样例、输入输出、执行步骤、预期结果、实际结果和必要备注。测试记录必须脱敏，不能包含真实密钥、账号、私有 payload 或不可公开的业务数据。

## Artifact 上传约定

非代码、非 Markdown 文档的大文件或二进制文件不要直接提交到仓库。优先使用 `bucket-upload-policy` 判断是否需要上传到对象存储。

本仓库默认 OSS artifact 目标：

```text
地区: oss-cn-shenzhen
Bucket: public-skills
域名: publick-skills.jeronasand.cn
OSS URI: oss://public-skills/
```

推荐路径：

```text
oss://public-skills/skills/<skill-name>/<version>/
https://publick-skills.jeronasand.cn/skills/<skill-name>/<version>/
```

OSS 上传优先使用 `oss-upload-folder` skill，endpoint 使用：

```text
oss-cn-shenzhen.aliyuncs.com
```

S3 上传优先使用 `aws-s3-upload-folder` skill，目标路径同样使用 `skills/<skill-name>/<version>/` 结构。

OSS 密钥通过本机 OSS CLI 配置，例如：

```bash
ossutil config
```

配置通常保存在用户目录的本地文件中，例如：

```text
~/.ossutilconfig
```

如果使用的 OSS CLI 版本不同，以该 CLI 的 `config` / `help` 输出为准。密钥只保留在本机，不提交到 git。

S3 上传使用本机 AWS CLI 配置：

```text
~/.aws/credentials
~/.aws/config
```

上传后在对应 skill 的 `references/` 或 `examples/` 中记录 artifact manifest，而不是提交原始大文件。

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
