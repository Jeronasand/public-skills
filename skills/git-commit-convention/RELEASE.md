# Git Commit Convention Release Notes

## Current Release

- Skill: `git-commit-convention`
- Version: `git-commit-convention/v1.0.5`
- Previous version: `git-commit-convention/v1.0.4`
- Release type: patch
- Maintainer: `Jeronasand & Codex`

## Summary

根据仓库规范和实际 diff 生成 git commit 内容，并在改动混杂多个主题时提示用户是否拆分提交。

## Changes

- 补充可复制给 agent 的安装 prompt。
- 明确安装前需要检查 `skills/associations.json`，有相关 skill 时先询问用户是否一起安装。

## Artifacts

无外部 artifact。

## Verification

- `git diff --check`
- basic skill package checks

## GitHub Release

本次 tag 推送后，为该 tag 单独创建 GitHub Release；Release 内容以本文件为准。
