import { NextResponse, type NextRequest } from "next/server";
import { existsSync } from "fs";
import * as path from "path";
import { minio, minioPublicUrl } from "@/lib/minio";

export const runtime = "nodejs";

const PUBLIC_ROOT = path.resolve(process.cwd(), "public/audio");

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ key: string }> },
) {
  const { key: rawKey } = await ctx.params;
  const key = decodeURIComponent(rawKey);
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(key)) {
    return NextResponse.json({ error: "invalid sentence key" }, { status: 400 });
  }

  const objectKey = `sentence/${key}.mp3`;

  const bucket = process.env.MINIO_BUCKET_AUDIO;
  if (bucket && process.env.MINIO_ACCESS_KEY) {
    try {
      await minio().statObject(bucket, objectKey);
      return NextResponse.redirect(minioPublicUrl(bucket, objectKey), 302);
    } catch {
      /* fall through */
    }
  }

  const localPath = path.join(PUBLIC_ROOT, objectKey);
  if (existsSync(localPath)) {
    return NextResponse.redirect(new URL(`/audio/${objectKey}`, req.url), 302);
  }

  return NextResponse.json(
    { error: "audio not found", key: objectKey },
    { status: 404 },
  );
}
