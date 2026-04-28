import { NextResponse, type NextRequest } from "next/server";
import { existsSync } from "fs";
import * as path from "path";
import { minio, minioPublicUrl } from "@/lib/minio";

export const runtime = "nodejs";

const PUBLIC_ROOT = path.resolve(process.cwd(), "public/audio");

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ hanzi: string }> },
) {
  const { hanzi: rawHanzi } = await ctx.params;
  const hanzi = decodeURIComponent(rawHanzi);
  const slow = req.nextUrl.searchParams.get("slow") === "1";

  const fileName = slow ? `${hanzi}_slow.mp3` : `${hanzi}.mp3`;
  const objectKey = `vocab/${fileName}`;

  // Try MinIO first.
  const bucket = process.env.MINIO_BUCKET_AUDIO;
  if (bucket && process.env.MINIO_ACCESS_KEY) {
    try {
      await minio().statObject(bucket, objectKey);
      return NextResponse.redirect(minioPublicUrl(bucket, objectKey), 302);
    } catch {
      /* fall through */
    }
  }

  // Local public/ fallback.
  const localPath = path.join(PUBLIC_ROOT, objectKey);
  if (existsSync(localPath)) {
    return NextResponse.redirect(new URL(`/audio/${objectKey}`, req.url), 302);
  }

  return NextResponse.json(
    { error: "audio not found", key: objectKey },
    { status: 404 },
  );
}
