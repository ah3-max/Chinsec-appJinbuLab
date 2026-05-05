import { NextResponse, type NextRequest } from "next/server";
import { serveAudioObject } from "@/lib/audio-serve";

export const runtime = "nodejs";

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
  return serveAudioObject(req, objectKey);
}
