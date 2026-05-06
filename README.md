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

## 指定版本引用

公开 skill 使用 tag 记录版本，tag 格式：

```text
<skill-name>/v<major>.<minor>.<patch>
```

例如：

```text
git-commit-convention/v1.0.0
```

其他仓库需要固定引用某个版本时，建议把本仓库作为 submodule 放到 `.codex/vendor/public-skills`，再把目标 skill 链接到 `.codex/skills`：

```bash
git submodule add git@github.com:Jeronasand/public-skills.git .codex/vendor/public-skills
cd .codex/vendor/public-skills
git fetch --tags
git checkout git-commit-convention/v1.0.0
cd -

mkdir -p .codex/skills
ln -s ../vendor/public-skills/skills/git-commit-convention .codex/skills/git-commit-convention
```

## 新增 skill 流程

1. 在 `skills/<skill-name>/` 下创建 `SKILL.md`。
2. 如需脚本，放到 `scripts/`；如需补充文档，放到 `references/`。
3. 确认内容不包含密钥、账号、私有 payload 或不可公开的内部信息。
4. 更新 `skills/README.md` 索引和版本记录。
5. 按仓库提交规范提交。
6. 使用 `<skill-name>/v<major>.<minor>.<patch>` 打 tag 并推送。

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
