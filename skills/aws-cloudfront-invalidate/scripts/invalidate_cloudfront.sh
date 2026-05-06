#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$SKILL_DIR/.env.aws-cloudfront-invalidate"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

usage() {
  cat <<'USAGE'
Usage:
  invalidate_cloudfront.sh --distribution-id <id> --path <path> [--path <path> ...] [options]

Required:
  --distribution-id <id>  CloudFront distribution id
  --path <path>           Invalidation path, repeatable

Optional:
  --paths <list>          Comma or space separated paths
  --alias <domain>        Verify distribution alias before invalidating
  --profile <name>        AWS CLI profile
  --aws-cli <command>     AWS CLI command, default: aws
  --dry-run               Preview only, do not invalidate
  --yes                   Skip confirmation for broad invalidation paths
  -h, --help              Show this help

Environment:
  Loads .env.aws-cloudfront-invalidate from the skill directory only.
USAGE
}

AWS_CLI="aws"
PROFILE="${AWS_CLOUDFRONT_INVALIDATE_PROFILE:-}"
DISTRIBUTION_ID="${AWS_CLOUDFRONT_DISTRIBUTION_ID:-}"
ALIAS="${AWS_CLOUDFRONT_ALIAS:-}"
DRY_RUN=0
YES=0
PATHS=()

if [[ -n "${AWS_CLOUDFRONT_PATHS:-}" ]]; then
  # shellcheck disable=SC2206
  PATHS=(${AWS_CLOUDFRONT_PATHS//,/ })
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --distribution-id)
      DISTRIBUTION_ID="${2:-}"
      shift 2
      ;;
    --path)
      PATHS+=("${2:-}")
      shift 2
      ;;
    --paths)
      raw="${2:-}"
      # shellcheck disable=SC2206
      more=(${raw//,/ })
      PATHS+=("${more[@]}")
      shift 2
      ;;
    --alias)
      ALIAS="${2:-}"
      shift 2
      ;;
    --profile)
      PROFILE="${2:-}"
      shift 2
      ;;
    --aws-cli)
      AWS_CLI="${2:-}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --yes)
      YES=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$DISTRIBUTION_ID" || ${#PATHS[@]} -eq 0 ]]; then
  echo "Error: --distribution-id and at least one --path are required." >&2
  usage
  exit 1
fi

NORMALIZED_PATHS=()
for p in "${PATHS[@]}"; do
  [[ -z "$p" ]] && continue
  if [[ "$p" != /* ]]; then
    p="/$p"
  fi
  NORMALIZED_PATHS+=("$p")
done

if [[ ${#NORMALIZED_PATHS[@]} -eq 0 ]]; then
  echo "Error: at least one non-empty invalidation path is required." >&2
  exit 1
fi

echo "Distribution : $DISTRIBUTION_ID"
[[ -n "$PROFILE" ]] && echo "Profile      : $PROFILE"
[[ -n "$ALIAS" ]] && echo "Alias check  : $ALIAS"
echo "Paths        : ${NORMALIZED_PATHS[*]}"
[[ $DRY_RUN -eq 1 ]] && echo "Mode         : dry-run"

if [[ $DRY_RUN -eq 1 ]]; then
  echo "Dry-run only; no CloudFront invalidation will be created."
  exit 0
fi

if ! command -v "$AWS_CLI" >/dev/null 2>&1; then
  echo "Error: requested AWS CLI is not installed or not in PATH: $AWS_CLI" >&2
  exit 127
fi

BASE_CMD=("$AWS_CLI")
[[ -n "$PROFILE" ]] && BASE_CMD+=(--profile "$PROFILE")

if [[ -n "$ALIAS" ]]; then
  echo "Verifying distribution alias..."
  dist_json="$("${BASE_CMD[@]}" cloudfront get-distribution --id "$DISTRIBUTION_ID" --output json)"
  if ! printf '%s' "$dist_json" | grep -F "\"$ALIAS\"" >/dev/null; then
    echo "Error: alias not found on distribution: $ALIAS" >&2
    exit 1
  fi
fi

for p in "${NORMALIZED_PATHS[@]}"; do
  if [[ "$p" == "/*" && $YES -ne 1 ]]; then
    echo "Warning: /* invalidates the full distribution cache."
    read -r -p "Continue? [y/N] " ans
    if [[ "${ans,,}" != "y" && "${ans,,}" != "yes" ]]; then
      echo "Cancelled."
      exit 1
    fi
  fi
done

CMD=("${BASE_CMD[@]}" cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "${NORMALIZED_PATHS[@]}")

printf 'Running: '
printf '%q ' "${CMD[@]}"
printf '\n'

"${CMD[@]}"

echo "Done."
