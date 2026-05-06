---
name: git-commit-convention
description: "Generate repository-compliant git commit messages and commit workflows. Use when the user asks Codex to write a commit message, commit staged or unstaged changes, follow a repo's git convention, inspect diffs before committing, or translate work into a Conventional Commit style message such as `type: subject`."
---

# Git Commit Convention

Use this skill to turn real repository changes into a commit message that follows the repository's own rules.

## Workflow

1. Inspect the repository rules before writing the message.
   - Read `AGENTS.md`, `CONTRIBUTING.md`, `.gitmessage`, README contribution sections, or package-specific docs if they exist.
   - Prefer explicit local rules over generic conventions.
   - If the user provides a convention in the prompt, treat it as the newest rule for this task.

2. Inspect the actual change set.
   - Run `git status --short --branch`.
   - Use `git diff --stat` for the scope.
   - Use `git diff` for unstaged changes and `git diff --cached` for staged changes when composing a real commit.
   - Do not include unrelated dirty files in the message unless they are part of the requested commit.

3. Choose the commit type from the repo convention.
   - Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`, `ci`, `perf`.
   - For documentation-only changes, prefer `docs`.
   - For new reusable skill content, prefer `feat` unless the repo treats skills as documentation.
   - For repository setup, formatting, or metadata, prefer `chore`.

4. Write the subject.
   - Keep it concise, imperative, and specific.
   - Use lowercase after the type unless the repo's convention differs.
   - Avoid trailing punctuation.
   - Mention the user-visible outcome, not every file touched.

5. Add a body only when it helps.
   - Use a body for multi-part changes, behavior changes, migrations, or important validation notes.
   - Skip the body for small obvious changes.

## Default Format

When the repository only says `type: subject`, use:

```text
type: short imperative subject
```

Examples:

```text
docs: add public skills repository guide
feat: add git commit convention skill
fix: correct skill validation command
chore: update skill index metadata
```

## Commit Execution

If the user asks Codex to commit:

1. Verify the intended files with `git status --short`.
2. Stage only the relevant files.
3. Run repository validation when available, or at minimum run `git diff --check` for text changes.
4. Commit with the selected message.
5. Report the commit hash and the files included.

Never stage or commit unrelated user changes without explicit permission.

## Response Shape

If only asked for a message, return the recommended commit message first:

```text
feat: add git commit convention skill
```

Then briefly explain why that type and subject match the diff if useful.
