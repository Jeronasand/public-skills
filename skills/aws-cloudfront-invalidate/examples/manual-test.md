# Manual Test Record

## Test Date

2026-05-06

## Scope

Public skill structure and script safety checks for `aws-cloudfront-invalidate`.

## Test Cases

### Script syntax

Command:

```bash
bash -n skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh
```

Expected:

- Exits successfully.

### Help output

Command:

```bash
skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh --help
```

Expected:

- Prints usage.
- Exits successfully.

### Dry-run without AWS call

Command:

```bash
skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh \
  --aws-cli definitely-not-installed-aws-cli \
  --distribution-id EXAMPLE123 \
  --path /index.html \
  --dry-run
```

Expected:

- Prints planned invalidation.
- Does not require AWS CLI because `--dry-run` is set.

### Missing AWS CLI guard

Command:

```bash
skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh \
  --aws-cli definitely-not-installed-aws-cli \
  --distribution-id EXAMPLE123 \
  --path /index.html
```

Expected:

- Fails before invalidation.
- Reports that the requested AWS CLI is not installed.

## Result

Passed current-run verification.

Verified commands:

- `bash -n skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh`
- `skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh --help`
- `skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh --aws-cli definitely-not-installed-aws-cli --distribution-id EXAMPLE123 --path /index.html --dry-run`
- `skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh --aws-cli definitely-not-installed-aws-cli --distribution-id EXAMPLE123 --path /index.html`

## Notes

All examples use placeholder distribution ids and contain no credentials.
