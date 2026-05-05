/**
 * Add 2 example sentences to every word across all 3 A2 stages
 * (originally written here — eldercare-context).
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

const EXAMPLES: Record<string, Ex[]> = {
  // L2-S01 詢問身體狀況
  "舒服":     [{ sentence: "今天很舒服。",         pinyin: "Jīntiān hěn shūfu.",            translation: "วันนี้สบายดี" },           { sentence: "您舒服嗎?",       pinyin: "Nín shūfu ma?",            translation: "คุณสบายดีไหม?" }],
  "不舒服":   [{ sentence: "我有點不舒服。",       pinyin: "Wǒ yǒu diǎn bù shūfu.",         translation: "ฉันรู้สึกไม่สบายนิดหน่อย" }, { sentence: "阿公哪裡不舒服?",   pinyin: "Ā gōng nǎlǐ bù shūfu?",   translation: "คุณตาไม่สบายตรงไหน?" }],
  "痛":       [{ sentence: "我的腳很痛。",          pinyin: "Wǒ de jiǎo hěn tòng.",          translation: "เท้าฉันเจ็บมาก" },         { sentence: "哪裡痛?",         pinyin: "Nǎlǐ tòng?",               translation: "เจ็บตรงไหน?" }],
  "頭痛":     [{ sentence: "我頭痛。",              pinyin: "Wǒ tóutòng.",                   translation: "ฉันปวดหัว" },              { sentence: "頭痛的時候要休息。", pinyin: "Tóutòng de shíhou yào xiūxí.", translation: "เวลาปวดหัวต้องพักผ่อน" }],
  "肚子痛":   [{ sentence: "我肚子痛。",            pinyin: "Wǒ dùzi tòng.",                 translation: "ฉันปวดท้อง" },             { sentence: "他吃壞了肚子,肚子痛。", pinyin: "Tā chī huài le dùzi, dùzi tòng.", translation: "เขากินผิดท้อง เลยปวดท้อง" }],
  "感冒":     [{ sentence: "我感冒了。",            pinyin: "Wǒ gǎnmào le.",                 translation: "ฉันเป็นหวัดแล้ว" },        { sentence: "感冒要多喝水。",   pinyin: "Gǎnmào yào duō hē shuǐ.",   translation: "เป็นหวัดต้องดื่มน้ำเยอะๆ" }],
  "發燒":     [{ sentence: "他發燒了。",            pinyin: "Tā fāshāo le.",                 translation: "เขาเป็นไข้" },             { sentence: "孩子發燒怎麼辦?",   pinyin: "Háizi fāshāo zěnme bàn?",  translation: "ลูกเป็นไข้ทำยังไงดี?" }],
  "咳嗽":     [{ sentence: "他一直咳嗽。",          pinyin: "Tā yìzhí késou.",               translation: "เขาไออยู่ตลอด" },          { sentence: "咳嗽要看醫生。",   pinyin: "Késou yào kàn yīshēng.",    translation: "ไอต้องไปหาหมอ" }],
  "累":       [{ sentence: "我很累。",              pinyin: "Wǒ hěn lèi.",                   translation: "ฉันเหนื่อยมาก" },          { sentence: "累了就休息。",     pinyin: "Lèi le jiù xiūxí.",        translation: "เหนื่อยแล้วก็พักผ่อน" }],
  "睡不著":   [{ sentence: "我睡不著。",            pinyin: "Wǒ shuì bù zháo.",              translation: "ฉันนอนไม่หลับ" },          { sentence: "她最近睡不著。",   pinyin: "Tā zuìjìn shuì bù zháo.",   translation: "เธอช่วงนี้นอนไม่หลับ" }],

  // L2-S02 簡單醫療術語
  "醫生":     [{ sentence: "我去看醫生。",          pinyin: "Wǒ qù kàn yīshēng.",            translation: "ฉันไปหาหมอ" },             { sentence: "醫生來了。",       pinyin: "Yīshēng lái le.",          translation: "หมอมาแล้ว" }],
  "護士":     [{ sentence: "護士幫我打針。",        pinyin: "Hùshì bāng wǒ dǎzhēn.",         translation: "พยาบาลฉีดยาให้ฉัน" },      { sentence: "護士很親切。",     pinyin: "Hùshì hěn qīnqiè.",        translation: "พยาบาลใจดีมาก" }],
  "醫院":     [{ sentence: "去醫院吧。",            pinyin: "Qù yīyuàn ba.",                 translation: "ไปโรงพยาบาลเถอะ" },         { sentence: "醫院在前面。",     pinyin: "Yīyuàn zài qiánmiàn.",     translation: "โรงพยาบาลอยู่ข้างหน้า" }],
  "診所":     [{ sentence: "附近有診所。",           pinyin: "Fùjìn yǒu zhěnsuǒ.",           translation: "ใกล้ๆ มีคลินิก" },          { sentence: "診所幾點開?",     pinyin: "Zhěnsuǒ jǐ diǎn kāi?",      translation: "คลินิกเปิดกี่โมง?" }],
  "病人":     [{ sentence: "病人需要休息。",        pinyin: "Bìngrén xūyào xiūxí.",          translation: "ผู้ป่วยต้องการพักผ่อน" }, { sentence: "病人在 5 號房。", pinyin: "Bìngrén zài wǔ hào fáng.",   translation: "ผู้ป่วยอยู่ห้อง 5" }],
  "看病":     [{ sentence: "明天看病。",            pinyin: "Míngtiān kànbìng.",             translation: "พรุ่งนี้ไปหาหมอ" },        { sentence: "他去看病了。",     pinyin: "Tā qù kànbìng le.",        translation: "เขาไปหาหมอแล้ว" }],
  "打針":     [{ sentence: "別怕,打針。",           pinyin: "Bié pà, dǎzhēn.",               translation: "ไม่ต้องกลัว ฉีดยา" },      { sentence: "我不喜歡打針。",   pinyin: "Wǒ bù xǐhuān dǎzhēn.",     translation: "ฉันไม่ชอบฉีดยา" }],
  "輪椅":     [{ sentence: "他坐輪椅。",            pinyin: "Tā zuò lúnyǐ.",                 translation: "เขานั่งรถเข็น" },          { sentence: "請推輪椅。",       pinyin: "Qǐng tuī lúnyǐ.",          translation: "เชิญเข็นรถเข็น" }],
  "拐杖":     [{ sentence: "阿公用拐杖。",          pinyin: "Ā gōng yòng guǎizhàng.",        translation: "คุณตาใช้ไม้เท้า" },        { sentence: "拐杖在這裡。",     pinyin: "Guǎizhàng zài zhèlǐ.",     translation: "ไม้เท้าอยู่ตรงนี้" }],
  "急救":     [{ sentence: "需要急救!",              pinyin: "Xūyào jíjiù!",                  translation: "ต้องการปฐมพยาบาล!" },       { sentence: "急救箱在那裡。",   pinyin: "Jíjiù xiāng zài nàlǐ.",    translation: "กล่องยาอยู่ตรงนั้น" }],

  // L2-S03 家屬溝通
  "家屬":     [{ sentence: "家屬來探望。",          pinyin: "Jiāshǔ lái tànwàng.",           translation: "ญาติมาเยี่ยม" },           { sentence: "請通知家屬。",     pinyin: "Qǐng tōngzhī jiāshǔ.",     translation: "กรุณาแจ้งญาติ" }],
  "電話":     [{ sentence: "電話響了。",            pinyin: "Diànhuà xiǎng le.",             translation: "โทรศัพท์ดัง" },             { sentence: "電話號碼是多少?",   pinyin: "Diànhuà hàomǎ shì duōshǎo?", translation: "เบอร์โทรกี่หมายเลข?" }],
  "打電話":   [{ sentence: "我打電話給家屬。",      pinyin: "Wǒ dǎ diànhuà gěi jiāshǔ.",     translation: "ฉันโทรหาญาติ" },           { sentence: "他正在打電話。",   pinyin: "Tā zhèngzài dǎ diànhuà.",  translation: "เขากำลังโทรศัพท์" }],
  "請坐":     [{ sentence: "請坐,我來倒茶。",       pinyin: "Qǐng zuò, wǒ lái dào chá.",     translation: "เชิญนั่ง ฉันจะรินชาให้" },  { sentence: "請坐這邊。",       pinyin: "Qǐng zuò zhè biān.",       translation: "เชิญนั่งทางนี้" }],
  "請等一下": [{ sentence: "請等一下,我去看看。",  pinyin: "Qǐng děng yíxià, wǒ qù kànkan.", translation: "กรุณารอสักครู่ ฉันไปดูก่อน" }, { sentence: "請等一下,馬上來。", pinyin: "Qǐng děng yíxià, mǎshàng lái.", translation: "กรุณารอสักครู่ มาทันที" }],
  "可以":     [{ sentence: "可以進來嗎?",            pinyin: "Kěyǐ jìn lái ma?",              translation: "เข้ามาได้ไหม?" },          { sentence: "當然可以。",       pinyin: "Dāngrán kěyǐ.",            translation: "ได้แน่นอน" }],
  "不可以":   [{ sentence: "現在不可以打擾他。",    pinyin: "Xiànzài bù kěyǐ dǎrǎo tā.",     translation: "ตอนนี้รบกวนเขาไม่ได้" },    { sentence: "這裡不可以抽煙。", pinyin: "Zhèlǐ bù kěyǐ chōuyān.",   translation: "ที่นี่สูบบุหรี่ไม่ได้" }],
  "好嗎":     [{ sentence: "明天再來,好嗎?",         pinyin: "Míngtiān zài lái, hǎo ma?",     translation: "พรุ่งนี้มาอีก ดีไหม?" },     { sentence: "我們去散步好嗎?",   pinyin: "Wǒmen qù sànbù hǎo ma?",   translation: "เราไปเดินเล่นกันไหม?" }],
  "謝謝關心": [{ sentence: "謝謝關心,我很好。",    pinyin: "Xièxie guānxīn, wǒ hěn hǎo.",   translation: "ขอบคุณที่ห่วงใย ฉันสบายดี" }, { sentence: "謝謝您的關心。",   pinyin: "Xièxie nín de guānxīn.",   translation: "ขอบคุณที่ห่วงใย" }],
  "別擔心":   [{ sentence: "別擔心,他沒事了。",    pinyin: "Bié dānxīn, tā méi shì le.",    translation: "ไม่ต้องกังวล เขาไม่เป็นไรแล้ว" }, { sentence: "別擔心,慢慢來。", pinyin: "Bié dānxīn, mànman lái.",    translation: "ไม่ต้องกังวล ค่อยๆ ทำ" }],
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

async function enrichLesson(lessonCode: string) {
  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, content: true },
  });
  if (!lesson) return 0;
  const content = lesson.content as { type?: string; heading?: string; items?: Item[] } | null;
  if (!content?.items) return 0;

  let added = 0;
  const updated: Item[] = content.items.map((item) => {
    const exs = EXAMPLES[item.hanzi];
    if (!exs) return item;
    added += exs.length;
    return { ...item, examples: exs };
  });

  await db.lesson.update({
    where: { id: lesson.id },
    data: { content: { ...content, items: updated } as object },
  });
  console.log(`  ✅ ${lessonCode}: +${added} examples`);
  return added;
}

async function main() {
  console.log("=== A2 example enrichment ===\n");
  const lessons = ["L2-S01-VOCAB", "L2-S02-VOCAB", "L2-S03-VOCAB"];
  let total = 0;
  for (const code of lessons) total += await enrichLesson(code);
  console.log(`\n🎉 Total: ${total} examples`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
