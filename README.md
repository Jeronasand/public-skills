# public-skills

这个仓库用于保存可以公开复用的 Codex skills。它的作用不是存放某个单一项目的私有知识，而是把已经整理过、可以脱敏公开、可以快速导入其他项目的 skill 集中管理起来。

## 目录结构

```text
public-skills/
├── AGENTS.md
├── README.md
└── skills/
    ├── README.md
    └── <skill-name>/
        ├── SKILL.md
        ├── scripts/
        └── references/
```

## 使用方式

选择需要的 skill 后，把对应目录复制到目标项目或 Codex skills 目录中：

```bash
cp -R skills/<skill-name> /path/to/target/.codex/skills/
```

如果目标是全局 Codex skills，可以复制到：

```bash
cp -R skills/<skill-name> ~/.codex/skills/
```

复制后建议检查：

```bash
ls ~/.codex/skills/<skill-name>/SKILL.md
```

## 新增 skill 流程

1. 在 `skills/<skill-name>/` 下创建 `SKILL.md`。
2. 如需脚本，放到 `scripts/`；如需补充文档，放到 `references/`。
3. 确认内容不包含密钥、账号、私有 payload 或不可公开的内部信息。
4. 更新 `skills/README.md` 索引。
5. 按仓库提交规范提交。

## 提交规范

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
