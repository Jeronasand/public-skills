# Skills Index

这里记录本仓库可公开复用的 Codex skills。新增 skill 时，在下方补充名称、用途和目录。

| Skill | 当前版本 | Tag | 用途 | 路径 |
| --- | --- | --- | --- | --- |
| Git Commit Convention | `v1.0.0` | `git-commit-convention/v1.0.0` | 根据仓库规范和实际 diff 生成 git commit 内容 | `skills/git-commit-convention/` |

## 版本记录

### git-commit-convention/v1.0.0

- 新增 `git-commit-convention` skill。
- 支持读取仓库提交规范、检查 staged/unstaged diff、选择提交类型并生成 `type: subject` 格式提交内容。
- 包含提交执行前的基础校验流程，避免误提交无关文件。
