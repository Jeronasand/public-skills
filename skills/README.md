# Skills Index

这里记录本仓库可公开复用的 Codex skills。新增 skill 时，在下方补充名称、用途和目录。

| Skill | 当前版本 | Tag | 作者/来源 | 用途 | 路径 |
| --- | --- | --- | --- | --- | --- |
| Git Commit Convention | `v1.0.4` | `git-commit-convention/v1.0.4` | `Jeronasand & Codex` | 根据仓库规范和实际 diff 生成 git commit 内容，改动混杂时提示是否拆分提交 | `skills/git-commit-convention/` |
| OSS Upload Folder | `v1.0.2` | `oss-upload-folder/v1.0.2` | `Jeronasand & Codex` | 使用 OSS CLI 优先的安全流程上传本地文件夹到一个或多个阿里云 OSS 目标，并提供可选 Node.js 版本 | `skills/oss-upload-folder/` |
| AWS S3 Upload Folder | `v1.0.2` | `aws-s3-upload-folder/v1.0.2` | `Jeronasand & Codex` | 使用 AWS CLI 将本地文件夹上传或同步到一个或多个 Amazon S3 目标 | `skills/aws-s3-upload-folder/` |
| AWS CloudFront Invalidate | `v1.0.1` | `aws-cloudfront-invalidate/v1.0.1` | `Jeronasand & Codex` | 使用 AWS CLI 刷新 CloudFront CDN 路径，并支持 alias 校验 | `skills/aws-cloudfront-invalidate/` |
| AI CLI Context Governance | `v1.0.3` | `ai-cli-context-governance/v1.0.3` | 社群 PDF 来源，`Jeronasand & Codex` 整理 | AI CLI 长上下文性能、幻觉治理、检索、压缩和证据约束工作流 | `skills/ai-cli-context-governance/` |
| Bucket Upload Policy | `v1.0.1` | `bucket-upload-policy/v1.0.1` | `Jeronasand & Codex` | 判断 skill 相关大文件或二进制资产是否应上传到 OSS/S3，并生成仓库内 artifact manifest | `skills/bucket-upload-policy/` |
| Public Skills Catalog | `v1.0.0` | `public-skills-catalog/v1.0.0` | `Jeronasand & Codex` | 读取机器可读目录、分类和关联 JSON，帮助 AI 快速了解、筛选、组合和安装 public skills | `skills/public-skills-catalog/` |

## 版本记录

### git-commit-convention/v1.0.4

- 当改动内容混乱或跨多个主题时，先提示用户是否分开提交。

### public-skills-catalog/v1.0.0

- 新增 `public-skills-catalog` skill。
- 新增 `skills/catalog.json` 和 `skills/categories.json`，用于 AI 快速读取所有 skills 并按分类筛选。
- 明确 Codex 创建或更新 skill 时必须自行判断分类并同步机器可读 JSON。

### git-commit-convention/v1.0.3

- 补充独立 `RELEASE.md` 发布记录。

### oss-upload-folder/v1.0.2

- 补充独立 `RELEASE.md` 发布记录。

### aws-s3-upload-folder/v1.0.2

- 补充独立 `RELEASE.md` 发布记录。

### aws-cloudfront-invalidate/v1.0.1

- 补充独立 `RELEASE.md` 发布记录。

### ai-cli-context-governance/v1.0.3

- 补充独立 `RELEASE.md` 发布记录。

### bucket-upload-policy/v1.0.1

- 补充独立 `RELEASE.md` 发布记录。

### bucket-upload-policy/v1.0.0

- 新增 `bucket-upload-policy` skill。
- 明确本仓库默认 OSS artifact 目标：`oss-cn-shenzhen`、bucket `public-skills`、域名 `publick-skills.jeronasand.cn`。
- 规范 PDF、图片、视频、压缩包、二进制样例等非代码/非 Markdown 大文件上传到 OSS/S3，仓库只保留 manifest。

### ai-cli-context-governance/v1.0.2

- 更新 PDF artifact 上传状态：对象已上传到 OSS，SDK HEAD 和公开域名 HEAD 均验证通过。

### ai-cli-context-governance/v1.0.1

- 补充原始 PDF 的 OSS artifact manifest，原始 PDF 不直接提交到仓库。

### ai-cli-context-governance/v1.0.0

- 新增 `ai-cli-context-governance` skill。
- 来源于社群「新•AI游戏开发」未来游戏人交流中的 PDF《AI CLI 长上下文性能与幻觉治理方案》。
- 沉淀 Hot/Warm/Cold context、token budget、prompt caching、evidence block、`/compact`、`/pin`、`/forget`、`/retrieve` 等 AI CLI 上下文治理流程。

### aws-s3-upload-folder/v1.0.1

- 支持重复传入多个 `--s3-uri`，用于同一次发布上传到多个 bucket 或 prefix。
- 补充 `AWS_S3_UPLOAD_DEFAULT_URIS` 默认多目标配置。

### oss-upload-folder/v1.0.1

- CLI 和 Node.js 脚本均支持重复传入多个 `--oss-url`，用于同一次发布上传到多个 bucket 或 prefix。
- 补充 `OSS_UPLOAD_DEFAULT_URLS` 和 `OSS_NODE_DEFAULT_URLS` 默认多目标配置。

### aws-s3-upload-folder/v1.0.0

- 新增 `aws-s3-upload-folder` skill。
- 使用本机已安装的 AWS CLI 执行 `aws s3 sync` 或 `aws s3 cp --recursive`。
- 支持 dry-run、profile、region、include/exclude、cache-control、ACL 和危险 `--delete` 确认。

### aws-cloudfront-invalidate/v1.0.0

- 新增 `aws-cloudfront-invalidate` skill。
- 使用本机已安装的 AWS CLI 执行 CloudFront invalidation。
- 支持 dry-run、路径列表、profile、distribution alias 校验和大范围 `/*` 刷新确认。

### git-commit-convention/v1.0.2

- 补充中文 `README.md`。

### oss-upload-folder/v1.0.0

- 新增 `oss-upload-folder` skill。
- 默认使用已安装的 `ossutil` 或 `osscli` 上传文件夹到 OSS。
- 提供可选 Node.js 脚本，需要用户明确选择 Node.js 版本并安装 `ali-oss`。
- 补充 skill 专属 env 模板、`.gitignore`、来源记录和人工测试记录目录。

### git-commit-convention/v1.0.1

- 补充 `SOURCE.md` 来源记录。
- 明确该 skill 作者为 `Jeronasand & Codex`，来源类型为 `original`。

### git-commit-convention/v1.0.0

- 新增 `git-commit-convention` skill。
- 支持读取仓库提交规范、检查 staged/unstaged diff、选择提交类型并生成 `type: subject` 格式提交内容。
- 包含提交执行前的基础校验流程，避免误提交无关文件。
