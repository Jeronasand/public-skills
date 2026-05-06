# Artifact Manifest

## Storage Target

- Provider: Alibaba Cloud OSS
- Region: `oss-cn-shenzhen`
- Bucket: `public-skills`
- Public domain: `publick-skills.jeronasand.cn`
- Prefix: `skills/ai-cli-context-governance/v1.0.1/`

## Files

| File | Public URL | Storage URI | Size | SHA-256 | Source | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `AI_CLI_context_solution.pdf` | `https://publick-skills.jeronasand.cn/skills/ai-cli-context-governance/v1.0.1/AI_CLI_context_solution.pdf` | `oss://public-skills/skills/ai-cli-context-governance/v1.0.1/AI_CLI_context_solution.pdf` | 131103 bytes | `2b852917429f455c1d6cdd19620c5b5722ecc1df6bf006382681a190ea7f5c4e` | 社群「新•AI游戏开发」未来游戏人交流 | Pending upload: local `ossutil`/`osscli` not configured during manifest creation |

## Upload Command

Prepare local artifact folder:

```bash
mkdir -p artifact-upload/ai-cli-context-governance/v1.0.1
cp /path/to/AI_CLI_context_solution.pdf \
  artifact-upload/ai-cli-context-governance/v1.0.1/AI_CLI_context_solution.pdf
```

Preview:

```bash
/Users/Jeronasand/.codex/skills/oss-upload-folder/scripts/upload_folder_to_oss.sh \
  --local-dir artifact-upload/ai-cli-context-governance/v1.0.1 \
  --oss-url oss://public-skills/skills/ai-cli-context-governance/v1.0.1/ \
  --endpoint oss-cn-shenzhen.aliyuncs.com \
  --dry-run
```

Upload:

```bash
/Users/Jeronasand/.codex/skills/oss-upload-folder/scripts/upload_folder_to_oss.sh \
  --local-dir artifact-upload/ai-cli-context-governance/v1.0.1 \
  --oss-url oss://public-skills/skills/ai-cli-context-governance/v1.0.1/ \
  --endpoint oss-cn-shenzhen.aliyuncs.com
```

## Credential Location

OSS credentials must stay local and must not be committed.

Configure with:

```bash
ossutil config
```

Typical local config path:

```text
~/.ossutilconfig
```

If using another OSS CLI version, follow that CLI's `config` / `help` output for the local config path.
