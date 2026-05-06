# AWS CloudFront Invalidate Notes

## Targeted Invalidation

Prefer specific paths:

```bash
.codex/skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh \
  --distribution-id EXAMPLE_DISTRIBUTION_ID \
  --path / \
  --path /index.html \
  --path /assets/*
```

## Alias Verification

When a domain is involved, verify it before invalidating:

```bash
.codex/skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh \
  --distribution-id EXAMPLE_DISTRIBUTION_ID \
  --alias example.com \
  --path /index.html \
  --dry-run
```

## Broad Invalidation

Use `/*` only when the user explicitly wants a full refresh:

```bash
.codex/skills/aws-cloudfront-invalidate/scripts/invalidate_cloudfront.sh \
  --distribution-id EXAMPLE_DISTRIBUTION_ID \
  --path '/*' \
  --dry-run
```

## Troubleshooting

- `aws: command not found`: install AWS CLI first.
- `NoSuchDistribution`: verify distribution id and account/profile.
- Alias mismatch: use `aws cloudfront list-distributions` or correct the distribution id.
- Invalidation quota exceeded: wait for existing invalidations to complete or reduce frequency.
