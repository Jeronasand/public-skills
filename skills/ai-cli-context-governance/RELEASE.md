# AI CLI Context Governance Release Notes

## Current Release

- Skill: `ai-cli-context-governance`
- Version: `ai-cli-context-governance/v1.0.4`
- Previous version: `ai-cli-context-governance/v1.0.3`
- Release type: patch
- Maintainer: `Jeronasand & Codex`

## Summary

AI CLI 长上下文性能、幻觉治理、检索、压缩和证据约束工作流。

## Changes

- 补充可复制给 agent 的安装 prompt。
- 明确安装前需要检查 `skills/associations.json`，有相关 skill 时先询问用户是否一起安装。

## Artifacts

PDF artifact: https://publick-skills.jeronasand.cn/skills/ai-cli-context-governance/v1.0.1/AI_CLI_context_solution.pdf

## Verification

- `git diff --check`
- basic skill package checks

## GitHub Release

本次 tag 推送后，为该 tag 单独创建 GitHub Release；Release 内容以本文件为准。
