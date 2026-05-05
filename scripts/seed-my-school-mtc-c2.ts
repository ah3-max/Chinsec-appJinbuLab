/**
 * Seed MY-SCHOOL Chapter 2 — Lesson 2「八折起」(Up to 20% off)
 *
 * 5 published lessons matching the textbook structure:
 *   1. MS-C2-DIALOG-1   對話 — text loaded via populate-reading.ts
 *   2. MS-C2-VOCAB-1    生詞 1 (32 items from Dialog 1)
 *   3. MS-C2-READING    短文 — text loaded via populate-reading.ts
 *   4. MS-C2-VOCAB-2    生詞 2 (24 items from Reading)
 *   5. MS-C2-GRAMMAR    文法 (7 patterns)
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient, Level } from "@prisma/client";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const db = new PrismaClient();

interface VocabSeed {
  hanzi: string;
  zhuyin: string;
  pinyin: string;
  partOfSpeech: string;
  translations: { en: string; th: string };
  imagePromptHint: string;
}

// ─── Vocabulary 1 (32 items: 27 vocab + 5 phrases, from Dialog 1) ──────────
const VOCAB_1: VocabSeed[] = [
  { hanzi: "起",       zhuyin: "ㄑㄧˇ",                pinyin: "qǐ",            partOfSpeech: "Vp",      translations: { en: "starting from…",                  th: "เริ่มต้นจาก…" },                  imagePromptHint: "clay starting line with arrow pointing right starting point" },
  { hanzi: "外套",     zhuyin: "ㄨㄞˋ ㄊㄠˋ",          pinyin: "wàitào",        partOfSpeech: "N",       translations: { en: "coat / jacket",                   th: "เสื้อโค้ท / แจ็คเก็ต" },          imagePromptHint: "clay warm winter coat hanging on hanger thick wool jacket" },
  { hanzi: "一般",     zhuyin: "ㄧˋ ㄅㄢ",             pinyin: "yībān",         partOfSpeech: "Adv",     translations: { en: "generally / in general",          th: "โดยทั่วไป / ปกติ" },              imagePromptHint: "clay diverse group of average everyday people standing together" },
  { hanzi: "商品",     zhuyin: "ㄕㄤ ㄆㄧㄣˇ",          pinyin: "shāngpǐn",      partOfSpeech: "N",       translations: { en: "goods / merchandise",             th: "สินค้า" },                         imagePromptHint: "clay store shelf full of various products with price tags" },
  { hanzi: "折扣",     zhuyin: "ㄓㄜˊ ㄎㄡˋ",          pinyin: "zhékòu",        partOfSpeech: "N",       translations: { en: "discount",                        th: "ส่วนลด" },                         imagePromptHint: "clay percent off sale tag with red discount sticker" },
  { hanzi: "省",       zhuyin: "ㄕㄥˇ",                pinyin: "shěng",         partOfSpeech: "V",       translations: { en: "to save / save up",               th: "ประหยัด / เก็บ" },                imagePromptHint: "clay piggy bank with coins dropping in saving money" },
  { hanzi: "牌子",     zhuyin: "ㄆㄞˊ ˙ㄗ",            pinyin: "páizi",         partOfSpeech: "N",       translations: { en: "brand",                           th: "ยี่ห้อ / แบรนด์" },               imagePromptHint: "clay luxury brand label tag with stylish logo on product" },
  { hanzi: "品質",     zhuyin: "ㄆㄧㄣˇ ㄓˊ",          pinyin: "pǐnzhí",        partOfSpeech: "N",       translations: { en: "quality",                         th: "คุณภาพ" },                         imagePromptHint: "clay shiny gold star quality stamp seal of approval" },
  { hanzi: "選擇",     zhuyin: "ㄒㄩㄢˇ ㄗㄜˊ",         pinyin: "xuǎnzé",        partOfSpeech: "N",       translations: { en: "choices / options",               th: "ทางเลือก / ตัวเลือก" },           imagePromptHint: "clay forked road with multiple paths and signposts" },
  { hanzi: "樣子",     zhuyin: "ㄧㄤˋ ˙ㄗ",            pinyin: "yàngzi",        partOfSpeech: "N",       translations: { en: "appearance / looks",              th: "หน้าตา / รูปลักษณ์" },            imagePromptHint: "clay dressing mirror reflecting outfit looks appearance" },
  { hanzi: "摸",       zhuyin: "ㄇㄛ",                 pinyin: "mō",            partOfSpeech: "V",       translations: { en: "to feel / touch",                 th: "สัมผัส / ลูบ" },                  imagePromptHint: "clay hand reaching out to touch soft fabric texture" },
  { hanzi: "店員",     zhuyin: "ㄉㄧㄢˋ ㄩㄢˊ",         pinyin: "diànyuán",      partOfSpeech: "N",       translations: { en: "salesperson / clerk",             th: "พนักงานร้าน" },                   imagePromptHint: "clay friendly store clerk in apron at counter smiling" },
  { hanzi: "短",       zhuyin: "ㄉㄨㄢˇ",              pinyin: "duǎn",          partOfSpeech: "Vs",      translations: { en: "short",                           th: "สั้น" },                          imagePromptHint: "clay short ruler with shorter pencil compared to long one" },
  { hanzi: "羊毛",     zhuyin: "ㄧㄤˊ ㄇㄠˊ",          pinyin: "yángmáo",       partOfSpeech: "N",       translations: { en: "wool",                            th: "ขนแกะ" },                          imagePromptHint: "clay fluffy white sheep wool ball with knitting needles" },
  { hanzi: "暖和",     zhuyin: "ㄋㄨㄢˇ ˙ㄏㄨㄛ",       pinyin: "nuǎnhuo",       partOfSpeech: "Vs",      translations: { en: "warm",                            th: "อบอุ่น" },                         imagePromptHint: "clay person hugging mug of cocoa wrapped in cozy blanket" },
  { hanzi: "打折",     zhuyin: "ㄉㄚˇ ㄓㄜˊ",          pinyin: "dǎzhé",         partOfSpeech: "V-sep",   translations: { en: "to offer a discount",             th: "ลดราคา" },                         imagePromptHint: "clay sale tag with red strike-through old price discount" },
  { hanzi: "原價",     zhuyin: "ㄩㄢˊ ㄐㄧㄚˋ",         pinyin: "yuánjià",       partOfSpeech: "N",       translations: { en: "original price",                  th: "ราคาเต็ม / ราคาดั้งเดิม" },        imagePromptHint: "clay price tag showing crossed-out higher price original" },
  { hanzi: "刷卡",     zhuyin: "ㄕㄨㄚ ㄎㄚˇ",          pinyin: "shuākǎ",        partOfSpeech: "V-sep",   translations: { en: "to swipe a credit card",          th: "รูดบัตรเครดิต" },                  imagePromptHint: "clay hand swiping credit card through payment terminal POS" },
  { hanzi: "現金",     zhuyin: "ㄒㄧㄢˋ ㄐㄧㄣ",         pinyin: "xiànjīn",       partOfSpeech: "N",       translations: { en: "cash",                            th: "เงินสด" },                         imagePromptHint: "clay stack of paper bills with golden coins next to them" },
  { hanzi: "麻煩",     zhuyin: "ㄇㄚˊ ㄈㄢˊ",          pinyin: "máfán",         partOfSpeech: "V",       translations: { en: "may I trouble you to…",           th: "รบกวน / ขอความกรุณา" },           imagePromptHint: "clay person politely bowing asking favor please gesture" },
  { hanzi: "簽名",     zhuyin: "ㄑㄧㄢ ㄇㄧㄥˊ",         pinyin: "qiānmíng",      partOfSpeech: "V-sep",   translations: { en: "to sign one's name",              th: "เซ็นชื่อ" },                       imagePromptHint: "clay hand with pen signing receipt or contract paper" },
  { hanzi: "破洞",     zhuyin: "ㄆㄛˋ ㄉㄨㄥˋ",         pinyin: "pòdòng",        partOfSpeech: "Vp-sep",  translations: { en: "to have a hole",                  th: "เป็นรู / ทะลุ" },                  imagePromptHint: "clay shirt or fabric with visible torn hole damaged" },
  { hanzi: "發票",     zhuyin: "ㄈㄚ ㄆㄧㄠˋ",          pinyin: "fāpiào",        partOfSpeech: "N",       translations: { en: "receipt",                         th: "ใบเสร็จ" },                        imagePromptHint: "clay long paper receipt with itemized purchases printed" },
  { hanzi: "弄",       zhuyin: "ㄋㄨㄥˋ",              pinyin: "nòng",          partOfSpeech: "V",       translations: { en: "to do / handle (general verb)",   th: "ทำ / จัดการ (กริยาทั่วไป)" },     imagePromptHint: "clay hands manipulating object handling tinkering general action" },
  { hanzi: "退",       zhuyin: "ㄊㄨㄟˋ",              pinyin: "tuì",           partOfSpeech: "V",       translations: { en: "to return (purchase)",            th: "คืนของ" },                         imagePromptHint: "clay hand returning product to store with refund arrow" },
  { hanzi: "換",       zhuyin: "ㄏㄨㄢˋ",              pinyin: "huàn",          partOfSpeech: "V",       translations: { en: "to exchange",                     th: "แลก / เปลี่ยน" },                  imagePromptHint: "clay two items with circular swap arrows exchanging" },
  { hanzi: "店長",     zhuyin: "ㄉㄧㄢˋ ㄓㄤˇ",         pinyin: "diànzhǎng",     partOfSpeech: "N",       translations: { en: "store manager",                   th: "ผู้จัดการร้าน" },                  imagePromptHint: "clay store manager in suit with name badge clipboard authority" },
  { hanzi: "週年慶",   zhuyin: "ㄓㄡ ㄋㄧㄢˊ ㄑㄧㄥˋ",  pinyin: "zhōunián qìng", partOfSpeech: "Phrase",  translations: { en: "anniversary sale",                th: "เซลล์ฉลองครบรอบปี" },              imagePromptHint: "clay department store storefront with anniversary sale banner balloons" },
  { hanzi: "一般來說", zhuyin: "ㄧˋ ㄅㄢ ㄌㄞˊ ㄕㄨㄛ", pinyin: "yībān láishuō", partOfSpeech: "Phrase",  translations: { en: "generally speaking",              th: "โดยทั่วไปแล้ว" },                  imagePromptHint: "clay speech bubble with universal earth icon general statement" },
  { hanzi: "試穿",     zhuyin: "ㄕˋ ㄔㄨㄢ",            pinyin: "shì chuān",     partOfSpeech: "Phrase",  translations: { en: "to try on (garments)",            th: "ลองสวมใส่" },                      imagePromptHint: "clay person trying on jacket in fitting room mirror" },
  { hanzi: "打完折",   zhuyin: "ㄉㄚˇ ㄨㄢˊ ㄓㄜˊ",     pinyin: "dǎ wán zhé",    partOfSpeech: "Phrase",  translations: { en: "after discount",                  th: "หลังหักส่วนลด" },                  imagePromptHint: "clay calculator showing reduced final price after discount" },
  { hanzi: "弄丟",     zhuyin: "ㄋㄨㄥˋ ㄉㄧㄡ",         pinyin: "nòng diū",      partOfSpeech: "Phrase",  translations: { en: "to lose (something)",             th: "ทำหาย" },                          imagePromptHint: "clay person holding empty pocket question marks lost item" },
];

// ─── Vocabulary 2 (24 items: 19 vocab + 5 phrases, from Reading) ──────────
const VOCAB_2: VocabSeed[] = [
  { hanzi: "購物",     zhuyin: "ㄍㄡˋ ㄨˋ",           pinyin: "gòuwù",         partOfSpeech: "Vi",      translations: { en: "to go shopping",                  th: "ช้อปปิ้ง / จับจ่าย" },             imagePromptHint: "clay person with shopping bags walking out of mall happy" },
  { hanzi: "糾紛",     zhuyin: "ㄐㄧㄡ ㄈㄣ",          pinyin: "jiūfēn",        partOfSpeech: "N",       translations: { en: "dispute",                         th: "ข้อพิพาท / การโต้แย้ง" },          imagePromptHint: "clay two people arguing pointing fingers angry conflict" },
  { hanzi: "電信",     zhuyin: "ㄉㄧㄢˋ ㄒㄧㄣˋ",       pinyin: "diànxìn",       partOfSpeech: "N",       translations: { en: "telecommunications",              th: "โทรคมนาคม" },                      imagePromptHint: "clay cell tower with signal waves radiating telecom network" },
  { hanzi: "門市",     zhuyin: "ㄇㄣˊ ㄕˋ",            pinyin: "ménshì",        partOfSpeech: "N",       translations: { en: "retail outlet / branch",          th: "สาขาร้าน / หน้าร้าน" },            imagePromptHint: "clay storefront with phone shop signage retail branch" },
  { hanzi: "居留證",   zhuyin: "ㄐㄩ ㄌㄧㄡˊ ㄓㄥˋ",   pinyin: "jūliúzhèng",    partOfSpeech: "N",       translations: { en: "Alien Resident Certificate (ARC)", th: "บัตรประจำตัวคนต่างด้าว (ARC)" },  imagePromptHint: "clay ID card with photo Taiwan resident certificate official" },
  { hanzi: "月租型",   zhuyin: "ㄩㄝˋ ㄗㄨ ㄒㄧㄥˊ",   pinyin: "yuèzūxíng",     partOfSpeech: "N",       translations: { en: "monthly subscription plan",       th: "แผนรายเดือน" },                    imagePromptHint: "clay calendar with monthly bill phone plan recurring icon" },
  { hanzi: "帳單",     zhuyin: "ㄓㄤˋ ㄉㄢ",           pinyin: "zhàngdān",      partOfSpeech: "N",       translations: { en: "bill / invoice",                  th: "ใบเสร็จเรียกเก็บเงิน / บิล" },     imagePromptHint: "clay paper bill statement with itemized charges due amount" },
  { hanzi: "並",       zhuyin: "ㄅㄧㄥˋ",              pinyin: "bìng",          partOfSpeech: "Adv",     translations: { en: "actually not (contrary to expectation)", th: "ไม่ได้...อย่างที่คิด (อันที่จริง)" }, imagePromptHint: "clay surprised face with crossed-out assumption contrast" },
  { hanzi: "包括",     zhuyin: "ㄅㄠ ㄎㄨㄛˋ",          pinyin: "bāokuò",        partOfSpeech: "V",       translations: { en: "to include",                      th: "รวมถึง / ครอบคลุม" },              imagePromptHint: "clay big circle wrapping around several items inclusive" },
  { hanzi: "解釋",     zhuyin: "ㄐㄧㄝˇ ㄕˋ",           pinyin: "jiěshì",        partOfSpeech: "N",       translations: { en: "explanation",                     th: "คำอธิบาย" },                       imagePromptHint: "clay teacher pointing at whiteboard explaining diagram clarity" },
  { hanzi: "顧客",     zhuyin: "ㄍㄨˋ ㄎㄜˋ",           pinyin: "gùkè",          partOfSpeech: "N",       translations: { en: "customer",                        th: "ลูกค้า" },                         imagePromptHint: "clay customer at store counter with shopping items happy" },
  { hanzi: "尤其",     zhuyin: "ㄧㄡˊ ㄑㄧˊ",           pinyin: "yóuqí",         partOfSpeech: "Adv",     translations: { en: "especially / in particular",      th: "โดยเฉพาะ / โดยเฉพาะอย่างยิ่ง" },   imagePromptHint: "clay highlighted item glowing among others spotlight emphasis" },
  { hanzi: "騙",       zhuyin: "ㄆㄧㄢˋ",              pinyin: "piàn",          partOfSpeech: "V",       translations: { en: "to cheat / swindle",              th: "หลอกลวง / โกง" },                  imagePromptHint: "clay sneaky person holding mask deceiving trickster scam" },
  { hanzi: "頓",       zhuyin: "ㄉㄨㄣˋ",              pinyin: "dùn",           partOfSpeech: "M",       translations: { en: "(measure for verbal action)",     th: "(ลักษณนามสำหรับครั้งของการกระทำ)" }, imagePromptHint: "clay scolding speech bubble exclamation marks one round of yelling" },
  { hanzi: "辦法",     zhuyin: "ㄅㄢˋ ㄈㄚˇ",          pinyin: "bànfǎ",         partOfSpeech: "N",       translations: { en: "solution / way",                  th: "วิธี / ทางออก" },                  imagePromptHint: "clay light bulb with key opening lock solution found idea" },
  { hanzi: "自動",     zhuyin: "ㄗˋ ㄉㄨㄥˋ",          pinyin: "zìdòng",        partOfSpeech: "Adv",     translations: { en: "automatically / on its own",      th: "อัตโนมัติ / โดยอัตโนมัติ" },        imagePromptHint: "clay robot machine working alone gear automatic process" },
  { hanzi: "關機",     zhuyin: "ㄍㄨㄢ ㄐㄧ",           pinyin: "guānjī",        partOfSpeech: "V-sep",   translations: { en: "to power off / shut down",        th: "ปิดเครื่อง" },
                       imagePromptHint: "clay phone screen turning off power button pressed dark" },
  { hanzi: "修理",     zhuyin: "ㄒㄧㄡ ㄌㄧˇ",          pinyin: "xiūlǐ",         partOfSpeech: "V",       translations: { en: "to repair",                       th: "ซ่อม" },                          imagePromptHint: "clay technician with toolbox fixing broken phone screwdriver" },
  { hanzi: "繳費",     zhuyin: "ㄐㄧㄠˇ ㄈㄟˋ",         pinyin: "jiǎofèi",       partOfSpeech: "V-sep",   translations: { en: "to pay a fee",                    th: "จ่ายค่าธรรมเนียม / ชำระเงิน" },     imagePromptHint: "clay hand handing over money at payment counter convenience store" },
  { hanzi: "預付卡",   zhuyin: "ㄩˋ ㄈㄨˋ ㄎㄚˇ",      pinyin: "yùfù kǎ",       partOfSpeech: "Phrase",  translations: { en: "prepaid SIM card",                th: "ซิมการ์ดแบบเติมเงิน" },             imagePromptHint: "clay SIM card with prepaid label coins visible top-up" },
  { hanzi: "換成",     zhuyin: "ㄏㄨㄢˋ ㄔㄥˊ",         pinyin: "huàn chéng",    partOfSpeech: "Phrase",  translations: { en: "to change into / switch to",      th: "เปลี่ยนเป็น" },                    imagePromptHint: "clay caterpillar arrow butterfly transformation switch" },
  { hanzi: "吃到飽",   zhuyin: "ㄔ ㄉㄠˋ ㄅㄠˇ",        pinyin: "chī dào bǎo",   partOfSpeech: "Phrase",  translations: { en: "unlimited (lit. all-you-can-eat)", th: "ไม่จำกัด (ตามตัวอักษร: กินจนอิ่ม)" }, imagePromptHint: "clay buffet table loaded with food unlimited spread feast" },
  { hanzi: "嚇一跳",   zhuyin: "ㄒㄧㄚˋ ㄧˋ ㄊㄧㄠˋ",   pinyin: "xià yí tiào",   partOfSpeech: "Phrase",  translations: { en: "shocked / startled",              th: "ตกใจ" },                          imagePromptHint: "clay person jumping back wide eyes mouth open surprised gasp" },
  { hanzi: "客服中心", zhuyin: "ㄎㄜˋ ㄈㄨˊ ㄓㄨㄥ ㄒㄧㄣ", pinyin: "kèfú zhōngxīn", partOfSpeech: "Phrase", translations: { en: "customer service center",       th: "ศูนย์บริการลูกค้า" },              imagePromptHint: "clay friendly call center agent with headset and helpdesk sign" },
];

// ─── Grammar (7 patterns; one example each, paraphrased descriptions) ─────
interface GrammarPattern {
  hanzi: string;
  pinyin: string;
  translations: { en: string; th: string };
  example: { sentence: string; sentencePinyin: string; sentenceTh: string };
  mnemonic: string;
  note?: string;
}
const GRAMMAR: GrammarPattern[] = [
  {
    hanzi: "一般來說…",
    pinyin: "yībān láishuō…",
    translations: { en: "generally speaking…",
                    th: "โดยทั่วไปแล้ว…" },
    example: { sentence: "一般來說,週年慶的時候商品都有不錯的折扣。", sentencePinyin: "Yībān láishuō, zhōunián qìng de shíhòu shāngpǐn dōu yǒu búcuò de zhékòu.", sentenceTh: "โดยทั่วไป ช่วงเซลล์ฉลองครบรอบสินค้ามักมีส่วนลดดีๆ" },
    mnemonic: "introduces a general truth — typically placed at the start of the sentence",
    note: "interchangeable with 一般說來",
  },
  {
    hanzi: "弄 (general verb)",
    pinyin: "nòng…",
    translations: { en: "to do / handle / mess with (general action verb)",
                    th: "ทำ / จัดการ (กริยาทั่วไป)" },
    example: { sentence: "雨好大,把我的衣服弄濕了。", sentencePinyin: "Yǔ hǎo dà, bǎ wǒ de yīfu nòng shīle.", sentenceTh: "ฝนตกหนัก ทำเสื้อฉันเปียกหมดแล้ว" },
    mnemonic: "弄 = catch-all verb, like English 'do/get/make'. Common: 弄丟、弄破、弄濕、弄好、弄錯、弄清楚",
    note: "Don't add 很 directly — say 弄得很乾淨, not 弄很乾淨",
  },
  {
    hanzi: "再說…",
    pinyin: "zàishuō…",
    translations: { en: "besides… / moreover…",
                    th: "อีกอย่าง / นอกจากนี้…" },
    example: { sentence: "刷卡吧,我沒帶現金。再說,刷卡還可以打九五折。", sentencePinyin: "Shuākǎ ba, wǒ méi dài xiànjīn. Zàishuō, shuākǎ hái kěyǐ dǎ jiǔwǔ zhé.", sentenceTh: "รูดบัตรเถอะ ฉันไม่ได้พกเงินสด อีกอย่าง รูดบัตรยังลด 5% ด้วย" },
    mnemonic: "adds further reasoning that strengthens the prior point — 'and besides…'",
    note: "Different from 而且 — 再說 only links full sentences and stresses elaboration",
  },
  {
    hanzi: "V + 成…",
    pinyin: "V chéng…",
    translations: { en: "to turn (something) into…",
                    th: "ทำให้กลายเป็น…" },
    example: { sentence: "你能不能幫我把這段話翻譯成中文？", sentencePinyin: "Nǐ néng bù néng bāng wǒ bǎ zhè duàn huà fānyì chéng zhōngwén?", sentenceTh: "ช่วยฉันแปลข้อความนี้เป็นภาษาจีนหน่อยได้ไหม?" },
    mnemonic: "成 marks the end-state: 翻譯成、換成、寫成、做成、拍成、打字成…",
    note: "成 is followed by a noun, not a state verb. Negation goes before the action verb",
  },
  {
    hanzi: "並 + (不/沒)…",
    pinyin: "bìng + (bù/méi)…",
    translations: { en: "actually not / contrary to expectation",
                    th: "ไม่ได้…อย่างที่คิด (ตรงข้ามกับที่คาด)" },
    example: { sentence: "店員覺得他並沒有騙人。", sentencePinyin: "Diànyuán juéde tā bìng méiyǒu piànrén.", sentenceTh: "พนักงานคิดว่าเขาไม่ได้หลอกลวงเลย" },
    mnemonic: "並 + 不/沒 = pushback against an assumption. Tactful refutation, softer than just 不",
    note: "Place 並 after the subject and before 不/沒. Pattern 並不是 = 'it's not the case that…'",
  },
  {
    hanzi: "尤其(是)…",
    pinyin: "yóuqí(shì)…",
    translations: { en: "especially / in particular…",
                    th: "โดยเฉพาะ (อย่างยิ่ง)…" },
    example: { sentence: "店員應該把重要的事情跟顧客說清楚,尤其是對外國人的時候。", sentencePinyin: "Diànyuán yīnggāi bǎ zhòngyào de shìqíng gēn gùkè shuō qīngchǔ, yóuqíshì duì wàiguórén de shíhòu.", sentenceTh: "พนักงานควรอธิบายเรื่องสำคัญให้ลูกค้าชัดเจน โดยเฉพาะกับชาวต่างชาติ" },
    mnemonic: "singles out one item from a group — typically appears at the back of the sentence",
  },
  {
    hanzi: "只好…",
    pinyin: "zhǐhǎo…",
    translations: { en: "have no choice but to / can only…",
                    th: "ไม่มีทางเลือก/จำเป็นต้อง…" },
    example: { sentence: "電信公司的門市不能刷卡,顧客只好付現金。", sentencePinyin: "Diànxìn gōngsī de ménshì bù néng shuākǎ, gùkè zhǐhǎo fù xiànjīn.", sentenceTh: "สาขาบริษัทโทรคมนาคมรูดบัตรไม่ได้ ลูกค้าจึงต้องจ่ายเงินสด" },
    mnemonic: "marks the best of bad options — 'forced into this choice by circumstance'",
  },
];

async function upsertVocab(items: VocabSeed[], category: string) {
  for (const v of items) {
    await db.vocabulary.upsert({
      where: { hanzi: v.hanzi },
      create: {
        hanzi: v.hanzi, zhuyin: v.zhuyin, pinyin: v.pinyin,
        partOfSpeech: v.partOfSpeech,
        translations: { ...v.translations, en: v.imagePromptHint },
        level: Level.B1_INTERMEDIATE, tocflBand: "B1",
        frequency: 3, difficulty: 3,
        category, tags: ["b1", "school", "mtc-textbook", category],
        isEldercareVocab: false,
      },
      update: {
        translations: { ...v.translations, en: v.imagePromptHint },
        category, partOfSpeech: v.partOfSpeech,
        zhuyin: v.zhuyin, pinyin: v.pinyin, level: Level.B1_INTERMEDIATE,
      },
    });
  }
}

async function ensureLesson(opts: {
  stageId: string; code: string; title: string; titleEn: string; titleTh: string;
  description: string; type: "VOCAB"; orderIndex: number; estimatedMinutes: number; xpReward: number;
  content: object; isPublished?: boolean;
}) {
  return db.lesson.upsert({
    where: { stageId_code: { stageId: opts.stageId, code: opts.code } },
    create: {
      stageId: opts.stageId, code: opts.code, title: opts.title,
      titleI18n: { en: opts.titleEn, th: opts.titleTh },
      description: opts.description, type: opts.type, difficulty: 3,
      orderIndex: opts.orderIndex, estimatedMinutes: opts.estimatedMinutes,
      xpReward: opts.xpReward, isPublished: opts.isPublished ?? true,
      content: opts.content,
    },
    update: {
      title: opts.title, titleI18n: { en: opts.titleEn, th: opts.titleTh },
      description: opts.description, isPublished: opts.isPublished ?? true,
      content: opts.content,
    },
  });
}

async function main() {
  const course = await db.course.findUnique({ where: { code: "MY-SCHOOL" } });
  if (!course) { console.error("MY-SCHOOL course missing — run earlier seed first"); process.exit(1); }

  console.log("📚 Upserting Chapter 2 vocabulary metadata…");
  await upsertVocab(VOCAB_1, "ms-c2-v1");
  await upsertVocab(VOCAB_2, "ms-c2-v2");
  console.log(`  ✅ ${VOCAB_1.length + VOCAB_2.length} entries\n`);

  // Stage MS-C2 — promote from stub to real
  const stageC2 = await db.stage.upsert({
    where: { courseId_code: { courseId: course.id, code: "MS-C2" } },
    create: {
      courseId: course.id, code: "MS-C2",
      title: "第二課 八折起",
      titleI18n: { en: "Lesson 2 — Up to 20% Off", th: "บทที่ 2 — ลดสูงสุดถึง 20%" },
      description: "購物 · Shopping",
      orderIndex: 1,
    },
    update: {
      title: "第二課 八折起",
      titleI18n: { en: "Lesson 2 — Up to 20% Off", th: "บทที่ 2 — ลดสูงสุดถึง 20%" },
      description: "購物 · Shopping",
      orderIndex: 1,
    },
  });

  // 1. Dialog (text loaded later via populate-reading helper)
  await ensureLesson({
    stageId: stageC2.id, code: "MS-C2-DIALOG-1",
    title: "對話一", titleEn: "Dialogue 1", titleTh: "บทสนทนา 1",
    description: "百貨公司週年慶 · ที่ห้างสรรพสินค้าเซลล์ฉลองครบรอบ",
    type: "VOCAB", orderIndex: 0, estimatedMinutes: 12, xpReward: 50,
    isPublished: true,
    content: { type: "reading-passage", title: "對話一 — 百貨公司週年慶", titleTr: "บทสนทนา — เซลล์ฉลองครบรอบที่ห้าง", paragraphs: [] },
  });

  // 2. Vocab 1
  await ensureLesson({
    stageId: stageC2.id, code: "MS-C2-VOCAB-1",
    title: "生詞 1", titleEn: "Vocabulary 1", titleTh: "คำศัพท์ 1",
    description: `${VOCAB_1.length} 個必修詞彙 (對話相關)`,
    type: "VOCAB", orderIndex: 1, estimatedMinutes: 20, xpReward: VOCAB_1.length * 4,
    content: {
      type: "vocabulary-list", heading: "生詞 1 — 對話",
      items: VOCAB_1.map((v) => ({ hanzi: v.hanzi, pinyin: v.pinyin, translations: v.translations, note: v.partOfSpeech })),
    },
  });

  // 3. Reading
  await ensureLesson({
    stageId: stageC2.id, code: "MS-C2-READING",
    title: "短文 — 購物糾紛", titleEn: "Reading — A Shopping Dispute", titleTh: "บทอ่าน — ข้อพิพาทเรื่องช้อปปิ้ง",
    description: "เนื้อหารอนำเข้า (รัน populate-reading.ts)",
    type: "VOCAB", orderIndex: 2, estimatedMinutes: 15, xpReward: 60,
    content: { type: "reading-passage", title: "購物糾紛", titleTr: "ข้อพิพาทเรื่องช้อปปิ้ง", paragraphs: [] },
  });

  // 4. Vocab 2
  await ensureLesson({
    stageId: stageC2.id, code: "MS-C2-VOCAB-2",
    title: "生詞 2", titleEn: "Vocabulary 2", titleTh: "คำศัพท์ 2",
    description: `${VOCAB_2.length} 個必修詞彙 (短文相關)`,
    type: "VOCAB", orderIndex: 3, estimatedMinutes: 12, xpReward: VOCAB_2.length * 4,
    content: {
      type: "vocabulary-list", heading: "生詞 2 — 短文",
      items: VOCAB_2.map((v) => ({ hanzi: v.hanzi, pinyin: v.pinyin, translations: v.translations, note: v.partOfSpeech })),
    },
  });

  // 5. Grammar
  await ensureLesson({
    stageId: stageC2.id, code: "MS-C2-GRAMMAR",
    title: "文法 · 7 個句型", titleEn: "Grammar · 7 Patterns", titleTh: "ไวยากรณ์ · 7 รูปแบบ",
    description: "7 個語法句型 + 例句 + 記憶法",
    type: "VOCAB", orderIndex: 4, estimatedMinutes: 25, xpReward: GRAMMAR.length * 8,
    content: {
      type: "vocabulary-list", heading: "第二課 · 文法",
      items: GRAMMAR.map((g) => ({
        hanzi: g.hanzi, pinyin: g.pinyin, translations: g.translations,
        example: g.example, mnemonic: g.mnemonic, note: g.note,
      })),
    },
  });

  console.log(`✅ MS-C2: 5 lessons published (${VOCAB_1.length} + ${VOCAB_2.length} vocab + ${GRAMMAR.length} grammar patterns)`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
