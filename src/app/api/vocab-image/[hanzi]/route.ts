import { type NextRequest } from "next/server";
import { Readable } from "stream";
import sharp from "sharp";
import { db } from "@/lib/db";
import { minio } from "@/lib/minio";
import { buildVocabImagePrompt } from "@/lib/vocab-image-style";
import { generateImage, activeProvider } from "@/lib/image-providers";

// Allow up to 90 s — DALL-E may take 10-30 s; LM Studio local models can be slower
export const maxDuration = 90;

const BUCKET =
  process.env.MINIO_BUCKET_VOCAB_IMAGES ?? "chinese-learn-vocab-images";

const TARGET_SIZE = 768;
const WEBP_QUALITY = 85;

async function ensureBucket() {
  const client = minio();
  try {
    const exists = await client.bucketExists(BUCKET);
    if (!exists) await client.makeBucket(BUCKET);
  } catch {
    /* already exists */
  }
}

async function optimizeToWebp(rawBytes: Buffer): Promise<Buffer> {
  return sharp(rawBytes)
    .resize(TARGET_SIZE, TARGET_SIZE, { fit: "cover" })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

async function tryServe(
  client: ReturnType<typeof minio>,
  key: string,
  contentType: string,
): Promise<Response | null> {
  try {
    const stat = await client.statObject(BUCKET, key);
    const nodeStream = await client.getObject(BUCKET, key);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
    return new Response(webStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(stat.size),
        "Cache-Control": "public, max-age=2592000, immutable",
      },
    });
  } catch {
    return null;
  }
}

function providerEnabled(): boolean {
  const p = activeProvider();
  if (p === "openai") return !!process.env.OPENAI_API_KEY;
  if (p === "lmstudio") return !!process.env.LM_STUDIO_IMAGE_BASE_URL;
  if (p === "gemini") return !!process.env.GEMINI_API_KEY;
  return false;
}

// ─── GET /api/vocab-image/[hanzi] ─────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ hanzi: string }> },
) {
  const { hanzi: raw } = await params;
  const hanzi = decodeURIComponent(raw);
  const webpKey = `vocab-images/${hanzi}.webp`;
  const pngKey = `vocab-images/${hanzi}.png`;

  const client = minio();
  await ensureBucket();

  // 1. Cache hit (WebP preferred, fall back to legacy PNG) ────────────────────
  const webpHit = await tryServe(client, webpKey, "image/webp");
  if (webpHit) return webpHit;
  const pngHit = await tryServe(client, pngKey, "image/png");
  if (pngHit) return pngHit;

  // 2. Provider configured? ────────────────────────────────────────────────────
  if (!providerEnabled()) return svgPlaceholder(hanzi);

  // 3. Look up English meaning from DB (it's our DALL-E prompt subject) ──────
  const vocab = await db.vocabulary.findUnique({
    where: { hanzi },
    select: { translations: true, partOfSpeech: true },
  });
  const translations = vocab?.translations as Record<string, string> | null;
  // Prefer the dedicated _imagePromptHint (a richer, visual description used
  // for image generation), fall back to the plain English meaning if no hint
  // is present.
  const promptSource = translations?._imagePromptHint ?? translations?.en;
  if (!promptSource) return svgPlaceholder(hanzi);

  const prompt = buildVocabImagePrompt(promptSource, vocab?.partOfSpeech);

  // 4. Generate via the active provider, optimise, store ──────────────────────
  try {
    const result = await generateImage({ prompt, size: 1024 });
    const webpBytes = await optimizeToWebp(result.bytes);

    await client.putObject(BUCKET, webpKey, webpBytes, webpBytes.length, {
      "Content-Type": "image/webp",
      "X-Image-Provider": result.provider,
    });

    return new Response(new Uint8Array(webpBytes), {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=2592000, immutable",
        "X-Image-Provider": result.provider,
      },
    });
  } catch (err) {
    console.error(`[vocab-image] generation failed (provider=${activeProvider()}):`, err);
    return svgPlaceholder(hanzi);
  }
}

// ─── Placeholder SVG (no provider / no English meaning / generation failed) ──
function svgPlaceholder(hanzi: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f0fdf4"/>
      <stop offset="100%" stop-color="#dcfce7"/>
    </linearGradient>
  </defs>
  <rect width="400" height="200" fill="url(#g)"/>
  <circle cx="200" cy="78" r="36" fill="#86efac" opacity="0.25"/>
  <text
    x="200" y="92"
    text-anchor="middle"
    font-size="40"
    font-family="serif"
    font-weight="bold"
    fill="#15803d"
  >${hanzi.length > 3 ? hanzi.slice(0, 3) : hanzi}</text>
  <text
    x="200" y="160"
    text-anchor="middle"
    font-size="13"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    fill="#86efac"
    letter-spacing="2"
  >กำลังโหลดรูปภาพ…</text>
</svg>`;
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store",
    },
  });
}
