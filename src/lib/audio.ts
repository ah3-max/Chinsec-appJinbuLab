// Helpers shared by the audio API route and any consumer that needs to
// translate an audio "symbol" (注音 / 範例字 / 聲調 demo) into a storage key.

export type AudioCategory = "symbols" | "examples" | "tones" | "compounds";

export function audioObjectKey(opts: {
  category: AudioCategory;
  name: string; // e.g. "ㄅ", "爸", "ma_1"
  slow?: boolean;
}): string {
  const base = opts.slow ? `${opts.name}_slow` : opts.name;
  return `zhuyin/${opts.category}/${base}.mp3`;
}

export function publicAudioPath(key: string): string {
  return `/audio/${key}`;
}
