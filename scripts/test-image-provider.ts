/**
 * Smoke-test the active image-generation provider.
 * Generates one image for "a smiling clay elephant" and writes the PNG/WebP
 * to /tmp so you can open it and inspect quality.
 *
 * Run:
 *   IMAGE_GEN_PROVIDER=lmstudio LM_STUDIO_IMAGE_BASE_URL=http://host:1234/v1 \
 *     npx tsx scripts/test-image-provider.ts
 *
 *   IMAGE_GEN_PROVIDER=gemini GEMINI_API_KEY=AIzaXXX \
 *     npx tsx scripts/test-image-provider.ts
 *
 *   (default) OPENAI_API_KEY=sk-... npx tsx scripts/test-image-provider.ts
 */
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";
import { generateImage, activeProvider } from "../src/lib/image-providers";
import { buildVocabImagePrompt } from "../src/lib/vocab-image-style";

// Load .env.local
const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

async function main() {
  const provider = activeProvider();
  console.log(`🧪 Testing image provider: ${provider}\n`);

  // Print relevant env so misconfigurations are obvious
  console.log("Env:");
  if (provider === "openai") {
    console.log(`  OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? "(set, " + process.env.OPENAI_API_KEY.slice(0, 7) + "…)" : "(MISSING)"}`);
  } else if (provider === "lmstudio") {
    console.log(`  LM_STUDIO_IMAGE_BASE_URL: ${process.env.LM_STUDIO_IMAGE_BASE_URL ?? "(MISSING)"}`);
    console.log(`  LM_STUDIO_IMAGE_MODEL:    ${process.env.LM_STUDIO_IMAGE_MODEL ?? "gemini-2.5-flash-image"}`);
  } else if (provider === "gemini") {
    console.log(`  GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? "(set, " + process.env.GEMINI_API_KEY.slice(0, 7) + "…)" : "(MISSING)"}`);
    console.log(`  GEMINI_IMAGE_MODEL: ${process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image"}`);
  }

  const subject = "smiling friendly clay elephant with star above its head";
  const prompt = buildVocabImagePrompt(subject);
  console.log(`\nPrompt: ${prompt.slice(0, 160)}…\n`);

  console.log("⏳ Generating...");
  const t0 = Date.now();
  try {
    const result = await generateImage({ prompt, size: 1024 });
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`✅ Got ${result.bytes.length} bytes (${result.mimeType}) in ${elapsed}s\n`);

    // Save raw + optimized
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const rawPath = `/tmp/vocab-image-test-${provider}-${stamp}.${result.mimeType === "image/png" ? "png" : "img"}`;
    fs.writeFileSync(rawPath, result.bytes);
    console.log(`💾 Raw saved: ${rawPath}`);

    const webp = await sharp(result.bytes)
      .resize(768, 768, { fit: "cover" })
      .webp({ quality: 85 })
      .toBuffer();
    const webpPath = `/tmp/vocab-image-test-${provider}-${stamp}.webp`;
    fs.writeFileSync(webpPath, webp);
    console.log(`💾 WebP optimized: ${webpPath} (${(webp.length / 1024).toFixed(0)} KB)`);

    console.log(`\n👀 Open: open ${webpPath}`);
  } catch (err) {
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.error(`❌ Failed after ${elapsed}s: ${(err as Error).message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
