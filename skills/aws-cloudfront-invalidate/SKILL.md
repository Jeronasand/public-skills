---
name: aws-cloudfront-invalidate
description: "Invalidate CloudFront CDN paths using the installed AWS CLI. Use when Codex needs to refresh CDN cache after S3/static deployments, create CloudFront invalidations, verify distribution aliases before invalidating, or generate preview-first CDN refresh commands."
---

# AWS CloudFront Invalidate

Use this skill to refresh CloudFront CDN cache with the installed `aws` CLI.

## Environment Setup

Copy the skill-local env template in the target repository if defaults are useful:

```bash
cp .codex/skills/aws-cloudfront-invalidate/.env.aws-cloudfront-invalidate.example \
  .codex/skills/aws-cloudfront-invalidate/.env.aws-cloudfront-invalidate
```

The script loads only `.env.aws-cloudfront-invalidate` from this skill directory. It does not read project `.env` files.

## Workflow

1. Confirm AWS CLI is installed:

```bash
aws --version
```

2. Verify the distribution before mutating CDN state:

```bash
aws cloudfront get-distribution --id EXAMPLE_DISTRIBUTION_ID
```

3. Preview invalidation:

```bash
.codex/skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh \
  --distribution-id EXAMPLE_DISTRIBUTION_ID \
  --path /index.html \
  --path /assets/* \
  --dry-run
```

4. Create invalidation:

```bash
.codex/skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh \
  --distribution-id EXAMPLE_DISTRIBUTION_ID \
  --path /index.html \
  --path /assets/*
```

## Supported Options

- `--distribution-id <id>`: CloudFront distribution id.
- `--path <path>`: invalidation path, repeatable.
- `--paths <paths>`: comma or space separated path list.
- `--alias <domain>`: verify the distribution has this alias before invalidating.
- `--profile <name>`: AWS CLI profile.
- `--aws-cli <command>`: AWS CLI command, default `aws`.
- `--dry-run`: preview only.
- `--yes`: skip confirmation for broad invalidations such as `/*`.

## Safety Rules

- Prefer targeted paths over `/*`.
- Use `--alias` when the user provides a domain, so the script verifies the distribution before invalidating.
- Treat `/*` as broad and require confirmation unless `--yes` is provided.
- Never include account secrets, credentials, or private deployment metadata in examples.

## References

- See `references/aws-cloudfront-invalidate-notes.md` for command patterns and troubleshooting.
- See `examples/manual-test.md` for public manual test records.
