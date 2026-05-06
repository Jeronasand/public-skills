# Manual Test Record

## Test Date

2026-05-06

## Scope

Public skill structure and script safety checks for `oss-upload-folder`.

## Test Cases

### CLI script help

Command:

```bash
bash skills/oss-upload-folder/scripts/upload_folder_to_oss_cli.sh --help
```

Expected:

- Prints usage.
- Exits successfully.

### CLI missing command guard

Command:

```bash
bash skills/oss-upload-folder/scripts/upload_folder_to_oss_cli.sh \
  --cli definitely-not-installed-oss-cli \
  --local-dir skills/oss-upload-folder/examples \
  --oss-url oss://example-bucket/test/ \
  --dry-run
```

Expected:

- Fails before upload.
- Reports that the requested CLI is not installed.

### Node.js script help

Command:

```bash
node skills/oss-upload-folder/scripts/upload_folder_to_oss_node.mjs --help
```

Expected:

- Prints usage.
- Exits successfully.

### Node.js dry-run without credentials

Command:

```bash
node skills/oss-upload-folder/scripts/upload_folder_to_oss_node.mjs \
  --local-dir skills/oss-upload-folder/examples \
  --oss-url oss://example-bucket/test/ \
  --dry-run
```

Expected:

- Lists local files and target object names.
- Does not require credentials.
- Does not upload files.

## Result

Passed current-run verification.

Verified commands:

- `bash -n skills/oss-upload-folder/scripts/upload_folder_to_oss_cli.sh`
- `node --check skills/oss-upload-folder/scripts/upload_folder_to_oss_node.mjs`
- `skills/oss-upload-folder/scripts/upload_folder_to_oss_cli.sh --help`
- `skills/oss-upload-folder/scripts/upload_folder_to_oss_cli.sh --cli definitely-not-installed-oss-cli --local-dir skills/oss-upload-folder/examples --oss-url oss://example-bucket/test/ --dry-run`
- `node skills/oss-upload-folder/scripts/upload_folder_to_oss_node.mjs --help`
- `node skills/oss-upload-folder/scripts/upload_folder_to_oss_node.mjs --local-dir skills/oss-upload-folder/examples --oss-url oss://example-bucket/test/ --dry-run`

## Notes

All examples use placeholder bucket names and contain no credentials.
