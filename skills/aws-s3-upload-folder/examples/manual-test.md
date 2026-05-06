# Manual Test Record

## Test Date

2026-05-06

## Scope

Public skill structure and script safety checks for `aws-s3-upload-folder`.

## Test Cases

### Script syntax

Command:

```bash
bash -n skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh
```

Expected:

- Exits successfully.

### Help output

Command:

```bash
skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh --help
```

Expected:

- Prints usage.
- Exits successfully.

### Missing AWS CLI guard

Command:

```bash
skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh \
  --aws-cli definitely-not-installed-aws-cli \
  --local-dir skills/aws-s3-upload-folder/examples \
  --s3-uri s3://example-bucket/site/ \
  --dry-run
```

Expected:

- Fails before upload.
- Reports that the requested AWS CLI is not installed.

### Multiple S3 URI guard

Command:

```bash
skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh \
  --aws-cli definitely-not-installed-aws-cli \
  --local-dir skills/aws-s3-upload-folder/examples \
  --s3-uri s3://example-bucket-a/site/ \
  --s3-uri s3://example-bucket-b/site/ \
  --dry-run
```

Expected:

- Accepts repeated `--s3-uri` arguments.
- Fails before upload because the requested AWS CLI is not installed.

### Multiple S3 URI command construction

Command:

```bash
skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh \
  --aws-cli true \
  --local-dir skills/aws-s3-upload-folder/examples \
  --s3-uri s3://example-bucket-a/site/ \
  --s3-uri s3://example-bucket-b/site/ \
  --dry-run
```

Expected:

- Prints two `Running:` commands.
- Preserves both target S3 URIs.

## Result

Passed current-run verification.

Verified commands:

- `bash -n skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh`
- `skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh --help`
- `skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh --aws-cli definitely-not-installed-aws-cli --local-dir skills/aws-s3-upload-folder/examples --s3-uri s3://example-bucket/site/ --dry-run`
- `skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh --aws-cli definitely-not-installed-aws-cli --local-dir skills/aws-s3-upload-folder/examples --s3-uri s3://example-bucket-a/site/ --s3-uri s3://example-bucket-b/site/ --dry-run`
- `skills/aws-s3-upload-folder/scripts/upload_folder_to_s3.sh --aws-cli true --local-dir skills/aws-s3-upload-folder/examples --s3-uri s3://example-bucket-a/site/ --s3-uri s3://example-bucket-b/site/ --dry-run`

## Notes

All examples use placeholder bucket names and contain no credentials.
