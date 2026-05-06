# AI CLI Context Governance

## 用途

这个 skill 用于设计、诊断和优化 AI CLI 的长上下文能力，重点解决：

- 上下文越聊越大导致每轮变慢。
- 模型在长上下文里幻觉、引用旧信息或忽略中间材料。
- CLI 每轮重复塞入大量工具 schema、历史对话、日志或仓库内容。
- 需要设计 `/compact`、`/pin`、`/forget`、`/retrieve` 等上下文治理能力。

核心思路是：不要把超长上下文当成工作内存，而是使用小型 hot context、精准检索、结构化摘要、证据约束和稳定 prompt 前缀。

## 引用方式

在目标仓库的 `.codex/public-skills.yaml` 中固定版本：

```yaml
skills:
  - name: ai-cli-context-governance
    repo: git@github.com:Jeronasand/public-skills.git
    ref: ai-cli-context-governance/v1.0.1
```

## 使用场景

- 设计新的 AI CLI 上下文系统。
- 给已有 CLI 加上下文压缩、检索、证据引用机制。
- 排查长上下文下的响应变慢、幻觉、旧信息污染。
- 制定 prompt caching 友好的 prompt 结构。
- 规划 agent 记忆、会话摘要、检索库和证据块。

## 推荐架构

将上下文拆成三层：

- Hot context：每轮都带，只放当前任务必须信息。
- Warm context：按需检索，只放本轮相关片段。
- Cold context：长期存储，不直接进入 prompt。

默认不要把完整历史、完整仓库、完整日志或完整 agent trace 每轮都塞给模型。

## 常用治理能力

- `/compact`：把会话压缩为结构化状态。
- `/pin`：固定关键约束、文件、决策。
- `/forget`：删除过期假设、污染上下文、旧文件。
- `/retrieve`：展示本轮实际使用了哪些证据片段。

## 证据约束

回答前先选 evidence block，再基于证据生成。没有证据时应明确说不确定，而不是凭印象补全。

## 环境变量

这个 skill 不需要环境变量。

## 测试记录

人工测试记录放在：

```text
examples/manual-test.md
```

## 外部文件

原始 PDF 不直接提交到仓库，应上传到 OSS 并在仓库内保留 manifest：

```text
references/artifact-manifest.md
```

目标地址：

```text
oss://public-skills/skills/ai-cli-context-governance/v1.0.1/AI_CLI_context_solution.pdf
https://publick-skills.jeronasand.cn/skills/ai-cli-context-governance/v1.0.1/AI_CLI_context_solution.pdf
```

当前状态：PDF 已上传到 OSS，SDK HEAD 和公开域名 HEAD 均验证通过。

## 作者和来源

- 来源：社群「新•AI游戏开发」未来游戏人交流中的 PDF《AI CLI 长上下文性能与幻觉治理方案》
- PDF 署名：ChatGPT
- 整理维护：`Jeronasand & Codex`
- 来源记录：[SOURCE.md](./SOURCE.md)

## 版本

- 当前版本：`ai-cli-context-governance/v1.0.2`
- `v1.0.2`：更新 PDF artifact 上传状态，公开访问已验证。
- `v1.0.1`：补充原始 PDF 的 OSS artifact manifest。
- `v1.0.0`：新增 AI CLI 上下文治理 skill。
