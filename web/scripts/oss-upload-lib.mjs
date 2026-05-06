import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

export function loadSkillEnv(envFile) {
  try {
    const text = readFileSync(envFile, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const index = trimmed.indexOf("=");
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // Missing env is only fatal for real uploads.
  }
}

export function parseOssUrl(url) {
  if (!url.startsWith("oss://")) throw new Error("OSS URL must start with oss://");
  const rest = url.slice("oss://".length);
  const slash = rest.indexOf("/");
  const bucket = slash === -1 ? rest : rest.slice(0, slash);
  let prefix = slash === -1 ? "" : rest.slice(slash + 1);
  if (!bucket) throw new Error("OSS URL must include bucket");
  if (prefix && !prefix.endsWith("/")) prefix += "/";
  return { bucket, prefix };
}

export function listFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function guessMime(file) {
  const ext = extname(file).toLowerCase();
  if (!ext && basename(file) !== file) return "text/html; charset=utf-8";
  const mimeByExt = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp",
  };
  return mimeByExt[ext] || "application/octet-stream";
}

export async function uploadDirectory({ localDir, ossUrl, envFile, dryRun }) {
  const target = parseOssUrl(ossUrl);
  const uploadFiles = listFiles(localDir);
  console.log(`Local dir : ${localDir}`);
  console.log(`Targets   : oss://${target.bucket}/${target.prefix}`);
  console.log(`Files     : ${uploadFiles.length}`);
  console.log(`Mode      : ${dryRun ? "dry-run" : "upload"}`);

  for (const file of uploadFiles) {
    const rel = file.slice(localDir.length + 1).split("/").join("/");
    const objectName = `${target.prefix}${rel}`;
    if (dryRun) {
      const size = statSync(file).size;
      console.log(`DRY-RUN ${rel} -> oss://${target.bucket}/${objectName}, size:${size}`);
    }
  }

  if (dryRun) return;

  loadSkillEnv(envFile);
  const region = process.env.OSS_NODE_REGION || "oss-cn-shenzhen";
  const endpoint = "oss-cn-shenzhen.aliyuncs.com";
  const accessKeyId = process.env.OSS_NODE_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_NODE_ACCESS_KEY_SECRET;
  if (!accessKeyId || !accessKeySecret) {
    throw new Error(`Missing OSS_NODE_ACCESS_KEY_ID or OSS_NODE_ACCESS_KEY_SECRET in ${envFile}`);
  }

  const mod = await import("ali-oss");
  const OSS = mod.default || mod;
  const client = new OSS({
    accessKeyId,
    accessKeySecret,
    bucket: target.bucket,
    region,
    endpoint,
  });

  for (const file of uploadFiles) {
    const rel = file.slice(localDir.length + 1).split("/").join("/");
    const objectName = `${target.prefix}${rel}`;
    console.log(`Uploading ${rel} -> oss://${target.bucket}/${objectName}`);
    await client.put(objectName, file, {
      mime: guessMime(file),
      headers: {
        "Content-Disposition": "inline",
      },
    });
  }
  console.log("Done.");
}
