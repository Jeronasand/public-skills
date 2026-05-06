# public-skills

这个仓库用于保存可以公开复用的 Codex skills。它的作用不是存放某个单一项目的私有知识，而是把已经整理过、可以脱敏公开、可以由其他项目按需挑选引用的 skill 集中管理起来。

本仓库完全由 Codex 维护。用户只需要说明要新增、修改、发布或引用哪些 skill，Codex 负责文件修改、版本记录、校验、提交、tag 和推送。

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

## 其他项目如何引用

其他项目不需要引用整个 skill 集合，而是在自己的仓库里声明需要哪些 skill 和版本。推荐在目标仓库创建：

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

目标仓库里的 Codex 根据这个清单安装对应 skill：

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
