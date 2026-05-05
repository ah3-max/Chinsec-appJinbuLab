/**
 * Broader enrichment for MY-SCHOOL Chapter 1.
 *  - Mnemonic memory hints for ~35 vocab items across D1 + D2 (originally written)
 *  - Multi-example sentences for ~12 abstract/high-value words (originally written)
 *
 * Existing single PDF example per word is kept as the first example;
 * additional 1-2 examples are authored from scratch here.
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

interface Enrichment {
  mnemonic?: string;
  usageNote?: string;
  /** Additional example sentences (originally written here) */
  extraExamples?: Array<{ sentence: string; pinyin: string; translation: string }>;
}

// ─── D1 enrichments — character-breakdown mnemonics + extra examples ─────────
const D1_ENRICHMENTS: Record<string, Enrichment> = {
  // (Already had these from prior batch — re-stating so update is idempotent)
  "開學":   { mnemonic: "開 (open) + 學 (study) → '開啟學習' = school starts" },
  "旁聽":   { mnemonic: "旁 (beside) + 聽 (listen) → 'listening from the side' = audit a class", usageNote: "ลงเรียนแบบไม่รับหน่วยกิต — no credit, attend to listen only" },
  "熬夜":   { mnemonic: "熬 (endure) + 夜 (night) → 'enduring the night' = stay up late", usageNote: "可分動詞 V-sep: 熬一個夜 = stay up one whole night" },
  "用功":   { mnemonic: "用 (use) + 功 (effort) → 'applying effort' = diligent / hardworking" },
  "羨慕":   { mnemonic: "羨 contains 羊 (lamb) + 次 — wanting again like a lamb wants more grass" },
  "恐怕":   { mnemonic: "恐 (fear) + 怕 (afraid) → double-fear = strong negative prediction" },
  "遲到":   { mnemonic: "遲 (late) + 到 (arrive) → literally 'arrive late'" },
  "報告":   { mnemonic: "報 (inform) + 告 (tell) → 'tell + inform' = report or presentation" },
  "壓力":   { mnemonic: "壓 (press down) + 力 (force) → 'pressing force' = pressure / stress" },
  "差一點": { mnemonic: "差 (short by) + 一點 (a bit) → 'short by just a bit' = almost (didn't happen)", usageNote: "อย่าสับสนกับ 差不多 (about, close to). 差一點 = เกือบ; 差不多 = ประมาณ" },

  // — New batch —
  "班":     { mnemonic: "班 = 王 + 刂 + 王 — picture two kings divided into class groups" },
  "新生":   { mnemonic: "新 (new) + 生 (born/student) → 'newly-born student' = freshman / new student" },
  "嚴":     { mnemonic: "嚴 has 口 (mouth) repeated — strict teacher gives many orders" },
  "口試":   { mnemonic: "口 (mouth) + 試 (test) → 'mouth test' = oral exam" },
  "筆試":   { mnemonic: "筆 (pen) + 試 (test) → 'pen test' = written exam" },
  "以外":   { mnemonic: "以 (use as) + 外 (outside) → 'outside of/besides X' = except for", usageNote: "Often pairs with 除了…以外 (besides, except for)" },
  "口頭":   { mnemonic: "口 (mouth) + 頭 (head) → 'mouth side / verbal' = oral, by mouth" },
  "說明":   { mnemonic: "說 (say) + 明 (clear) → 'say clearly' = explanation, instructions" },
  "清楚":   { mnemonic: "清 (clear water) + 楚 (clear/Chu state) → both clear → very clear, understandable" },
  "位子":   { mnemonic: "位 (position) + 子 (suffix) → 'a position-thing' = seat, place" },
  "分":     { mnemonic: "分 = 八 (split) + 刀 (knife) — splitting things into points/scores" },
  "休學":   { mnemonic: "休 (rest) + 學 (study) → 'resting from study' = take a leave of absence", usageNote: "Vp-sep: 休一年的學 = take one year's leave" },
  "行":     { mnemonic: "行 here ≠ walk; means 'OK / will do'. Like '可以' but shorter & casual" },
  "轉":     { mnemonic: "轉 has 車 (vehicle) — 'turning the wheels' to a new direction = transfer" },
  "原來":   { mnemonic: "原 (origin) + 來 (come) → '(it turns out it) came originally...' = ah, so that's it!", usageNote: "Two meanings: (1) originally (2) ah, so that's it (realization)" },
  "會計":   { mnemonic: "會 (gather) + 計 (calculate) → 'gather + calculate' = accounting / accountant" },
  "熱門":   { mnemonic: "熱 (hot) + 門 (door) → 'hot door' (everyone wants in) = popular, trending" },
  "當":     { mnemonic: "當 here = fail (a course) — slang. Imagine a heavy gong (當噹) of failure" },
  "口才":   { mnemonic: "口 (mouth) + 才 (talent) → 'mouth talent' = eloquence, way with words" },
  "事":     { mnemonic: "事 = matter, affair — common counter for events: 一件事" },
  "這樣下去": { mnemonic: "這樣 (like this) + 下去 (continue) → 'continuing like this' = at this rate, if this continues" },
  "沒辦法":  { mnemonic: "沒 (no) + 辦法 (method) → 'no method' = no way / can't be helped" },

  // — Names — short identifiers, no mnemonic needed —
};

// ─── D2 enrichments ──────────────────────────────────────────────────────────
const D2_ENRICHMENTS: Record<string, Enrichment> = {
  "獨生女":  { mnemonic: "獨 (alone) + 生 (born) + 女 (daughter) → 'alone-born daughter' = only daughter (no siblings)" },
  "私立":   { mnemonic: "私 (private) + 立 (established) → 'privately established' = private (school)", usageNote: "對 = 公立 (public)" },
  "理想":   { mnemonic: "理 (reason) + 想 (think) → 'reasoned thinking' = ideal, perfect" },
  "合":     { mnemonic: "合 = 人 + 一 + 口 — many mouths in agreement → fit, match, suit" },
  "痛苦":   { mnemonic: "痛 (hurt) + 苦 (bitter) → 'hurt + bitter' = painful, suffering" },
  "科系":   { mnemonic: "科 (subject) + 系 (department) → 'subject department' = academic major" },
  "放棄":   { mnemonic: "放 (release) + 棄 (abandon) → 'release + abandon' = give up entirely" },
  "不管":   { mnemonic: "不 (not) + 管 (control/care) → 'don't control' = regardless of, no matter", usageNote: "Conj — pairs with 都/也: 不管…都/也…" },
  "反對":   { mnemonic: "反 (opposite) + 對 (correct) → 'opposite of agreeing' = oppose", usageNote: "Vst — takes object: 反對 + something" },
  "個性":   { mnemonic: "個 (individual) + 性 (nature) → 'individual nature' = personality" },
  "活潑":   { mnemonic: "活 (alive) + 潑 (splash water) → 'splashing with life' = lively, vivacious" },
  "外語":   { mnemonic: "外 (outside) + 語 (language) → 'outside language' = foreign language" },
  "擔心":   { mnemonic: "擔 (carry burden) + 心 (heart) → 'heart carrying burden' = worry" },
  "填":     { mnemonic: "填 = 土 + 真 — filling earth into a hole; for forms = fill in blanks" },
  "表":     { mnemonic: "表 = 衣 (clothes) + 毛 — surface display; here = form, chart" },
  "辦":     { mnemonic: "辦 has 力 (force) on both sides — vigorous handling = take care of, process" },
  "手續":   { mnemonic: "手 (hand) + 續 (continue) → 'hand-continuing' = sequential procedure" },
  "申請":   { mnemonic: "申 (formally state) + 請 (please request) → 'formal polite request' = to apply" },
  "成績單":  { mnemonic: "成績 (achievement) + 單 (sheet) → 'achievement sheet' = transcript" },
  "考上":   { mnemonic: "考 (take exam) + 上 (succeed/up) → 'exam-up' = get admitted by exam" },
  "推薦信":  { mnemonic: "推薦 (recommend) + 信 (letter) → 'recommendation letter' — literal" },
};

// ─── Extra examples for ~12 abstract / high-value words ──────────────────────
// Each entry adds 2 new example sentences (written from scratch here),
// supplementing the 1 PDF example already on the card → 3 total per word.
const EXTRA_EXAMPLES: Record<
  string,
  Array<{ sentence: string; pinyin: string; translation: string }>
> = {
  "開學": [
    { sentence: "九月一號開學，你準備好了嗎？", pinyin: "Jiǔ yuè yī hào kāixué, nǐ zhǔnbèi hǎo le ma?", translation: "เปิดเทอม 1 กันยา คุณพร้อมหรือยัง?" },
    { sentence: "開學以後，學校的人很多。", pinyin: "Kāixué yǐhòu, xuéxiào de rén hěn duō.", translation: "หลังเปิดเทอม คนในโรงเรียนเยอะมาก" },
  ],
  "壓力": [
    { sentence: "工作壓力大的時候，要好好休息。", pinyin: "Gōngzuò yālì dà de shíhou, yào hǎohǎo xiūxí.", translation: "เวลาเครียดจากงานมาก ต้องพักผ่อนให้ดี" },
    { sentence: "他承受不了這麼大的壓力。", pinyin: "Tā chéngshòu bù liǎo zhème dà de yālì.", translation: "เขาทนความกดดันมากขนาดนี้ไม่ไหว" },
  ],
  "熬夜": [
    { sentence: "熬夜對皮膚不好。", pinyin: "Áoyè duì pífū bù hǎo.", translation: "การอดนอนไม่ดีต่อผิวหน้า" },
    { sentence: "明天考試，今天得熬夜了。", pinyin: "Míngtiān kǎoshì, jīntiān děi áoyè le.", translation: "พรุ่งนี้สอบ วันนี้ต้องอดนอนแล้ว" },
  ],
  "用功": [
    { sentence: "她最用功了，每天都在念書。", pinyin: "Tā zuì yònggōng le, měitiān dōu zài niànshū.", translation: "เธอขยันที่สุด อ่านหนังสือทุกวัน" },
    { sentence: "你要再用功一點，下次考試才能進步。", pinyin: "Nǐ yào zài yònggōng yìdiǎn, xià cì kǎoshì cái néng jìnbù.", translation: "ต้องขยันอีกหน่อย ถึงจะสอบดีขึ้นครั้งหน้า" },
  ],
  "申請": [
    { sentence: "我想申請出國留學。", pinyin: "Wǒ xiǎng shēnqǐng chūguó liúxué.", translation: "ฉันอยากสมัครไปเรียนต่อต่างประเทศ" },
    { sentence: "申請獎學金需要哪些文件？", pinyin: "Shēnqǐng jiǎngxuéjīn xūyào nǎxiē wénjiàn?", translation: "การสมัครทุนต้องใช้เอกสารอะไรบ้าง?" },
  ],
  "反對": [
    { sentence: "媽媽反對我半夜出門。", pinyin: "Māma fǎnduì wǒ bànyè chūmén.", translation: "แม่ไม่ให้ออกจากบ้านตอนกลางคืน" },
    { sentence: "他的家人都反對這個決定。", pinyin: "Tā de jiārén dōu fǎnduì zhège juédìng.", translation: "ครอบครัวเขาคัดค้านการตัดสินใจนี้กันหมด" },
  ],
  "擔心": [
    { sentence: "別擔心，一切都會好的。", pinyin: "Bié dānxīn, yíqiè dōu huì hǎo de.", translation: "ไม่ต้องกังวล ทุกอย่างจะดีขึ้น" },
    { sentence: "媽媽很擔心我的健康。", pinyin: "Māma hěn dānxīn wǒ de jiànkāng.", translation: "แม่ห่วงเรื่องสุขภาพของฉันมาก" },
  ],
  "個性": [
    { sentence: "他的個性很開朗。", pinyin: "Tā de gèxìng hěn kāilǎng.", translation: "บุคลิกของเขาร่าเริงมาก" },
    { sentence: "兩個人的個性不合，所以分手了。", pinyin: "Liǎng ge rén de gèxìng bù hé, suǒyǐ fēnshǒu le.", translation: "บุคลิกของสองคนเข้ากันไม่ได้ จึงเลิกกัน" },
  ],
  "活潑": [
    { sentence: "這個小女孩很活潑可愛。", pinyin: "Zhège xiǎo nǚhái hěn huópō kě'ài.", translation: "เด็กผู้หญิงคนนี้ร่าเริงน่ารักมาก" },
    { sentence: "他在朋友面前很活潑，但見到陌生人就害羞。", pinyin: "Tā zài péngyǒu miànqián hěn huópō, dàn jiàndào mòshēng rén jiù hàixiū.", translation: "เขาร่าเริงเวลาอยู่กับเพื่อน แต่เจอคนแปลกหน้าจะเขินอาย" },
  ],
  "外語": [
    { sentence: "學外語要多聽多說。", pinyin: "Xué wàiyǔ yào duō tīng duō shuō.", translation: "การเรียนภาษาต่างประเทศต้องฟังเยอะพูดเยอะ" },
    { sentence: "她會三種外語：英文、日文、泰文。", pinyin: "Tā huì sān zhǒng wàiyǔ: yīngwén, rìwén, tàiwén.", translation: "เธอพูดภาษาต่างประเทศได้ 3 ภาษา: อังกฤษ ญี่ปุ่น ไทย" },
  ],
  "痛苦": [
    { sentence: "失去家人是很痛苦的事。", pinyin: "Shīqù jiārén shì hěn tòngkǔ de shì.", translation: "การสูญเสียคนในครอบครัวเป็นเรื่องเจ็บปวดมาก" },
    { sentence: "他做這個工作做得很痛苦。", pinyin: "Tā zuò zhège gōngzuò zuò de hěn tòngkǔ.", translation: "เขาทำงานนี้แล้วรู้สึกทุกข์ทรมานมาก" },
  ],
  "放棄": [
    { sentence: "別放棄你的夢想。", pinyin: "Bié fàngqì nǐ de mèngxiǎng.", translation: "อย่ายอมแพ้ความฝันของคุณ" },
    { sentence: "他從來不放棄。", pinyin: "Tā cónglái bù fàngqì.", translation: "เขาไม่เคยยอมแพ้เลย" },
  ],
};

interface VocabItem {
  hanzi: string;
  pinyin?: string;
  translations?: Record<string, string>;
  note?: string;
  example?: { sentence?: string; sentencePinyin?: string; sentenceTh?: string };
  examples?: Array<{ sentence: string; pinyin?: string; translation?: string }>;
  mnemonic?: string;
  usageNote?: string;
}

async function enrichLesson(
  lessonCode: string,
  enrichMap: Record<string, Enrichment>,
) {
  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, content: true },
  });
  if (!lesson) {
    console.log(`⏭  ${lessonCode} not found, skipping`);
    return { mnemonics: 0, examples: 0 };
  }
  const content = lesson.content as { type?: string; heading?: string; items?: VocabItem[] } | null;
  if (!content?.items) {
    console.log(`⏭  ${lessonCode}: no items`);
    return { mnemonics: 0, examples: 0 };
  }

  let mnemonicCount = 0;
  let exampleCount = 0;

  const enrichedItems: VocabItem[] = content.items.map((item) => {
    const en = enrichMap[item.hanzi];
    const extra = EXTRA_EXAMPLES[item.hanzi];

    let updated = { ...item };

    if (en?.mnemonic) {
      updated.mnemonic = en.mnemonic;
      mnemonicCount++;
    }
    if (en?.usageNote) {
      updated.usageNote = en.usageNote;
    }

    // Build the examples array: keep existing first example (from PDF), then append the new ones
    if (extra && extra.length > 0) {
      const firstFromPdf =
        item.example?.sentence
          ? [{
              sentence: item.example.sentence,
              pinyin: item.example.sentencePinyin,
              translation: item.example.sentenceTh,
            }]
          : [];
      updated.examples = [...firstFromPdf, ...extra];
      exampleCount += extra.length;
    }

    return updated;
  });

  await db.lesson.update({
    where: { id: lesson.id },
    data: { content: { ...content, items: enrichedItems } as object },
  });

  console.log(`  ✅ ${lessonCode}: +${mnemonicCount} mnemonics, +${exampleCount} extra examples`);
  return { mnemonics: mnemonicCount, examples: exampleCount };
}

async function main() {
  console.log("=== Broad enrichment of MY-SCHOOL Chapter 1 ===\n");
  const r1 = await enrichLesson("MS-C1-D1-VOCAB", D1_ENRICHMENTS);
  const r2 = await enrichLesson("MS-C1-D2-VOCAB", D2_ENRICHMENTS);
  const totalMn = r1.mnemonics + r2.mnemonics;
  const totalEx = r1.examples + r2.examples;
  console.log(`\n🎉 Total: ${totalMn} mnemonics, ${totalEx} extra examples added`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
