/**
 * Pluggable image-generation providers.
 *
 * The active provider is chosen via the `IMAGE_GEN_PROVIDER` env var:
 *   - "openai"   → OpenAI DALL-E 3 (default; needs OPENAI_API_KEY)
 *   - "lmstudio" → LM Studio's OpenAI-compatible /v1/images/generations
 *                  (needs LM_STUDIO_IMAGE_BASE_URL + LM_STUDIO_IMAGE_MODEL)
 *   - "gemini"   → Google Gemini 2.5 Flash Image ("nano-banana")
 *                  (needs GEMINI_API_KEY)
 *
 * Each provider returns raw PNG bytes that the caller pipes through
 * `sharp` for WebP optimisation before storing in MinIO.
 */
import OpenAI from "openai";

export type Provider = "openai" | "lmstudio" | "gemini";

export interface GenerateInput {
  /** Full prompt (already includes style preamble) */
  prompt: string;
  /** Square output size; providers may round to nearest supported */
  size?: 512 | 768 | 1024;
}

export interface GenerateResult {
  bytes: Buffer;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  /** What provider produced it — useful in logs */
  provider: Provider;
}

export function activeProvider(): Provider {
  const raw = (process.env.IMAGE_GEN_PROVIDER ?? "openai").toLowerCase();
  if (raw === "lmstudio" || raw === "gemini" || raw === "openai") return raw;
  return "openai";
}

// ─── OpenAI DALL-E 3 ─────────────────────────────────────────────────────────
async function generateOpenAI(input: GenerateInput): Promise<GenerateResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");
  const openai = new OpenAI({ apiKey });
  const res = await openai.images.generate({
    model: "dall-e-3",
    prompt: input.prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    response_format: "b64_json",
  });
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("openai returned no image data");
  return {
    bytes: Buffer.from(b64, "base64"),
    mimeType: "image/png",
    provider: "openai",
  };
}

// ─── LM Studio (OpenAI-compatible /v1/images/generations) ────────────────────
async function generateLmStudio(input: GenerateInput): Promise<GenerateResult> {
  const baseUrl = process.env.LM_STUDIO_IMAGE_BASE_URL;
  const model = process.env.LM_STUDIO_IMAGE_MODEL ?? "gemini-2.5-flash-image";
  if (!baseUrl) throw new Error("LM_STUDIO_IMAGE_BASE_URL missing");

  const url = `${baseUrl.replace(/\/+$/, "")}/images/generations`;
  const apiKey = process.env.LM_STUDIO_API_KEY ?? "lm-studio-placeholder";
  const size = `${input.size ?? 1024}x${input.size ?? 1024}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt: input.prompt,
      n: 1,
      size,
      response_format: "b64_json",
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`lmstudio ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as { data?: Array<{ b64_json?: string; url?: string }> };
  const item = json.data?.[0];
  if (!item) throw new Error("lmstudio returned no data");

  if (item.b64_json) {
    return {
      bytes: Buffer.from(item.b64_json, "base64"),
      mimeType: "image/png",
      provider: "lmstudio",
    };
  }
  if (item.url) {
    const dl = await fetch(item.url);
    if (!dl.ok) throw new Error(`lmstudio image url fetch failed: ${dl.status}`);
    const buf = Buffer.from(await dl.arrayBuffer());
    return { bytes: buf, mimeType: "image/png", provider: "lmstudio" };
  }
  throw new Error("lmstudio: neither b64_json nor url present");
}

// ─── Google Gemini 2.5 Flash Image ("nano-banana") ───────────────────────────
async function generateGemini(input: GenerateInput): Promise<GenerateResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");
  const model = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: input.prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`gemini ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> };
    }>;
  };
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  const data = part?.inlineData?.data;
  if (!data) throw new Error("gemini returned no image data");
  const mime = part?.inlineData?.mimeType;
  return {
    bytes: Buffer.from(data, "base64"),
    mimeType:
      mime === "image/jpeg" ? "image/jpeg"
      : mime === "image/webp" ? "image/webp"
      : "image/png",
    provider: "gemini",
  };
}

export async function generateImage(input: GenerateInput): Promise<GenerateResult> {
  const provider = activeProvider();
  switch (provider) {
    case "lmstudio": return generateLmStudio(input);
    case "gemini":   return generateGemini(input);
    case "openai":
    default:         return generateOpenAI(input);
  }
}
