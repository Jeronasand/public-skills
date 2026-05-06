# Git Commit Convention

## 用途

这个 skill 用于帮助 Codex 根据目标仓库的真实改动和本地提交规范生成 git commit 内容，也可以在用户要求提交时辅助完成检查、暂存、提交和结果汇报。

## 适用场景

- 用户要求“帮我写 commit message”。
- 用户要求“按照仓库规范提交”。
- 仓库有 `AGENTS.md`、`CONTRIBUTING.md`、`.gitmessage` 或其他提交规范。
- 需要根据 staged/unstaged diff 判断提交类型和提交摘要。

## 引用方式

在目标仓库的 `.codex/public-skills.yaml` 中选择固定版本：

```yaml
skills:
  - name: git-commit-convention
    repo: git@github.com:Jeronasand/public-skills.git
    ref: git-commit-convention/v1.0.3
```

## 常用输出

当仓库只要求 `type: subject` 时，输出类似：

```text
feat: add git commit convention skill
docs: update repository usage guide
fix: correct validation command
```

## 环境变量

这个 skill 不需要环境变量。

## 作者和来源

- 作者：`Jeronasand & Codex`
- 来源类型：`original`
- 来源记录：[SOURCE.md](./SOURCE.md)

## 版本

- `v1.0.3`：补充独立 RELEASE.md 发布记录。
- 当前版本：`git-commit-convention/v1.0.3`
- `v1.0.2`：补充中文 README。
- `v1.0.1`：补充来源记录。
- `v1.0.0`：新增 git 提交规范 skill。
