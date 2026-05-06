# AWS S3 Upload Notes

## Preview First

Use dry-run before real upload:

```bash
.codex/skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh \
  --local-dir ./dist \
  --s3-uri s3://example-bucket/site/ \
  --dry-run
```

## Static Site Sync

For most static deployments, use the default sync mode:

```bash
.codex/skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh \
  --local-dir ./dist \
  --s3-uri s3://example-bucket/site/ \
  --cache-control "public,max-age=31536000,immutable"
```

Set cache headers carefully. `index.html` often needs shorter cache settings, which may require separate commands.

## Strict Mirror

Use `--delete` only after previewing:

```bash
.codex/skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh \
  --local-dir ./dist \
  --s3-uri s3://example-bucket/site/ \
  --delete \
  --dry-run
```

## Troubleshooting

- `aws: command not found`: install AWS CLI first.
- `AccessDenied`: check profile, IAM policy, bucket policy, and region.
- `Could not connect to the endpoint URL`: verify region/network and start with `aws s3 ls`.
- Unexpected files: check `--exclude`, `--include`, local directory, and target prefix.
