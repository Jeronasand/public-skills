# Git Commit Convention Release Notes

## Current Release

- Skill: `git-commit-convention`
- Version: `git-commit-convention/v1.0.4`
- Previous version: `git-commit-convention/v1.0.3`
- Release type: patch
- Maintainer: `Jeronasand & Codex`

## Summary

根据仓库规范和实际 diff 生成 git commit 内容，并在改动混杂多个主题时提示用户是否拆分提交。

## Changes

- 新增混乱改动拆分判断流程。
- 当 diff 跨多个不相关目的、模块或提交类型时，Codex 需要先说明建议拆分组并询问用户是否分开提交。
- 未经用户确认，不自动拆分、不部分 stage。

## Artifacts

无外部 artifact。

## Verification

- `git diff --check`
- basic skill package checks

## GitHub Release

本次 tag 推送后，为该 tag 单独创建 GitHub Release；Release 内容以本文件为准。
