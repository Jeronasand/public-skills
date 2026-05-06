# Git Commit Convention Release Notes

## Current Release

- Skill: `git-commit-convention`
- Version: `git-commit-convention/v1.0.6`
- Previous version: `git-commit-convention/v1.0.5`
- Release type: patch
- Maintainer: `Jeronasand & Codex`

## Summary

根据仓库规范和实际 diff 生成 git commit 内容，并在改动混杂多个主题时提示用户是否拆分提交。

## Changes

- 明确必须读取 `CONVENTIONS.md` 等仓库约定文件。
- 如果仓库规则定义了提交单元、发布单元、生成文件归属或 tag 规则，按本地规则判断拆分提交。
- 生成文件、索引文件、lockfile 和快照默认跟随触发它们变化的源改动；仓库有明确规则时以仓库规则为准。

## Artifacts

无外部 artifact。

## Verification

- `git diff --check`
- basic skill package checks

## GitHub Release

本次 tag 推送后，为该 tag 单独创建 GitHub Release；Release 内容以本文件为准。
