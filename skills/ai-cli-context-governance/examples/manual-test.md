# Manual Test Record

## Test Date

2026-05-06

## Scope

Public skill structure and source extraction for `ai-cli-context-governance`.

## Source Read

Source PDF:

```text
AI_CLI_context_solution.pdf
```

Extraction method:

```bash
python3 -m pip install --user pypdf
python3 - <<'PY'
from pypdf import PdfReader
reader = PdfReader("AI_CLI_context_solution.pdf")
print(len(reader.pages))
PY
```

Result:

- PDF had 7 pages.
- Text extraction succeeded.
- Skill was created as a summarized, attributed derivative rather than committing the PDF itself.

## Package Checks

Commands:

```bash
git diff --check
python3 - <<'PY'
from pathlib import Path
d = Path("skills/ai-cli-context-governance")
for name in ["SKILL.md", "README.md", "SOURCE.md"]:
    assert (d / name).exists(), name
text = (d / "SKILL.md").read_text()
assert text.startswith("---\n") and "\n---\n" in text[4:]
print("ok")
PY
```

Expected:

- Markdown whitespace check passes.
- Required skill files exist.
- `SKILL.md` frontmatter is valid enough for package checks.

## Artifact Manifest Check

Commands:

```bash
shasum -a 256 artifact-upload/ai-cli-context-governance/v1.0.1/AI_CLI_context_solution.pdf
/Users/Jeronasand/.codex/skills/oss-upload-folder/scripts/upload_folder_to_oss.sh \
  --local-dir artifact-upload/ai-cli-context-governance/v1.0.1 \
  --oss-url oss://public-skills/skills/ai-cli-context-governance/v1.0.1/ \
  --endpoint oss-cn-shenzhen.aliyuncs.com \
  --dry-run
```

Result:

- SHA-256: `2b852917429f455c1d6cdd19620c5b5722ecc1df6bf006382681a190ea7f5c4e`
- Initial OSS CLI dry-run was blocked because local `ossutil`/`osscli` was not installed during verification.
- Node.js upload path succeeded after using local `.env.oss-upload-folder` credentials and temporary `ali-oss` dependencies under `/tmp`.
- OSS SDK HEAD returned `200`, content length `131103`, ETag `"CD254638D2C06F1ECE6BB3F00732EC24"`.
- Public URL HEAD returned `200 OK`, content type `application/pdf`, content length `131103`, ETag `"CD254638D2C06F1ECE6BB3F00732EC24"` after the bucket owner updated read permissions.

## Result

Passed current-run verification.
