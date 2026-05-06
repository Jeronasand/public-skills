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

## Result

Passed current-run verification.
