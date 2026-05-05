/**
 * Seed MY-SCHOOL Chapter 3 — Lesson 3「外套帶了沒有？」(Did you bring your coat?)
 *
 * 5 published lessons matching the textbook structure:
 *   1. MS-C3-DIALOG-1   對話 — text loaded via populate-dialog-or-reading.ts
 *   2. MS-C3-VOCAB-1    生詞 1 (37 items from Dialog 1)
 *   3. MS-C3-READING    短文 — text loaded via populate-dialog-or-reading.ts
 *   4. MS-C3-VOCAB-2    生詞 2 (17 items from Reading)
 *   5. MS-C3-GRAMMAR    文法 (9 patterns)
 *
 * Stub for MS-C2 (Chapter 2) is also created — placeholder until that PDF arrives.
 *
 * What this script seeds: stage rows, lesson rows, vocabulary metadata
 * (hanzi/pinyin/translations/POS — dictionary-level data), and grammar pattern
 * definitions with one example each. Dialog and reading prose are NOT in this
 * file — they're populated separately via the populate-* helpers from local
 * JSON kept off-git, same approach used for Chapter 1's reading.
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

// ─── Vocabulary 1 (37 items: 2 names + 28 vocab + 1 name + 6 phrases) ─────
const VOCAB_1: VocabSeed[] = [
  { hanzi: "陳敏萱",   zhuyin: "ㄔㄣˊ ㄇㄧㄣˇ ㄒㄩㄢ", pinyin: "Chén Mǐnxuān", partOfSpeech: "Name", translations: { en: "(name) woman from the Netherlands", th: "ชื่อหญิงจากเนเธอร์แลนด์" }, imagePromptHint: "clay portrait friendly young European woman with Dutch flag, Pixar style" },
  { hanzi: "高橋健太", zhuyin: "ㄍㄠ ㄑㄧㄠˊ ㄐㄧㄢˋ ㄊㄞˋ", pinyin: "Gāoqiáo Jiàntài", partOfSpeech: "Name", translations: { en: "(name) man from Japan", th: "ชื่อชายจากญี่ปุ่น" }, imagePromptHint: "clay portrait friendly young Japanese man with Japan flag, Pixar style" },
  { hanzi: "空氣",     zhuyin: "ㄎㄨㄥ ㄑㄧˋ",       pinyin: "kōngqì",       partOfSpeech: "N",       translations: { en: "air",                     th: "อากาศ" },                       imagePromptHint: "clay swirling fresh blue air with white wisps and clouds" },
  { hanzi: "影響",     zhuyin: "ㄧㄥˇ ㄒㄧㄤˇ",       pinyin: "yǐngxiǎng",    partOfSpeech: "N",       translations: { en: "influence",               th: "อิทธิพล / ผลกระทบ" },          imagePromptHint: "clay ripples spreading from one stone in pond, influence concept" },
  { hanzi: "穩定",     zhuyin: "ㄨㄣˇ ㄉㄧㄥˋ",       pinyin: "wěndìng",      partOfSpeech: "Vs",      translations: { en: "stable",                  th: "คงที่ / มั่นคง" },             imagePromptHint: "clay solid stone tower stable foundation rock steady" },
  { hanzi: "幸虧",     zhuyin: "ㄒㄧㄥˋ ㄎㄨㄟ",      pinyin: "xìngkuī",      partOfSpeech: "Adv",     translations: { en: "fortunately",             th: "โชคดีที่ / นับว่าโชคดี" },     imagePromptHint: "clay four leaf clover with sunshine lucky horseshoe" },
  { hanzi: "躲",       zhuyin: "ㄉㄨㄛˇ",            pinyin: "duǒ",          partOfSpeech: "Vi",      translations: { en: "to hide / take shelter",  th: "หลบ / ซ่อน" },                  imagePromptHint: "clay person ducking behind umbrella sheltering from rain" },
  { hanzi: "度",       zhuyin: "ㄉㄨˋ",              pinyin: "dù",           partOfSpeech: "M",       translations: { en: "degree (temp)",           th: "องศา" },                         imagePromptHint: "clay thermometer with degree symbol scale prominent" },
  { hanzi: "溫度",     zhuyin: "ㄨㄣ ㄉㄨˋ",         pinyin: "wēndù",        partOfSpeech: "N",       translations: { en: "temperature",             th: "อุณหภูมิ" },                    imagePromptHint: "clay round dial thermometer showing temperature reading" },
  { hanzi: "零下",     zhuyin: "ㄌㄧㄥˊ ㄒㄧㄚˋ",     pinyin: "língxià",      partOfSpeech: "Vs-attr", translations: { en: "below zero",              th: "ติดลบ / ต่ำกว่าศูนย์" },        imagePromptHint: "clay thermometer showing minus freezing snow icicle" },
  { hanzi: "感覺",     zhuyin: "ㄍㄢˇ ㄐㄩㄝˊ",       pinyin: "gǎnjué",       partOfSpeech: "Vst",     translations: { en: "to feel",                 th: "รู้สึก" },                      imagePromptHint: "clay person thinking with hand on chin sensing emotion" },
  { hanzi: "實際",     zhuyin: "ㄕˊ ㄐㄧˋ",          pinyin: "shíjì",        partOfSpeech: "Vs-attr", translations: { en: "actual / real",           th: "จริง / ตามความเป็นจริง" },     imagePromptHint: "clay magnifying glass over checklist showing real facts" },
  { hanzi: "難怪",     zhuyin: "ㄋㄢˊ ㄍㄨㄞˋ",      pinyin: "nánguài",      partOfSpeech: "Adv",     translations: { en: "no wonder",               th: "มิน่า / ไม่น่าแปลกใจ" },        imagePromptHint: "clay light bulb over head ah-ha realization moment" },
  { hanzi: "季節",     zhuyin: "ㄐㄧˋ ㄐㄧㄝˊ",       pinyin: "jìjié",        partOfSpeech: "N",       translations: { en: "season",                  th: "ฤดู" },                          imagePromptHint: "clay 4-season tree spring summer autumn winter quadrants" },
  { hanzi: "火鍋",     zhuyin: "ㄏㄨㄛˇ ㄍㄨㄛ",      pinyin: "huǒguō",       partOfSpeech: "N",       translations: { en: "hotpot",                  th: "หม้อไฟ / สุกี้" },              imagePromptHint: "clay steaming hotpot bowl with vegetables tofu meat colorful" },
  { hanzi: "海鮮",     zhuyin: "ㄏㄞˇ ㄒㄧㄢ",        pinyin: "hǎixiān",      partOfSpeech: "N",       translations: { en: "seafood",                 th: "อาหารทะเล" },                    imagePromptHint: "clay platter of shrimp fish clams squid ocean creatures" },
  { hanzi: "新鮮",     zhuyin: "ㄒㄧㄣ ㄒㄧㄢ",       pinyin: "xīnxiān",      partOfSpeech: "Vs",      translations: { en: "fresh",                   th: "สด / ใหม่" },                    imagePromptHint: "clay glistening fresh fish on ice with sparkles" },
  { hanzi: "櫻花",     zhuyin: "ㄧㄥ ㄏㄨㄚ",        pinyin: "yīnghuā",      partOfSpeech: "N",       translations: { en: "cherry blossom",          th: "ดอกซากุระ" },                   imagePromptHint: "clay pink cherry blossom flowers branch spring blossoms" },
  { hanzi: "變化",     zhuyin: "ㄅㄧㄢˋ ㄏㄨㄚˋ",     pinyin: "biànhuà",      partOfSpeech: "N",       translations: { en: "change",                  th: "การเปลี่ยนแปลง" },               imagePromptHint: "clay caterpillar transforming butterfly transformation cycle" },
  { hanzi: "氣溫",     zhuyin: "ㄑㄧˋ ㄨㄣ",         pinyin: "qìwēn",        partOfSpeech: "N",       translations: { en: "weather temperature",     th: "อุณหภูมิอากาศ" },                imagePromptHint: "clay outdoor thermometer with sky weather symbol sun cloud" },
  { hanzi: "差",       zhuyin: "ㄔㄚ",                pinyin: "chā",          partOfSpeech: "Vst",     translations: { en: "to differ",               th: "แตกต่าง / ห่าง" },               imagePromptHint: "clay two arrows showing gap between values comparison difference" },
  { hanzi: "幾乎",     zhuyin: "ㄐㄧ ㄏㄨ",          pinyin: "jīhū",         partOfSpeech: "Adv",     translations: { en: "almost",                  th: "เกือบ / แทบจะ" },                imagePromptHint: "clay person reaching nearly grasping target almost there" },
  { hanzi: "乾",       zhuyin: "ㄍㄢ",                pinyin: "gān",          partOfSpeech: "Vp",      translations: { en: "to dry",                  th: "แห้ง" },                         imagePromptHint: "clay sun dried clothes on line desert dry crackled earth" },
  { hanzi: "發霉",     zhuyin: "ㄈㄚ ㄇㄟˊ",         pinyin: "fāméi",        partOfSpeech: "Vp-sep",  translations: { en: "to mildew / mold",        th: "ขึ้นรา" },                       imagePromptHint: "clay green mold spores growing on bread or wall fuzzy" },
  { hanzi: "除濕機",   zhuyin: "ㄔㄨˊ ㄕ ㄐㄧ",       pinyin: "chúshījī",     partOfSpeech: "N",       translations: { en: "dehumidifier",            th: "เครื่องลดความชื้น" },           imagePromptHint: "clay box dehumidifier appliance with water tank inside room" },
  { hanzi: "雨季",     zhuyin: "ㄩˇ ㄐㄧˋ",          pinyin: "yǔjì",         partOfSpeech: "N",       translations: { en: "rainy season",            th: "ฤดูฝน" },                       imagePromptHint: "clay umbrella heavy rain dropping calendar wet season" },
  { hanzi: "涼快",     zhuyin: "ㄌㄧㄤˊ ㄎㄨㄞˋ",     pinyin: "liángkuài",    partOfSpeech: "Vs",      translations: { en: "cool / refreshing",       th: "เย็นสบาย" },                    imagePromptHint: "clay person fanning self under tree cool breeze refreshing" },
  { hanzi: "潮濕",     zhuyin: "ㄔㄠˊ ㄕ",           pinyin: "cháoshī",      partOfSpeech: "Vs",      translations: { en: "humid / damp",            th: "ชื้น" },                        imagePromptHint: "clay water droplets condensing on glass humidity wet steam" },
  { hanzi: "悶",       zhuyin: "ㄇㄣ",                pinyin: "mēn",          partOfSpeech: "Vs",      translations: { en: "stuffy",                  th: "อบอ้าว / ไม่มีลม" },           imagePromptHint: "clay person sweating in stuffy room no air windows shut" },
  { hanzi: "冷氣",     zhuyin: "ㄌㄥˇ ㄑㄧˋ",        pinyin: "lěngqì",       partOfSpeech: "N",       translations: { en: "air conditioning",        th: "เครื่องปรับอากาศ / แอร์" },     imagePromptHint: "clay split air conditioner unit blowing cool blue air" },
  { hanzi: "荷蘭",     zhuyin: "ㄏㄜˊ ㄌㄢˊ",        pinyin: "Hélán",        partOfSpeech: "Name",    translations: { en: "the Netherlands",         th: "เนเธอร์แลนด์ / ฮอลแลนด์" },     imagePromptHint: "clay Dutch windmill tulips canal Netherlands landmark scene" },
  { hanzi: "出大太陽", zhuyin: "ㄔㄨ ㄉㄚˋ ㄊㄞˋ ㄧㄤˊ", pinyin: "chū dà tàiyáng", partOfSpeech: "Phrase", translations: { en: "to be blazing hot",     th: "แดดออกแรง / แดดจัด" },          imagePromptHint: "clay bright glowing sun in clear sky scorching summer day" },
  { hanzi: "颳風",     zhuyin: "ㄍㄨㄚ ㄈㄥ",        pinyin: "guā fēng",     partOfSpeech: "Phrase",  translations: { en: "to be windy",             th: "ลมแรง / มีลม" },                imagePromptHint: "clay strong wind blowing trees leaves swirling whoosh lines" },
  { hanzi: "受到",     zhuyin: "ㄕㄡˋ ㄉㄠˋ",         pinyin: "shòu dào",     partOfSpeech: "Phrase",  translations: { en: "to receive / be (affected)", th: "ได้รับ / ถูก (ได้รับผล)" },  imagePromptHint: "clay hands receiving gift influence flowing into person" },
  { hanzi: "受不了",   zhuyin: "ㄕㄡˋ ㄅㄨ ㄌㄧㄠˇ", pinyin: "shòu bù liǎo", partOfSpeech: "Phrase",  translations: { en: "can't stand it",          th: "ทนไม่ไหว" },                   imagePromptHint: "clay person hands on head exasperated overwhelmed cant take it" },
  { hanzi: "餓死了",   zhuyin: "ㄜˋ ㄙˇ ˙ㄌㄜ",      pinyin: "è sǐle",       partOfSpeech: "Phrase",  translations: { en: "to starve to death (exaggeration)", th: "หิวจะตาย" },           imagePromptHint: "clay person clutching empty stomach hungry stars over head" },
  { hanzi: "後母臉",   zhuyin: "ㄏㄡˋ ㄇㄨˇ ㄌㄧㄢˇ", pinyin: "hòumǔ liǎn",   partOfSpeech: "Phrase",  translations: { en: "stepmother's face (stern)", th: "หน้าแม่เลี้ยง (เอาแน่ไม่ได้)" }, imagePromptHint: "clay split scene smiling sun and frowning rain weather changeable" },
];

// ─── Vocabulary 2 (17 items: 11 vocab + 3 names + 3 phrases) ──────────────
const VOCAB_2: VocabSeed[] = [
  { hanzi: "祖先",     zhuyin: "ㄗㄨˇ ㄒㄧㄢ",       pinyin: "zǔxiān",       partOfSpeech: "N",       translations: { en: "ancestor",                th: "บรรพบุรุษ" },                   imagePromptHint: "clay family tree with old portraits hanging traditional ancestors" },
  { hanzi: "移民",     zhuyin: "ㄧˊ ㄇㄧㄣˊ",        pinyin: "yímín",        partOfSpeech: "Vi",      translations: { en: "to immigrate",            th: "อพยพ" },                        imagePromptHint: "clay people with suitcases boarding boat moving immigration" },
  { hanzi: "當中",     zhuyin: "ㄉㄤ ㄓㄨㄥ",        pinyin: "dāngzhōng",    partOfSpeech: "N",       translations: { en: "amongst / of",            th: "ในจำนวน / ในหมู่" },             imagePromptHint: "clay group of items with one highlighted in center selected" },
  { hanzi: "根據",     zhuyin: "ㄍㄣ ㄐㄩˋ",         pinyin: "gēnjù",        partOfSpeech: "Prep",    translations: { en: "based on / according to", th: "ตาม / อิงจาก" },                imagePromptHint: "clay open document with arrow pointing to evidence reference" },
  { hanzi: "農曆",     zhuyin: "ㄋㄨㄥˊ ㄌㄧˋ",       pinyin: "nónglì",       partOfSpeech: "N",       translations: { en: "lunar calendar",          th: "ปฏิทินจันทรคติ" },               imagePromptHint: "clay traditional Chinese calendar with moon phases visible" },
  { hanzi: "農業",     zhuyin: "ㄋㄨㄥˊ ㄧㄝˋ",       pinyin: "nóngyè",       partOfSpeech: "N",       translations: { en: "agriculture",             th: "การเกษตร" },                    imagePromptHint: "clay rice fields with farmer working green crops growing" },
  { hanzi: "農人",     zhuyin: "ㄋㄨㄥˊ ㄖㄣˊ",       pinyin: "nóngrén",      partOfSpeech: "N",       translations: { en: "farmer",                  th: "ชาวนา / เกษตรกร" },             imagePromptHint: "clay friendly farmer with straw hat hoe in rice field" },
  { hanzi: "難得",     zhuyin: "ㄋㄢˊ ㄉㄜˊ",        pinyin: "nándé",        partOfSpeech: "Vs",      translations: { en: "rare / hard-to-come-by",  th: "หาได้ยาก / นานๆ ครั้ง" },        imagePromptHint: "clay rare gem jewel sparkling diamond unique special find" },
  { hanzi: "祭祖",     zhuyin: "ㄐㄧˋ ㄗㄨˇ",         pinyin: "jìzǔ",         partOfSpeech: "Vi",      translations: { en: "to venerate ancestors",   th: "ไหว้บรรพบุรุษ" },                imagePromptHint: "clay altar with incense fruit offerings ancestor portraits respect" },
  { hanzi: "拜",       zhuyin: "ㄅㄞˋ",              pinyin: "bài",          partOfSpeech: "V",       translations: { en: "to honor / pay homage",   th: "ไหว้" },                        imagePromptHint: "clay person bowing hands clasped praying respect gesture" },
  { hanzi: "神",       zhuyin: "ㄕㄣˊ",              pinyin: "shén",         partOfSpeech: "N",       translations: { en: "gods / divinities",       th: "เทพเจ้า" },                     imagePromptHint: "clay ornate temple statue golden god deity figure traditional" },
  { hanzi: "端午節",   zhuyin: "ㄉㄨㄢ ㄨˇ ㄐㄧㄝˊ",  pinyin: "Duānwǔ jié",   partOfSpeech: "Name",    translations: { en: "Dragon Boat Festival",    th: "เทศกาลเรือมังกร" },              imagePromptHint: "clay dragon boat with rowers paddling rice dumpling zongzi festival" },
  { hanzi: "中秋節",   zhuyin: "ㄓㄨㄥ ㄑㄧㄡ ㄐㄧㄝˊ", pinyin: "Zhōngqiū jié", partOfSpeech: "Name",  translations: { en: "Mid-autumn Moon Festival", th: "เทศกาลไหว้พระจันทร์" },          imagePromptHint: "clay full bright moon with mooncakes family gathering autumn night" },
  { hanzi: "雄黃酒",   zhuyin: "ㄒㄩㄥˊ ㄏㄨㄤˊ ㄐㄧㄡˇ", pinyin: "xiónghuáng jiǔ", partOfSpeech: "Name", translations: { en: "realgar liquor (festival drink)", th: "เหล้าซยงหวง (เครื่องดื่มเทศกาล)" }, imagePromptHint: "clay traditional Chinese liquor cup with red label dragon boat festival" },
  { hanzi: "古時候",   zhuyin: "ㄍㄨˇ ㄕˊ ㄏㄡˋ",     pinyin: "gǔ shíhòu",    partOfSpeech: "Phrase",  translations: { en: "in ancient times",        th: "สมัยโบราณ" },                   imagePromptHint: "clay old scroll ink brush ancient writing tradition history" },
  { hanzi: "趕走",     zhuyin: "ㄍㄢˇ ㄗㄡˇ",         pinyin: "gǎnzǒu",       partOfSpeech: "Phrase",  translations: { en: "to drive away / chase off", th: "ไล่ออก / ขับไล่" },             imagePromptHint: "clay broom sweeping away pesky bug shooing motion" },
  { hanzi: "過節",     zhuyin: "ㄍㄨㄛˋ ㄐㄧㄝˊ",     pinyin: "guò jié",      partOfSpeech: "Phrase",  translations: { en: "to celebrate / spend a holiday", th: "ฉลองเทศกาล" },             imagePromptHint: "clay family at festive table with lanterns red decorations" },
];

// ─── Grammar (9 patterns; one example each, paraphrased descriptions) ─────
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
    hanzi: "受到 (…的) 影響",
    pinyin: "shòu dào (... de) yǐngxiǎng",
    translations: { en: "to be influenced/affected by",
                    th: "ได้รับอิทธิพล / ผลกระทบจาก..." },
    example: { sentence: "他的公司受到經濟不好的影響。", sentencePinyin: "Tā de gōngsī shòu dào jīngjì bù hǎo de yǐngxiǎng.", sentenceTh: "บริษัทของเขาได้รับผลกระทบจากเศรษฐกิจไม่ดี" },
    mnemonic: "受到 = receive an effect; the cause sits between 受到 and 的影響",
    note: "Slightly formal; pairs with many nouns beyond 影響",
  },
  {
    hanzi: "幸虧…",
    pinyin: "xìngkuī…",
    translations: { en: "fortunately…",
                    th: "โชคดีที่ / นับว่าโชคดี..." },
    example: { sentence: "幸虧我帶了傘,要不然就被淋濕了。", sentencePinyin: "Xìngkuī wǒ dài le sǎn, yàoburán jiù bèi línshī le.", sentenceTh: "โชคดีที่ฉันพกร่ม ไม่งั้นเปียกแล้ว" },
    mnemonic: "introduces a relief — bad outcome avoided. Often paired with 要不然/才",
  },
  {
    hanzi: "算是…",
    pinyin: "suànshì…",
    translations: { en: "can be considered…",
                    th: "ถือว่า / นับว่า..." },
    example: { sentence: "教書算是穩定的工作。", sentencePinyin: "Jiāoshū suànshì wěndìng de gōngzuò.", sentenceTh: "การสอนถือว่าเป็นงานที่มั่นคง" },
    mnemonic: "moderate evaluation by comparison. Negative form is 不算 (not 算是不…)",
  },
  {
    hanzi: "是…",
    pinyin: "shì… (agreement marker)",
    translations: { en: "it is indeed true that…",
                    th: "ก็จริงอยู่ที่..." },
    example: { sentence: "她解釋得是很清楚,而且很有趣。", sentencePinyin: "Tā jiěshì de shì hěn qīngchǔ, érqiě hěn yǒuqù.", sentenceTh: "เธออธิบายชัดเจนจริง และยังน่าสนใจด้วย" },
    mnemonic: "stressed 是 = 'yes you're right that…'. Often followed by 可是/不過 to add a caveat",
  },
  {
    hanzi: "難怪…",
    pinyin: "nánguài…",
    translations: { en: "no wonder…",
                    th: "มิน่า / ไม่น่าแปลกใจที่..." },
    example: { sentence: "他下星期有口頭報告,難怪這幾天都熬夜。", sentencePinyin: "Tā xià xīngqí yǒu kǒutóu bàogào, nánguài zhè jǐ tiān dōu áoyè.", sentenceTh: "อาทิตย์หน้าเขามีรายงานปากเปล่า มิน่าหลายวันนี้อดนอนเลย" },
    mnemonic: "new fact (clause 1) clears up old puzzlement (clause 2 with 難怪)",
  },
  {
    hanzi: "…死了",
    pinyin: "…sǐle (post-verbal intensifier)",
    translations: { en: "extremely…/ to death",
                    th: "...สุดๆ / ...จะตาย" },
    example: { sentence: "我餓死了,趕快吃飯吧。", sentencePinyin: "Wǒ è sǐle, gǎnkuài chīfàn ba.", sentenceTh: "ฉันหิวจะตาย รีบไปกินข้าวกันเถอะ" },
    mnemonic: "highest intensity (vs 極了/得不得了/得很). Usually negative; exceptions: 高興死了, 樂死了",
  },
  {
    hanzi: "幾乎…",
    pinyin: "jīhū…",
    translations: { en: "almost / nearly…",
                    th: "เกือบ / แทบจะ..." },
    example: { sentence: "這幾天幾乎每天都下雨。", sentencePinyin: "Zhè jǐ tiān jīhū měi tiān dōu xià yǔ.", sentenceTh: "หลายวันนี้แทบจะฝนตกทุกวัน" },
    mnemonic: "indicates near-totality. With numbers, 幾乎 means 'just under' — different from 差不多 (about)",
  },
  {
    hanzi: "多少…",
    pinyin: "duōshǎo… (somewhat)",
    translations: { en: "at least somewhat / a little",
                    th: "อย่างน้อย / มากน้อยก็..." },
    example: { sentence: "你不餓,可是多少吃一點吧。", sentencePinyin: "Nǐ bù è, kěshì duōshǎo chī yìdiǎn ba.", sentenceTh: "ไม่หิวก็จริง แต่ก็กินสักนิดสิ" },
    mnemonic: "stresses that some non-zero amount exists. Different from quantity question 'how much'",
  },
  {
    hanzi: "再…也…",
    pinyin: "zài… yě…",
    translations: { en: "no matter how… still…",
                    th: "ไม่ว่าจะ...แค่ไหน ก็..." },
    example: { sentence: "學中文壓力再大,我也要繼續學。", sentencePinyin: "Xué zhōngwén yālì zài dà, wǒ yě yào jìxù xué.", sentenceTh: "เรียนจีนเครียดแค่ไหน ฉันก็จะเรียนต่อ" },
    mnemonic: "extreme circumstance + 也 outcome. More intense than 不管…都…",
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

  // Vocabulary metadata for both vocab lessons
  console.log("📚 Upserting Chapter 3 vocabulary metadata…");
  await upsertVocab(VOCAB_1, "ms-c3-v1");
  await upsertVocab(VOCAB_2, "ms-c3-v2");
  console.log(`  ✅ ${VOCAB_1.length + VOCAB_2.length} entries\n`);

  // Stage MS-C3
  const stageC3 = await db.stage.upsert({
    where: { courseId_code: { courseId: course.id, code: "MS-C3" } },
    create: {
      courseId: course.id, code: "MS-C3",
      title: "第三課 外套帶了沒有？",
      titleI18n: { en: "Lesson 3 — Did You Bring Your Coat?", th: "บทที่ 3 — เอาเสื้อโค้ทมาด้วยไหม?" },
      description: "氣候、節日 · Climate & Holidays",
      orderIndex: 2,
    },
    update: {
      title: "第三課 外套帶了沒有？",
      titleI18n: { en: "Lesson 3 — Did You Bring Your Coat?", th: "บทที่ 3 — เอาเสื้อโค้ทมาด้วยไหม?" },
      description: "氣候、節日 · Climate & Holidays",
      orderIndex: 2,
    },
  });

  // 1. Dialog (text loaded later via populate-dialog-or-reading helper)
  await ensureLesson({
    stageId: stageC3.id, code: "MS-C3-DIALOG-1",
    title: "對話一", titleEn: "Dialogue 1", titleTh: "บทสนทนา 1",
    description: "เนื้อหารอนำเข้าจาก PDF (รัน populate-dialog-or-reading.ts)",
    type: "VOCAB", orderIndex: 0, estimatedMinutes: 12, xpReward: 50,
    isPublished: true, // visible but the runner shows an empty state until paragraphs are populated
    content: { type: "reading-passage", title: "對話一 — 在火鍋店", titleTr: "บทสนทนา — ที่ร้านหม้อไฟ", paragraphs: [] },
  });

  // 2. Vocab 1 (37 items)
  await ensureLesson({
    stageId: stageC3.id, code: "MS-C3-VOCAB-1",
    title: "生詞 1", titleEn: "Vocabulary 1", titleTh: "คำศัพท์ 1",
    description: `${VOCAB_1.length} 個必修詞彙 (對話相關)`,
    type: "VOCAB", orderIndex: 1, estimatedMinutes: 20, xpReward: VOCAB_1.length * 4,
    content: {
      type: "vocabulary-list", heading: "生詞 1 — 對話",
      items: VOCAB_1.map((v) => ({ hanzi: v.hanzi, pinyin: v.pinyin, translations: v.translations, note: v.partOfSpeech })),
    },
  });

  // 3. Reading (text populated later)
  await ensureLesson({
    stageId: stageC3.id, code: "MS-C3-READING",
    title: "短文 — 華人的重要節日", titleEn: "Reading — Important Festivals", titleTh: "บทอ่าน — เทศกาลสำคัญของชาวจีน",
    description: "เนื้อหารอนำเข้า (รัน populate-dialog-or-reading.ts)",
    type: "VOCAB", orderIndex: 2, estimatedMinutes: 15, xpReward: 60,
    content: { type: "reading-passage", title: "華人的重要節日", titleTr: "เทศกาลสำคัญของชาวจีน", paragraphs: [] },
  });

  // 4. Vocab 2 (17 items)
  await ensureLesson({
    stageId: stageC3.id, code: "MS-C3-VOCAB-2",
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
    stageId: stageC3.id, code: "MS-C3-GRAMMAR",
    title: "文法 · 9 個句型", titleEn: "Grammar · 9 Patterns", titleTh: "ไวยากรณ์ · 9 รูปแบบ",
    description: "9 個語法句型 + 例句 + 記憶法",
    type: "VOCAB", orderIndex: 4, estimatedMinutes: 25, xpReward: GRAMMAR.length * 8,
    content: {
      type: "vocabulary-list", heading: "第三課 · 文法",
      items: GRAMMAR.map((g) => ({
        hanzi: g.hanzi, pinyin: g.pinyin, translations: g.translations,
        example: g.example, mnemonic: g.mnemonic, note: g.note,
      })),
    },
  });

  console.log(`✅ MS-C3: 5 lessons created (${VOCAB_1.length} + ${VOCAB_2.length} vocab + ${GRAMMAR.length} grammar patterns)`);

  // Stage MS-C2 — stub. Lessons left empty/unpublished for the user to populate later.
  const stageC2 = await db.stage.upsert({
    where: { courseId_code: { courseId: course.id, code: "MS-C2" } },
    create: {
      courseId: course.id, code: "MS-C2",
      title: "第二課 (待補)",
      titleI18n: { en: "Lesson 2 (pending PDF)", th: "บทที่ 2 (รอเพิ่ม)" },
      description: "等待用戶上傳第二課 PDF",
      orderIndex: 1,
    },
    update: {
      title: "第二課 (待補)",
      titleI18n: { en: "Lesson 2 (pending PDF)", th: "บทที่ 2 (รอเพิ่ม)" },
      description: "等待用戶上傳第二課 PDF",
      orderIndex: 1,
    },
  });
  // 5 placeholder lessons, unpublished
  const c2Stubs = [
    { code: "MS-C2-DIALOG-1", title: "對話一",      en: "Dialogue 1",   th: "บทสนทนา 1" },
    { code: "MS-C2-VOCAB-1",  title: "生詞 1",       en: "Vocabulary 1", th: "คำศัพท์ 1" },
    { code: "MS-C2-READING",  title: "短文",         en: "Reading",      th: "บทอ่าน" },
    { code: "MS-C2-VOCAB-2",  title: "生詞 2",       en: "Vocabulary 2", th: "คำศัพท์ 2" },
    { code: "MS-C2-GRAMMAR",  title: "文法",         en: "Grammar",      th: "ไวยากรณ์" },
  ];
  for (let i = 0; i < c2Stubs.length; i++) {
    const s = c2Stubs[i]!;
    await ensureLesson({
      stageId: stageC2.id, code: s.code, title: s.title,
      titleEn: s.en + " (pending)", titleTh: s.th + " (รอเพิ่ม)",
      description: "(待補) 上傳 PDF 後再啟用", type: "VOCAB",
      orderIndex: i, estimatedMinutes: 15, xpReward: 40,
      isPublished: false,
      content: { type: "vocabulary-list", heading: s.title, items: [] },
    });
  }
  console.log(`✅ MS-C2: 5 stub lessons (unpublished)`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
