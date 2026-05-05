/**
 * Add originally-written example sentences to every MS-C2 vocab word
 * (Vocab 1: 32, Vocab 2: 24). All sentences are written here, not from
 * the textbook, to avoid copyright issues.
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

// ─── Vocab 1 (32) — Dialog 1 ───────────────────────────────────────────────
const V1_EXAMPLES: Record<string, Ex> = {
  "起":         { sentence: "票價一百塊起。",                       pinyin: "Piàojià yìbǎi kuài qǐ.",                            translation: "ค่าตั๋วเริ่มต้นที่ 100 บาท" },
  "外套":       { sentence: "天氣冷,記得穿外套。",                  pinyin: "Tiānqì lěng, jìde chuān wàitào.",                   translation: "อากาศหนาว อย่าลืมใส่เสื้อโค้ท" },
  "一般":       { sentence: "一般學生都喜歡假期。",                 pinyin: "Yībān xuéshēng dōu xǐhuān jiàqī.",                  translation: "นักเรียนทั่วไปชอบช่วงปิดเทอม" },
  "商品":       { sentence: "這家店的商品都很便宜。",               pinyin: "Zhè jiā diàn de shāngpǐn dōu hěn piányí.",          translation: "สินค้าของร้านนี้ถูกหมดเลย" },
  "折扣":       { sentence: "今天的折扣不錯。",                     pinyin: "Jīntiān de zhékòu búcuò.",                          translation: "ส่วนลดวันนี้ใช้ได้เลย" },
  "省":         { sentence: "我要省錢買新手機。",                   pinyin: "Wǒ yào shěng qián mǎi xīn shǒujī.",                 translation: "ฉันต้องประหยัดเงินซื้อมือถือใหม่" },
  "牌子":       { sentence: "這個牌子在台灣很有名。",               pinyin: "Zhège páizi zài Táiwān hěn yǒumíng.",               translation: "ยี่ห้อนี้ดังมากในไต้หวัน" },
  "品質":       { sentence: "貴的東西品質不一定好。",               pinyin: "Guì de dōngxī pǐnzhí bù yídìng hǎo.",               translation: "ของแพงคุณภาพไม่จำเป็นต้องดี" },
  "選擇":       { sentence: "我們有很多選擇。",                     pinyin: "Wǒmen yǒu hěn duō xuǎnzé.",                         translation: "พวกเรามีตัวเลือกเยอะ" },
  "樣子":       { sentence: "這件外套的樣子我喜歡。",               pinyin: "Zhè jiàn wàitào de yàngzi wǒ xǐhuān.",              translation: "รูปลักษณ์ของเสื้อโค้ทตัวนี้ฉันชอบ" },
  "摸":         { sentence: "請不要摸這個玻璃。",                   pinyin: "Qǐng búyào mō zhège bōlí.",                         translation: "กรุณาอย่าจับกระจกนี้" },
  "店員":       { sentence: "店員對我很客氣。",                     pinyin: "Diànyuán duì wǒ hěn kèqì.",                         translation: "พนักงานร้านสุภาพมากกับฉัน" },
  "短":         { sentence: "這條褲子太短了。",                     pinyin: "Zhè tiáo kùzi tài duǎn le.",                        translation: "กางเกงตัวนี้สั้นเกินไป" },
  "羊毛":       { sentence: "羊毛的衣服比較暖。",                   pinyin: "Yángmáo de yīfu bǐjiào nuǎn.",                       translation: "เสื้อขนแกะอุ่นกว่า" },
  "暖和":       { sentence: "今天很暖和,出去走走吧。",              pinyin: "Jīntiān hěn nuǎnhuo, chūqù zǒuzǒu ba.",             translation: "วันนี้อบอุ่น ออกไปเดินเล่นกันเถอะ" },
  "打折":       { sentence: "百貨公司常常打折。",                   pinyin: "Bǎihuò gōngsī chángcháng dǎzhé.",                   translation: "ห้างสรรพสินค้าลดราคาบ่อย" },
  "原價":       { sentence: "原價兩千,現在一千五。",                pinyin: "Yuánjià liǎngqiān, xiànzài yìqiān wǔ.",             translation: "ราคาเต็ม 2000 ตอนนี้ 1500" },
  "刷卡":       { sentence: "我可以刷卡嗎?",                        pinyin: "Wǒ kěyǐ shuākǎ ma?",                                translation: "ฉันรูดบัตรได้ไหม?" },
  "現金":       { sentence: "我只帶了一些現金。",                   pinyin: "Wǒ zhǐ dài le yìxiē xiànjīn.",                      translation: "ฉันพกเงินสดมาแค่นิดหน่อย" },
  "麻煩":       { sentence: "麻煩你幫我拿一下。",                   pinyin: "Máfán nǐ bāng wǒ ná yíxià.",                        translation: "รบกวนช่วยถือให้ฉันหน่อย" },
  "簽名":       { sentence: "請在這裡簽名。",                       pinyin: "Qǐng zài zhèlǐ qiānmíng.",                          translation: "กรุณาเซ็นชื่อตรงนี้" },
  "破洞":       { sentence: "我的襪子破洞了。",                     pinyin: "Wǒ de wàzi pòdòng le.",                              translation: "ถุงเท้าฉันเป็นรู" },
  "發票":       { sentence: "請給我發票。",                         pinyin: "Qǐng gěi wǒ fāpiào.",                                translation: "ขอใบเสร็จด้วยค่ะ" },
  "弄":         { sentence: "誰把窗戶弄破了?",                      pinyin: "Shéi bǎ chuānghù nòng pò le?",                       translation: "ใครทำหน้าต่างแตก?" },
  "退":         { sentence: "我想退這件衣服。",                     pinyin: "Wǒ xiǎng tuì zhè jiàn yīfu.",                        translation: "ฉันอยากคืนเสื้อตัวนี้" },
  "換":         { sentence: "可以換大一點的嗎?",                    pinyin: "Kěyǐ huàn dà yìdiǎn de ma?",                         translation: "ขอเปลี่ยนเป็นไซส์ใหญ่กว่านี้ได้ไหม?" },
  "店長":       { sentence: "店長剛剛出去了。",                     pinyin: "Diànzhǎng gānggāng chūqù le.",                       translation: "ผู้จัดการร้านเพิ่งออกไป" },
  "週年慶":     { sentence: "週年慶買東西最划算。",                 pinyin: "Zhōunián qìng mǎi dōngxī zuì huásuàn.",              translation: "ช่วงเซลล์ฉลองครบรอบซื้อของคุ้มที่สุด" },
  "一般來說":   { sentence: "一般來說,週末人比較多。",              pinyin: "Yībān láishuō, zhōumò rén bǐjiào duō.",              translation: "โดยทั่วไป เสาร์อาทิตย์คนเยอะกว่า" },
  "試穿":       { sentence: "我可以試穿這件嗎?",                    pinyin: "Wǒ kěyǐ shì chuān zhè jiàn ma?",                     translation: "ฉันลองสวมตัวนี้ได้ไหม?" },
  "打完折":     { sentence: "打完折比較便宜。",                     pinyin: "Dǎ wán zhé bǐjiào piányí.",                          translation: "หลังหักส่วนลดถูกกว่า" },
  "弄丟":       { sentence: "我的鑰匙弄丟了。",                     pinyin: "Wǒ de yàoshi nòng diū le.",                          translation: "ฉันทำกุญแจหาย" },
};

// ─── Vocab 2 (24) — Reading ───────────────────────────────────────────────
const V2_EXAMPLES: Record<string, Ex> = {
  "購物":       { sentence: "我喜歡上網購物。",                     pinyin: "Wǒ xǐhuān shàngwǎng gòuwù.",                         translation: "ฉันชอบช้อปปิ้งออนไลน์" },
  "糾紛":       { sentence: "他們有一點糾紛。",                     pinyin: "Tāmen yǒu yìdiǎn jiūfēn.",                           translation: "พวกเขามีข้อพิพาทเล็กน้อย" },
  "電信":       { sentence: "電信公司就在前面。",                   pinyin: "Diànxìn gōngsī jiù zài qiánmiàn.",                   translation: "บริษัทโทรคมนาคมอยู่ข้างหน้า" },
  "門市":       { sentence: "離我家最近的門市在這。",               pinyin: "Lí wǒ jiā zuì jìn de ménshì zài zhè.",                translation: "สาขาที่ใกล้บ้านฉันที่สุดอยู่ที่นี่" },
  "居留證":     { sentence: "我下個月去辦居留證。",                 pinyin: "Wǒ xià ge yuè qù bàn jūliúzhèng.",                   translation: "เดือนหน้าฉันจะไปทำ ARC" },
  "月租型":     { sentence: "月租型比較方便。",                     pinyin: "Yuèzūxíng bǐjiào fāngbiàn.",                          translation: "แผนรายเดือนสะดวกกว่า" },
  "帳單":       { sentence: "帳單下個禮拜要繳。",                   pinyin: "Zhàngdān xià ge lǐbài yào jiǎo.",                    translation: "ต้องจ่ายบิลอาทิตย์หน้า" },
  "並":         { sentence: "他並不知道這件事。",                   pinyin: "Tā bìng bù zhīdào zhè jiàn shì.",                    translation: "เขาไม่ได้รู้เรื่องนี้เลย" },
  "包括":       { sentence: "房租不包括水電。",                     pinyin: "Fángzū bù bāokuò shuǐ diàn.",                         translation: "ค่าเช่าไม่รวมค่าน้ำค่าไฟ" },
  "解釋":       { sentence: "請聽我的解釋。",                       pinyin: "Qǐng tīng wǒ de jiěshì.",                            translation: "กรุณาฟังคำอธิบายของฉัน" },
  "顧客":       { sentence: "顧客就是上帝。",                       pinyin: "Gùkè jiùshì shàngdì.",                                translation: "ลูกค้าคือพระเจ้า" },
  "尤其":       { sentence: "我喜歡水果,尤其是芒果。",              pinyin: "Wǒ xǐhuān shuǐguǒ, yóuqí shì mángguǒ.",              translation: "ฉันชอบผลไม้ โดยเฉพาะมะม่วง" },
  "騙":         { sentence: "他騙了我兩百塊。",                     pinyin: "Tā piàn le wǒ liǎngbǎi kuài.",                        translation: "เขาโกงฉัน 200 บาท" },
  "頓":         { sentence: "媽媽把弟弟罵了一頓。",                 pinyin: "Māma bǎ dìdi mà le yí dùn.",                          translation: "แม่ด่าน้องชายไปฉากหนึ่ง" },
  "辦法":       { sentence: "我有一個好辦法。",                     pinyin: "Wǒ yǒu yí ge hǎo bànfǎ.",                            translation: "ฉันมีวิธีที่ดีอยู่หนึ่งอย่าง" },
  "自動":       { sentence: "門會自動關。",                         pinyin: "Mén huì zìdòng guān.",                                translation: "ประตูจะปิดอัตโนมัติ" },
  "關機":       { sentence: "上課請關機。",                         pinyin: "Shàngkè qǐng guānjī.",                                translation: "เข้าเรียนกรุณาปิดเครื่อง" },
  "修理":       { sentence: "我要拿手機去修理。",                   pinyin: "Wǒ yào ná shǒujī qù xiūlǐ.",                          translation: "ฉันต้องเอามือถือไปซ่อม" },
  "繳費":       { sentence: "可以在便利商店繳費。",                 pinyin: "Kěyǐ zài biànlì shāngdiàn jiǎofèi.",                  translation: "จ่ายเงินที่ร้านสะดวกซื้อได้" },
  "預付卡":     { sentence: "剛來台灣可以買預付卡。",               pinyin: "Gāng lái Táiwān kěyǐ mǎi yùfù kǎ.",                   translation: "พึ่งมาไต้หวันใหม่ๆ ซื้อซิมเติมเงินได้" },
  "換成":       { sentence: "請把美金換成台幣。",                   pinyin: "Qǐng bǎ měijīn huàn chéng táibì.",                    translation: "กรุณาแลกเงินดอลลาร์เป็นเงินไต้หวัน" },
  "吃到飽":     { sentence: "這家餐廳是吃到飽。",                   pinyin: "Zhè jiā cāntīng shì chī dào bǎo.",                    translation: "ร้านนี้เป็นบุฟเฟ่ต์ไม่อั้น" },
  "嚇一跳":     { sentence: "他突然出現,嚇了我一跳。",              pinyin: "Tā túrán chūxiàn, xià le wǒ yí tiào.",                translation: "เขาโผล่มาทันใด ทำเอาฉันตกใจ" },
  "客服中心":   { sentence: "有問題請打給客服中心。",               pinyin: "Yǒu wèntí qǐng dǎ gěi kèfú zhōngxīn.",                translation: "มีปัญหากรุณาโทรหาศูนย์บริการลูกค้า" },
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

async function fillExamples(lessonCode: string, exMap: Record<string, Ex>) {
  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, content: true },
  });
  if (!lesson) return 0;
  const content = lesson.content as { type?: string; heading?: string; items?: Item[] } | null;
  if (!content?.items) return 0;

  let filled = 0;
  const updated: Item[] = content.items.map((item) => {
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
  console.log(`  ✅ ${lessonCode}: filled ${filled} / ${content.items.length} examples`);
  return filled;
}

async function main() {
  console.log("=== Enriching MY-SCHOOL Chapter 2 with examples ===\n");
  const v1 = await fillExamples("MS-C2-VOCAB-1", V1_EXAMPLES);
  const v2 = await fillExamples("MS-C2-VOCAB-2", V2_EXAMPLES);
  console.log(`\n🎉 Filled ${v1 + v2} examples (V1: ${v1}, V2: ${v2})`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
