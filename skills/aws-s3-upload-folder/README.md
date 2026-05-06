# AWS S3 Upload Folder

## 用途

这个 skill 用于通过本机已安装的 AWS CLI，把本地目录上传或同步到 Amazon S3。典型场景是上传 `dist/`、静态站点产物、SDK bundle 或其他目录内容。

默认使用：

```bash
aws s3 sync
```

也可以显式选择：

```bash
aws s3 cp --recursive
```

## 前提条件

目标环境需要已经安装并配置 AWS CLI：

```bash
aws --version
aws s3 ls s3://example-bucket/example-prefix/
```

## 引用方式

在目标仓库的 `.codex/public-skills.yaml` 中固定版本：

```yaml
skills:
  - name: aws-s3-upload-folder
    repo: git@github.com:Jeronasand/public-skills.git
    ref: aws-s3-upload-folder/v1.0.0
```

## 环境变量

如需默认配置，在目标仓库的 skill 目录中复制：

```bash
cp .codex/skills/aws-s3-upload-folder/.env.aws-s3-upload-folder.example \
  .codex/skills/aws-s3-upload-folder/.env.aws-s3-upload-folder
```

可配置：

```text
AWS_S3_UPLOAD_PROFILE=
AWS_S3_UPLOAD_REGION=
AWS_S3_UPLOAD_DEFAULT_URI=
AWS_S3_UPLOAD_CACHE_CONTROL=
AWS_S3_UPLOAD_ACL=
```

不要把 AWS access key 写入仓库。

## 常用命令

先预览：

```bash
.codex/skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh \
  --local-dir ./dist \
  --s3-uri s3://example-bucket/site/ \
  --dry-run
```

确认后上传：

```bash
.codex/skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh \
  --local-dir ./dist \
  --s3-uri s3://example-bucket/site/
```

严格同步并删除远端多余文件：

```bash
.codex/skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh \
  --local-dir ./dist \
  --s3-uri s3://example-bucket/site/ \
  --delete \
  --dry-run
```

## 注意事项

- 第一次上传新路径必须先使用 `--dry-run`。
- 默认阻止 bucket 根目录上传。
- `--delete` 会删除远端多余对象，属于危险操作。
- 需要同时刷新 CloudFront 时，另行引用 `aws-cloudfront-invalidate` skill。

## 作者和来源

- 作者：`Jeronasand & Codex`
- 来源类型：`original`
- 来源记录：[SOURCE.md](./SOURCE.md)

## 版本

- 当前版本：`aws-s3-upload-folder/v1.0.0`
