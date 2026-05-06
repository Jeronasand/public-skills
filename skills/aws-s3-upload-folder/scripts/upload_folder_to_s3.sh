#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$SKILL_DIR/.env.aws-s3-upload-folder"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

usage() {
  cat <<'USAGE'
Usage:
  upload_folder_to_s3.sh --local-dir <path> --s3-uri <s3://bucket/prefix/> [--s3-uri <s3://bucket2/prefix/> ...] [options]

Required:
  --local-dir <path>      Local directory to upload
  --s3-uri <uri>          Destination S3 URI, repeatable, e.g. s3://example-bucket/site/

Optional:
  --aws-cli <command>     AWS CLI command, default: aws
  --profile <name>        AWS CLI profile
  --region <region>       AWS region
  --exclude <pattern>     Exclude filter (repeatable)
  --include <pattern>     Include filter (repeatable)
  --cache-control <value> Set Cache-Control metadata
  --content-type <value>  Set Content-Type metadata, cp mode only
  --acl <acl>             Set canned ACL
  --delete                Delete remote files missing locally, sync mode only
  --cp                    Use aws s3 cp --recursive instead of sync
  --dry-run               Preview only, do not upload
  --yes                   Skip confirmation for dangerous options
  -h, --help              Show this help

Environment:
  Loads .env.aws-s3-upload-folder from the skill directory only.
USAGE
}

LOCAL_DIR=""
AWS_CLI="aws"
PROFILE="${AWS_S3_UPLOAD_PROFILE:-}"
REGION="${AWS_S3_UPLOAD_REGION:-}"
CACHE_CONTROL="${AWS_S3_UPLOAD_CACHE_CONTROL:-}"
ACL="${AWS_S3_UPLOAD_ACL:-}"
CONTENT_TYPE=""
DELETE_EXTRA=0
DRY_RUN=0
YES=0
USE_CP=0
INCLUDES=()
EXCLUDES=()
S3_URIS=()

if [[ -n "${AWS_S3_UPLOAD_DEFAULT_URI:-}" ]]; then
  S3_URIS+=("$AWS_S3_UPLOAD_DEFAULT_URI")
fi

if [[ -n "${AWS_S3_UPLOAD_DEFAULT_URIS:-}" ]]; then
  # shellcheck disable=SC2206
  defaults=(${AWS_S3_UPLOAD_DEFAULT_URIS//,/ })
  S3_URIS+=("${defaults[@]}")
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --local-dir)
      LOCAL_DIR="${2:-}"
      shift 2
      ;;
    --s3-uri)
      S3_URIS+=("${2:-}")
      shift 2
      ;;
    --aws-cli)
      AWS_CLI="${2:-}"
      shift 2
      ;;
    --profile)
      PROFILE="${2:-}"
      shift 2
      ;;
    --region)
      REGION="${2:-}"
      shift 2
      ;;
    --exclude)
      EXCLUDES+=("${2:-}")
      shift 2
      ;;
    --include)
      INCLUDES+=("${2:-}")
      shift 2
      ;;
    --cache-control)
      CACHE_CONTROL="${2:-}"
      shift 2
      ;;
    --content-type)
      CONTENT_TYPE="${2:-}"
      shift 2
      ;;
    --acl)
      ACL="${2:-}"
      shift 2
      ;;
    --delete)
      DELETE_EXTRA=1
      shift
      ;;
    --cp)
      USE_CP=1
      shift
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

if [[ -z "$LOCAL_DIR" || ${#S3_URIS[@]} -eq 0 ]]; then
  echo "Error: --local-dir and at least one --s3-uri are required." >&2
  usage
  exit 1
fi

if ! command -v "$AWS_CLI" >/dev/null 2>&1; then
  echo "Error: requested AWS CLI is not installed or not in PATH: $AWS_CLI" >&2
  exit 127
fi

if [[ ! -d "$LOCAL_DIR" ]]; then
  echo "Error: local directory does not exist: $LOCAL_DIR" >&2
  exit 1
fi

if [[ $DELETE_EXTRA -eq 1 ]]; then
  if [[ $USE_CP -eq 1 ]]; then
    echo "Error: --delete is supported only in sync mode." >&2
    exit 1
  fi
fi

echo "Local dir : $LOCAL_DIR"
echo "Targets   : ${S3_URIS[*]}"
echo "Mode      : $([[ $USE_CP -eq 1 ]] && echo cp-recursive || echo sync)"
[[ -n "$PROFILE" ]] && echo "Profile   : $PROFILE"
[[ -n "$REGION" ]] && echo "Region    : $REGION"
[[ -n "$CACHE_CONTROL" ]] && echo "Cache     : $CACHE_CONTROL"
[[ -n "$ACL" ]] && echo "ACL       : $ACL"
[[ ${#EXCLUDES[@]} -gt 0 ]] && echo "Excludes  : ${EXCLUDES[*]:-}"
[[ ${#INCLUDES[@]} -gt 0 ]] && echo "Includes  : ${INCLUDES[*]:-}"
[[ $DELETE_EXTRA -eq 1 ]] && echo "Delete    : enabled"
[[ $DRY_RUN -eq 1 ]] && echo "Dry-run   : enabled"

if [[ $DELETE_EXTRA -eq 1 && $YES -ne 1 ]]; then
  echo "Warning: --delete will remove remote S3 objects not present locally."
  read -r -p "Continue? [y/N] " ans
  if [[ "${ans,,}" != "y" && "${ans,,}" != "yes" ]]; then
    echo "Cancelled."
    exit 1
  fi
fi

run_one_target() {
  local target="$1"

  if [[ ! "$target" =~ ^s3:// ]]; then
    echo "Error: --s3-uri must start with s3:// ($target)" >&2
    exit 1
  fi

  if [[ "$target" =~ ^s3://[^/]+/?$ ]]; then
    echo "Error: bucket-root upload is blocked. Use an explicit prefix: $target" >&2
    exit 1
  fi

  if [[ "$target" != */ ]]; then
    target="${target}/"
  fi

  if [[ $USE_CP -eq 1 ]]; then
    CMD=("$AWS_CLI" s3 cp "$LOCAL_DIR" "$target" --recursive)
  else
    CMD=("$AWS_CLI" s3 sync "$LOCAL_DIR" "$target")
  fi

  [[ -n "$PROFILE" ]] && CMD+=(--profile "$PROFILE")
  [[ -n "$REGION" ]] && CMD+=(--region "$REGION")
  [[ -n "$CACHE_CONTROL" ]] && CMD+=(--cache-control "$CACHE_CONTROL")
  [[ -n "$ACL" ]] && CMD+=(--acl "$ACL")

  if [[ $USE_CP -eq 1 && -n "$CONTENT_TYPE" ]]; then
    CMD+=(--content-type "$CONTENT_TYPE")
  fi

  for pattern in "${EXCLUDES[@]+"${EXCLUDES[@]}"}"; do
    CMD+=(--exclude "$pattern")
  done

  for pattern in "${INCLUDES[@]+"${INCLUDES[@]}"}"; do
    CMD+=(--include "$pattern")
  done

  if [[ $DELETE_EXTRA -eq 1 ]]; then
    CMD+=(--delete)
  fi

  if [[ $DRY_RUN -eq 1 ]]; then
    CMD+=(--dryrun)
  fi

  printf 'Running: '
  printf '%q ' "${CMD[@]}"
  printf '\n'

  "${CMD[@]}"
}

for target in "${S3_URIS[@]}"; do
  [[ -z "$target" ]] && continue
  run_one_target "$target"
done

echo "Done."
