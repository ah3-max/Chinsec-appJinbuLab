/**
 * scripts/upload-audio-to-minio.ts
 *
 * 將 public/audio 下所有 mp3 上傳到 MinIO bucket(zhuyin/, vocab/, dialogue/,
 * sentence/),並設置 bucket public-read policy,讓 API 可以直接 redirect。
 *
 * 執行:
 *   npx tsx scripts/upload-audio-to-minio.ts
 *
 * 環境變數:MINIO_ENDPOINT / MINIO_PORT / MINIO_USE_SSL / MINIO_ACCESS_KEY /
 *          MINIO_SECRET_KEY / MINIO_BUCKET_AUDIO (都已在 .env.local 中)
 */

import { Client } from "minio";
import { existsSync, statSync } from "fs";
import { readdir } from "fs/promises";
import * as path from "path";

// Walk the whole audio tree so we cover zhuyin/, vocab/, dialogue/, sentence/.
const ROOT = path.resolve(process.cwd(), "public/audio");

// Exclude any per-environment generated subdirs we never want to ship.
const EXCLUDE_DIRS = new Set(["generated"]);

function envOrDie(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (EXCLUDE_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && e.name.endsWith(".mp3")) yield p;
  }
}

async function ensureBucketReadable(client: Client, bucket: string) {
  const exists = await client.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await client.makeBucket(bucket, "us-east-1");
    console.log(`   created bucket ${bucket}`);
  }

  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  };
  try {
    await client.setBucketPolicy(bucket, JSON.stringify(policy));
  } catch (err) {
    console.warn(
      `   warning: failed to set public-read policy on ${bucket}:`,
      (err as Error).message,
    );
  }
}

async function main() {
  if (!existsSync(ROOT)) {
    console.error(
      `❌ ${ROOT} does not exist. Run 'npx tsx scripts/generate-zhuyin-audio.ts' first.`,
    );
    process.exit(1);
  }

  const endPoint = envOrDie("MINIO_ENDPOINT");
  const port = parseInt(process.env.MINIO_PORT ?? "9000", 10);
  const useSSL = (process.env.MINIO_USE_SSL ?? "false") === "true";
  const accessKey = envOrDie("MINIO_ACCESS_KEY");
  const secretKey = envOrDie("MINIO_SECRET_KEY");
  const bucket = envOrDie("MINIO_BUCKET_AUDIO");

  const client = new Client({ endPoint, port, useSSL, accessKey, secretKey });
  console.log(
    `📦 Uploading to MinIO ${useSSL ? "https" : "http"}://${endPoint}:${port}/${bucket}`,
  );

  await ensureBucketReadable(client, bucket);

  let uploaded = 0;
  let skipped = 0;
  for await (const file of walk(ROOT)) {
    // rel already starts with the top-level subfolder (zhuyin/ vocab/
    // dialogue/ sentence/) so we use it directly as the object key.
    const objectKey = path.relative(ROOT, file).split(path.sep).join("/");

    // Skip if same size already exists.
    try {
      const stat = await client.statObject(bucket, objectKey);
      const localSize = statSync(file).size;
      if (Number(stat.size) === localSize) {
        skipped++;
        continue;
      }
    } catch {
      // not found → upload
    }

    await client.fPutObject(bucket, objectKey, file, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    });
    uploaded++;
    if (uploaded % 20 === 0) console.log(`   …${uploaded} uploaded`);
  }

  console.log(`✅ uploaded=${uploaded}, skipped(existing)=${skipped}`);
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
