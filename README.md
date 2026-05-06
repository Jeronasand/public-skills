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
        ├── README.md
        ├── SOURCE.md
        ├── scripts/
        ├── references/
        └── examples/
```

## 其他项目如何引用

其他项目不需要引用整个 skill 集合，而是在自己的仓库里声明需要哪些 skill 和版本。这个流程由目标仓库里的 Codex 自动完成，用户只需要授权安装计划，不需要手动 clone、checkout 或 symlink。

推荐在目标仓库创建或维护：

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

当 Codex 判断当前任务需要某个 public skill 时，应先向用户说明：

- 需要安装的 skill 名称。
- 来源仓库。
- 固定版本 tag。
- 将写入或创建的目标路径。
- 是否需要 env 文件或额外本地配置。

用户授权后，Codex 自动安装。安装逻辑如下，由 Codex 执行，不要求用户手动操作：

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

安装后，Codex 应更新 `.codex/public-skills.yaml` 并提交到目标仓库，除非用户明确只想临时使用。

## 自动安装授权流程

目标仓库需要使用 public skill 时，Codex 按这个流程执行：

1. 检查 `.codex/skills/<skill-name>/SKILL.md` 是否已存在。
2. 如果不存在，读取或创建 `.codex/public-skills.yaml`。
3. 选择匹配任务的 skill 和固定版本。
4. 向用户请求授权，说明来源、版本、安装路径和影响范围。
5. 用户授权后自动 clone 到 `.codex/vendor/public-skills/<skill-name>/<version>/`。
6. checkout 指定 tag。
7. symlink 到 `.codex/skills/<skill-name>`。
8. 如有 `.env.<skill-name>.example`，提示用户是否需要复制本地 env；真实 env 不提交。
9. 更新 `.codex/public-skills.yaml`。
10. 继续执行原任务。

如果用户拒绝授权，Codex 不安装该 skill，并用当前已有能力继续处理或说明缺失能力。

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
2. 在 `skills/<skill-name>/README.md` 下写中文使用说明。
3. 在 `skills/<skill-name>/SOURCE.md` 下记录作者和来源。
4. 如需脚本，放到 `scripts/`；如需补充文档，放到 `references/`。
5. 如果需要环境变量，在 skill 目录内创建 `skills/<skill-name>/.env.<skill-name>.example`。
6. 如果 skill 会产生本地 env、临时文件、测试输出或工具缓存，在 skill 目录内创建 `.gitignore`。
7. 如果涉及测试或人工验证，在 `skills/<skill-name>/examples/` 下补充测试记录。
8. 确认内容不包含密钥、账号、私有 payload 或不可公开的内部信息。
9. 更新 `skills/README.md` 索引和版本记录。
10. 按仓库提交规范提交。
11. 使用 `<skill-name>/v<major>.<minor>.<patch>` 打 tag 并推送。

## Skill README 约定

每个 skill 必须提供中文说明：

```text
skills/<skill-name>/README.md
```

README 面向人类使用者，至少说明用途、适用场景、引用方式、环境变量、常用命令、版本信息、作者/来源和注意事项。`SKILL.md` 面向 Codex 执行，`README.md` 面向用户阅读，两者都要保持同步。

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

## Artifact 上传约定

如果 skill 涉及 PDF、图片、视频、压缩包、二进制样例或较大的非代码/非 Markdown 文档资产，不要直接提交到仓库。默认上传到对象存储，并在仓库中保留 manifest。

本仓库默认 OSS 目标：

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

OSS 上传使用 `oss-upload-folder` skill。密钥通过本机 OSS CLI 配置，例如：

```bash
ossutil config
```

配置通常保存在用户目录的本地文件中，例如：

```text
~/.ossutilconfig
```

如果使用的 OSS CLI 版本不同，以该 CLI 的 `config` / `help` 输出为准。密钥只保留在本机，不提交到 git。

S3 上传使用 `aws-s3-upload-folder` skill，密钥使用本机 AWS CLI 配置：

```text
~/.aws/credentials
~/.aws/config
```

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
