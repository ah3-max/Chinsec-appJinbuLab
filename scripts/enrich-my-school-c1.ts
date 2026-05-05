/**
 * Enrich Chapter 1 lessons with:
 *   - 3 examples per grammar pattern (1 from user's PDF + 2 originally written)
 *   - Mnemonic memory hints (originally written, character-breakdown style)
 *   - Usage notes for tricky patterns
 *
 * The originally-written example sentences and mnemonics are linguistic
 * teaching aids written from scratch here. The single PDF example per
 * pattern was already in the prior seed.
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const db = new PrismaClient();

interface ExampleEx {
  sentence: string;
  pinyin?: string;
  translation?: string;
}

interface GrammarItem {
  hanzi: string;
  pinyin: string;
  translations: { en: string; th: string };
  examples: ExampleEx[];
  mnemonic: string;
  note?: string;
}

// ─── Enriched grammar — 3 examples + mnemonic per pattern ────────────────────
// Each pattern's first example is from the user's textbook PDF; the
// remaining two and the mnemonic were authored here.
const GRAMMAR: GrammarItem[] = [
  {
    hanzi: "…的話",
    pinyin: "…de huà",
    translations: {
      en: "if, supposing (placed at end of conditional clause)",
      th: "ถ้า / สมมติว่า (วางท้ายประโยคเงื่อนไข)",
    },
    examples: [
      {
        sentence: "你想轉系的話，最好先跟父母討論。",
        pinyin: "Nǐ xiǎng zhuǎn xì de huà, zuìhǎo xiān gēn fùmǔ tǎolùn.",
        translation: "ถ้าอยากย้ายสาขา ควรคุยกับพ่อแม่ก่อนจะดีกว่า",
      },
      {
        sentence: "明天下雨的話，我們就在家裡看電影。",
        pinyin: "Míngtiān xià yǔ de huà, wǒmen jiù zài jiā lǐ kàn diànyǐng.",
        translation: "ถ้าพรุ่งนี้ฝนตก เราก็อยู่บ้านดูหนัง",
      },
      {
        sentence: "你不去的話，我也不去。",
        pinyin: "Nǐ bú qù de huà, wǒ yě bú qù.",
        translation: "ถ้าคุณไม่ไป ฉันก็ไม่ไป",
      },
    ],
    mnemonic:
      "把 「…的話」 放在條件後面，「ถ้า…」 ของจีน vs ไทย ตำแหน่งสลับกัน — IF-clause + 的話 → result. Combine 如果/要是 ที่หน้าประโยคเพื่อให้เป็นทางการมากขึ้น",
    note: "如果/要是 + clause + 的話 = formal version. The 的話 alone is colloquial.",
  },
  {
    hanzi: "不到",
    pinyin: "bú dào",
    translations: {
      en: "less than… (followed by a number/quantity)",
      th: "ไม่ถึง... (ตามด้วยจำนวน)",
    },
    examples: [
      {
        sentence: "這支手機不到五千塊，真便宜。",
        pinyin: "Zhè zhī shǒujī bú dào wǔ qiān kuài, zhēn piányí.",
        translation: "มือถือเครื่องนี้ไม่ถึงห้าพันบาท ถูกมากเลย",
      },
      {
        sentence: "我等了不到五分鐘，公車就來了。",
        pinyin: "Wǒ děng le bú dào wǔ fēnzhōng, gōngchē jiù lái le.",
        translation: "ฉันรอไม่ถึง 5 นาที รถเมล์ก็มา",
      },
      {
        sentence: "他寫這篇報告不到一個小時。",
        pinyin: "Tā xiě zhè piān bàogào bú dào yí ge xiǎoshí.",
        translation: "เขาเขียนรายงานนี้ไม่ถึงชั่วโมงเดียว",
      },
    ],
    mnemonic:
      "「不到」= 「ไม่ + ถึง」 — literally 'not arrive at (this number)'. ตามด้วยตัวเลขเสมอ — always followed by a number/quantity",
    note: "Pairs with time (5 分鐘), money (5000塊), age (6歲), etc.",
  },
  {
    hanzi: "差一點(就)…",
    pinyin: "chà yì diǎn (jiù) …",
    translations: {
      en: "almost… (but did not happen)",
      th: "เกือบจะ... (แต่ไม่ได้เกิดขึ้น)",
    },
    examples: [
      {
        sentence: "昨天的演講真沒意思，我差一點睡著了。",
        pinyin: "Zuótiān de yǎnjiǎng zhēn méi yìsi, wǒ chà yì diǎn shuìzháo le.",
        translation: "การบรรยายเมื่อวานน่าเบื่อมาก ฉันเกือบหลับเลย",
      },
      {
        sentence: "上次考試我差一點不及格。",
        pinyin: "Shàng cì kǎoshì wǒ chà yì diǎn bù jí gé.",
        translation: "ครั้งที่แล้วฉันเกือบสอบตก",
      },
      {
        sentence: "我差一點忘了今天有會議。",
        pinyin: "Wǒ chà yì diǎn wàng le jīntiān yǒu huìyì.",
        translation: "ฉันเกือบลืมว่าวันนี้มีประชุม",
      },
    ],
    mnemonic:
      "差一點 = 「ขาดอีกนิดเดียว」 'short by just a little'. เกือบเกิดแต่ไม่ได้เกิด — almost did, but didn't. ระวังอย่าสับสนกับ 差不多 (เกือบจะ ≈ ประมาณ)",
    note: "就 is optional. Don't confuse with 差不多 (about, close to / similar).",
  },
  {
    hanzi: "恐怕…",
    pinyin: "kǒngpà …",
    translations: {
      en: "I'm afraid that… (likely outcome, usually unfavorable)",
      th: "เกรงว่า, น่าจะ... (มักเป็นสถานการณ์ที่ไม่ดี)",
    },
    examples: [
      {
        sentence: "壓力太大，恐怕會影響身體健康。",
        pinyin: "Yālì tài dà, kǒngpà huì yǐngxiǎng shēntǐ jiànkāng.",
        translation: "ความเครียดมากเกินไป เกรงว่าจะกระทบต่อสุขภาพ",
      },
      {
        sentence: "下這麼大的雨，他恐怕來不了了。",
        pinyin: "Xià zhème dà de yǔ, tā kǒngpà lái bù liǎo le.",
        translation: "ฝนตกหนักขนาดนี้ เกรงว่าเขาจะมาไม่ได้",
      },
      {
        sentence: "現在這麼晚，銀行恐怕關門了。",
        pinyin: "Xiànzài zhème wǎn, yínháng kǒngpà guān mén le.",
        translation: "ตอนนี้ดึกแล้ว ธนาคารคงปิดแล้ว",
      },
    ],
    mnemonic:
      "恐 + 怕 = สองตัวอักษรของ「กลัว」 → คำพยากรณ์เชิงลบ — double-fear character → predicting an unfavorable outcome. ใช้ 大概/可能 ถ้าเป็นกลาง",
    note: "More negative than 大概 / 可能. For others' fear use 怕 (without 恐).",
  },
  {
    hanzi: "好不容易",
    pinyin: "hǎo bù róngyì",
    translations: {
      en: "finally managed to… (hard-won, after great difficulty)",
      th: "ในที่สุดก็สำเร็จ / ลำบากมากกว่าจะ... (ผลที่ได้มาด้วยความยากลำบาก)",
    },
    examples: [
      {
        sentence: "下了兩星期的雨，今天好不容易才停。",
        pinyin: "Xià le liǎng xīngqí de yǔ, jīntiān hǎo bù róngyì cái tíng.",
        translation: "ฝนตกมาสองอาทิตย์ วันนี้ในที่สุดก็หยุดตกซะที",
      },
      {
        sentence: "排了三個小時的隊，好不容易才買到票。",
        pinyin: "Pái le sān ge xiǎoshí de duì, hǎo bù róngyì cái mǎi dào piào.",
        translation: "ต่อแถวสามชั่วโมง ในที่สุดก็ซื้อตั๋วได้",
      },
      {
        sentence: "她好不容易才考上這個學校。",
        pinyin: "Tā hǎo bù róngyì cái kǎo shàng zhège xuéxiào.",
        translation: "เธอลำบากมากกว่าจะสอบเข้าโรงเรียนนี้ได้",
      },
    ],
    mnemonic:
      "好不容易 = 「ไม่ง่ายเลย แต่ในที่สุดก็ได้」 — 'really not easy, but finally...'. มักจะตามด้วย 才 (only then). หมายความเชิงบวกถึงสิ่งที่ได้มา",
    note: "Very often pairs with 才 (cái) for emphasis: 好不容易…才… = only managed after much effort.",
  },
  {
    hanzi: "說…就…",
    pinyin: "shuō … jiù …",
    translations: {
      en: "just like that / and before you know it (sudden, unexpected action)",
      th: "พูดจะ... ก็... (เกิดขึ้นทันทีโดยไม่บอกล่วงหน้า)",
    },
    examples: [
      {
        sentence: "台北的天氣真奇怪，說下雨就下雨。",
        pinyin: "Táiběi de tiānqì zhēn qíguài, shuō xià yǔ jiù xià yǔ.",
        translation: "อากาศในไทเปแปลกจริงๆ พูดจะฝนตกก็ตกเลย",
      },
      {
        sentence: "他說走就走，我們都來不及說再見。",
        pinyin: "Tā shuō zǒu jiù zǒu, wǒmen dōu lái bù jí shuō zài jiàn.",
        translation: "เขาพูดว่าจะไปก็ไปเลย เราพูดลายังไม่ทันเลย",
      },
      {
        sentence: "孩子說哭就哭，說笑就笑。",
        pinyin: "Háizi shuō kū jiù kū, shuō xiào jiù xiào.",
        translation: "เด็กพูดว่าจะร้องก็ร้องเลย พูดว่าจะหัวเราะก็หัวเราะเลย",
      },
    ],
    mnemonic:
      "說X就X — กริยาคำเดียวกันใส่สองที่ — same verb fills both slots. แสดงการกระทำที่เกิดทันทีไม่ทันคิด — instantaneous, no warning. คล้าย English 'just like that'",
    note: "Same verb fills both blanks (e.g. 說走就走, 說哭就哭).",
  },
];

// ─── Vocabulary mnemonics — written as character-breakdown memory aids ────────
// Linguistic teaching aids written here from scratch (originally authored).
const VOCAB_MNEMONICS: Record<string, { mnemonic: string; usageNote?: string }> = {
  "開學": {
    mnemonic: "開 (open) + 學 (study) → '開啟學習' — opening up study = school starts",
  },
  "旁聽": {
    mnemonic: "旁 (beside) + 聽 (listen) → 'listening from the side' = auditing a class",
    usageNote: "ลงเรียนแบบไม่รับหน่วยกิต — no credit, just attending to listen",
  },
  "熬夜": {
    mnemonic: "熬 (endure) + 夜 (night) → 'enduring the night' = staying up late",
    usageNote: "可分動詞 V-sep: 熬一個夜 (stay up one whole night)",
  },
  "用功": {
    mnemonic: "用 (use) + 功 (effort) → 'applying effort' = diligent / hardworking",
  },
  "羨慕": {
    mnemonic: "羨 = 羊 (lamb) + 次 (times) — wanting again like a lamb wants more grass = envy",
  },
  "恐怕": {
    mnemonic: "恐 (fear) + 怕 (afraid) → double-fear = strong negative prediction",
  },
  "遲到": {
    mnemonic: "遲 (late) + 到 (arrive) → 'arrive late' — literally what it says",
  },
  "報告": {
    mnemonic: "報 (inform) + 告 (tell) → 'tell + inform' = report or presentation",
  },
  "壓力": {
    mnemonic: "壓 (press down) + 力 (force) → 'pressing force' = pressure / stress",
  },
  "申請": {
    mnemonic: "申 (state formally) + 請 (please/request) → 'formal request' = to apply",
  },
  "反對": {
    mnemonic: "反 (opposite/reverse) + 對 (correct) → 'opposite of correct' = oppose",
    usageNote: "Vst — takes an object: 反對 + something",
  },
  "擔心": {
    mnemonic: "擔 (carry/bear) + 心 (heart) → 'heart carrying a burden' = worry",
  },
  "個性": {
    mnemonic: "個 (individual) + 性 (nature) → 'individual nature' = personality",
  },
  "痛苦": {
    mnemonic: "痛 (hurt) + 苦 (bitter) → 'hurt + bitter' = painful, suffering",
  },
  "差一點": {
    mnemonic: "差 (short by) + 一點 (a bit) → 'short by just a bit' = almost (didn't happen)",
    usageNote: "อย่าสับสนกับ 差不多 (about, close to). 差一點 = เกือบ; 差不多 = ประมาณ",
  },
};

// ─── Update Grammar lesson ───────────────────────────────────────────────────
async function updateGrammarLesson() {
  const lesson = await db.lesson.findFirst({
    where: { code: "MS-C1-GRAMMAR" },
    select: { id: true },
  });
  if (!lesson) {
    console.log("⏭  MS-C1-GRAMMAR not found, skipping");
    return;
  }
  await db.lesson.update({
    where: { id: lesson.id },
    data: {
      content: {
        type: "vocabulary-list",
        heading: "第一課 · 語法 (3 個例句 + 記憶法)",
        items: GRAMMAR.map((g) => ({
          hanzi: g.hanzi,
          pinyin: g.pinyin,
          translations: g.translations,
          examples: g.examples,
          mnemonic: g.mnemonic,
          note: g.note,
        })),
      },
    },
  });
  console.log(
    `  ✅ MS-C1-GRAMMAR enriched: ${GRAMMAR.length} patterns × 3 examples + mnemonics`,
  );
}

// ─── Update D1 Vocab lesson with mnemonics for selected words ─────────────────
async function enrichD1VocabMnemonics() {
  const lesson = await db.lesson.findFirst({
    where: { code: "MS-C1-D1-VOCAB" },
    select: { id: true, content: true },
  });
  if (!lesson) {
    console.log("⏭  MS-C1-D1-VOCAB not found, skipping");
    return;
  }
  const content = lesson.content as {
    type?: string;
    heading?: string;
    items?: Array<{
      hanzi: string;
      pinyin?: string;
      translations?: Record<string, string>;
      note?: string;
    }>;
  } | null;
  if (!content?.items) {
    console.log("⏭  D1 has no items, skipping");
    return;
  }

  const enrichedItems = content.items.map((item) => {
    const memo = VOCAB_MNEMONICS[item.hanzi];
    if (!memo) return item;
    return {
      ...item,
      mnemonic: memo.mnemonic,
      ...(memo.usageNote ? { usageNote: memo.usageNote } : {}),
    };
  });

  await db.lesson.update({
    where: { id: lesson.id },
    data: {
      content: { ...content, items: enrichedItems },
    },
  });
  const count = enrichedItems.filter((i) => "mnemonic" in i).length;
  console.log(`  ✅ MS-C1-D1-VOCAB: added mnemonics to ${count} of ${enrichedItems.length} words`);
}

async function main() {
  console.log("=== Enriching Chapter 1 with examples + mnemonics ===\n");
  await updateGrammarLesson();
  await enrichD1VocabMnemonics();
  console.log("\n🎉 Done");
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
