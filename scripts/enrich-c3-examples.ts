/**
 * Add 1-2 example sentences to every Chapter 3 vocab word
 * (originally written here — climate/season context for V1, festival/tradition for V2).
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

// ─── V1 examples (climate / seasons / dialog topics) ────────────────────────
const V1_EXAMPLES: Record<string, Ex[]> = {
  "陳敏萱":   [{ sentence: "陳敏萱來自荷蘭。",                     pinyin: "Chén Mǐnxuān láizì Hélán.",                  translation: "เฉินมิ่นเซวียนมาจากเนเธอร์แลนด์" }],
  "高橋健太": [{ sentence: "高橋健太是日本人。",                   pinyin: "Gāoqiáo Jiàntài shì Rìběn rén.",              translation: "ทากาฮาชิเค็นตะเป็นชาวญี่ปุ่น" }],
  "空氣":     [{ sentence: "今天的空氣很乾淨。",                   pinyin: "Jīntiān de kōngqì hěn gānjìng.",              translation: "อากาศวันนี้สะอาดมาก" }, { sentence: "山上的空氣比較新鮮。", pinyin: "Shān shàng de kōngqì bǐjiào xīnxiān.", translation: "อากาศบนภูเขาสดใสกว่า" }],
  "影響":     [{ sentence: "天氣的影響很大。",                     pinyin: "Tiānqì de yǐngxiǎng hěn dà.",                  translation: "อากาศมีอิทธิพลมาก" }, { sentence: "他受到老師的影響。", pinyin: "Tā shòu dào lǎoshī de yǐngxiǎng.", translation: "เขาได้รับอิทธิพลจากคุณครู" }],
  "穩定":     [{ sentence: "工作穩定很重要。",                     pinyin: "Gōngzuò wěndìng hěn zhòngyào.",                translation: "งานที่มั่นคงสำคัญมาก" }, { sentence: "天氣不穩定。",       pinyin: "Tiānqì bù wěndìng.",                  translation: "อากาศไม่นิ่ง" }],
  "幸虧":     [{ sentence: "幸虧帶了傘。",                         pinyin: "Xìngkuī dài le sǎn.",                          translation: "โชคดีที่เอาร่มมา" }, { sentence: "幸虧你提醒我。",        pinyin: "Xìngkuī nǐ tíxǐng wǒ.",                translation: "โชคดีที่คุณเตือนฉัน" }],
  "躲":       [{ sentence: "下雨了,我們躲一下。",                  pinyin: "Xià yǔ le, wǒmen duǒ yíxià.",                  translation: "ฝนตกแล้ว เราหลบกันก่อน" }, { sentence: "貓躲在沙發後面。",     pinyin: "Māo duǒ zài shāfā hòumiàn.",            translation: "แมวซ่อนหลังโซฟา" }],
  "度":       [{ sentence: "今天 18 度。",                        pinyin: "Jīntiān shíbā dù.",                            translation: "วันนี้ 18 องศา" }, { sentence: "水到 100 度才會開。", pinyin: "Shuǐ dào yìbǎi dù cái huì kāi.",          translation: "น้ำต้องถึง 100 องศาถึงเดือด" }],
  "溫度":     [{ sentence: "請看溫度計。",                         pinyin: "Qǐng kàn wēndùjì.",                            translation: "กรุณาดูเทอร์โมมิเตอร์" }, { sentence: "夏天溫度很高。",     pinyin: "Xiàtiān wēndù hěn gāo.",                translation: "หน้าร้อนอุณหภูมิสูง" }],
  "零下":     [{ sentence: "北方冬天常常零下。",                    pinyin: "Běifāng dōngtiān chángcháng língxià.",          translation: "ภาคเหนือฤดูหนาวมักจะติดลบ" }, { sentence: "今天零下五度。",      pinyin: "Jīntiān língxià wǔ dù.",                translation: "วันนี้ติดลบ 5 องศา" }],
  "感覺":     [{ sentence: "我感覺很冷。",                         pinyin: "Wǒ gǎnjué hěn lěng.",                          translation: "ฉันรู้สึกหนาวมาก" }, { sentence: "你感覺怎麼樣?",        pinyin: "Nǐ gǎnjué zěnmeyàng?",                  translation: "คุณรู้สึกอย่างไร?" }],
  "實際":     [{ sentence: "實際的溫度很高。",                     pinyin: "Shíjì de wēndù hěn gāo.",                      translation: "อุณหภูมิจริงๆ สูง" }, { sentence: "實際情況不太一樣。",   pinyin: "Shíjì qíngkuàng bù tài yíyàng.",        translation: "สถานการณ์จริงไม่เหมือนกัน" }],
  "難怪":     [{ sentence: "難怪你那麼累。",                       pinyin: "Nánguài nǐ nàme lèi.",                          translation: "มิน่าคุณถึงเหนื่อยขนาดนั้น" }, { sentence: "難怪她不來。",           pinyin: "Nánguài tā bù lái.",                    translation: "มิน่าเธอถึงไม่มา" }],
  "季節":     [{ sentence: "這個季節最舒服。",                     pinyin: "Zhège jìjié zuì shūfu.",                       translation: "ฤดูนี้สบายที่สุด" }, { sentence: "你最喜歡哪個季節?",     pinyin: "Nǐ zuì xǐhuān nǎge jìjié?",            translation: "คุณชอบฤดูไหนมากที่สุด?" }],
  "火鍋":     [{ sentence: "冬天最適合吃火鍋。",                   pinyin: "Dōngtiān zuì shìhé chī huǒguō.",                translation: "ฤดูหนาวเหมาะกินหม้อไฟที่สุด" }, { sentence: "我們去吃火鍋吧!",      pinyin: "Wǒmen qù chī huǒguō ba!",                translation: "เราไปกินหม้อไฟกันเถอะ!" }],
  "海鮮":     [{ sentence: "海邊的海鮮新鮮。",                     pinyin: "Hǎibiān de hǎixiān xīnxiān.",                  translation: "อาหารทะเลที่ชายทะเลสด" }, { sentence: "我喜歡吃海鮮。",        pinyin: "Wǒ xǐhuān chī hǎixiān.",                translation: "ฉันชอบกินอาหารทะเล" }],
  "新鮮":     [{ sentence: "這個魚很新鮮。",                       pinyin: "Zhège yú hěn xīnxiān.",                        translation: "ปลาตัวนี้สดมาก" }, { sentence: "新鮮的水果好吃。",       pinyin: "Xīnxiān de shuǐguǒ hǎochī.",            translation: "ผลไม้สดอร่อย" }],
  "櫻花":     [{ sentence: "春天看櫻花真美。",                     pinyin: "Chūntiān kàn yīnghuā zhēn měi.",                translation: "ดูซากุระฤดูใบไม้ผลิสวยมาก" }, { sentence: "日本的櫻花很有名。",   pinyin: "Rìběn de yīnghuā hěn yǒumíng.",          translation: "ซากุระญี่ปุ่นมีชื่อเสียง" }],
  "變化":     [{ sentence: "天氣變化很大。",                       pinyin: "Tiānqì biànhuà hěn dà.",                        translation: "อากาศเปลี่ยนแปลงมาก" }, { sentence: "生活有變化。",           pinyin: "Shēnghuó yǒu biànhuà.",                  translation: "ชีวิตมีการเปลี่ยนแปลง" }],
  "氣溫":     [{ sentence: "氣溫降低了。",                         pinyin: "Qìwēn jiàngdī le.",                            translation: "อุณหภูมิลดลงแล้ว" }, { sentence: "今晚氣溫會更低。",       pinyin: "Jīn wǎn qìwēn huì gèng dī.",            translation: "คืนนี้อุณหภูมิจะลงต่ำกว่า" }],
  "差":       [{ sentence: "兩個城市的天氣差很多。",              pinyin: "Liǎng ge chéngshì de tiānqì chā hěn duō.",      translation: "อากาศสองเมืองต่างกันเยอะ" }, { sentence: "差五度。",             pinyin: "Chā wǔ dù.",                            translation: "ต่างกัน 5 องศา" }],
  "幾乎":     [{ sentence: "我幾乎每天都運動。",                   pinyin: "Wǒ jīhū měi tiān dōu yùndòng.",                translation: "ฉันแทบจะออกกำลังทุกวัน" }, { sentence: "他幾乎要哭了。",       pinyin: "Tā jīhū yào kū le.",                    translation: "เขาเกือบจะร้องไห้" }],
  "乾":       [{ sentence: "衣服還沒乾。",                         pinyin: "Yīfu hái méi gān.",                            translation: "เสื้อผ้ายังไม่แห้ง" }, { sentence: "毛巾乾了。",               pinyin: "Máojīn gān le.",                        translation: "ผ้าเช็ดตัวแห้งแล้ว" }],
  "發霉":     [{ sentence: "麵包發霉了。",                         pinyin: "Miànbāo fāméi le.",                            translation: "ขนมปังขึ้นราแล้ว" }, { sentence: "潮濕容易發霉。",        pinyin: "Cháoshī róngyì fāméi.",                  translation: "ชื้นๆ ขึ้นราง่าย" }],
  "除濕機":   [{ sentence: "我家裡有除濕機。",                     pinyin: "Wǒ jiā lǐ yǒu chúshījī.",                      translation: "บ้านฉันมีเครื่องลดความชื้น" }, { sentence: "除濕機很有用。",        pinyin: "Chúshījī hěn yǒuyòng.",                  translation: "เครื่องลดความชื้นมีประโยชน์มาก" }],
  "雨季":     [{ sentence: "雨季要帶傘。",                         pinyin: "Yǔjì yào dài sǎn.",                            translation: "ฤดูฝนต้องพกร่ม" }, { sentence: "台灣有雨季。",            pinyin: "Táiwān yǒu yǔjì.",                      translation: "ไต้หวันมีฤดูฝน" }],
  "涼快":     [{ sentence: "晚上涼快多了。",                       pinyin: "Wǎnshàng liángkuài duō le.",                    translation: "ตอนเย็นเย็นสบายขึ้นเยอะ" }, { sentence: "山上很涼快。",        pinyin: "Shān shàng hěn liángkuài.",              translation: "บนภูเขาเย็นสบาย" }],
  "潮濕":     [{ sentence: "台北很潮濕。",                         pinyin: "Táiběi hěn cháoshī.",                          translation: "ไทเปชื้นมาก" }, { sentence: "潮濕的天氣不舒服。",       pinyin: "Cháoshī de tiānqì bù shūfu.",            translation: "อากาศชื้นไม่สบายเลย" }],
  "悶":       [{ sentence: "夏天又悶又熱。",                       pinyin: "Xiàtiān yòu mēn yòu rè.",                      translation: "หน้าร้อนทั้งอบอ้าวทั้งร้อน" }, { sentence: "房間很悶,開窗吧。",   pinyin: "Fángjiān hěn mēn, kāi chuāng ba.",      translation: "ห้องอบอ้าว เปิดหน้าต่างเถอะ" }],
  "冷氣":     [{ sentence: "請開冷氣。",                           pinyin: "Qǐng kāi lěngqì.",                              translation: "กรุณาเปิดแอร์" }, { sentence: "冷氣壞了。",                 pinyin: "Lěngqì huài le.",                        translation: "แอร์เสีย" }],
  "荷蘭":     [{ sentence: "她從荷蘭來。",                         pinyin: "Tā cóng Hélán lái.",                            translation: "เธอมาจากเนเธอร์แลนด์" }],
  "出大太陽": [{ sentence: "今天出大太陽。",                       pinyin: "Jīntiān chū dà tàiyáng.",                       translation: "วันนี้แดดออกแรง" }],
  "颳風":     [{ sentence: "外面在颳風。",                         pinyin: "Wàimiàn zài guā fēng.",                        translation: "ข้างนอกลมแรง" }],
  "受到":     [{ sentence: "受到颱風的影響。",                     pinyin: "Shòu dào táifēng de yǐngxiǎng.",                translation: "ได้รับผลกระทบจากพายุ" }],
  "受不了":   [{ sentence: "太熱了,受不了。",                      pinyin: "Tài rè le, shòu bù liǎo.",                      translation: "ร้อนเกินไป ทนไม่ไหว" }],
  "餓死了":   [{ sentence: "我餓死了!",                            pinyin: "Wǒ è sǐle!",                                    translation: "หิวจะตายแล้ว!" }],
  "後母臉":   [{ sentence: "春天的天氣像後母臉。",                  pinyin: "Chūntiān de tiānqì xiàng hòumǔ liǎn.",          translation: "อากาศฤดูใบไม้ผลิเปลี่ยนเหมือนหน้าแม่เลี้ยง" }],
};

// ─── V2 examples (festivals / traditions) ───────────────────────────────────
const V2_EXAMPLES: Record<string, Ex[]> = {
  "祖先":     [{ sentence: "我們的祖先很重要。",                   pinyin: "Wǒmen de zǔxiān hěn zhòngyào.",                translation: "บรรพบุรุษของเราสำคัญมาก" }, { sentence: "祭拜祖先。",         pinyin: "Jìbài zǔxiān.",                          translation: "ไหว้บรรพบุรุษ" }],
  "移民":     [{ sentence: "他移民去美國。",                       pinyin: "Tā yímín qù Měiguó.",                          translation: "เขาอพยพไปอเมริกา" }, { sentence: "很多人從中國移民來。",  pinyin: "Hěn duō rén cóng Zhōngguó yímín lái.",  translation: "หลายคนอพยพมาจากจีน" }],
  "當中":     [{ sentence: "三個節日當中,春節最重要。",            pinyin: "Sān ge jiérì dāngzhōng, Chūnjié zuì zhòngyào.", translation: "ในสามเทศกาล ตรุษจีนสำคัญที่สุด" }, { sentence: "朋友當中她最高。", pinyin: "Péngyǒu dāngzhōng tā zuì gāo.",          translation: "ในบรรดาเพื่อนๆ เธอสูงที่สุด" }],
  "根據":     [{ sentence: "根據傳統慶祝節日。",                    pinyin: "Gēnjù chuántǒng qìngzhù jiérì.",                translation: "ฉลองเทศกาลตามประเพณี" }, { sentence: "根據新聞報導。",        pinyin: "Gēnjù xīnwén bàodǎo.",                  translation: "ตามข่าวที่รายงาน" }],
  "農曆":     [{ sentence: "農曆新年快樂!",                        pinyin: "Nónglì xīnnián kuàilè!",                        translation: "สุขสันต์วันตรุษจีน!" }, { sentence: "他用農曆過生日。",        pinyin: "Tā yòng nónglì guò shēngrì.",            translation: "เขาฉลองวันเกิดตามจันทรคติ" }],
  "農業":     [{ sentence: "古代是農業社會。",                      pinyin: "Gǔdài shì nóngyè shèhuì.",                      translation: "สมัยโบราณเป็นสังคมเกษตร" }, { sentence: "農業很重要。",         pinyin: "Nóngyè hěn zhòngyào.",                  translation: "การเกษตรสำคัญมาก" }],
  "農人":     [{ sentence: "農人很辛苦。",                          pinyin: "Nóngrén hěn xīnkǔ.",                            translation: "ชาวนาเหนื่อยมาก" }, { sentence: "農人靠天吃飯。",          pinyin: "Nóngrén kào tiān chīfàn.",              translation: "ชาวนาพึ่งพาธรรมชาติ" }],
  "難得":     [{ sentence: "難得放假,要好好休息。",                 pinyin: "Nándé fàngjià, yào hǎohǎo xiūxí.",              translation: "หาวันหยุดได้ยาก ต้องพักให้ดี" }, { sentence: "這是難得的機會。",     pinyin: "Zhè shì nándé de jīhuì.",                translation: "นี่คือโอกาสที่หาได้ยาก" }],
  "祭祖":     [{ sentence: "過年要祭祖。",                          pinyin: "Guònián yào jìzǔ.",                            translation: "ตรุษจีนต้องไหว้บรรพบุรุษ" }, { sentence: "他們在家祭祖。",        pinyin: "Tāmen zài jiā jìzǔ.",                    translation: "พวกเขาไหว้บรรพบุรุษที่บ้าน" }],
  "拜":       [{ sentence: "去廟裡拜拜。",                          pinyin: "Qù miào lǐ bàibài.",                            translation: "ไปไหว้ที่วัด" }, { sentence: "他每天早上拜神。",            pinyin: "Tā měi tiān zǎoshàng bài shén.",        translation: "เขาไหว้เทพเจ้าทุกเช้า" }],
  "神":       [{ sentence: "希望神保佑我們。",                      pinyin: "Xīwàng shén bǎoyòu wǒmen.",                    translation: "ขอเทพเจ้าคุ้มครองเรา" }, { sentence: "廟裡有很多神像。",       pinyin: "Miào lǐ yǒu hěn duō shénxiàng.",        translation: "ในวัดมีรูปเทพเจ้าเยอะ" }],
  "端午節":   [{ sentence: "端午節吃粽子。",                        pinyin: "Duānwǔ jié chī zòngzi.",                        translation: "เทศกาลเรือมังกรกินบ๊ะจ่าง" }],
  "中秋節":   [{ sentence: "中秋節吃月餅。",                        pinyin: "Zhōngqiū jié chī yuèbǐng.",                    translation: "เทศกาลไหว้พระจันทร์กินขนมไหว้พระจันทร์" }],
  "雄黃酒":   [{ sentence: "古代人喝雄黃酒。",                      pinyin: "Gǔdài rén hē xiónghuáng jiǔ.",                  translation: "คนโบราณดื่มเหล้าซยงหวง" }],
  "古時候":   [{ sentence: "古時候沒有電。",                        pinyin: "Gǔ shíhòu méiyǒu diàn.",                        translation: "สมัยโบราณไม่มีไฟฟ้า" }],
  "趕走":     [{ sentence: "趕走蚊子。",                            pinyin: "Gǎnzǒu wénzi.",                                translation: "ไล่ยุง" }],
  "過節":     [{ sentence: "和家人一起過節。",                      pinyin: "Hé jiārén yīqǐ guò jié.",                      translation: "ฉลองเทศกาลกับครอบครัว" }],
};

interface Item {
  hanzi: string;
  pinyin?: string;
  translations?: Record<string, string>;
  note?: string;
  examples?: Array<{ sentence: string; pinyin?: string; translation?: string }>;
  example?: { sentence?: string; sentencePinyin?: string; sentenceTh?: string };
  mnemonic?: string;
  usageNote?: string;
}

async function enrichLesson(lessonCode: string, exMap: Record<string, Ex[]>) {
  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, content: true },
  });
  if (!lesson) return 0;
  const content = lesson.content as { type?: string; heading?: string; items?: Item[] } | null;
  if (!content?.items) return 0;

  let added = 0;
  const updated: Item[] = content.items.map((item) => {
    const exs = exMap[item.hanzi];
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
  console.log("=== Chapter 3 example enrichment ===\n");
  const v1 = await enrichLesson("MS-C3-VOCAB-1", V1_EXAMPLES);
  const v2 = await enrichLesson("MS-C3-VOCAB-2", V2_EXAMPLES);
  console.log(`\n🎉 Total: ${v1 + v2} examples`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
