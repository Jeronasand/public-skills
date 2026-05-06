# Bucket Upload Policy Release Notes

## Current Release

- Skill: `bucket-upload-policy`
- Version: `bucket-upload-policy/v1.0.2`
- Previous version: `bucket-upload-policy/v1.0.1`
- Release type: patch
- Maintainer: `Jeronasand & Codex`

## Summary

判断 skill 相关大文件或二进制资产是否应上传到 OSS/S3，并生成仓库内 artifact manifest。

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
