/**
 * Seed MY-SCHOOL Chapter 4 — 第四課 我愛台灣的人情味 (I Love Taiwanese Hospitality)
 *
 * 5 lessons matching the textbook structure:
 *   1. MS-C4-DIALOG-1   對話 — text loaded via populate-reading.ts
 *   2. MS-C4-VOCAB-1    生詞 1 (35 items: 29 vocab + 3 names + 3 phrases)
 *   3. MS-C4-READING    短文 — text loaded via populate-reading.ts
 *   4. MS-C4-VOCAB-2    生詞 2 (29 items: 24 vocab + 2 names + 3 phrases)
 *   5. MS-C4-GRAMMAR    文法 (8 patterns)
 *
 * Multi-language: every vocab carries en/th/vi/id translations from the start.
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
  translations: { en: string; th: string; vi: string; id: string };
  imagePromptHint: string;
}

// ─── Vocabulary 1 (35 items: 29 vocab + 3 names + 3 phrases) ──────────────
const VOCAB_1: VocabSeed[] = [
  { hanzi: "愛",       zhuyin: "ㄞˋ",                pinyin: "ài",            partOfSpeech: "Vst", translations: { en: "to love",                          th: "รัก",                                  vi: "yêu",                                id: "mencintai / suka" },                          imagePromptHint: "clay heart shape with sparkles loving care embrace" },
  { hanzi: "人情味",   zhuyin: "ㄖㄣˊ ㄑㄧㄥˊ ㄨㄟˋ", pinyin: "rénqíngwèi",    partOfSpeech: "N",   translations: { en: "hospitality / warmth toward people", th: "น้ำใจ / ความเอื้อเฟื้อ",            vi: "tình cảm / lòng hiếu khách",         id: "keramahan / kehangatan manusiawi" },         imagePromptHint: "clay friendly people sharing tea warm hands welcoming smile" },
  { hanzi: "放",       zhuyin: "ㄈㄤˋ",              pinyin: "fàng",          partOfSpeech: "V",   translations: { en: "to release / let go",              th: "ปล่อย / ปล่อยไป",                       vi: "thả / phóng",                        id: "melepaskan / membiarkan" },                  imagePromptHint: "clay hands releasing sky lantern floating up into starry sky" },
  { hanzi: "天燈",     zhuyin: "ㄊㄧㄢ ㄉㄥ",          pinyin: "tiāndēng",      partOfSpeech: "N",   translations: { en: "sky lantern",                      th: "โคมลอย",                               vi: "đèn trời",                           id: "lampion langit" },                            imagePromptHint: "clay glowing red orange sky lantern rising into night sky" },
  { hanzi: "願望",     zhuyin: "ㄩㄢˋ ㄨㄤˋ",         pinyin: "yuànwàng",      partOfSpeech: "N",   translations: { en: "wish / aspiration",                th: "คำอธิษฐาน / ความปรารถนา",              vi: "ước nguyện / mong ước",              id: "harapan / cita-cita" },                       imagePromptHint: "clay person hands together praying shooting star wish" },
  { hanzi: "訊號",     zhuyin: "ㄒㄩㄣˋ ㄏㄠˋ",       pinyin: "xùnhào",        partOfSpeech: "N",   translations: { en: "signal (data connection)",         th: "สัญญาณ (มือถือ)",                       vi: "tín hiệu (mạng / sóng)",             id: "sinyal (jaringan)" },                         imagePromptHint: "clay phone with signal bars cell tower waves radio" },
  { hanzi: "元宵",     zhuyin: "ㄩㄢˊ ㄒㄧㄠ",        pinyin: "yuánxiāo",      partOfSpeech: "N",   translations: { en: "sweet sticky-rice dumplings",      th: "ขนมบัวลอยจีน",                          vi: "bánh trôi nước",                     id: "kue bola ketan manis" },                      imagePromptHint: "clay bowl of round white sticky rice dumplings in sweet soup" },
  { hanzi: "牆",       zhuyin: "ㄑㄧㄤˊ",            pinyin: "qiáng",         partOfSpeech: "N",   translations: { en: "wall",                             th: "กำแพง",                                vi: "tường",                              id: "tembok / dinding" },                          imagePromptHint: "clay brick wall with old characters carved Confucian temple" },
  { hanzi: "耐心",     zhuyin: "ㄋㄞˋ ㄒㄧㄣ",        pinyin: "nàixīn",        partOfSpeech: "N",   translations: { en: "patience",                         th: "ความอดทน / ความใจเย็น",                vi: "kiên nhẫn",                          id: "kesabaran" },                                 imagePromptHint: "clay calm meditating person hourglass beside them peaceful" },
  { hanzi: "感動",     zhuyin: "ㄍㄢˇ ㄉㄨㄥˋ",       pinyin: "gǎndòng",       partOfSpeech: "Vs",  translations: { en: "to be moved / touched",            th: "ซาบซึ้ง / ประทับใจ",                    vi: "cảm động",                           id: "terharu / tersentuh" },                       imagePromptHint: "clay person tears in eyes hand on chest emotional touched" },
  { hanzi: "擔仔麵",   zhuyin: "ㄉㄢˋ ㄗㄞˇ ㄇㄧㄢˋ", pinyin: "dànzǎimiàn",    partOfSpeech: "N",   translations: { en: "Danzai noodles (Tainan dish)",     th: "บะหมี่ตันไจ้ (อาหารพิเศษไถหนาน)",       vi: "mì Đam Tử (đặc sản Đài Nam)",        id: "mi Danzai (khas Tainan)" },                   imagePromptHint: "clay small bowl of noodles topped with shrimp pork sauce Tainan" },
  { hanzi: "招牌",     zhuyin: "ㄓㄠ ㄆㄞˊ",          pinyin: "zhāopái",       partOfSpeech: "N",   translations: { en: "store sign / signboard",           th: "ป้ายร้าน",                              vi: "biển hiệu",                          id: "papan nama toko" },                           imagePromptHint: "clay colorful Taiwanese street shop sign hanging above storefront" },
  { hanzi: "當地",     zhuyin: "ㄉㄤ ㄉㄧˋ",          pinyin: "dāngdì",        partOfSpeech: "Vs-attr", translations: { en: "local",                         th: "ท้องถิ่น",                              vi: "địa phương / bản địa",               id: "setempat / lokal" },                          imagePromptHint: "clay map pin with local people in traditional clothes pointing" },
  { hanzi: "賺",       zhuyin: "ㄓㄨㄢˋ",            pinyin: "zhuàn",         partOfSpeech: "V",   translations: { en: "to earn (money)",                  th: "หา (เงิน) / กำไร",                      vi: "kiếm (tiền)",                        id: "menghasilkan (uang)" },                        imagePromptHint: "clay hand catching coins golden money raining down rich" },
  { hanzi: "而",       zhuyin: "ㄦˊ",                pinyin: "ér",            partOfSpeech: "Adv", translations: { en: "rather / on the other hand",       th: "แต่ / ในทางตรงกันข้าม",                 vi: "mà / trái lại",                      id: "melainkan / sedangkan" },                     imagePromptHint: "clay split scene yes no contrast arrow comparison" },
  { hanzi: "交",       zhuyin: "ㄐㄧㄠ",              pinyin: "jiāo",          partOfSpeech: "V",   translations: { en: "to make (friends)",                th: "ผูก (มิตร) / คบ",                       vi: "kết (bạn)",                          id: "berteman / bergaul" },                        imagePromptHint: "clay two people shaking hands becoming friends new acquaintance" },
  { hanzi: "理想",     zhuyin: "ㄌㄧˇ ㄒㄧㄤˇ",       pinyin: "lǐxiǎng",       partOfSpeech: "N",   translations: { en: "ideal / aspiration",               th: "อุดมคติ / ความใฝ่ฝัน",                  vi: "lý tưởng",                           id: "cita-cita / idealisme" },                     imagePromptHint: "clay person reaching for stars dream cloud aspiration vision" },
  { hanzi: "剛剛",     zhuyin: "ㄍㄤ ㄍㄤ",           pinyin: "gānggāng",      partOfSpeech: "Adv", translations: { en: "just now",                         th: "เมื่อกี้ / เมื่อสักครู่",               vi: "vừa nãy / vừa rồi",                  id: "tadi / barusan" },                            imagePromptHint: "clay clock with arrow pointing back just past moment now" },
  { hanzi: "改天",     zhuyin: "ㄍㄞˇ ㄊㄧㄢ",        pinyin: "gǎitiān",       partOfSpeech: "Adv", translations: { en: "some other day",                    th: "วันหลัง / โอกาสหน้า",                   vi: "hôm khác / dịp khác",                id: "lain hari / kapan-kapan" },                   imagePromptHint: "clay calendar with arrow pointing to future day later schedule" },
  { hanzi: "無聊",     zhuyin: "ㄨˊ ㄌㄧㄠˊ",         pinyin: "wúliáo",        partOfSpeech: "Vs",  translations: { en: "boring / dull",                    th: "น่าเบื่อ",                              vi: "chán / nhàm chán",                   id: "membosankan" },                               imagePromptHint: "clay person yawning slumped over with bored expression sleepy" },
  { hanzi: "東區",     zhuyin: "ㄉㄨㄥ ㄑㄩ",         pinyin: "dōngqū",        partOfSpeech: "N",   translations: { en: "East District (Taipei)",            th: "ย่านตงชู (ไทเปตะวันออก)",                vi: "khu Đông (Đài Bắc)",                 id: "Distrik Timur (Taipei)" },                    imagePromptHint: "clay bustling Taipei East District shopping street neon lights night" },
  { hanzi: "煙火",     zhuyin: "ㄧㄢ ㄏㄨㄛˇ",        pinyin: "yānhuǒ",        partOfSpeech: "N",   translations: { en: "fireworks",                         th: "ดอกไม้ไฟ / พลุ",                       vi: "pháo hoa",                           id: "kembang api" },                               imagePromptHint: "clay colorful exploding fireworks night sky celebration sparkle" },
  { hanzi: "跨年",     zhuyin: "ㄎㄨㄚˋ ㄋㄧㄢˊ",     pinyin: "kuànián",       partOfSpeech: "Vi",  translations: { en: "to ring in the new year",           th: "ฉลองข้ามปี / นับถอยหลังขึ้นปีใหม่",     vi: "đón giao thừa (dương lịch)",         id: "merayakan tahun baru / pergantian tahun" },   imagePromptHint: "clay countdown clock fireworks crowd celebrating midnight new year" },
  { hanzi: "種類",     zhuyin: "ㄓㄨㄥˇ ㄌㄟˋ",       pinyin: "zhǒnglèi",      partOfSpeech: "N",   translations: { en: "type / category / variety",         th: "ชนิด / ประเภท",                         vi: "loại / chủng loại",                  id: "jenis / kategori" },                          imagePromptHint: "clay sorted boxes labeled different types categories sorted" },
  { hanzi: "價錢",     zhuyin: "ㄐㄧㄚˋ ㄑㄧㄢˊ",     pinyin: "jiàqián",       partOfSpeech: "N",   translations: { en: "price",                             th: "ราคา",                                  vi: "giá / giá tiền",                     id: "harga" },                                     imagePromptHint: "clay price tag with dollar sign hanging from product label" },
  { hanzi: "感覺",     zhuyin: "ㄍㄢˇ ㄐㄩㄝˊ",        pinyin: "gǎnjué",        partOfSpeech: "N",   translations: { en: "feeling / sensation",               th: "ความรู้สึก",                            vi: "cảm giác",                           id: "perasaan" },                                  imagePromptHint: "clay person thinking with hand on chin sensing emotion bubble" },
  { hanzi: "雞排",     zhuyin: "ㄐㄧ ㄆㄞˊ",          pinyin: "jīpái",         partOfSpeech: "N",   translations: { en: "fried chicken cutlet",              th: "ไก่ทอดไต้หวัน (ไก่แผ่นใหญ่)",            vi: "miếng gà chiên Đài Loan",            id: "fillet ayam goreng Taiwan" },                  imagePromptHint: "clay large crispy fried chicken cutlet Taiwanese street food" },
  { hanzi: "口",       zhuyin: "ㄎㄡˇ",              pinyin: "kǒu",           partOfSpeech: "M",   translations: { en: "(measure: mouthful, bite)",         th: "(ลักษณนาม: คำ / ปาก)",                  vi: "(lượng từ: miếng / ngụm)",           id: "(kata bantu: suap / teguk)" },                imagePromptHint: "clay open mouth taking bite of food chomp" },
  { hanzi: "紅茶",     zhuyin: "ㄏㄨㄥˊ ㄔㄚˊ",       pinyin: "hóngchá",       partOfSpeech: "N",   translations: { en: "black tea (lit. red tea)",          th: "ชาดำ (จีนเรียกชาแดง)",                  vi: "trà đen / hồng trà",                 id: "teh hitam / teh merah" },                     imagePromptHint: "clay glass cup of dark amber tea steaming brewed" },
  { hanzi: "平溪",     zhuyin: "ㄆㄧㄥˊ ㄒㄧ",        pinyin: "Píngxī",        partOfSpeech: "Name", translations: { en: "Pingxi (town in N. Taiwan)",       th: "ผิงซี (เมืองทางเหนือไต้หวัน)",          vi: "Bình Khê (thị trấn ở Bắc Đài Loan)", id: "Pingxi (kota di Taiwan utara)" },             imagePromptHint: "clay Pingxi village railway tracks lanterns rising old town" },
  { hanzi: "元宵節",   zhuyin: "ㄩㄢˊ ㄒㄧㄠ ㄐㄧㄝˊ", pinyin: "Yuánxiāo jié",   partOfSpeech: "Name", translations: { en: "Lantern Festival",                  th: "เทศกาลโคมไฟ",                          vi: "Tết Nguyên Tiêu",                    id: "Festival Lampion" },                          imagePromptHint: "clay glowing red lanterns festival full moon night celebration" },
  { hanzi: "孔廟",     zhuyin: "ㄎㄨㄥˇ ㄇㄧㄠˋ",      pinyin: "Kǒngmiào",      partOfSpeech: "Name", translations: { en: "Confucian Temple",                  th: "ศาลขงจื๊อ",                            vi: "Miếu Khổng Tử",                      id: "Kuil Konfusius" },                            imagePromptHint: "clay traditional Confucian temple red roof courtyard old elegant" },
  { hanzi: "校外教學", zhuyin: "ㄒㄧㄠˋ ㄨㄞˋ ㄐㄧㄠ ㄒㄩㄝˊ", pinyin: "xiàowài jiāoxué", partOfSpeech: "Phrase", translations: { en: "field trip / class excursion", th: "ทัศนศึกษานอกสถานที่",                vi: "đi tham quan ngoại khóa",            id: "studi lapangan / ekskursi sekolah" },         imagePromptHint: "clay group of students with teacher visiting museum field trip" },
  { hanzi: "碰到",     zhuyin: "ㄆㄥˋ ㄉㄠˋ",          pinyin: "pèngdào",       partOfSpeech: "Phrase", translations: { en: "to run into / encounter",         th: "เจอ (โดยบังเอิญ)",                       vi: "gặp (tình cờ) / chạm phải",          id: "kebetulan bertemu" },                         imagePromptHint: "clay two people surprised running into each other on street" },
  { hanzi: "水煎包",   zhuyin: "ㄕㄨㄟˇ ㄐㄧㄢ ㄅㄠ", pinyin: "shuǐjiān bāo",   partOfSpeech: "Phrase", translations: { en: "pan-fried pork bun",              th: "ซาลาเปาทอดน้ำ (ขนมจีบทอด)",              vi: "bánh bao chiên áp chảo",             id: "bakpao goreng / pangsit kuah" },              imagePromptHint: "clay golden pan-fried buns with crispy bottom Taiwanese street snack" },
];

// ─── Vocabulary 2 (29 items: 24 vocab + 2 names + 3 phrases) ──────────────
const VOCAB_2: VocabSeed[] = [
  { hanzi: "同事",     zhuyin: "ㄊㄨㄥˊ ㄕˋ",        pinyin: "tóngshì",       partOfSpeech: "N",   translations: { en: "colleague / coworker",             th: "เพื่อนร่วมงาน",                         vi: "đồng nghiệp",                        id: "rekan kerja" },                               imagePromptHint: "clay two professional coworkers in office shaking hands smiling" },
  { hanzi: "美食",     zhuyin: "ㄇㄟˇ ㄕˊ",          pinyin: "měishí",        partOfSpeech: "N",   translations: { en: "delicious food / delicacy",         th: "อาหารอร่อย / อาหารเลิศ",               vi: "món ngon / mỹ thực",                 id: "makanan lezat / kuliner" },                   imagePromptHint: "clay table laden with colorful plates of delicious gourmet dishes" },
  { hanzi: "上",       zhuyin: "ㄕㄤˋ",              pinyin: "shàng",         partOfSpeech: "V",   translations: { en: "to go up to / get on",              th: "ขึ้น / ไปถึง",                          vi: "lên / đi lên",                       id: "naik / pergi ke" },                           imagePromptHint: "clay person climbing up arrow pointing up boarding bus" },
  { hanzi: "泡",       zhuyin: "ㄆㄠˋ",              pinyin: "pào",           partOfSpeech: "V",   translations: { en: "to steep (tea) / to soak",          th: "ชง (ชา) / แช่",                        vi: "pha (trà) / ngâm",                   id: "menyeduh (teh) / berendam" },                 imagePromptHint: "clay teapot pouring water teabag steeping tea steam aroma" },
  { hanzi: "錯過",     zhuyin: "ㄘㄨㄛˋ ㄍㄨㄛˋ",     pinyin: "cuòguò",        partOfSpeech: "Vpt", translations: { en: "to miss (an opportunity)",          th: "พลาด (โอกาส)",                         vi: "bỏ lỡ / lỡ mất",                     id: "melewatkan (kesempatan)" },                   imagePromptHint: "clay missed train leaving station person too late running" },
  { hanzi: "營業",     zhuyin: "ㄧㄥˊ ㄧㄝˋ",        pinyin: "yíngyè",        partOfSpeech: "Vi",  translations: { en: "to be open for business",           th: "เปิดให้บริการ / เปิดทำการ",            vi: "kinh doanh / mở cửa",                id: "buka / beroperasi" },                         imagePromptHint: "clay open sign hanging on shop door welcome business hours" },
  { hanzi: "夜景",     zhuyin: "ㄧㄝˋ ㄐㄧㄥˇ",       pinyin: "yèjǐng",        partOfSpeech: "N",   translations: { en: "night view / nightscape",           th: "วิวกลางคืน",                            vi: "cảnh đêm",                           id: "pemandangan malam" },                         imagePromptHint: "clay city skyline at night sparkling lights skyscrapers" },
  { hanzi: "古老",     zhuyin: "ㄍㄨˇ ㄌㄠˇ",        pinyin: "gǔlǎo",         partOfSpeech: "Vs",  translations: { en: "ancient / antiquated",              th: "เก่าแก่ / โบราณ",                       vi: "cổ xưa / cổ kính",                   id: "kuno / antik" },                              imagePromptHint: "clay old stone temple building weathered ancient ruins" },
  { hanzi: "古蹟",     zhuyin: "ㄍㄨˇ ㄐㄧ",          pinyin: "gǔjī",          partOfSpeech: "N",   translations: { en: "historical site / monument",        th: "โบราณสถาน",                            vi: "di tích cổ",                         id: "situs bersejarah / cagar budaya" },           imagePromptHint: "clay heritage monument plaque tourists walking historical landmark" },
  { hanzi: "重視",     zhuyin: "ㄓㄨㄥˋ ㄕˋ",         pinyin: "zhòngshì",      partOfSpeech: "Vst", translations: { en: "to value / emphasize",              th: "ให้ความสำคัญ / เห็นคุณค่า",            vi: "coi trọng / chú trọng",              id: "menghargai / mementingkan" },                 imagePromptHint: "clay hand holding precious gem important treasured emphasized" },
  { hanzi: "歷史",     zhuyin: "ㄌㄧˋ ㄕˇ",          pinyin: "lìshǐ",         partOfSpeech: "N",   translations: { en: "history",                            th: "ประวัติศาสตร์",                         vi: "lịch sử",                            id: "sejarah" },                                   imagePromptHint: "clay open ancient history book scrolls quill pen artifacts" },
  { hanzi: "風俗",     zhuyin: "ㄈㄥ ㄙㄨˊ",          pinyin: "fēngsú",        partOfSpeech: "N",   translations: { en: "customs / folkways",                 th: "ขนบธรรมเนียม / ประเพณีท้องถิ่น",        vi: "phong tục",                          id: "adat istiadat" },                              imagePromptHint: "clay traditional ceremony with people in folk costumes ritual" },
  { hanzi: "習慣",     zhuyin: "ㄒㄧˊ ㄍㄨㄢˋ",       pinyin: "xíguàn",        partOfSpeech: "N",   translations: { en: "habit / custom",                    th: "นิสัย / ความเคยชิน",                    vi: "thói quen",                          id: "kebiasaan" },                                  imagePromptHint: "clay daily routine calendar checked off recurring action habit" },
  { hanzi: "道地",     zhuyin: "ㄉㄠˋ ㄉㄧˋ",        pinyin: "dàodì",         partOfSpeech: "Vs",  translations: { en: "authentic / genuine",                th: "แท้ / ตามแบบฉบับ",                      vi: "chính gốc / đích thực",              id: "asli / autentik" },                            imagePromptHint: "clay seal stamp marked authentic genuine certified original" },
  { hanzi: "粥",       zhuyin: "ㄓㄡ",                pinyin: "zhōu",          partOfSpeech: "N",   translations: { en: "congee / rice porridge",            th: "โจ๊ก / ข้าวต้ม",                        vi: "cháo",                               id: "bubur" },                                     imagePromptHint: "clay steaming bowl of white rice porridge with toppings ginger" },
  { hanzi: "講究",     zhuyin: "ㄐㄧㄤˇ ㄐㄧㄡˋ",     pinyin: "jiǎngjiù",      partOfSpeech: "Vst", translations: { en: "to be particular about / fastidious", th: "พิถีพิถัน / เอาใจใส่",                   vi: "kén chọn / kỹ lưỡng",                id: "pilih-pilih / teliti" },                       imagePromptHint: "clay person carefully inspecting product with magnifying glass picky" },
  { hanzi: "頓",       zhuyin: "ㄉㄨㄣˋ",            pinyin: "dùn",           partOfSpeech: "M",   translations: { en: "(measure: meal)",                    th: "(ลักษณนาม: มื้ออาหาร)",                  vi: "(lượng từ: bữa ăn)",                 id: "(kata bantu: kali makan)" },                  imagePromptHint: "clay full plate of food meal table setting one sitting" },
  { hanzi: "速度",     zhuyin: "ㄙㄨˋ ㄉㄨˋ",        pinyin: "sùdù",          partOfSpeech: "N",   translations: { en: "speed",                              th: "ความเร็ว",                              vi: "tốc độ",                             id: "kecepatan" },                                  imagePromptHint: "clay speedometer needle fast motion blur swift action" },
  { hanzi: "窄",       zhuyin: "ㄓㄞˇ",              pinyin: "zhǎi",          partOfSpeech: "Vs",  translations: { en: "narrow",                             th: "แคบ",                                  vi: "hẹp / chật",                         id: "sempit" },                                     imagePromptHint: "clay narrow alley path between two buildings tight squeeze" },
  { hanzi: "街道",     zhuyin: "ㄐㄧㄝ ㄉㄠˋ",        pinyin: "jiēdào",        partOfSpeech: "N",   translations: { en: "street",                             th: "ถนน / ตรอกซอย",                         vi: "đường phố",                          id: "jalanan / jalan" },                            imagePromptHint: "clay charming Taiwanese street with old buildings shops walking" },
  { hanzi: "蓋",       zhuyin: "ㄍㄞˋ",              pinyin: "gài",           partOfSpeech: "V",   translations: { en: "to build / construct",               th: "สร้าง / ก่อสร้าง",                      vi: "xây / dựng",                         id: "membangun" },                                  imagePromptHint: "clay construction worker with hard hat building house bricks" },
  { hanzi: "待",       zhuyin: "ㄉㄞ",                pinyin: "dāi",           partOfSpeech: "Vi",  translations: { en: "to stay / remain",                   th: "อยู่ (ที่ใดที่หนึ่ง) / พำนัก",         vi: "ở lại / nán lại",                    id: "tinggal / menetap" },                          imagePromptHint: "clay cozy person sitting at home reading book staying inside" },
  { hanzi: "欣賞",     zhuyin: "ㄒㄧㄣ ㄕㄤˇ",        pinyin: "xīnshǎng",      partOfSpeech: "V",   translations: { en: "to appreciate / enjoy",              th: "ชื่นชม / เพลิดเพลิน",                   vi: "thưởng thức / thưởng ngoạn",         id: "menikmati / mengapresiasi" },                  imagePromptHint: "clay person in art gallery admiring painting hands clasped enjoying" },
  { hanzi: "美麗",     zhuyin: "ㄇㄟˇ ㄌㄧˋ",        pinyin: "měilì",         partOfSpeech: "Vs",  translations: { en: "beautiful",                          th: "สวยงาม / งดงาม",                        vi: "đẹp / mỹ lệ",                        id: "cantik / indah" },                            imagePromptHint: "clay scenic mountain lake beautiful landscape sunset stunning" },
  { hanzi: "鈴木",     zhuyin: "ㄌㄧㄥˊ ㄇㄨˋ",       pinyin: "Língmù",        partOfSpeech: "Name", translations: { en: "Suzuki (Japanese surname)",         th: "ซูซูกิ (นามสกุลญี่ปุ่น)",               vi: "Suzuki (họ Nhật Bản)",               id: "Suzuki (nama keluarga Jepang)" },             imagePromptHint: "clay portrait friendly Japanese man with Japan flag businessman" },
  { hanzi: "赤崁樓",   zhuyin: "ㄔˋ ㄎㄢˇ ㄌㄡˊ",    pinyin: "Chìkǎn Lóu",    partOfSpeech: "Name", translations: { en: "Chihkan Tower (Tainan landmark)",   th: "หอชื่อข่าน (ไถหนาน)",                   vi: "Lầu Xích Khám (di tích Đài Nam)",    id: "Menara Chihkan (landmark Tainan)" },          imagePromptHint: "clay historic Tainan red brick fort tower Dutch colonial era" },
  { hanzi: "留下來",   zhuyin: "ㄌㄧㄡˊ ㄒㄧㄚˋ ㄌㄞˊ", pinyin: "liú xià lái", partOfSpeech: "Phrase", translations: { en: "to leave behind / remain",         th: "ทิ้งไว้ / เก็บไว้",                     vi: "để lại / ở lại",                     id: "ditinggalkan / tertinggal" },                  imagePromptHint: "clay old book left on table memories preserved heritage" },
  { hanzi: "木造",     zhuyin: "ㄇㄨˋ ㄗㄠˋ",        pinyin: "mù zào",        partOfSpeech: "Phrase", translations: { en: "wooden / made of wood",            th: "ทำด้วยไม้",                            vi: "làm bằng gỗ",                        id: "berbahan kayu" },                              imagePromptHint: "clay traditional wooden Japanese house with sliding doors" },
  { hanzi: "非去不可", zhuyin: "ㄈㄟ ㄑㄩˋ ㄅㄨˋ ㄎㄜˇ", pinyin: "fēiqù bùkě", partOfSpeech: "Phrase", translations: { en: "must visit / a must-go",            th: "ต้องไปให้ได้ / ต้องไปเท่านั้น",         vi: "nhất định phải đi",                  id: "wajib didatangi" },                            imagePromptHint: "clay big bold red checkmark on travel destination map must-see" },
];

// ─── Grammar (8 patterns) ─────────────────────────────────────────────────
interface GrammarPattern {
  hanzi: string;
  pinyin: string;
  translations: { en: string; th: string; vi: string; id: string };
  example: { sentence: string; sentencePinyin: string; sentenceTh: string; sentenceEn: string; sentenceVi: string; sentenceId: string };
  mnemonic: string;
  note?: string;
}
const GRAMMAR: GrammarPattern[] = [
  {
    hanzi: "不但…，還…",
    pinyin: "búdàn… hái…",
    translations: {
      en: "not only…, but also…",
      th: "ไม่เพียงแค่... ยัง...",
      vi: "không những… mà còn…",
      id: "tidak hanya…, tetapi juga…",
    },
    example: {
      sentence: "他昨天買的那件外套不但輕,還很暖和。",
      sentencePinyin: "Tā zuótiān mǎi de nà jiàn wàitào búdàn qīng, hái hěn nuǎnhuo.",
      sentenceTh: "เสื้อโค้ทที่เขาซื้อเมื่อวานไม่เพียงเบา ยังอบอุ่นด้วย",
      sentenceEn: "The coat he bought yesterday is not only light, it's also warm.",
      sentenceVi: "Chiếc áo khoác anh ấy mua hôm qua không những nhẹ mà còn rất ấm.",
      sentenceId: "Mantel yang dia beli kemarin tidak hanya ringan, tetapi juga hangat.",
    },
    mnemonic: "不但 + clause 1, 還 + clause 2 — stack two facts about the same subject.",
    note: "If 而且 follows 不但, 還 can be omitted.",
  },
  {
    hanzi: "說 vs. 談",
    pinyin: "shuō vs. tán",
    translations: {
      en: "speak / say (one-way) vs. talk / discuss (two-way)",
      th: "พูด / บอก (ทางเดียว) vs. พูดคุย / สนทนา (สองทาง)",
      vi: "nói (một chiều) vs. trò chuyện (hai chiều)",
      id: "berbicara / mengatakan (satu arah) vs. berdiskusi (dua arah)",
    },
    example: {
      sentence: "我們剛剛說了很多話。老師想找你談話。",
      sentencePinyin: "Wǒmen gānggāng shuō le hěn duō huà. Lǎoshī xiǎng zhǎo nǐ tánhuà.",
      sentenceTh: "เราเพิ่งพูดกันเยอะมาก ครูอยากคุยกับคุณ",
      sentenceEn: "We just said a lot. The teacher wants to have a chat with you.",
      sentenceVi: "Chúng tôi vừa nói rất nhiều. Cô giáo muốn nói chuyện với bạn.",
      sentenceId: "Kami baru saja banyak bicara. Guru ingin berbincang dengan kamu.",
    },
    mnemonic: "說 = speak/say (informal, one direction). 談 = discuss (formal, back-and-forth).",
    note: "說 takes sentence objects far more often than 談.",
  },
  {
    hanzi: "不是…，而是…",
    pinyin: "búshì… érshì…",
    translations: {
      en: "not… but rather…",
      th: "ไม่ใช่... แต่กลับเป็น...",
      vi: "không phải… mà là…",
      id: "bukan… melainkan…",
    },
    example: {
      sentence: "我換新工作,不是因為薪水比較高,而是新公司離我家比較近。",
      sentencePinyin: "Wǒ huàn xīn gōngzuò, bú shì yīnwèi xīnshuǐ bǐjiào gāo, érshì xīn gōngsī lí wǒ jiā bǐjiào jìn.",
      sentenceTh: "ฉันเปลี่ยนงานใหม่ ไม่ใช่เพราะเงินเดือนสูงกว่า แต่เพราะบริษัทใหม่อยู่ใกล้บ้าน",
      sentenceEn: "I changed jobs not because the salary is higher, but because the new company is closer to home.",
      sentenceVi: "Tôi đổi việc không phải vì lương cao hơn, mà vì công ty mới gần nhà hơn.",
      sentenceId: "Saya pindah kerja bukan karena gaji lebih tinggi, melainkan karena kantor baru lebih dekat dari rumah.",
    },
    mnemonic: "不是 + wrong claim, 而是 + correct one. 而 is a literary adverb that can't stand alone.",
  },
  {
    hanzi: "從來 + 沒/不…",
    pinyin: "cónglái + méi/bù…",
    translations: {
      en: "have never… (past) / never (in general)",
      th: "ไม่เคย... / ไม่เคยจะ...",
      vi: "chưa bao giờ… / không bao giờ…",
      id: "tidak pernah… / belum pernah…",
    },
    example: {
      sentence: "我從來沒參加過跨年活動。",
      sentencePinyin: "Wǒ cónglái méi cānjiā guò kuànián huódòng.",
      sentenceTh: "ฉันไม่เคยเข้าร่วมงานเคาท์ดาวน์ปีใหม่",
      sentenceEn: "I've never been to a New Year's Eve countdown event.",
      sentenceVi: "Tôi chưa bao giờ tham gia hoạt động đón giao thừa.",
      sentenceId: "Saya belum pernah ikut acara pergantian tahun.",
    },
    mnemonic: "從來沒 + V + 過 = never did it (past). 從來不 + V = doesn't do it (in general).",
    note: "從來不 works for action and state verbs; 從來沒…過 works for action and process verbs.",
  },
  {
    hanzi: "上 (multi-meaning V)",
    pinyin: "shàng (multi-meaning V)",
    translations: {
      en: "to go up / get on / attend / browse",
      th: "ขึ้น / ขึ้นไป / เข้า (ห้อง/รถ) / ไป",
      vi: "lên / đi lên / dự / vào",
      id: "naik / pergi ke / mengikuti / mengakses",
    },
    example: {
      sentence: "春天的時候,很多人上陽明山泡溫泉、欣賞櫻花。",
      sentencePinyin: "Chūntiān de shíhòu, hěn duō rén shàng Yángmíng shān pào wēnquán, xīnshǎng yīnghuā.",
      sentenceTh: "ช่วงฤดูใบไม้ผลิ คนมากมายขึ้นเขาหยางหมิงไปแช่น้ำพุร้อนและชมซากุระ",
      sentenceEn: "In spring, many people go up Yangmingshan to soak in the hot springs and admire the cherry blossoms.",
      sentenceVi: "Mùa xuân, nhiều người lên núi Dương Minh tắm suối nước nóng và ngắm hoa anh đào.",
      sentenceId: "Saat musim semi, banyak orang naik ke Gunung Yangming untuk berendam di pemandian air panas dan menikmati sakura.",
    },
    mnemonic: "上山, 上車, 上飛機, 上班, 上網, 上電視 — same character, different uses to memorize.",
    note: "Each combination has to be learned individually; no general rule applies.",
  },
  {
    hanzi: "非…不可",
    pinyin: "fēi… bùkě",
    translations: {
      en: "must (do); have to",
      th: "จำเป็นต้อง... / ต้อง...ให้ได้",
      vi: "nhất định phải / không thể không…",
      id: "harus / mau tidak mau harus…",
    },
    example: {
      sentence: "台北這麼潮濕,我的鞋子都發霉了,非買除濕機不可。",
      sentencePinyin: "Táiběi zhème cháoshī, wǒ de xiézi dōu fāméi le, fēi mǎi chúshījī bùkě.",
      sentenceTh: "ไทเปชื้นมากจนรองเท้าฉันขึ้นรา ต้องซื้อเครื่องลดความชื้นแล้ว",
      sentenceEn: "Taipei is so humid that my shoes have moldedI absolutely have to buy a dehumidifier.",
      sentenceVi: "Đài Bắc ẩm quá, giày của tôi bị mốc rồi, nhất định phải mua máy hút ẩm.",
      sentenceId: "Taipei lembap sekali sampai sepatu saya berjamur, mau tidak mau harus beli dehumidifier.",
    },
    mnemonic: "非 (literary 'not') + verb phrase + 不可 (literary 'cannot do without') = absolute necessity.",
  },
  {
    hanzi: "對…來說",
    pinyin: "duì… láishuō",
    translations: {
      en: "as for / from the perspective of…",
      th: "สำหรับ... / ในมุมมองของ...",
      vi: "đối với… mà nói",
      id: "bagi… / dari sudut pandang…",
    },
    example: {
      sentence: "對台南人來說,早餐非常重要。",
      sentencePinyin: "Duì Táinán rén láishuō, zǎocān fēicháng zhòngyào.",
      sentenceTh: "สำหรับชาวไถหนาน อาหารเช้าสำคัญมาก",
      sentenceEn: "For people in Tainan, breakfast is extremely important.",
      sentenceVi: "Đối với người Đài Nam, bữa sáng rất quan trọng.",
      sentenceId: "Bagi orang Tainan, sarapan sangat penting.",
    },
    mnemonic: "對 + person/group + 來說 = the following statement is true *for* them; may not apply to others.",
  },
  {
    hanzi: "對…講究",
    pinyin: "duì… jiǎngjiù",
    translations: {
      en: "to be particular / picky about…",
      th: "พิถีพิถันเรื่อง... / เลือกเรื่อง...",
      vi: "kén chọn / kỹ tính về…",
      id: "pilih-pilih tentang… / teliti soal…",
    },
    example: {
      sentence: "高先生對住的環境非常講究,不但要離車站近,附近還要有公園。",
      sentencePinyin: "Gāo xiānsheng duì zhù de huánjìng fēicháng jiǎngjiù, búdàn yào lí chēzhàn jìn, fùjìn hái yào yǒu gōngyuán.",
      sentenceTh: "คุณเกาพิถีพิถันเรื่องที่อยู่อาศัยมาก ทั้งต้องใกล้สถานี และยังต้องมีสวนใกล้ๆ ด้วย",
      sentenceEn: "Mr. Gao is very particular about where he lives — it has to be near the station and have a park nearby.",
      sentenceVi: "Ông Cao rất kỹ tính về môi trường ở, vừa phải gần trạm xe vừa phải có công viên gần đó.",
      sentenceId: "Pak Gao sangat pilih-pilih soal tempat tinggal: harus dekat stasiun dan ada taman di sekitarnya.",
    },
    mnemonic: "對 + topic + 講究 = the subject demands the best in that domain.",
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
  stageId: string; code: string; title: string; titleI18n: Record<string, string>;
  description: string; type: "VOCAB"; orderIndex: number; estimatedMinutes: number; xpReward: number;
  content: object; isPublished?: boolean;
}) {
  return db.lesson.upsert({
    where: { stageId_code: { stageId: opts.stageId, code: opts.code } },
    create: {
      stageId: opts.stageId, code: opts.code, title: opts.title,
      titleI18n: opts.titleI18n,
      description: opts.description, type: opts.type, difficulty: 3,
      orderIndex: opts.orderIndex, estimatedMinutes: opts.estimatedMinutes,
      xpReward: opts.xpReward, isPublished: opts.isPublished ?? true,
      content: opts.content,
    },
    update: {
      title: opts.title, titleI18n: opts.titleI18n,
      description: opts.description, isPublished: opts.isPublished ?? true,
      orderIndex: opts.orderIndex, estimatedMinutes: opts.estimatedMinutes, xpReward: opts.xpReward,
      content: opts.content,
    },
  });
}

async function main() {
  const course = await db.course.findUnique({ where: { code: "MY-SCHOOL" } });
  if (!course) { console.error("MY-SCHOOL course missing"); process.exit(1); }

  console.log("📚 Upserting Chapter 4 vocabulary metadata…");
  await upsertVocab(VOCAB_1, "ms-c4-v1");
  await upsertVocab(VOCAB_2, "ms-c4-v2");
  console.log(`  ✅ ${VOCAB_1.length + VOCAB_2.length} entries\n`);

  // Stage MS-C4
  const stageC4 = await db.stage.upsert({
    where: { courseId_code: { courseId: course.id, code: "MS-C4" } },
    create: {
      courseId: course.id, code: "MS-C4",
      title: "第四課 我愛台灣的人情味",
      titleI18n: {
        en: "Lesson 4 — I Love Taiwanese Hospitality",
        th: "บทที่ 4 — ฉันรักน้ำใจของคนไต้หวัน",
        vi: "Bài 4 — Tôi Yêu Tình Người Đài Loan",
        id: "Pelajaran 4 — Aku Cinta Keramahan Taiwan",
      },
      description: "台灣文化、人情味、美食 · Taiwanese culture, hospitality & cuisine",
      orderIndex: 3,
    },
    update: {
      title: "第四課 我愛台灣的人情味",
      titleI18n: {
        en: "Lesson 4 — I Love Taiwanese Hospitality",
        th: "บทที่ 4 — ฉันรักน้ำใจของคนไต้หวัน",
        vi: "Bài 4 — Tôi Yêu Tình Người Đài Loan",
        id: "Pelajaran 4 — Aku Cinta Keramahan Taiwan",
      },
      description: "台灣文化、人情味、美食 · Taiwanese culture, hospitality & cuisine",
      orderIndex: 3,
    },
  });

  await ensureLesson({
    stageId: stageC4.id, code: "MS-C4-DIALOG-1",
    title: "對話一",
    titleI18n: { en: "Dialogue 1", th: "บทสนทนา 1", vi: "Hội thoại 1", id: "Dialog 1" },
    description: "在活動中心 · ที่ศูนย์กิจกรรม",
    type: "VOCAB", orderIndex: 0, estimatedMinutes: 12, xpReward: 50,
    isPublished: true,
    content: {
      type: "reading-passage",
      title: "對話一 — 在活動中心",
      titleTr: "บทสนทนา — ที่ศูนย์กิจกรรม",
      paragraphs: [],
    },
  });

  await ensureLesson({
    stageId: stageC4.id, code: "MS-C4-VOCAB-1",
    title: "生詞 1",
    titleI18n: { en: "Vocabulary 1", th: "คำศัพท์ 1", vi: "Từ vựng 1", id: "Kosakata 1" },
    description: `${VOCAB_1.length} 個必修詞彙 (對話相關)`,
    type: "VOCAB", orderIndex: 1, estimatedMinutes: 22, xpReward: VOCAB_1.length * 4,
    content: {
      type: "vocabulary-list", heading: "生詞 1 — 對話",
      items: VOCAB_1.map((v) => ({ hanzi: v.hanzi, pinyin: v.pinyin, translations: v.translations, note: v.partOfSpeech })),
    },
  });

  await ensureLesson({
    stageId: stageC4.id, code: "MS-C4-READING",
    title: "短文 — 台灣南北走一趟",
    titleI18n: {
      en: "Reading — A Trip Across Taiwan",
      th: "บทอ่าน — ตระเวนใต้สู่เหนือไต้หวัน",
      vi: "Bài đọc — Một chuyến đi Bắc Nam Đài Loan",
      id: "Bacaan — Perjalanan Utara-Selatan Taiwan",
    },
    description: "台灣南北走一趟 · เที่ยวเหนือใต้ของไต้หวัน",
    type: "VOCAB", orderIndex: 2, estimatedMinutes: 15, xpReward: 60,
    content: {
      type: "reading-passage",
      title: "台灣南北走一趟",
      titleTr: "ตระเวนใต้สู่เหนือไต้หวัน",
      paragraphs: [],
    },
  });

  await ensureLesson({
    stageId: stageC4.id, code: "MS-C4-VOCAB-2",
    title: "生詞 2",
    titleI18n: { en: "Vocabulary 2", th: "คำศัพท์ 2", vi: "Từ vựng 2", id: "Kosakata 2" },
    description: `${VOCAB_2.length} 個必修詞彙 (短文相關)`,
    type: "VOCAB", orderIndex: 3, estimatedMinutes: 18, xpReward: VOCAB_2.length * 4,
    content: {
      type: "vocabulary-list", heading: "生詞 2 — 短文",
      items: VOCAB_2.map((v) => ({ hanzi: v.hanzi, pinyin: v.pinyin, translations: v.translations, note: v.partOfSpeech })),
    },
  });

  await ensureLesson({
    stageId: stageC4.id, code: "MS-C4-GRAMMAR",
    title: "文法 · 8 個句型",
    titleI18n: {
      en: "Grammar · 8 Patterns",
      th: "ไวยากรณ์ · 8 รูปแบบ",
      vi: "Ngữ pháp · 8 mẫu câu",
      id: "Tata Bahasa · 8 Pola",
    },
    description: "8 個語法句型 + 例句 + 記憶法",
    type: "VOCAB", orderIndex: 4, estimatedMinutes: 25, xpReward: GRAMMAR.length * 8,
    content: {
      type: "vocabulary-list", heading: "第四課 · 文法",
      items: GRAMMAR.map((g) => ({
        hanzi: g.hanzi, pinyin: g.pinyin, translations: g.translations,
        example: {
          sentence: g.example.sentence,
          sentencePinyin: g.example.sentencePinyin,
          sentenceTh: g.example.sentenceTh,
        },
        examples: [{
          sentence: g.example.sentence,
          pinyin: g.example.sentencePinyin,
          translation: g.example.sentenceTh,
          translations: {
            en: g.example.sentenceEn,
            th: g.example.sentenceTh,
            vi: g.example.sentenceVi,
            id: g.example.sentenceId,
          },
        }],
        mnemonic: g.mnemonic, note: g.note,
      })),
    },
  });

  console.log(`✅ MS-C4: 5 lessons published (${VOCAB_1.length} + ${VOCAB_2.length} vocab + ${GRAMMAR.length} grammar patterns)`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
