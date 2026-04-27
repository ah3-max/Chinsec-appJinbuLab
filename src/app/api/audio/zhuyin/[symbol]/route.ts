import { NextResponse, type NextRequest } from "next/server";
import { existsSync } from "fs";
import * as path from "path";
import { audioObjectKey, publicAudioPath, type AudioCategory } from "@/lib/audio";
import { minio, minioPublicUrl } from "@/lib/minio";

export const runtime = "nodejs";

const PUBLIC_ROOT = path.resolve(process.cwd(), "public/audio");

// Heuristic for which subfolder a symbol lives in.
// - Bopomofo block U+3105–U+312D → symbols/
// - "ma_1" / "intro_2" pattern → tones/
// - default → examples/ (Chinese hanzi)
function inferCategory(name: string): AudioCategory {
  if (/^[ma|intro]_\d+$/i.test(name) || /^ma_\d/.test(name) || /^intro_\d/.test(name)) {
    return "tones";
  }
  if (name.length === 1) {
    const code = name.charCodeAt(0);
    if (code >= 0x3105 && code <= 0x312d) return "symbols";
    return "examples";
  }
  return "compounds";
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ symbol: string }> },
) {
  const { symbol: rawSymbol } = await ctx.params;
  const symbol = decodeURIComponent(rawSymbol);
  const slow = req.nextUrl.searchParams.get("slow") === "1";

  // Allow `?cat=examples` etc to override the heuristic.
  const catParam = req.nextUrl.searchParams.get("cat");
  const category: AudioCategory =
    catParam &&
    (["symbols", "examples", "tones", "compounds"] as const).includes(
      catParam as AudioCategory,
    )
      ? (catParam as AudioCategory)
      : inferCategory(symbol);

  const key = audioObjectKey({ category, name: symbol, slow });

  // 1. MinIO first (the canonical source post-deploy).
  const bucket = process.env.MINIO_BUCKET_AUDIO;
  if (bucket && process.env.MINIO_ACCESS_KEY) {
    try {
      await minio().statObject(bucket, key);
      return NextResponse.redirect(minioPublicUrl(bucket, key), 302);
    } catch {
      // Not in MinIO — fall through to public/.
    }
  }

  // 2. Local public/ folder fallback (handy in dev before the upload script
  //    has run).
  const localPath = path.join(PUBLIC_ROOT, key);
  if (existsSync(localPath)) {
    return NextResponse.redirect(
      new URL(publicAudioPath(key), req.url),
      302,
    );
  }

  return NextResponse.json({ error: "audio not found", key }, { status: 404 });
}
