---
name: aws-s3-upload-folder
description: "Upload or sync a local folder to Amazon S3 using the installed AWS CLI. Use when Codex needs to publish static assets, upload dist/ output, mirror a directory to s3://bucket/prefix/, or produce a preview-first AWS CLI S3 deployment command."
---

# AWS S3 Upload Folder

Use this skill to upload a local directory to S3 with the installed `aws` CLI. Do not use SDK code or Node.js for the default path.

## Environment Setup

Copy the skill-local env template in the target repository if defaults are useful:

```bash
cp .codex/skills/aws-s3-upload-folder/.env.aws-s3-upload-folder.example \
  .codex/skills/aws-s3-upload-folder/.env.aws-s3-upload-folder
```

The script loads only `.env.aws-s3-upload-folder` from this skill directory. It does not read project `.env` files.

## Workflow

1. Confirm AWS CLI is installed:

```bash
aws --version
```

2. Confirm access with a read-only check:

```bash
aws s3 ls s3://example-bucket/example-prefix/
```

3. Preview the upload:

```bash
.codex/skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh \
  --local-dir ./dist \
  --s3-uri s3://example-bucket/site/ \
  --dry-run
```

4. Upload after checking the preview:

```bash
.codex/skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh \
  --local-dir ./dist \
  --s3-uri s3://example-bucket/site/
```

## Supported Options

- `--local-dir <path>`: local folder to upload.
- `--s3-uri <s3://bucket/prefix/>`: destination, repeatable for multiple buckets or prefixes.
- `--profile <name>`: AWS CLI profile.
- `--region <region>`: AWS region.
- `--exclude <pattern>`: exclude filter, repeatable.
- `--include <pattern>`: include filter, repeatable.
- `--cache-control <value>`: set object cache control.
- `--content-type <value>`: set content type for all uploaded files when using `cp` mode.
- `--acl <acl>`: optional canned ACL.
- `--delete`: delete remote files that do not exist locally, sync mode only.
- `--cp`: use `aws s3 cp --recursive` instead of the default `aws s3 sync`.
- `--dry-run`: preview actions.
- `--yes`: skip confirmation for dangerous options.

## Safety Rules

- Always run `--dry-run` before a real upload to a new prefix.
- For multi-bucket uploads, pass multiple `--s3-uri` values and verify every target in dry-run output.
- Bucket-root upload is blocked by default.
- Treat `--delete` as dangerous and require confirmation unless `--yes` is provided.
- Prefer `sync` for static site deploys; use `cp` only when the user explicitly wants recursive copy semantics.
- Never write AWS access keys into docs, examples, commits, or test records.

## References

- See `references/aws-s3-upload-notes.md` for command patterns and troubleshooting.
- See `examples/manual-test.md` for public manual test records.
