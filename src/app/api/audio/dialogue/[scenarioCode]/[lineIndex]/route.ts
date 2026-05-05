import { NextResponse, type NextRequest } from "next/server";
import { serveAudioObject } from "@/lib/audio-serve";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ scenarioCode: string; lineIndex: string }> },
) {
  const { scenarioCode, lineIndex } = await ctx.params;
  if (!/^[A-Za-z0-9-]{1,20}$/.test(scenarioCode)) {
    return NextResponse.json({ error: "invalid scenario code" }, { status: 400 });
  }
  if (!/^\d{1,3}$/.test(lineIndex)) {
    return NextResponse.json({ error: "invalid line index" }, { status: 400 });
  }

  const objectKey = `dialogue/${scenarioCode}/${lineIndex}.mp3`;
  return serveAudioObject(req, objectKey);
}
