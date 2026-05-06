import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSkillEnv, parseOssUrl } from "./oss-upload-lib.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const envFile = resolve(repoRoot, "skills/oss-upload-folder/.env.oss-upload-folder");
const target = parseOssUrl(process.env.SKILLS_DNA_OSS_ROOT || "oss://public-skills/");

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

await client.putBucketWebsite(target.bucket, {
  index: "index.html",
  error: "index.html",
});

console.log(`Configured static website for oss://${target.bucket}/ with index.html`);
