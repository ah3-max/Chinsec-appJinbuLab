/**
 * One-time migration: convert existing vocab-images/*.png in MinIO to optimized WebP.
 *  - Reads each .png, resizes to 768×768, encodes WebP @ q85, uploads .webp
 *  - Deletes the .png after successful upload
 */
import * as fs from "fs";
import * as path from "path";
import { Client as MinioClient } from "minio";
import sharp from "sharp";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const BUCKET = process.env.MINIO_BUCKET_VOCAB_IMAGES ?? "chinese-learn-vocab-images";

const minio = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
  port: parseInt(process.env.MINIO_PORT ?? "9000", 10),
  useSSL: (process.env.MINIO_USE_SSL ?? "false") === "true",
  accessKey: process.env.MINIO_ACCESS_KEY ?? "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY ?? "chinese_learn_minio_pwd",
});

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (c) => chunks.push(Buffer.from(c)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

async function listPngObjects(): Promise<string[]> {
  const keys: string[] = [];
  return new Promise((resolve, reject) => {
    const stream = minio.listObjectsV2(BUCKET, "vocab-images/", true);
    stream.on("data", (obj) => {
      if (obj.name && obj.name.endsWith(".png")) keys.push(obj.name);
    });
    stream.on("end", () => resolve(keys));
    stream.on("error", reject);
  });
}

async function main() {
  const pngKeys = await listPngObjects();
  console.log(`\n📸 Found ${pngKeys.length} PNG files to convert\n`);

  let totalPngBytes = 0;
  let totalWebpBytes = 0;
  let success = 0;
  let failed = 0;

  for (let i = 0; i < pngKeys.length; i++) {
    const pngKey = pngKeys[i];
    const webpKey = pngKey.replace(/\.png$/, ".webp");
    const hanzi = path.basename(pngKey).replace(/\.png$/, "");

    try {
      // Skip if WebP already exists
      try {
        await minio.statObject(BUCKET, webpKey);
        console.log(`⏭  [${i + 1}/${pngKeys.length}] ${hanzi} — webp exists, deleting old png`);
        await minio.removeObject(BUCKET, pngKey);
        continue;
      } catch {}

      const stream = await minio.getObject(BUCKET, pngKey);
      const pngBytes = await streamToBuffer(stream);
      totalPngBytes += pngBytes.length;

      const webpBytes = await sharp(pngBytes)
        .resize(768, 768, { fit: "cover" })
        .webp({ quality: 85 })
        .toBuffer();
      totalWebpBytes += webpBytes.length;

      await minio.putObject(BUCKET, webpKey, webpBytes, webpBytes.length, {
        "Content-Type": "image/webp",
      });
      await minio.removeObject(BUCKET, pngKey);

      console.log(
        `✅ [${i + 1}/${pngKeys.length}] ${hanzi}: ${(pngBytes.length / 1024).toFixed(0)}KB → ${(webpBytes.length / 1024).toFixed(0)}KB ` +
        `(${(((pngBytes.length - webpBytes.length) / pngBytes.length) * 100).toFixed(0)}% smaller)`
      );
      success++;
    } catch (err) {
      console.error(`❌ ${hanzi}: ${err}`);
      failed++;
    }
  }

  if (totalPngBytes > 0) {
    console.log(`\n💾 Total saved: ${(totalPngBytes / 1024 / 1024).toFixed(1)} MB → ${(totalWebpBytes / 1024 / 1024).toFixed(1)} MB`);
    console.log(`📉 Reduction: ${(((totalPngBytes - totalWebpBytes) / totalPngBytes) * 100).toFixed(0)}%`);
  }
  console.log(`\n🎉 Done — converted: ${success}, failed: ${failed}`);
}

main().catch(console.error);
