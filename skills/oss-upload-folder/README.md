# OSS Upload Folder

## 用途

这个 skill 用于把本地文件夹上传或同步到阿里云 OSS。默认使用已经安装好的 OSS 命令行工具，例如 `ossutil` 或 `osscli`，而不是 Node.js。

同时提供一个可选 Node.js 版本，只有当用户明确选择 Node.js 实现时才使用。

## 前提条件

默认 CLI 版本需要目标环境已经安装并配置好：

```bash
command -v ossutil || command -v osscli
```

如果走 Node.js 版本，目标项目需要自行安装：

```bash
npm install ali-oss
```

## 引用方式

在目标仓库的 `.codex/public-skills.yaml` 中选择固定版本：

```yaml
skills:
  - name: oss-upload-folder
    repo: git@github.com:Jeronasand/public-skills.git
    ref: oss-upload-folder/v1.0.0
```

## 环境变量

如需默认配置，在目标仓库的 skill 目录中复制 env 文件：

```bash
cp .codex/skills/oss-upload-folder/.env.oss-upload-folder.example \
  .codex/skills/oss-upload-folder/.env.oss-upload-folder
```

CLI 版本可使用：

```text
OSS_UPLOAD_CLI=
OSS_UPLOAD_ENDPOINT=
OSS_UPLOAD_DEFAULT_URL=
```

Node.js 版本需要：

```text
OSS_NODE_REGION=
OSS_NODE_BUCKET=
OSS_NODE_ENDPOINT=
OSS_NODE_ACCESS_KEY_ID=
OSS_NODE_ACCESS_KEY_SECRET=
```

不要把真实密钥写入仓库，只能放在本地 `.env.oss-upload-folder`。

## CLI 版本

先预览：

```bash
.codex/skills/oss-upload-folder/scripts/upload_folder_to_oss_cli.sh \
  --local-dir ./dist \
  --oss-url oss://example-bucket/site/ \
  --dry-run
```

确认范围后上传：

```bash
.codex/skills/oss-upload-folder/scripts/upload_folder_to_oss_cli.sh \
  --local-dir ./dist \
  --oss-url oss://example-bucket/site/
```

常用参数：

- `--endpoint <endpoint>`：指定 OSS endpoint。
- `--include <pattern>`：包含过滤，可重复。
- `--exclude <pattern>`：排除过滤，可重复。
- `--update`：只上传较新的文件。
- `--delete`：删除远端多余文件，危险操作。
- `--dry-run`：只预览不上传。

## Node.js 可选版本

只有用户明确选择 Node.js 版本时使用：

```bash
node .codex/skills/oss-upload-folder/scripts/upload_folder_to_oss_node.mjs \
  --local-dir ./dist \
  --oss-url oss://example-bucket/site/ \
  --dry-run
```

确认后去掉 `--dry-run` 上传。

## 测试记录

人工测试记录放在：

```text
examples/manual-test.md
```

## 作者和来源

- 作者：`Jeronasand & Codex`
- 来源类型：`derived-original`
- 来源记录：[SOURCE.md](./SOURCE.md)

## 版本

- 当前版本：`oss-upload-folder/v1.0.0`
