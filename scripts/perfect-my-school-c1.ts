/**
 * "Perfect" MY-SCHOOL Chapter 1:
 *   1. Restructure to 5-lesson pattern matching Chapter 3:
 *        0. MS-C1-DIALOG-1   (new — placeholder for dialog text)
 *        1. MS-C1-D1-VOCAB   (Vocab 1, 35 entries)
 *        2. MS-C1-READING    (existing)
 *        3. MS-C1-D2-VOCAB   (Vocab 2, 21 entries)
 *        4. MS-C1-GRAMMAR    (existing)
 *   2. Add an example sentence to every word that doesn't already have one
 *      (preserving existing examples). All sentences originally written here.
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

interface Ex { sentence: string; pinyin: string; translation: string }

// Examples for D1 words that still need them (all originally written)
const D1_EXAMPLES: Record<string, Ex> = {
  "安德思":   { sentence: "他叫安德思,從宏都拉斯來。",   pinyin: "Tā jiào Āndésī, cóng Hóngdūlāsī lái.",  translation: "เขาชื่ออันเดสเซ มาจากฮอนดูรัส" },
  "羅珊蒂":   { sentence: "羅珊蒂是我的同學。",          pinyin: "Luó Shāndì shì wǒ de tóngxué.",         translation: "หลัวซานตี้เป็นเพื่อนร่วมชั้นของฉัน" },
  "何雅婷":   { sentence: "何雅婷在台灣念書。",          pinyin: "Hé Yǎtíng zài Táiwān niànshū.",         translation: "เหอหยาถิงเรียนหนังสือที่ไต้หวัน" },
  "班":       { sentence: "我們班有三十個學生。",        pinyin: "Wǒmen bān yǒu sānshí ge xuéshēng.",     translation: "ห้องของเรามีนักเรียน 30 คน" },
  "新生":     { sentence: "我是這學期的新生。",          pinyin: "Wǒ shì zhè xuéqī de xīnshēng.",         translation: "ฉันเป็นนักศึกษาใหม่ของเทอมนี้" },
  "嚴":       { sentence: "這個老師很嚴。",              pinyin: "Zhège lǎoshī hěn yán.",                  translation: "ครูคนนี้เคร่งครัดมาก" },
  "口試":     { sentence: "明天有口試。",                pinyin: "Míngtiān yǒu kǒushì.",                   translation: "พรุ่งนี้มีสอบปากเปล่า" },
  "筆試":     { sentence: "筆試比口試簡單。",            pinyin: "Bǐshì bǐ kǒushì jiǎndān.",               translation: "สอบข้อเขียนง่ายกว่าสอบปากเปล่า" },
  "以外":     { sentence: "除了我以外,大家都來了。",     pinyin: "Chúle wǒ yǐwài, dàjiā dōu lái le.",      translation: "นอกจากฉัน ทุกคนมาแล้ว" },
  "口頭":     { sentence: "請給我口頭報告。",            pinyin: "Qǐng gěi wǒ kǒutóu bàogào.",             translation: "กรุณานำเสนอด้วยปากเปล่า" },
  "報告":     { sentence: "我下週要交報告。",            pinyin: "Wǒ xià zhōu yào jiāo bàogào.",           translation: "อาทิตย์หน้าฉันต้องส่งรายงาน" },
  "說明":     { sentence: "請看使用說明。",              pinyin: "Qǐng kàn shǐyòng shuōmíng.",             translation: "กรุณาดูคู่มือการใช้งาน" },
  "清楚":     { sentence: "老師說得很清楚。",            pinyin: "Lǎoshī shuō de hěn qīngchǔ.",            translation: "ครูพูดชัดเจนมาก" },
  "位子":     { sentence: "這個位子有人嗎?",             pinyin: "Zhège wèizi yǒu rén ma?",                translation: "ที่นั่งนี้มีคนนั่งไหม?" },
  "旁聽":     { sentence: "我去旁聽他的課。",            pinyin: "Wǒ qù pángtīng tā de kè.",               translation: "ฉันไปนั่ง audit คาบเรียนของเขา" },
  "分":       { sentence: "考試成績是 90 分。",          pinyin: "Kǎoshì chéngjī shì jiǔshí fēn.",         translation: "คะแนนสอบ 90 คะแนน" },
  "羨慕":     { sentence: "我很羨慕你的工作。",          pinyin: "Wǒ hěn xiànmù nǐ de gōngzuò.",           translation: "ฉันอิจฉางานของคุณมาก" },
  "休學":     { sentence: "他休學一年回家。",            pinyin: "Tā xiūxué yì nián huíjiā.",              translation: "เขาพักเรียนหนึ่งปีกลับบ้าน" },
  "行":       { sentence: "這個方法行不行?",             pinyin: "Zhège fāngfǎ xíng bù xíng?",             translation: "วิธีนี้ใช้ได้ไหม?" },
  "轉":       { sentence: "她想轉到別的系。",            pinyin: "Tā xiǎng zhuǎn dào bié de xì.",          translation: "เธออยากย้ายไปคณะอื่น" },
  "原來":     { sentence: "原來你也在這裡!",             pinyin: "Yuánlái nǐ yě zài zhèlǐ!",               translation: "ที่แท้คุณก็อยู่ที่นี่!" },
  "會計":     { sentence: "她念會計系。",                pinyin: "Tā niàn kuàijì xì.",                      translation: "เธอเรียนคณะบัญชี" },
  "熱門":     { sentence: "電腦是熱門科系。",            pinyin: "Diànnǎo shì rèmén kēxì.",                translation: "คอมพิวเตอร์เป็นภาควิชายอดนิยม" },
  "當":       { sentence: "他這科被當了。",              pinyin: "Tā zhè kē bèi dàng le.",                  translation: "เขาตกวิชานี้แล้ว" },
  "恐怕":     { sentence: "恐怕來不及了。",              pinyin: "Kǒngpà láibují le.",                      translation: "เกรงว่าจะไม่ทัน" },
  "口才":     { sentence: "他的口才很好。",              pinyin: "Tā de kǒucái hěn hǎo.",                  translation: "เขาพูดเก่งมาก" },
  "事":       { sentence: "我有事找你。",                pinyin: "Wǒ yǒu shì zhǎo nǐ.",                    translation: "ฉันมีเรื่องจะคุยกับคุณ" },
  "遲到":     { sentence: "他常常遲到。",                pinyin: "Tā chángcháng chídào.",                   translation: "เขามาสายบ่อย" },
  "差一點":   { sentence: "我差一點睡著了。",            pinyin: "Wǒ chà yì diǎn shuìzháo le.",            translation: "ฉันเกือบหลับ" },
  "這樣下去": { sentence: "這樣下去不行。",              pinyin: "Zhèyàng xiàqù bù xíng.",                  translation: "ถ้าเป็นแบบนี้ต่อไปไม่ได้" },
  "沒辦法":   { sentence: "我也沒辦法。",                pinyin: "Wǒ yě méi bànfǎ.",                       translation: "ฉันก็ทำอะไรไม่ได้" },
};

const D2_EXAMPLES: Record<string, Ex> = {
  "獨生女":   { sentence: "她是家裡的獨生女。",          pinyin: "Tā shì jiā lǐ de dúshēngnǚ.",            translation: "เธอเป็นลูกสาวคนเดียวของบ้าน" },
  "私立":     { sentence: "我念私立學校。",              pinyin: "Wǒ niàn sīlì xuéxiào.",                  translation: "ฉันเรียนโรงเรียนเอกชน" },
  "理想":     { sentence: "這是理想的工作。",            pinyin: "Zhè shì lǐxiǎng de gōngzuò.",            translation: "นี่คืองานในอุดมคติ" },
  "合":       { sentence: "我跟他不合。",                pinyin: "Wǒ gēn tā bù hé.",                       translation: "ฉันกับเขาเข้ากันไม่ได้" },
  "科系":     { sentence: "你念哪個科系?",               pinyin: "Nǐ niàn nǎge kēxì?",                     translation: "คุณเรียนคณะอะไร?" },
  "不管":     { sentence: "不管下不下雨,我都要去。",     pinyin: "Bùguǎn xià bù xià yǔ, wǒ dōu yào qù.",   translation: "ไม่ว่าฝนจะตกหรือไม่ ฉันก็จะไป" },
  "填":       { sentence: "請填這張表。",                pinyin: "Qǐng tián zhè zhāng biǎo.",              translation: "กรุณากรอกแบบฟอร์มนี้" },
  "表":       { sentence: "這是申請表。",                pinyin: "Zhè shì shēnqǐng biǎo.",                  translation: "นี่คือใบสมัคร" },
  "辦":       { sentence: "我要去辦事。",                pinyin: "Wǒ yào qù bànshì.",                      translation: "ฉันต้องไปจัดการเรื่อง" },
  "手續":     { sentence: "辦手續很麻煩。",              pinyin: "Bàn shǒuxù hěn máfan.",                   translation: "ดำเนินการเอกสารยุ่งยากมาก" },
  "成績單":   { sentence: "請給我成績單。",              pinyin: "Qǐng gěi wǒ chéngjī dān.",                translation: "กรุณาให้ใบเกรดฉัน" },
  "考上":     { sentence: "她考上了大學。",              pinyin: "Tā kǎo shàng le dàxué.",                  translation: "เธอสอบติดมหาวิทยาลัย" },
  "推薦信":   { sentence: "教授寫了推薦信。",            pinyin: "Jiàoshòu xiě le tuījiàn xìn.",            translation: "อาจารย์เขียนจดหมายแนะนำให้แล้ว" },
};

interface Item {
  hanzi: string;
  pinyin?: string;
  translations?: Record<string, string>;
  note?: string;
  example?: { sentence?: string; sentencePinyin?: string; sentenceTh?: string };
  examples?: Array<{ sentence: string; pinyin?: string; translation?: string }>;
  mnemonic?: string;
  usageNote?: string;
}

async function fillMissingExamples(lessonCode: string, exMap: Record<string, Ex>) {
  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, content: true },
  });
  if (!lesson) return 0;
  const content = lesson.content as { type?: string; heading?: string; items?: Item[] } | null;
  if (!content?.items) return 0;

  let filled = 0;
  const updated: Item[] = content.items.map((item) => {
    // Already has examples or single example? leave alone
    if ((item.examples && item.examples.length > 0) || item.example?.sentence) {
      return item;
    }
    const ex = exMap[item.hanzi];
    if (!ex) return item;
    filled++;
    return { ...item, examples: [ex] };
  });

  await db.lesson.update({
    where: { id: lesson.id },
    data: { content: { ...content, items: updated } as object },
  });
  console.log(`  ✅ ${lessonCode}: filled ${filled} missing examples`);
  return filled;
}

async function reorderAndAddDialogStub() {
  // Find Chapter 1 stage
  const stage = await db.stage.findFirst({
    where: { course: { code: "MY-SCHOOL" }, code: "MS-C1" },
    select: { id: true },
  });
  if (!stage) {
    console.error("❌ MS-C1 stage not found");
    return;
  }

  // Pattern: Dialog 1 (0) → Vocab 1 (1) → Reading (2) → Vocab 2 (3) → Grammar (4)
  const updates = [
    { code: "MS-C1-D1-VOCAB", orderIndex: 1 }, // Vocab 1
    { code: "MS-C1-READING",  orderIndex: 2 }, // Reading
    { code: "MS-C1-D2-VOCAB", orderIndex: 3 }, // Vocab 2
    { code: "MS-C1-GRAMMAR",  orderIndex: 4 }, // Grammar
  ];
  for (const u of updates) {
    const lesson = await db.lesson.findFirst({
      where: { stageId: stage.id, code: u.code },
      select: { id: true },
    });
    if (lesson) {
      await db.lesson.update({
        where: { id: lesson.id },
        data: { orderIndex: u.orderIndex },
      });
      console.log(`  ✅ ${u.code} → orderIndex ${u.orderIndex}`);
    }
  }

  // Add Dialog 1 stub at orderIndex 0
  await db.lesson.upsert({
    where: { stageId_code: { stageId: stage.id, code: "MS-C1-DIALOG-1" } },
    create: {
      stageId: stage.id,
      code: "MS-C1-DIALOG-1",
      title: "對話一",
      titleI18n: { en: "Dialogue 1", th: "บทสนทนา 1" },
      description: "เนื้อหารอนำเข้าจาก PDF (run populate-reading.ts)",
      type: "VOCAB",
      difficulty: 3,
      orderIndex: 0,
      estimatedMinutes: 12,
      xpReward: 50,
      isPublished: true,
      content: {
        type: "reading-passage",
        title: "對話一",
        titleTr: "บทสนทนา 1",
        paragraphs: [],
      },
    },
    update: {
      orderIndex: 0,
      isPublished: true,
    },
  });
  console.log(`  ✅ MS-C1-DIALOG-1 → orderIndex 0 (placeholder)`);
}

async function main() {
  console.log("=== Perfecting MY-SCHOOL Chapter 1 ===\n");

  console.log("📐 Reordering to 5-lesson pattern + adding Dialog stub\n");
  await reorderAndAddDialogStub();
  console.log();

  console.log("📝 Filling missing examples (D1 + D2)\n");
  const d1 = await fillMissingExamples("MS-C1-D1-VOCAB", D1_EXAMPLES);
  const d2 = await fillMissingExamples("MS-C1-D2-VOCAB", D2_EXAMPLES);
  console.log(`\n🎉 Filled ${d1 + d2} examples (D1: ${d1}, D2: ${d2})`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
