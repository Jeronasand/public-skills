# Public Skills Catalog Release Notes

## Current Release

- Skill: `public-skills-catalog`
- Version: `public-skills-catalog/v1.0.2`
- Previous version: `public-skills-catalog/v1.0.1`
- Release type: patch
- Maintainer: `Jeronasand & Codex`

## Summary

读取和维护 public-skills 机器可读目录、分类和关联 JSON，并在用户解析仓库使用方式时渲染为用户可读表格。

## Changes

- 补充可复制给 agent 的安装 prompt。
- 明确安装前需要检查 `skills/associations.json`，有相关 skill 时先询问用户是否一起安装。

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
