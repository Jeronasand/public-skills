# Public Skills Catalog Release Notes

## Current Release

- Skill: `public-skills-catalog`
- Version: `public-skills-catalog/v1.0.1`
- Previous version: `public-skills-catalog/v1.0.0`
- Release type: patch
- Maintainer: `Jeronasand & Codex`

## Summary

读取和维护 public-skills 机器可读目录、分类和关联 JSON，并在用户解析仓库使用方式时渲染为用户可读表格。

## Changes

- 当用户询问仓库怎么用、有哪些 skill 或要求解析仓库时，Codex 应读取 `categories`、`catalog`、`associations` JSON 并渲染分类表、skill 目录表和关联提示表。
- 默认不直接粘贴完整 raw JSON，除非用户明确要求。
- 用户选定 skill 后，再输出对应 `.codex/public-skills.yaml` 安装片段。

## Artifacts

无外部 artifact。

## Verification

- `python3 -m json.tool skills/catalog.json`
- `python3 -m json.tool skills/categories.json`
- `python3 -m json.tool skills/associations.json`
- catalog/category/association reference checks
- `git diff --check`

## GitHub Release

本次 tag 推送后，为该 tag 单独创建 GitHub Release；Release 内容以本文件为准。
