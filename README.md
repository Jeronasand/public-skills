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
        ├── .env.<skill-name>.example
        ├── .gitignore
        ├── SKILL.md
        ├── SOURCE.md
        ├── scripts/
        ├── references/
        └── examples/
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
2. 在 `skills/<skill-name>/SOURCE.md` 下记录作者和来源。
3. 如需脚本，放到 `scripts/`；如需补充文档，放到 `references/`。
4. 如果需要环境变量，在 skill 目录内创建 `skills/<skill-name>/.env.<skill-name>.example`。
5. 如果 skill 会产生本地 env、临时文件、测试输出或工具缓存，在 skill 目录内创建 `.gitignore`。
6. 如果涉及测试或人工验证，在 `skills/<skill-name>/examples/` 下补充测试记录。
7. 确认内容不包含密钥、账号、私有 payload 或不可公开的内部信息。
8. 更新 `skills/README.md` 索引和版本记录。
9. 按仓库提交规范提交。
10. 使用 `<skill-name>/v<major>.<minor>.<patch>` 打 tag 并推送。

## 来源和作者约定

每个 skill 必须提供：

```text
skills/<skill-name>/SOURCE.md
```

自建 skill 的作者写：

```text
Jeronasand & Codex
```

如果 skill 来自其他作者、其他仓库或其他 skill 源，必须记录原作者、源地址、原始版本或引用时间。目标仓库使用时，应优先使用源 skill；本仓库只维护清晰注明来源的公开副本或索引，不把外部来源不明的 skill 当作自建内容。

## 测试记录约定

如果 skill 涉及测试、验证或人工确认流程，必须提供：

```text
skills/<skill-name>/examples/
```

该目录用于记录人工测试样例、输入输出、执行步骤、预期结果、实际结果和必要备注。测试记录必须脱敏，不能包含真实密钥、账号、私有 payload 或不可公开的业务数据。

## 环境变量约定

如果 skill 需要环境变量，必须在对应 skill 目录内提供 example 文件：

```text
skills/<skill-name>/.env.<skill-name>.example
```

使用者在目标仓库的 skill 目录内自己复制一份本地配置：

```bash
cp .codex/skills/<skill-name>/.env.<skill-name>.example \
  .codex/skills/<skill-name>/.env.<skill-name>
```

skill 应读取 `.codex/skills/<skill-name>/.env.<skill-name>`，不要默认读取宿主环境或通用 `.env`，避免误用目标机器上的同名变量。缺少必需变量时，应提示用户补全该 skill 专属 env 文件。

如果 skill 使用 env 文件，该 skill 目录内还应提供 `.gitignore`，至少包含：

```gitignore
.env.<skill-name>
```

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
