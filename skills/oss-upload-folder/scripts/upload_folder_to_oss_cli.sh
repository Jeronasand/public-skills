#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$SKILL_DIR/.env.oss-upload-folder"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

usage() {
  cat <<'USAGE'
Usage:
  upload_folder_to_oss_cli.sh --local-dir <path> --oss-url <oss://bucket/prefix/> [options]

Required:
  --local-dir <path>      Local directory to upload
  --oss-url <url>         Destination OSS URL, e.g. oss://example-bucket/site/

Optional:
  --cli <command>         OSS CLI command, e.g. ossutil or osscli
  --endpoint <endpoint>   OSS endpoint, e.g. oss-cn-shanghai.aliyuncs.com
  --include <pattern>     Include filter (repeatable)
  --exclude <pattern>     Exclude filter (repeatable)
  --update                Upload only newer files when supported
  --delete                Delete remote files that do not exist locally when supported
  --dry-run               Preview only, do not upload
  --yes                   Skip interactive confirmation for dangerous options
  -h, --help              Show this help

Environment:
  Loads .env.oss-upload-folder from the skill directory only.
  OSS_UPLOAD_CLI, OSS_UPLOAD_ENDPOINT, and OSS_UPLOAD_DEFAULT_URL may set defaults.
USAGE
}

LOCAL_DIR=""
OSS_URL="${OSS_UPLOAD_DEFAULT_URL:-}"
OSS_CLI="${OSS_UPLOAD_CLI:-}"
ENDPOINT="${OSS_UPLOAD_ENDPOINT:-}"
DRY_RUN=0
UPDATE_ONLY=0
DELETE_EXTRA=0
YES=0
INCLUDES=()
EXCLUDES=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --local-dir)
      LOCAL_DIR="${2:-}"
      shift 2
      ;;
    --oss-url)
      OSS_URL="${2:-}"
      shift 2
      ;;
    --cli)
      OSS_CLI="${2:-}"
      shift 2
      ;;
    --endpoint)
      ENDPOINT="${2:-}"
      shift 2
      ;;
    --include)
      INCLUDES+=("${2:-}")
      shift 2
      ;;
    --exclude)
      EXCLUDES+=("${2:-}")
      shift 2
      ;;
    --update)
      UPDATE_ONLY=1
      shift
      ;;
    --delete)
      DELETE_EXTRA=1
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

if [[ -z "$LOCAL_DIR" || -z "$OSS_URL" ]]; then
  echo "Error: --local-dir and --oss-url are required." >&2
  usage
  exit 1
fi

if [[ -z "$OSS_CLI" ]]; then
  if command -v ossutil >/dev/null 2>&1; then
    OSS_CLI="ossutil"
  elif command -v osscli >/dev/null 2>&1; then
    OSS_CLI="osscli"
  else
    echo "Error: OSS CLI not found. Install ossutil or osscli, or pass --cli <command>." >&2
    exit 127
  fi
fi

if ! command -v "$OSS_CLI" >/dev/null 2>&1; then
  echo "Error: requested OSS CLI is not installed or not in PATH: $OSS_CLI" >&2
  exit 127
fi

if [[ ! -d "$LOCAL_DIR" ]]; then
  echo "Error: local directory does not exist: $LOCAL_DIR" >&2
  exit 1
fi

if [[ ! "$OSS_URL" =~ ^oss:// ]]; then
  echo "Error: --oss-url must start with oss://" >&2
  exit 1
fi

if [[ "$OSS_URL" =~ ^oss://[^/]+/?$ ]]; then
  echo "Error: bucket-root upload is blocked. Use an explicit prefix or confirm manually outside this wrapper." >&2
  exit 1
fi

if [[ "$OSS_URL" != */ ]]; then
  OSS_URL="${OSS_URL}/"
fi

CMD=("$OSS_CLI" cp -r "$LOCAL_DIR" "$OSS_URL")

if [[ -n "$ENDPOINT" ]]; then
  CMD+=(--endpoint "$ENDPOINT")
fi

for pattern in "${INCLUDES[@]}"; do
  CMD+=(--include "$pattern")
done

for pattern in "${EXCLUDES[@]}"; do
  CMD+=(--exclude "$pattern")
done

if [[ $UPDATE_ONLY -eq 1 ]]; then
  CMD+=(--update)
fi

if [[ $DELETE_EXTRA -eq 1 ]]; then
  CMD+=(--delete)
fi

if [[ $DRY_RUN -eq 1 ]]; then
  CMD+=(--dry-run)
fi

echo "Local dir : $LOCAL_DIR"
echo "Target    : $OSS_URL"
echo "CLI       : $OSS_CLI"
[[ -n "$ENDPOINT" ]] && echo "Endpoint  : $ENDPOINT"
[[ ${#INCLUDES[@]} -gt 0 ]] && echo "Includes  : ${INCLUDES[*]}"
[[ ${#EXCLUDES[@]} -gt 0 ]] && echo "Excludes  : ${EXCLUDES[*]}"
[[ $UPDATE_ONLY -eq 1 ]] && echo "Mode      : update-only"
[[ $DELETE_EXTRA -eq 1 ]] && echo "Mode      : delete-remote-extra"
[[ $DRY_RUN -eq 1 ]] && echo "Mode      : dry-run"

if [[ $DELETE_EXTRA -eq 1 && $YES -ne 1 ]]; then
  echo "Warning: --delete will remove remote objects not present locally."
  read -r -p "Continue? [y/N] " ans
  if [[ "${ans,,}" != "y" && "${ans,,}" != "yes" ]]; then
    echo "Cancelled."
    exit 1
  fi
fi

printf 'Running: '
printf '%q ' "${CMD[@]}"
printf '\n'

"${CMD[@]}"

echo "Done."
