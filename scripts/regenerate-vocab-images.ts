/**
 * Regenerate cached vocabulary images using the active provider
 * (so you can swap from DALL-E → Gemini banana / LM Studio etc.).
 *
 * Examples:
 *   # Gemini, only words missing an image
 *   IMAGE_GEN_PROVIDER=gemini npx tsx scripts/regenerate-vocab-images.ts --missing
 *
 *   # LM Studio, force-overwrite a single category
 *   IMAGE_GEN_PROVIDER=lmstudio LM_STUDIO_IMAGE_BASE_URL=http://host.docker.internal:1234/v1 \
 *     npx tsx scripts/regenerate-vocab-images.ts --category ms-c1-d1 --force
 *
 *   # Everything
 *   npx tsx scripts/regenerate-vocab-images.ts --all --force
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import { Client as MinioClient } from "minio";
import sharp from "sharp";
import { generateImage, activeProvider } from "../src/lib/image-providers";
import { buildVocabImagePrompt } from "../src/lib/vocab-image-style";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const BUCKET = process.env.MINIO_BUCKET_VOCAB_IMAGES ?? "chinese-learn-vocab-images";
const TARGET_SIZE = 768;
const WEBP_QUALITY = 85;
const CONCURRENCY = 1;
const SLEEP_MS = 500;

const prisma = new PrismaClient();
const minio = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
  port: parseInt(process.env.MINIO_PORT ?? "9000", 10),
  useSSL: (process.env.MINIO_USE_SSL ?? "false") === "true",
  accessKey: process.env.MINIO_ACCESS_KEY ?? "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY ?? "chinese_learn_minio_pwd",
});

function parseArgs(argv: string[]) {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a) continue;
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

async function isCached(hanzi: string) {
  for (const ext of ["webp", "png"]) {
    try {
      await minio.statObject(BUCKET, `vocab-images/${hanzi}.${ext}`);
      return true;
    } catch {}
  }
  return false;
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const missing = !!args.missing;
  const force = !!args.force;
  const all = !!args.all;
  const categoryFilter = typeof args.category === "string" ? args.category : undefined;
  const hanziFilter = typeof args.hanzi === "string" ? args.hanzi : undefined;
  const limit = typeof args.limit === "string" ? parseInt(args.limit, 10) : undefined;

  if (!missing && !force && !all && !categoryFilter && !hanziFilter) {
    console.error("❌ Specify at least one of: --missing | --force | --all | --category=X | --hanzi=X[,Y]");
    process.exit(1);
  }

  const provider = activeProvider();
  console.log(`🎨 Provider: ${provider}\n`);

  // Build the where filter
  let where: Record<string, unknown> = {};
  if (hanziFilter) where = { hanzi: { in: hanziFilter.split(",").map((h) => h.trim()) } };
  else if (categoryFilter) where = { category: categoryFilter };

  const vocab = await prisma.vocabulary.findMany({
    where,
    select: { hanzi: true, translations: true, partOfSpeech: true, category: true },
    orderBy: [{ category: "asc" }],
    ...(limit ? { take: limit } : {}),
  });

  console.log(`📚 Vocab to consider: ${vocab.length}\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < vocab.length; i += CONCURRENCY) {
    const batch = vocab.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (v) => {
      const translations = v.translations as Record<string, string> | null;
      const englishMeaning = translations?.en;
      if (!englishMeaning) {
        console.log(`  ⏭  ${v.hanzi}: no English meaning`);
        skipped++;
        return;
      }

      if (missing && !force) {
        if (await isCached(v.hanzi)) {
          skipped++;
          return;
        }
      }

      const prompt = buildVocabImagePrompt(englishMeaning, v.partOfSpeech);
      const tag = `[${i + 1}/${vocab.length}]`;
      console.log(`  🎨 ${tag} ${v.hanzi} → "${englishMeaning.slice(0, 50)}…"`);
      try {
        const result = await generateImage({ prompt, size: 1024 });
        const webp = await sharp(result.bytes)
          .resize(TARGET_SIZE, TARGET_SIZE, { fit: "cover" })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();

        const key = `vocab-images/${v.hanzi}.webp`;
        await minio.putObject(BUCKET, key, webp, webp.length, {
          "Content-Type": "image/webp",
          "X-Image-Provider": result.provider,
        });

        // Remove legacy PNG if present
        try { await minio.removeObject(BUCKET, `vocab-images/${v.hanzi}.png`); } catch {}

        console.log(`     ✅ saved ${(webp.length / 1024).toFixed(0)} KB (${result.provider})`);
        generated++;
      } catch (err) {
        console.error(`     ❌ ${v.hanzi} failed: ${(err as Error).message}`);
        failed++;
      }
    }));
    if (i + CONCURRENCY < vocab.length) await sleep(SLEEP_MS);
  }

  console.log(`\n🎉 Done — generated: ${generated}, skipped: ${skipped}, failed: ${failed}`);
  await prisma.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
