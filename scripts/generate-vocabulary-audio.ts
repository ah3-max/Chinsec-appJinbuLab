/**
 * scripts/generate-vocabulary-audio.ts
 *
 * Generate Mandarin mp3s for scenario vocabularies + dialogue lines + key
 * sentences using Edge-TTS (zh-TW-HsiaoChenNeural). Output:
 *   public/audio/vocab/{hanzi}.mp3                       (normal)
 *   public/audio/vocab/{hanzi}_slow.mp3                  (-30%)
 *   public/audio/dialogue/{scenarioCode}/{lineIndex}.mp3
 *   public/audio/sentence/{key}.mp3                      (named sentences)
 *
 * Usage:
 *   npx tsx scripts/generate-vocabulary-audio.ts --scenario L1-S01
 *   npx tsx scripts/generate-vocabulary-audio.ts --scenario all
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import * as path from "path";

import { L1_S01 } from "../src/content/scenarios/L1-S01-self-introduction";
import type { ScenarioDef } from "../src/content/scenarios/_types";

const VOICE = "zh-TW-HsiaoChenNeural";
const SLOW_RATE = "-30%";
const ROOT = path.resolve(process.cwd(), "public/audio");

const ALL_SCENARIOS: ScenarioDef[] = [L1_S01];

interface Job {
  text: string;
  outPath: string;
  rate?: string;
}

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

function buildJobs(scenario: ScenarioDef): Job[] {
  const jobs: Job[] = [];

  // 1) Vocabulary words (global by hanzi — same word in different scenarios
  //    re-uses the same mp3).
  const vocabDir = path.join(ROOT, "vocab");
  for (const v of scenario.vocabularies) {
    jobs.push({ text: v.hanzi, outPath: path.join(vocabDir, `${v.hanzi}.mp3`) });
    jobs.push({
      text: v.hanzi,
      outPath: path.join(vocabDir, `${v.hanzi}_slow.mp3`),
      rate: SLOW_RATE,
    });
  }

  // 2) Dialogue lines (per scenario × line index).
  const dlgDir = path.join(ROOT, "dialogue", scenario.code);
  scenario.dialogue.forEach((line, idx) => {
    jobs.push({
      text: line.hanzi,
      outPath: path.join(dlgDir, `${idx}.mp3`),
    });
  });

  // 3) A few named full sentences keyed off the dialogue, for SPEAK_REPEAT.
  if (scenario.code === "L1-S01") {
    const sentDir = path.join(ROOT, "sentence");
    jobs.push({
      text: "您好!我叫歐寶。",
      outPath: path.join(sentDir, "L1-S01-greeting.mp3"),
    });
  }

  return jobs;
}

async function main() {
  const argScenario = parseArg("--scenario") ?? "L1-S01";
  const targets =
    argScenario === "all"
      ? ALL_SCENARIOS
      : ALL_SCENARIOS.filter((s) => s.code === argScenario);

  if (targets.length === 0) {
    console.error(`❌ no scenario found for code=${argScenario}`);
    process.exit(1);
  }

  console.log(`🎙️  Generating audio for ${targets.length} scenario(s) via edge-tts…`);

  for (const scenario of targets) {
    const jobs = buildJobs(scenario);
    console.log(`  ${scenario.code}: ${jobs.length} jobs`);

    // Pre-create dirs
    for (const j of jobs) await ensureDir(path.dirname(j.outPath));

    let done = 0,
      skipped = 0,
      failed = 0;
    for (const j of jobs) {
      if (existsSync(j.outPath)) {
        skipped++;
        continue;
      }
      try {
        await runEdgeTts(j.text, j.outPath, j.rate);
        done++;
        if (done % 5 === 0) console.log(`    …${done}`);
      } catch (err) {
        failed++;
        console.warn(
          `    ! failed for ${path.basename(j.outPath)}:`,
          (err as Error).message.slice(0, 120),
        );
      }
    }
    console.log(`  ${scenario.code} done: gen=${done} skip=${skipped} fail=${failed}`);
  }
}

function parseArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
