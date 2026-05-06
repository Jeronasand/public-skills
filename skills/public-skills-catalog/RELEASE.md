# Public Skills Catalog Release Notes

## Current Release

- Skill: `public-skills-catalog`
- Version: `public-skills-catalog/v1.0.0`
- Previous version: none
- Release type: initial
- Maintainer: `Jeronasand & Codex`

## Summary

新增用于读取和维护 public-skills 机器可读目录、分类和关联 JSON 的 skill。

## Changes

- 新增 `skills/catalog.json`，记录所有 skill 的名称、版本、tag、路径、分类、关键词和维护信息。
- 新增 `skills/categories.json`，记录 skill 分类和每个分类下的 skill 列表。
- 新增 `public-skills-catalog` skill，指导 AI 快速读取目录并在创建 skill 时自行归类。

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
