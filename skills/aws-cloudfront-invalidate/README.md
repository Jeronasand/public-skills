# AWS CloudFront Invalidate

## 用途

这个 skill 用于通过本机已安装的 AWS CLI 刷新 CloudFront CDN 缓存。典型场景是 S3 静态站点上传后刷新 `/index.html`、`/assets/*` 或指定路径。

## 前提条件

目标环境需要已经安装并配置 AWS CLI：

```bash
aws --version
aws cloudfront get-distribution --id EXAMPLE_DISTRIBUTION_ID
```

## 引用方式

在目标仓库的 `.codex/public-skills.yaml` 中固定版本：

```yaml
skills:
  - name: aws-cloudfront-invalidate
    repo: git@github.com:Jeronasand/public-skills.git
    ref: aws-cloudfront-invalidate/v1.0.2
```

## Agent 安装 Prompt

复制下面这句话给目标仓库里的 Codex/agent：

```text
请从 git@github.com:Jeronasand/public-skills.git 安装 public skill `aws-cloudfront-invalidate`，固定版本 `aws-cloudfront-invalidate/v1.0.2`，安装到当前仓库 `.codex/skills/aws-cloudfront-invalidate`；安装前请检查 `skills/associations.json`，如果存在相关 skill，请先询问我是否一起安装。
```

## 环境变量

如需默认配置，在目标仓库的 skill 目录中复制：

```bash
cp .codex/skills/aws-cloudfront-invalidate/.env.aws-cloudfront-invalidate.example \
  .codex/skills/aws-cloudfront-invalidate/.env.aws-cloudfront-invalidate
```

可配置：

```text
AWS_CLOUDFRONT_INVALIDATE_PROFILE=
AWS_CLOUDFRONT_DISTRIBUTION_ID=
AWS_CLOUDFRONT_ALIAS=
AWS_CLOUDFRONT_PATHS=
```

## 常用命令

先预览：

```bash
.codex/skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh \
  --distribution-id EXAMPLE_DISTRIBUTION_ID \
  --path /index.html \
  --path /assets/* \
  --dry-run
```

确认后刷新：

```bash
.codex/skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh \
  --distribution-id EXAMPLE_DISTRIBUTION_ID \
  --path /index.html \
  --path /assets/*
```

带域名校验：

```bash
.codex/skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh \
  --distribution-id EXAMPLE_DISTRIBUTION_ID \
  --alias example.com \
  --path /index.html
```

## 注意事项

- 优先刷新具体路径，不要默认使用 `/*`。
- 如果用户给了域名，使用 `--alias` 校验 distribution，避免刷错 CDN。
- `/*` 属于大范围刷新，默认需要确认。
- 需要先上传 S3 时，另行引用 `aws-s3-upload-folder` skill。

## 作者和来源

- 作者：`Jeronasand & Codex`
- 来源类型：`original`
- 来源记录：[SOURCE.md](./SOURCE.md)

## 版本

- `v1.0.2`：补充可复制给 agent 的安装 prompt。
- `v1.0.1`：补充独立 RELEASE.md 发布记录。
- 当前版本：`aws-cloudfront-invalidate/v1.0.2`
