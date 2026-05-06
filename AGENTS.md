# public-skills Agent Instructions

## 项目定位

这个仓库用于记录和维护用户通过 Codex 创建、整理、验证过，并且可以公开复用的 Codex skills。目标是把零散的一次性 skill 沉淀为可选择、可复制、可导入到其他项目的公开技能库。

## 内容边界

- 只收录可以公开使用的 skill，不提交私有业务密钥、账号凭证、客户数据、运行日志中的敏感 payload。
- 每个 skill 必须能独立理解用途、触发条件、输入要求、输出预期和注意事项。
- 优先沉淀通用工作流，例如部署、文档处理、批处理、仓库维护、第三方工具集成。
- 和单个私有项目强绑定、无法脱敏复用的内容不要直接放入本仓库；需要先抽象为公开版。

## 目录约定

- `skills/<skill-name>/SKILL.md`：每个 skill 的主说明文件。
- `skills/<skill-name>/scripts/`：可选，放置该 skill 需要复用的脚本。
- `skills/<skill-name>/references/`：可选，放置该 skill 的补充参考文档。
- `skills/README.md`：公开 skill 索引，新增 skill 时同步更新。

## 编写要求

- `SKILL.md` 使用清晰的触发条件开头，说明什么时候应该使用该 skill。
- 操作步骤要可执行，避免只写概念解释。
- 示例命令使用占位符，不能包含真实 token、私钥、cookie、账号或内部 URL。
- 如果 skill 依赖本地工具，写清楚依赖名称、检查命令和失败时的处理方式。
- 如果 skill 包含脚本，脚本默认先提供 dry-run 或预览能力，再执行有副作用操作。

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
