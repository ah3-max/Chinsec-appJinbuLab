/**
 * scripts/generate-zhuyin-audio.ts
 *
 * 用 edge-tts (Microsoft Edge 線上 TTS) 預生成注音相關音檔，存到
 *   public/audio/zhuyin/{symbols,examples,tones,compounds}/
 *
 * 兩種速度：normal + slow (-30%)
 *
 * 執行：
 *   npx tsx scripts/generate-zhuyin-audio.ts
 *
 * 安裝：
 *   pipx install edge-tts            # 推薦
 *   或 python3 -m pip install --user edge-tts
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import * as path from "path";

import { ALL_ZHUYIN, TONES } from "../src/lib/zhuyin/data";

const VOICE = "zh-TW-HsiaoChenNeural";
const SLOW_RATE = "-30%";
const ROOT = path.resolve(process.cwd(), "public/audio/zhuyin");

// 4 聲調對比示範字
const TONE_DEMO = [
  { hanzi: "媽", pinyin: "mā", tone: 1 },
  { hanzi: "麻", pinyin: "má", tone: 2 },
  { hanzi: "馬", pinyin: "mǎ", tone: 3 },
  { hanzi: "罵", pinyin: "mà", tone: 4 },
  { hanzi: "嗎", pinyin: "ma", tone: 5 },
];

interface Job {
  text: string;
  outPath: string;
  rate?: string;
}

async function ensureDir(dir: string) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

async function runEdgeTts(text: string, outPath: string, rate?: string) {
  // Resolve `edge-tts` via `python3 -m edge_tts` so we don't depend on PATH.
  const args = ["-m", "edge_tts", "--text", text, "--voice", VOICE];
  // argparse treats a leading "-30%" as an option flag, so use `--rate=...`.
  if (rate) args.push(`--rate=${rate}`);
  args.push("--write-media", outPath);

  await new Promise<void>((resolve, reject) => {
    const proc = spawn("python3", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (b: Buffer) => (stderr += b.toString()));
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(
            `edge-tts exit ${code} (text=${JSON.stringify(text)}): ${stderr.slice(0, 200)}`,
          ),
        );
    });
  });
}

function buildJobs(): Job[] {
  const jobs: Job[] = [];

  // 1) 注音符號 + 範例字（讀範例字較清楚）
  for (const z of ALL_ZHUYIN) {
    const text = z.example?.hanzi ?? z.pinyin;
    const symbolDir = path.join(ROOT, "symbols");
    jobs.push({ text, outPath: path.join(symbolDir, `${z.symbol}.mp3`) });
    jobs.push({
      text,
      outPath: path.join(symbolDir, `${z.symbol}_slow.mp3`),
      rate: SLOW_RATE,
    });

    if (z.example) {
      const exDir = path.join(ROOT, "examples");
      jobs.push({
        text: z.example.hanzi,
        outPath: path.join(exDir, `${z.example.hanzi}.mp3`),
      });
      jobs.push({
        text: z.example.hanzi,
        outPath: path.join(exDir, `${z.example.hanzi}_slow.mp3`),
        rate: SLOW_RATE,
      });
    }
  }

  // 2) 4 聲調對比 (使用 ma 系列展示)
  const tonesDir = path.join(ROOT, "tones");
  for (const td of TONE_DEMO) {
    jobs.push({
      text: td.hanzi,
      outPath: path.join(tonesDir, `ma_${td.tone}.mp3`),
    });
    jobs.push({
      text: td.hanzi,
      outPath: path.join(tonesDir, `ma_${td.tone}_slow.mp3`),
      rate: SLOW_RATE,
    });
  }

  // 3) 提供完整聲調介紹（用 TONES 名稱朗讀）
  for (const t of TONES) {
    jobs.push({
      text: t.name.replace(/[（）]/g, " "),
      outPath: path.join(tonesDir, `intro_${t.number}.mp3`),
    });
  }

  return jobs;
}

async function main() {
  console.log("🎙️  Generating Zhuyin audio with edge-tts…");

  // Pre-create directories.
  for (const sub of ["symbols", "examples", "tones", "compounds"]) {
    await ensureDir(path.join(ROOT, sub));
  }

  const jobs = buildJobs();
  console.log(`   total jobs: ${jobs.length}`);

  let done = 0;
  let skipped = 0;
  let failed = 0;

  for (const j of jobs) {
    if (existsSync(j.outPath)) {
      skipped++;
      continue;
    }
    try {
      await runEdgeTts(j.text, j.outPath, j.rate);
      done++;
      if (done % 10 === 0) {
        console.log(`   …${done} generated`);
      }
    } catch (err) {
      failed++;
      console.warn(
        `   ! failed for ${path.basename(j.outPath)}:`,
        (err as Error).message.slice(0, 120),
      );
    }
  }

  console.log("");
  console.log(
    `✅ done. generated=${done}, skipped(existing)=${skipped}, failed=${failed}`,
  );
  console.log(`   output: ${ROOT}`);
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
