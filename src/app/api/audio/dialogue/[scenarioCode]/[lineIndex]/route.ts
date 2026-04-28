import { NextResponse, type NextRequest } from "next/server";
import { existsSync } from "fs";
import * as path from "path";
import { minio, minioPublicUrl } from "@/lib/minio";

export const runtime = "nodejs";

const PUBLIC_ROOT = path.resolve(process.cwd(), "public/audio");

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ scenarioCode: string; lineIndex: string }> },
) {
  const { scenarioCode, lineIndex } = await ctx.params;
  // Light validation: scenario code is letters/digits/dashes; line index is
  // a small non-negative number.
  if (!/^[A-Za-z0-9-]{1,20}$/.test(scenarioCode)) {
    return NextResponse.json({ error: "invalid scenario code" }, { status: 400 });
  }
  if (!/^\d{1,3}$/.test(lineIndex)) {
    return NextResponse.json({ error: "invalid line index" }, { status: 400 });
  }

  const objectKey = `dialogue/${scenarioCode}/${lineIndex}.mp3`;

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
