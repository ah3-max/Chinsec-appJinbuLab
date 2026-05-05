/**
 * scripts/generate-finance-audio.ts
 *
 * Pre-generate normal + slow mp3s for every AAY-FINANCE vocab using
 * edge-tts (zh-TW-HsiaoChenNeural). Output:
 *   public/audio/vocab/{hanzi}.mp3
 *   public/audio/vocab/{hanzi}_slow.mp3
 *
 * Pulls the vocab list straight from the JSON the seed reads, so it stays
 * in sync without going through the DB.
 *
 *   npx tsx scripts/generate-finance-audio.ts
 *   npx tsx scripts/generate-finance-audio.ts --redo   # regenerate even if exists
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import * as path from "path";

import data from "../prisma/seed/courses/aay-finance.data.json";

const VOICE = "zh-TW-HsiaoChenNeural";
const SLOW_RATE = "-30%";
const ROOT = path.resolve(process.cwd(), "public/audio");
const VOCAB_DIR = path.join(ROOT, "vocab");

interface Item {
  hanzi: string;
  pinyin: string;
}

interface Stage {
  items: Item[];
}

interface CourseData {
  stages: Stage[];
}

const COURSE = data as CourseData;
const REDO = process.argv.includes("--redo");

async function ensureDir(dir: string) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

async function runEdgeTts(text: string, outPath: string, rate?: string) {
  const args = ["-m", "edge_tts", "--text", text, "--voice", VOICE];
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
            `edge-tts exit ${code} (text=${JSON.stringify(text).slice(0, 40)}): ${stderr.slice(0, 200)}`,
          ),
        );
    });
  });
}

interface Job {
  text: string;
  outPath: string;
  rate?: string;
}

async function main() {
  await ensureDir(VOCAB_DIR);

  // De-dupe by hanzi (some words like 合計 may appear in multiple stages).
  const seen = new Set<string>();
  const jobs: Job[] = [];
  for (const stage of COURSE.stages) {
    for (const item of stage.items) {
      if (seen.has(item.hanzi)) continue;
      seen.add(item.hanzi);
      jobs.push({
        text: item.hanzi,
        outPath: path.join(VOCAB_DIR, `${item.hanzi}.mp3`),
      });
      jobs.push({
        text: item.hanzi,
        outPath: path.join(VOCAB_DIR, `${item.hanzi}_slow.mp3`),
        rate: SLOW_RATE,
      });
    }
  }

  console.log(`🎙️  AAY-FINANCE: ${seen.size} 詞 → ${jobs.length} mp3 jobs`);

  let done = 0;
  let skipped = 0;
  let failed = 0;
  for (const j of jobs) {
    if (!REDO && existsSync(j.outPath)) {
      skipped++;
      continue;
    }
    try {
      await runEdgeTts(j.text, j.outPath, j.rate);
      done++;
      if (done % 20 === 0) console.log(`    …${done}`);
    } catch (err) {
      failed++;
      console.warn(
        `    ! failed for ${path.basename(j.outPath)}:`,
        (err as Error).message.slice(0, 140),
      );
    }
  }

  console.log(`✓ done: gen=${done} skip=${skipped} fail=${failed}`);
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
