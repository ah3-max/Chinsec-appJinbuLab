/**
 * generate-translations.ts — 批次產生 vi / id 翻譯
 *
 * ⚠️  此腳本「現在不執行」，等歐寶走完 L1-S01-S03 並回饋翻譯問題後才跑。
 *
 * Usage:
 *   npx tsx scripts/generate-translations.ts --target vi --scenario L1-S01
 *   npx tsx scripts/generate-translations.ts --target id --scenario all
 *
 * 邏輯:
 * 1. 從 DB 取出目標 scenario 所有 Vocabulary 的中文 + 泰文 + 英文
 * 2. 呼叫 Claude API (translation_assist task)
 * 3. prompt: 將下列詞彙翻譯成 vi/id，參考泰文翻譯維持風格一致
 * 4. 寫回 Vocabulary.translations.vi / .id
 * 5. 記錄到 docs/translation-history-{date}.json
 */

import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TARGET_LANGS: Record<string, { name: string; placeholder: string }> = {
  vi: { name: "越南文 (Vietnamese)", placeholder: "[VI-AUTO-PENDING]" },
  id: { name: "印尼文 (Indonesian)", placeholder: "[ID-AUTO-PENDING]" },
};

async function main() {
  const args = process.argv.slice(2);
  const targetIdx = args.indexOf("--target");
  const scenarioIdx = args.indexOf("--scenario");

  if (targetIdx === -1 || scenarioIdx === -1) {
    console.error("Usage: npx tsx scripts/generate-translations.ts --target vi|id --scenario <code|all>");
    process.exit(1);
  }

  const target = args[targetIdx + 1];
  const scenarioCode = args[scenarioIdx + 1];

  if (!TARGET_LANGS[target]) {
    console.error(`Invalid target language: ${target}. Use 'vi' or 'id'.`);
    process.exit(1);
  }

  const langInfo = TARGET_LANGS[target];
  console.log(`\n🌍 Generating ${langInfo.name} translations (target: ${target}, scenario: ${scenarioCode})`);

  // Find vocabularies that still have placeholder
  const scenarioFilter = scenarioCode === "all"
    ? {}
    : { scenarios: { some: { scenario: { code: scenarioCode } } } };

  const vocabs = await prisma.vocabulary.findMany({
    where: {
      ...scenarioFilter,
      translations: { path: [target], equals: langInfo.placeholder },
    },
    select: { id: true, hanzi: true, pinyin: true, translations: true },
    orderBy: { hanzi: "asc" },
  });

  if (vocabs.length === 0) {
    console.log("✓ No pending translations found.");
    return;
  }
  console.log(`Found ${vocabs.length} words with ${langInfo.placeholder}`);

  const history: Array<{ hanzi: string; original: string; generated: string }> = [];
  let updated = 0;

  for (const v of vocabs) {
    const tr = v.translations as Record<string, string>;
    const thMeaning = tr.th ?? "";
    const enMeaning = tr.en ?? "";

    const prompt = `你是一名專業語言翻譯師。請把下列中文詞彙翻譯成${langInfo.name}。
參考提供的泰文和英文翻譯，保持同等簡潔度和風格。
只回答翻譯結果，不要解釋。

漢字: ${v.hanzi}
拼音: ${v.pinyin}
泰文參考: ${thMeaning}
英文參考: ${enMeaning}

${langInfo.name}翻譯:`;

    try {
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 64,
        messages: [{ role: "user", content: prompt }],
      });
      const generated = (response.content[0] as { type: string; text: string }).text.trim();

      await prisma.vocabulary.update({
        where: { id: v.id },
        data: { translations: { ...tr, [target]: generated } },
      });
      history.push({ hanzi: v.hanzi, original: langInfo.placeholder, generated });
      updated++;
      console.log(`  ${v.hanzi}: ${generated}`);
    } catch (err) {
      console.error(`  ✗ Failed for ${v.hanzi}:`, err);
    }
  }

  // Save history log
  const dateStr = new Date().toISOString().slice(0, 10);
  const historyPath = path.join(process.cwd(), "docs", `translation-history-${target}-${dateStr}.json`);
  fs.writeFileSync(historyPath, JSON.stringify({ target, scenarioCode, generated: history }, null, 2));
  console.log(`\n✅ Updated ${updated} / ${vocabs.length} translations`);
  console.log(`📄 History saved to ${historyPath}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
