import { type NextRequest } from "next/server";
import { audioObjectKey, type AudioCategory } from "@/lib/audio";
import { serveAudioObject } from "@/lib/audio-serve";

export const runtime = "nodejs";

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

  const catParam = req.nextUrl.searchParams.get("cat");
  const category: AudioCategory =
    catParam &&
    (["symbols", "examples", "tones", "compounds"] as const).includes(
      catParam as AudioCategory,
    )
      ? (catParam as AudioCategory)
      : inferCategory(symbol);

  const key = audioObjectKey({ category, name: symbol, slow });
  return serveAudioObject(req, key);
}
