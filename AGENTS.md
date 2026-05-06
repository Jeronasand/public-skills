# public-skills Agent Instructions

## 项目定位

这个仓库用于记录和维护用户通过 Codex 创建、整理、验证过，并且可以公开复用的 Codex skills。目标是把零散的一次性 skill 沉淀为可选择、可复制、可导入到其他项目的公开技能库。

## 维护方式

- 本仓库完全由 Codex 维护；用户只需要描述要新增、修改、发布或引用的 skill 需求。
- Codex 负责创建 skill、补充索引、写版本记录、运行校验、提交、打 tag 和推送。
- Codex 每次创建或更新 skill 时，必须自行判断分类，并同步 `skills/catalog.json`、`skills/categories.json` 和必要的 `skills/associations.json`。
- 不要求用户手动编辑仓库文件；如果需要用户在其他项目执行命令，Codex 应优先给出可复制的最小命令序列。
- 其他仓库引用本仓库 skill 时，应由目标仓库内的 Codex 根据清单挑选需要的 skill，并固定到指定版本。
- 如果目标任务需要使用本仓库 skill，Codex 应自动提出安装计划并请求用户授权；授权后由 Codex 执行 clone、checkout tag、symlink 和清单更新，不要求用户手动安装。
- 提出安装计划前，Codex 必须检查 `skills/associations.json`；如果存在同源、同类能力、可选前置、可选后续或业务链路关联，必须主动询问用户是否同时安装相关 skill。
- 未经用户授权，Codex 不应在目标仓库自动安装或更新 public skill。

## 内容边界

- 具体内容边界以 `CONVENTIONS.md` 为准。
- 关键原则：只收录可以公开使用的 skill，不提交私有业务密钥、账号凭证、客户数据或运行日志中的敏感 payload。

## 约定入口

- `CONVENTIONS.md` 是本仓库唯一的详细约定文件。
- 创建、修改、发布 skill 时，先按 `CONVENTIONS.md` 检查目录、README、SOURCE、RELEASE、env、examples、artifact、分类、目录 JSON、关联、版本和提交规则。
- `README.md` 只保留仓库介绍和引用流程，不重复维护完整约定。

## 发布要求

- 每个 skill 必须单独维护版本、tag、`RELEASE.md` 和 GitHub Release。
- 单个 skill tag 格式为 `<skill-name>/v<major>.<minor>.<patch>`。
- 不使用全局 release 替代多个 skill 的独立 release。

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
