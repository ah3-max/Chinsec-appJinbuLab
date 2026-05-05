/**
 * Generate eldercare-context example sentences for AAY-FINANCE vocabulary
 * via OpenAI gpt-4o-mini, then merge into src/content/aay-finance-examples.json.
 *
 * Each entry is:
 *   "<hanzi>": {
 *     sentence: "Traditional Chinese sentence using the word",
 *     sentencePinyin: "Pinyin with tone marks",
 *     sentenceTh: "Thai translation"
 *   }
 *
 * Run:  npx tsx scripts/generate-finance-examples.ts
 *       npx tsx scripts/generate-finance-examples.ts --limit 30   # Cap how many to add this run
 *       npx tsx scripts/generate-finance-examples.ts --dry-run
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

// Load .env.local
const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const EXAMPLES_FILE = path.resolve(
  process.cwd(),
  "src/content/aay-finance-examples.json",
);

const db = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Example {
  sentence: string;
  sentencePinyin: string;
  sentenceTh: string;
}

const SYSTEM_PROMPT = `You write practical example sentences for Mandarin learners working at a Taiwanese eldercare nursing home (愛愛院).

Given a Chinese word and its English meaning, produce ONE example sentence that:
- Is a realistic situation in an eldercare facility's financial/admin context
- Uses Traditional Chinese (繁體中文)
- Is short and clear (10-20 characters)
- Naturally uses the target word
- Is appropriate for an A1-A2 level Thai-speaking caregiver

Respond with EXACTLY this JSON shape (no markdown, no extra text):
{"sentence": "...", "sentencePinyin": "...", "sentenceTh": "..."}

- sentencePinyin: Hanyu Pinyin with tone marks
- sentenceTh: Natural Thai translation`;

async function generateOne(hanzi: string, en: string): Promise<Example | null> {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 200,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Word: ${hanzi}\nEnglish meaning: ${en}\n\nWrite one example sentence in JSON.`,
        },
      ],
    });
    const text = res.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(text) as Example;
    if (!parsed.sentence || !parsed.sentencePinyin || !parsed.sentenceTh) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.error(`  ❌ ${hanzi}: ${(err as Error).message}`);
    return null;
  }
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const limitArg = args.find((a) => a.startsWith("--limit="))?.split("=")[1];
  const limit = limitArg ? parseInt(limitArg, 10) : undefined;

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY not set");
    process.exit(1);
  }

  // Load existing examples
  const existingRaw = fs.existsSync(EXAMPLES_FILE)
    ? fs.readFileSync(EXAMPLES_FILE, "utf-8")
    : "{}";
  const existing = JSON.parse(existingRaw) as Record<string, Example>;
  console.log(`📖 Loaded ${Object.keys(existing).length} existing examples\n`);

  // Find finance-category vocab without an example yet
  const vocab = await db.vocabulary.findMany({
    where: { category: { startsWith: "f" } },
    select: { hanzi: true, translations: true, category: true },
    orderBy: [{ category: "asc" }],
  });
  const missing = vocab.filter((v) => !existing[v.hanzi]);
  const todo = limit ? missing.slice(0, limit) : missing;

  console.log(`🎯 ${vocab.length} total vocab, ${missing.length} missing examples`);
  console.log(`📝 Generating ${todo.length} this run\n`);

  if (dryRun) {
    todo.slice(0, 10).forEach((v) => {
      const t = v.translations as Record<string, string> | null;
      console.log(`  [${v.category}] ${v.hanzi} → "${t?.en ?? "(no en)"}"`);
    });
    console.log("\n--dry-run: not calling OpenAI");
    await db.$disconnect();
    return;
  }

  let generated = 0;
  let failed = 0;
  const merged = { ...existing };

  // Run sequentially to be polite to the API and catch quota errors early
  for (let i = 0; i < todo.length; i++) {
    const v = todo[i];
    const t = v.translations as Record<string, string> | null;
    const en = t?.en;
    if (!en) {
      console.log(`  ⏭  ${v.hanzi}: no English meaning, skipping`);
      continue;
    }
    process.stdout.write(`  [${i + 1}/${todo.length}] ${v.hanzi} → `);
    const example = await generateOne(v.hanzi, en);
    if (example) {
      merged[v.hanzi] = example;
      console.log(`✅ "${example.sentence}"`);
      generated++;

      // Persist incrementally so we don't lose work on failure
      if (generated % 10 === 0) {
        fs.writeFileSync(EXAMPLES_FILE, JSON.stringify(merged, null, 2) + "\n", "utf-8");
        console.log(`     💾 checkpoint saved (${generated} new)`);
      }
    } else {
      failed++;
    }
    await sleep(150); // light rate limit
  }

  fs.writeFileSync(EXAMPLES_FILE, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  console.log(`\n🎉 Done — added: ${generated}, failed: ${failed}`);
  console.log(`📁 Saved to ${EXAMPLES_FILE}`);

  await db.$disconnect();
}

main().catch(console.error);
