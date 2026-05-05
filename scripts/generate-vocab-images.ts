/**
 * Pre-generate clay-style vocabulary illustrations for all (or filtered) words.
 *
 * Usage:
 *   npx tsx scripts/generate-vocab-images.ts
 *   npx tsx scripts/generate-vocab-images.ts --course AAY-FINANCE
 *   npx tsx scripts/generate-vocab-images.ts --hanzi 收入,支出,薪資
 *   npx tsx scripts/generate-vocab-images.ts --missing   # only words without a cached image
 *
 * Prerequisites:
 *   - OPENAI_API_KEY must be set in .env.local
 *   - MinIO must be running (docker compose up minio)
 *   - DATABASE_URL must point to the running Postgres
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import { Client as MinioClient } from "minio";
import OpenAI from "openai";
import { buildVocabImagePrompt } from "../src/lib/vocab-image-style";

// ─── Load env from .env.local ─────────────────────────────────────────────────
const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, "utf-8").split("\n");
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

const BUCKET = process.env.MINIO_BUCKET_VOCAB_IMAGES ?? "chinese-learn-vocab-images";
const CONCURRENCY = 2; // max parallel DALL-E requests
const DELAY_MS = 1200;  // polite delay between requests

// ─── Clients ─────────────────────────────────────────────────────────────────
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
  port: parseInt(process.env.MINIO_PORT ?? "9000", 10),
  useSSL: (process.env.MINIO_USE_SSL ?? "false") === "true",
  accessKey: process.env.MINIO_ACCESS_KEY ?? "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY ?? "chinese_learn_minio_pwd",
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function isCached(hanzi: string): Promise<boolean> {
  try {
    await minioClient.statObject(BUCKET, `vocab-images/${hanzi}.png`);
    return true;
  } catch {
    return false;
  }
}

async function generate(hanzi: string, englishMeaning: string, pos?: string | null) {
  const prompt = buildVocabImagePrompt(englishMeaning, pos);
  console.log(`  ↳ prompt: ${prompt.slice(0, 120)}…`);

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    response_format: "b64_json",
  });

  const b64 = response.data[0]?.b64_json;
  if (!b64) throw new Error("No image data returned");

  const imageBytes = Buffer.from(b64, "base64");
  await minioClient.putObject(
    BUCKET,
    `vocab-images/${hanzi}.png`,
    imageBytes,
    imageBytes.length,
    { "Content-Type": "image/png" },
  );
  return imageBytes.length;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const courseArg = args.find((a) => a.startsWith("--course="))?.split("=")[1]
    ?? (args.includes("--course") ? args[args.indexOf("--course") + 1] : undefined);
  const hanziArg = args.find((a) => a.startsWith("--hanzi="))?.split("=")[1]
    ?? (args.includes("--hanzi") ? args[args.indexOf("--hanzi") + 1] : undefined);
  const missingOnly = args.includes("--missing");

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is not set");
    process.exit(1);
  }

  // Ensure bucket exists
  try {
    const exists = await minioClient.bucketExists(BUCKET);
    if (!exists) await minioClient.makeBucket(BUCKET);
  } catch {}

  // Fetch target vocabulary
  let where: Record<string, unknown> = {};
  if (hanziArg) {
    where = { hanzi: { in: hanziArg.split(",").map((h) => h.trim()) } };
  } else if (courseArg) {
    // Filter by course code via lessons → exercises (rough heuristic: use category tag)
    where = { tags: { has: courseArg.toLowerCase() } };
  }

  const vocab = await prisma.vocabulary.findMany({
    where,
    select: { hanzi: true, translations: true, partOfSpeech: true },
    orderBy: { frequency: "asc" },
  });

  console.log(`\n🖼  Vocab image generator — ${vocab.length} words\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < vocab.length; i += CONCURRENCY) {
    const batch = vocab.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (v) => {
        const translations = v.translations as Record<string, string> | null;
        const english = translations?.en ?? v.hanzi;
        const cached = await isCached(v.hanzi);

        if (missingOnly && cached) {
          console.log(`⏭  ${v.hanzi} (${english}) — already cached`);
          skipped++;
          return;
        }

        console.log(`🎨 [${i + 1}/${vocab.length}] ${v.hanzi} (${english})`);
        try {
          const bytes = await generate(v.hanzi, english, v.partOfSpeech);
          console.log(`   ✅ saved ${(bytes / 1024).toFixed(0)} KB`);
          generated++;
        } catch (err) {
          console.error(`   ❌ failed: ${err}`);
          failed++;
        }
      }),
    );
    if (i + CONCURRENCY < vocab.length) await sleep(DELAY_MS);
  }

  console.log(`\n✅ Done — generated: ${generated}, skipped: ${skipped}, failed: ${failed}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
