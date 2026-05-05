import { type NextRequest } from "next/server";
import { serveAudioObject } from "@/lib/audio-serve";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ hanzi: string }> },
) {
  const { hanzi: rawHanzi } = await ctx.params;
  const hanzi = decodeURIComponent(rawHanzi);
  const slow = req.nextUrl.searchParams.get("slow") === "1";

  const fileName = slow ? `${hanzi}_slow.mp3` : `${hanzi}.mp3`;
  const objectKey = `vocab/${fileName}`;
  return serveAudioObject(req, objectKey);
}
