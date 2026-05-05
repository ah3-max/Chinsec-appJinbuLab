/**
 * Add 2 example sentences to every word across all 12 A1 stages
 * (originally written here — simple, eldercare-relevant where applicable).
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

// ─── Examples per word (originally written) ──────────────────────────────────
const EXAMPLES: Record<string, Ex[]> = {
  // L1-S01 招呼用語
  "你好":   [{ sentence: "你好,我叫小美。",       pinyin: "Nǐ hǎo, wǒ jiào Xiǎoměi.",          translation: "สวัสดี ฉันชื่อเสี่ยวเหม่ย" }, { sentence: "你好,阿公!",  pinyin: "Nǐ hǎo, ā gōng!",  translation: "สวัสดีค่ะคุณตา" }],
  "早安":   [{ sentence: "早安,阿公!",            pinyin: "Zǎoān, ā gōng!",                   translation: "อรุณสวัสดิ์ค่ะคุณตา" }, { sentence: "老師早安。", pinyin: "Lǎoshī zǎoān.", translation: "อรุณสวัสดิ์ค่ะคุณครู" }],
  "午安":   [{ sentence: "午安,大家好。",          pinyin: "Wǔ'ān, dàjiā hǎo.",                translation: "สวัสดีตอนบ่ายทุกคน" }, { sentence: "院長午安!", pinyin: "Yuànzhǎng wǔ'ān!", translation: "สวัสดีตอนบ่ายค่ะท่านผู้อำนวยการ" }],
  "晚安":   [{ sentence: "晚安,阿嬤。",            pinyin: "Wǎnān, ā mā.",                     translation: "ราตรีสวัสดิ์ค่ะคุณยาย" }, { sentence: "晚安,睡得好。", pinyin: "Wǎnān, shuì de hǎo.", translation: "ราตรีสวัสดิ์ หลับฝันดี" }],
  "再見":   [{ sentence: "再見,明天見。",          pinyin: "Zàijiàn, míngtiān jiàn.",          translation: "ลาก่อน เจอกันพรุ่งนี้" }, { sentence: "我要走了,再見!", pinyin: "Wǒ yào zǒu le, zàijiàn!", translation: "ฉันจะไปแล้ว ลาก่อน" }],
  "謝謝":   [{ sentence: "謝謝你。",                pinyin: "Xièxie nǐ.",                       translation: "ขอบคุณคุณนะ" }, { sentence: "謝謝,真好吃。", pinyin: "Xièxie, zhēn hǎochī.", translation: "ขอบคุณ อร่อยมาก" }],
  "對不起": [{ sentence: "對不起,我遲到了。",      pinyin: "Duìbuqǐ, wǒ chídào le.",           translation: "ขอโทษ ฉันมาสาย" }, { sentence: "對不起,我聽不懂。", pinyin: "Duìbuqǐ, wǒ tīng bù dǒng.", translation: "ขอโทษ ฉันฟังไม่เข้าใจ" }],
  "不客氣": [{ sentence: "謝謝! 不客氣。",          pinyin: "Xièxie! Bú kèqì.",                 translation: "ขอบคุณ! ไม่เป็นไร" }, { sentence: "不客氣,沒關係。", pinyin: "Bú kèqì, méi guānxi.", translation: "ไม่เป็นไร ไม่มีอะไร" }],

  // L1-S02 自我介紹
  "我":     [{ sentence: "我是小美。",              pinyin: "Wǒ shì Xiǎoměi.",                  translation: "ฉันคือเสี่ยวเหม่ย" }, { sentence: "我來自泰國。", pinyin: "Wǒ láizì Tàiguó.", translation: "ฉันมาจากไทย" }],
  "你":     [{ sentence: "你叫什麼名字?",          pinyin: "Nǐ jiào shénme míngzi?",           translation: "คุณชื่ออะไร?" }, { sentence: "你是學生嗎?", pinyin: "Nǐ shì xuéshēng ma?", translation: "คุณเป็นนักเรียนไหม?" }],
  "他":     [{ sentence: "他是我哥哥。",           pinyin: "Tā shì wǒ gēge.",                  translation: "เขาคือพี่ชายฉัน" }, { sentence: "他在哪裡?",    pinyin: "Tā zài nǎlǐ?",            translation: "เขาอยู่ที่ไหน?" }],
  "她":     [{ sentence: "她是我媽媽。",           pinyin: "Tā shì wǒ māma.",                  translation: "เธอคือแม่ฉัน" }, { sentence: "她很高興。",    pinyin: "Tā hěn gāoxìng.",          translation: "เธอดีใจมาก" }],
  "名字":   [{ sentence: "你的名字是什麼?",        pinyin: "Nǐ de míngzi shì shénme?",         translation: "ชื่อคุณคืออะไร?" }, { sentence: "我的名字是小美。", pinyin: "Wǒ de míngzi shì Xiǎoměi.", translation: "ชื่อฉันคือเสี่ยวเหม่ย" }],
  "叫":     [{ sentence: "我叫小美。",              pinyin: "Wǒ jiào Xiǎoměi.",                 translation: "ฉันชื่อเสี่ยวเหม่ย" }, { sentence: "他叫什麼?", pinyin: "Tā jiào shénme?", translation: "เขาชื่ออะไร?" }],
  "中文":   [{ sentence: "我學中文。",              pinyin: "Wǒ xué zhōngwén.",                 translation: "ฉันเรียนภาษาจีน" }, { sentence: "她會說中文。", pinyin: "Tā huì shuō zhōngwén.", translation: "เธอพูดภาษาจีนได้" }],
  "泰國":   [{ sentence: "我來自泰國。",            pinyin: "Wǒ láizì Tàiguó.",                 translation: "ฉันมาจากประเทศไทย" }, { sentence: "他去泰國旅行。", pinyin: "Tā qù Tàiguó lǚxíng.", translation: "เขาไปท่องเที่ยวประเทศไทย" }],
  "越南":   [{ sentence: "她來自越南。",            pinyin: "Tā láizì Yuènán.",                 translation: "เธอมาจากเวียดนาม" }, { sentence: "越南菜很好吃。", pinyin: "Yuènán cài hěn hǎochī.", translation: "อาหารเวียดนามอร่อยมาก" }],
  "台灣":   [{ sentence: "我們在台灣。",            pinyin: "Wǒmen zài Táiwān.",                translation: "พวกเราอยู่ในไต้หวัน" }, { sentence: "台灣是個美麗的島。", pinyin: "Táiwān shì ge měilì de dǎo.", translation: "ไต้หวันเป็นเกาะที่สวยงาม" }],

  // L1-S03 數字
  "一": [{ sentence: "我有一個哥哥。",  pinyin: "Wǒ yǒu yí ge gēge.",     translation: "ฉันมีพี่ชายหนึ่งคน" }, { sentence: "我吃了一碗飯。", pinyin: "Wǒ chī le yì wǎn fàn.", translation: "ฉันกินข้าวหนึ่งชาม" }],
  "二": [{ sentence: "今天二號。",       pinyin: "Jīntiān èr hào.",         translation: "วันนี้วันที่สอง" }, { sentence: "我有二個女兒。", pinyin: "Wǒ yǒu èr ge nǚ'ér.", translation: "ฉันมีลูกสาวสองคน" }],
  "三": [{ sentence: "三點了。",          pinyin: "Sān diǎn le.",            translation: "บ่ายสามแล้ว" }, { sentence: "我有三本書。",   pinyin: "Wǒ yǒu sān běn shū.",   translation: "ฉันมีหนังสือสามเล่ม" }],
  "四": [{ sentence: "四個阿公阿嬤。",   pinyin: "Sì ge ā gōng ā mā.",      translation: "คุณตาคุณยายสี่คน" }, { sentence: "今天四號。",    pinyin: "Jīntiān sì hào.",       translation: "วันนี้วันที่สี่" }],
  "五": [{ sentence: "五分鐘到了。",      pinyin: "Wǔ fēnzhōng dào le.",     translation: "ครบห้านาทีแล้ว" }, { sentence: "我吃了五個藥丸。", pinyin: "Wǒ chī le wǔ ge yàowán.", translation: "ฉันกินยาห้าเม็ด" }],
  "六": [{ sentence: "六點起床。",        pinyin: "Liù diǎn qǐchuáng.",      translation: "ตื่นนอนหกโมงเช้า" }, { sentence: "我有六歲的孫女。", pinyin: "Wǒ yǒu liù suì de sūnnǚ.", translation: "ฉันมีหลานสาวอายุหกขวบ" }],
  "七": [{ sentence: "一週七天。",        pinyin: "Yì zhōu qī tiān.",        translation: "หนึ่งสัปดาห์มีเจ็ดวัน" }, { sentence: "我七點下班。",   pinyin: "Wǒ qī diǎn xiàbān.",    translation: "ฉันเลิกงานเจ็ดโมง" }],
  "八": [{ sentence: "八個月。",           pinyin: "Bā ge yuè.",              translation: "แปดเดือน" }, { sentence: "他八十歲了。",   pinyin: "Tā bāshí suì le.",      translation: "เขาอายุแปดสิบแล้ว" }],
  "九": [{ sentence: "九號房間。",        pinyin: "Jiǔ hào fángjiān.",       translation: "ห้องเลขเก้า" }, { sentence: "九點吃藥。",     pinyin: "Jiǔ diǎn chī yào.",     translation: "เก้าโมงกินยา" }],
  "十": [{ sentence: "十分鐘。",           pinyin: "Shí fēnzhōng.",           translation: "สิบนาที" }, { sentence: "她有十個孫子。", pinyin: "Tā yǒu shí ge sūnzi.",  translation: "เธอมีหลานสิบคน" }],

  // L1-S04 時間
  "今天":   [{ sentence: "今天天氣很好。",      pinyin: "Jīntiān tiānqì hěn hǎo.",     translation: "วันนี้อากาศดีมาก" }, { sentence: "今天我上班。", pinyin: "Jīntiān wǒ shàngbān.", translation: "วันนี้ฉันไปทำงาน" }],
  "明天":   [{ sentence: "明天見!",                pinyin: "Míngtiān jiàn!",              translation: "เจอกันพรุ่งนี้!" }, { sentence: "明天有客人來。", pinyin: "Míngtiān yǒu kèrén lái.", translation: "พรุ่งนี้มีแขกมา" }],
  "昨天":   [{ sentence: "昨天我去看醫生。",   pinyin: "Zuótiān wǒ qù kàn yīshēng.",  translation: "เมื่อวานฉันไปหาหมอ" }, { sentence: "昨天阿公感冒了。", pinyin: "Zuótiān ā gōng gǎnmào le.", translation: "เมื่อวานคุณตาเป็นหวัด" }],
  "早上":   [{ sentence: "早上好。",                pinyin: "Zǎoshàng hǎo.",               translation: "อรุณสวัสดิ์" }, { sentence: "早上六點起床。", pinyin: "Zǎoshàng liù diǎn qǐchuáng.", translation: "ตื่นนอนหกโมงเช้า" }],
  "中午":   [{ sentence: "中午吃飯。",              pinyin: "Zhōngwǔ chīfàn.",             translation: "กลางวันกินข้าว" }, { sentence: "中午我休息一下。", pinyin: "Zhōngwǔ wǒ xiūxí yíxià.", translation: "ตอนเที่ยงฉันพักหน่อย" }],
  "下午":   [{ sentence: "下午見。",                pinyin: "Xiàwǔ jiàn.",                 translation: "เจอกันบ่าย" }, { sentence: "下午有會議。", pinyin: "Xiàwǔ yǒu huìyì.", translation: "บ่ายนี้มีประชุม" }],
  "晚上":   [{ sentence: "晚上吃藥。",              pinyin: "Wǎnshàng chī yào.",           translation: "ตอนเย็นกินยา" }, { sentence: "晚上九點睡覺。", pinyin: "Wǎnshàng jiǔ diǎn shuìjiào.", translation: "สามทุ่มเข้านอน" }],
  "現在":   [{ sentence: "現在幾點?",               pinyin: "Xiànzài jǐ diǎn?",            translation: "ตอนนี้กี่โมง?" }, { sentence: "現在去廁所。", pinyin: "Xiànzài qù cèsuǒ.", translation: "ตอนนี้ไปห้องน้ำ" }],

  // L1-S05 身體部位
  "頭":     [{ sentence: "我的頭很痛。",        pinyin: "Wǒ de tóu hěn tòng.",         translation: "หัวฉันปวดมาก" }, { sentence: "阿公的頭髮很白。", pinyin: "Ā gōng de tóufǎ hěn bái.", translation: "ผมคุณตาขาวมาก" }],
  "眼睛":   [{ sentence: "她的眼睛很大。",      pinyin: "Tā de yǎnjīng hěn dà.",       translation: "ตาเธอโตมาก" }, { sentence: "用眼睛看書。", pinyin: "Yòng yǎnjīng kàn shū.", translation: "ใช้ตาอ่านหนังสือ" }],
  "嘴":     [{ sentence: "張開嘴吃藥。",        pinyin: "Zhāng kāi zuǐ chī yào.",      translation: "อ้าปากกินยา" }, { sentence: "用嘴吃飯。", pinyin: "Yòng zuǐ chīfàn.", translation: "ใช้ปากกินข้าว" }],
  "耳朵":   [{ sentence: "他的耳朵不好。",      pinyin: "Tā de ěrduo bù hǎo.",         translation: "หูเขาไม่ดี" }, { sentence: "用耳朵聽。",   pinyin: "Yòng ěrduo tīng.",          translation: "ใช้หูฟัง" }],
  "手":     [{ sentence: "我的手洗了。",        pinyin: "Wǒ de shǒu xǐ le.",           translation: "ฉันล้างมือแล้ว" }, { sentence: "握住我的手。", pinyin: "Wò zhù wǒ de shǒu.", translation: "จับมือฉันไว้" }],
  "腳":     [{ sentence: "我的腳痛。",            pinyin: "Wǒ de jiǎo tòng.",            translation: "เท้าฉันเจ็บ" }, { sentence: "用腳走路。",     pinyin: "Yòng jiǎo zǒulù.",          translation: "ใช้เท้าเดิน" }],
  "心臟":   [{ sentence: "心臟很重要。",         pinyin: "Xīnzàng hěn zhòngyào.",       translation: "หัวใจสำคัญมาก" }, { sentence: "他的心臟跳得很快。", pinyin: "Tā de xīnzàng tiào de hěn kuài.", translation: "หัวใจเขาเต้นเร็วมาก" }],
  "肚子":   [{ sentence: "肚子餓了。",            pinyin: "Dùzi è le.",                  translation: "หิว" }, { sentence: "我的肚子痛。",    pinyin: "Wǒ de dùzi tòng.",         translation: "ท้องฉันปวด" }],
  "背":     [{ sentence: "背很痛。",                pinyin: "Bèi hěn tòng.",               translation: "หลังปวดมาก" }, { sentence: "幫我擦背。",   pinyin: "Bāng wǒ cā bèi.",          translation: "ช่วยเช็ดหลังให้หน่อย" }],
  "牙齒":   [{ sentence: "牙齒疼。",                pinyin: "Yáchǐ téng.",                 translation: "ปวดฟัน" }, { sentence: "刷牙齒。",       pinyin: "Shuā yáchǐ.",              translation: "แปรงฟัน" }],

  // L1-S06 家人
  "爸爸":   [{ sentence: "我爸爸是醫生。",       pinyin: "Wǒ bàba shì yīshēng.",         translation: "พ่อฉันเป็นหมอ" }, { sentence: "爸爸,我餓了。", pinyin: "Bàba, wǒ è le.",       translation: "พ่อ ฉันหิว" }],
  "媽媽":   [{ sentence: "我媽媽很好。",         pinyin: "Wǒ māma hěn hǎo.",            translation: "แม่ฉันสบายดี" }, { sentence: "媽媽煮飯。",   pinyin: "Māma zhǔfàn.",             translation: "แม่ทำกับข้าว" }],
  "兒子":   [{ sentence: "我的兒子三歲。",       pinyin: "Wǒ de érzi sān suì.",          translation: "ลูกชายฉันสามขวบ" }, { sentence: "他是阿公的兒子。", pinyin: "Tā shì ā gōng de érzi.", translation: "เขาเป็นลูกชายคุณตา" }],
  "女兒":   [{ sentence: "她有兩個女兒。",       pinyin: "Tā yǒu liǎng ge nǚ'ér.",       translation: "เธอมีลูกสาวสองคน" }, { sentence: "我的女兒很乖。", pinyin: "Wǒ de nǚ'ér hěn guāi.", translation: "ลูกสาวฉันน่ารัก" }],
  "阿公":   [{ sentence: "阿公您好。",            pinyin: "Ā gōng nín hǎo.",             translation: "สวัสดีค่ะคุณตา" }, { sentence: "阿公在睡覺。", pinyin: "Ā gōng zài shuìjiào.", translation: "คุณตากำลังนอน" }],
  "阿嬤":   [{ sentence: "阿嬤吃藥了嗎?",        pinyin: "Ā mā chī yào le ma?",         translation: "คุณยายกินยาหรือยัง?" }, { sentence: "阿嬤喜歡看電視。", pinyin: "Ā mā xǐhuān kàn diànshì.", translation: "คุณยายชอบดูทีวี" }],
  "哥哥":   [{ sentence: "我有一個哥哥。",       pinyin: "Wǒ yǒu yí ge gēge.",           translation: "ฉันมีพี่ชายหนึ่งคน" }, { sentence: "哥哥比我大。", pinyin: "Gēge bǐ wǒ dà.", translation: "พี่ชายแก่กว่าฉัน" }],
  "姊姊":   [{ sentence: "姊姊去上班。",         pinyin: "Jiějie qù shàngbān.",          translation: "พี่สาวไปทำงาน" }, { sentence: "我的姊姊很漂亮。", pinyin: "Wǒ de jiějie hěn piàoliang.", translation: "พี่สาวฉันสวยมาก" }],

  // L1-S07 食物
  "飯":     [{ sentence: "我吃飯。",                pinyin: "Wǒ chīfàn.",                   translation: "ฉันกินข้าว" }, { sentence: "請給我一碗飯。", pinyin: "Qǐng gěi wǒ yì wǎn fàn.", translation: "ขอข้าวหนึ่งชาม" }],
  "水":     [{ sentence: "請喝水。",                pinyin: "Qǐng hē shuǐ.",                translation: "เชิญดื่มน้ำ" }, { sentence: "水很冰。",         pinyin: "Shuǐ hěn bīng.",            translation: "น้ำเย็นมาก" }],
  "茶":     [{ sentence: "喝杯茶吧。",              pinyin: "Hē bēi chá ba.",               translation: "ดื่มชาสักแก้วนะ" }, { sentence: "阿公喜歡喝茶。", pinyin: "Ā gōng xǐhuān hē chá.", translation: "คุณตาชอบดื่มชา" }],
  "湯":     [{ sentence: "湯很熱。",                pinyin: "Tāng hěn rè.",                 translation: "ซุปร้อนมาก" }, { sentence: "我喜歡魚湯。",   pinyin: "Wǒ xǐhuān yú tāng.",        translation: "ฉันชอบซุปปลา" }],
  "麵":     [{ sentence: "我吃麵。",                pinyin: "Wǒ chī miàn.",                 translation: "ฉันกินบะหมี่" }, { sentence: "牛肉麵很好吃。", pinyin: "Niúròu miàn hěn hǎochī.", translation: "บะหมี่เนื้ออร่อยมาก" }],
  "肉":     [{ sentence: "今天有雞肉。",          pinyin: "Jīntiān yǒu jīròu.",           translation: "วันนี้มีเนื้อไก่" }, { sentence: "他不吃肉。",   pinyin: "Tā bù chī ròu.",            translation: "เขาไม่กินเนื้อ" }],
  "菜":     [{ sentence: "多吃菜。",                pinyin: "Duō chī cài.",                 translation: "กินผักเยอะๆ" }, { sentence: "這個菜很好吃。", pinyin: "Zhè ge cài hěn hǎochī.", translation: "ผักจานนี้อร่อยมาก" }],
  "水果":   [{ sentence: "水果很甜。",              pinyin: "Shuǐguǒ hěn tián.",            translation: "ผลไม้หวานมาก" }, { sentence: "我喜歡吃水果。", pinyin: "Wǒ xǐhuān chī shuǐguǒ.", translation: "ฉันชอบกินผลไม้" }],
  "蛋":     [{ sentence: "早餐有蛋。",              pinyin: "Zǎocān yǒu dàn.",              translation: "อาหารเช้ามีไข่" }, { sentence: "雞蛋很營養。", pinyin: "Jīdàn hěn yíngyǎng.", translation: "ไข่ไก่มีคุณค่าทางอาหาร" }],
  "牛奶":   [{ sentence: "喝牛奶。",                pinyin: "Hē niúnǎi.",                   translation: "ดื่มนม" }, { sentence: "牛奶配早餐。",     pinyin: "Niúnǎi pèi zǎocān.",       translation: "นมคู่กับอาหารเช้า" }],

  // L1-S08 餵食
  "吃":     [{ sentence: "請慢慢吃。",              pinyin: "Qǐng mànman chī.",            translation: "เชิญทานช้าๆ" }, { sentence: "你吃了嗎?",   pinyin: "Nǐ chī le ma?",            translation: "คุณกินแล้วหรือยัง?" }],
  "喝":     [{ sentence: "喝水好。",                pinyin: "Hē shuǐ hǎo.",                translation: "ดื่มน้ำดี" }, { sentence: "請喝湯。",     pinyin: "Qǐng hē tāng.",            translation: "เชิญดื่มซุป" }],
  "慢慢":   [{ sentence: "慢慢來。",                pinyin: "Mànman lái.",                 translation: "ค่อยๆ ไม่ต้องรีบ" }, { sentence: "慢慢走。",     pinyin: "Mànman zǒu.",              translation: "ค่อยๆ เดิน" }],
  "小心":   [{ sentence: "小心燙!",                  pinyin: "Xiǎoxīn tàng!",               translation: "ระวังร้อน!" }, { sentence: "小心走路。",   pinyin: "Xiǎoxīn zǒulù.",            translation: "ระวังเดิน" }],
  "燙":     [{ sentence: "湯很燙,小心。",           pinyin: "Tāng hěn tàng, xiǎoxīn.",     translation: "ซุปร้อนมาก ระวัง" }, { sentence: "茶燙嗎?",     pinyin: "Chá tàng ma?",              translation: "ชาร้อนมั้ย?" }],
  "軟":     [{ sentence: "稀飯很軟。",              pinyin: "Xīfàn hěn ruǎn.",             translation: "ข้าวต้มนุ่มมาก" }, { sentence: "肉很軟。",     pinyin: "Ròu hěn ruǎn.",            translation: "เนื้อนุ่มมาก" }],
  "餵":     [{ sentence: "我餵阿公吃飯。",         pinyin: "Wǒ wèi ā gōng chīfàn.",       translation: "ฉันป้อนข้าวคุณตา" }, { sentence: "餵小貓。",     pinyin: "Wèi xiǎo māo.",            translation: "ป้อนแมวน้อย" }],
  "飽":     [{ sentence: "我飽了。",                pinyin: "Wǒ bǎo le.",                  translation: "ฉันอิ่มแล้ว" }, { sentence: "阿嬤吃飽了嗎?", pinyin: "Ā mā chī bǎo le ma?",      translation: "คุณยายอิ่มแล้วหรือยัง?" }],

  // L1-S09 餵藥
  "藥":     [{ sentence: "吃藥了。",                pinyin: "Chī yào le.",                 translation: "กินยาแล้ว" }, { sentence: "藥要冷藏。",   pinyin: "Yào yào lěngcáng.",        translation: "ยาต้องแช่เย็น" }],
  "顆":     [{ sentence: "一顆藥。",                pinyin: "Yì kē yào.",                  translation: "ยาหนึ่งเม็ด" }, { sentence: "三顆藥。",     pinyin: "Sān kē yào.",              translation: "ยาสามเม็ด" }],
  "吃藥":   [{ sentence: "飯後吃藥。",              pinyin: "Fàn hòu chī yào.",            translation: "กินยาหลังอาหาร" }, { sentence: "請吃藥。",    pinyin: "Qǐng chī yào.",            translation: "เชิญกินยา" }],
  "飯後":   [{ sentence: "飯後吃藥。",              pinyin: "Fàn hòu chī yào.",            translation: "หลังอาหารกินยา" }, { sentence: "飯後散步。",  pinyin: "Fàn hòu sànbù.",           translation: "หลังอาหารเดินเล่น" }],
  "飯前":   [{ sentence: "飯前喝水。",              pinyin: "Fàn qián hē shuǐ.",           translation: "ก่อนอาหารดื่มน้ำ" }, { sentence: "飯前洗手。", pinyin: "Fàn qián xǐ shǒu.",        translation: "ก่อนอาหารล้างมือ" }],
  "吞":     [{ sentence: "把藥吞下去。",            pinyin: "Bǎ yào tūn xiàqù.",           translation: "กลืนยาลงไป" }, { sentence: "吞下水。",     pinyin: "Tūn xià shuǐ.",            translation: "กลืนน้ำลงไป" }],
  "喝水":   [{ sentence: "吃完藥喝水。",            pinyin: "Chī wán yào hē shuǐ.",        translation: "กินยาเสร็จแล้วดื่มน้ำ" }, { sentence: "多喝水。",  pinyin: "Duō hē shuǐ.",             translation: "ดื่มน้ำเยอะๆ" }],
  "一天":   [{ sentence: "一天三次。",              pinyin: "Yì tiān sān cì.",             translation: "วันละสามครั้ง" }, { sentence: "一天兩顆。", pinyin: "Yì tiān liǎng kē.",          translation: "วันละสองเม็ด" }],

  // L1-S10 翻身換尿布
  "翻身":   [{ sentence: "我幫您翻身。",           pinyin: "Wǒ bāng nín fānshēn.",        translation: "ฉันช่วยคุณพลิกตัว" }, { sentence: "兩小時翻身一次。", pinyin: "Liǎng xiǎoshí fānshēn yí cì.", translation: "พลิกตัวทุกสองชั่วโมง" }],
  "尿布":   [{ sentence: "尿布濕了。",              pinyin: "Niàobù shī le.",              translation: "ผ้าอ้อมเปียกแล้ว" }, { sentence: "換新尿布。", pinyin: "Huàn xīn niàobù.",          translation: "เปลี่ยนผ้าอ้อมใหม่" }],
  "換":     [{ sentence: "我幫您換。",              pinyin: "Wǒ bāng nín huàn.",           translation: "ฉันช่วยเปลี่ยนให้" }, { sentence: "換衣服。",    pinyin: "Huàn yīfu.",              translation: "เปลี่ยนเสื้อผ้า" }],
  "擦":     [{ sentence: "幫您擦乾淨。",           pinyin: "Bāng nín cā gānjìng.",        translation: "ช่วยเช็ดให้สะอาด" }, { sentence: "擦臉。",       pinyin: "Cā liǎn.",                  translation: "เช็ดหน้า" }],
  "床":     [{ sentence: "上床睡覺。",              pinyin: "Shàngchuáng shuìjiào.",       translation: "ขึ้นเตียงนอน" }, { sentence: "床很舒服。", pinyin: "Chuáng hěn shūfu.",         translation: "เตียงสบายมาก" }],
  "起來":   [{ sentence: "請起來。",                pinyin: "Qǐng qǐlái.",                 translation: "เชิญลุกขึ้น" }, { sentence: "起來吃飯。",   pinyin: "Qǐlái chīfàn.",            translation: "ลุกขึ้นมากินข้าว" }],
  "躺":     [{ sentence: "躺著休息。",              pinyin: "Tǎng zhe xiūxí.",             translation: "นอนพักผ่อน" }, { sentence: "躺下來。",     pinyin: "Tǎng xiàlái.",             translation: "นอนลง" }],
  "坐":     [{ sentence: "請坐這裡。",              pinyin: "Qǐng zuò zhèlǐ.",             translation: "เชิญนั่งตรงนี้" }, { sentence: "坐起來吧。",  pinyin: "Zuò qǐlái ba.",             translation: "ลุกนั่งสิ" }],

  // L1-S11 量測
  "量":     [{ sentence: "我量血壓。",              pinyin: "Wǒ liáng xiěyā.",             translation: "ฉันวัดความดัน" }, { sentence: "量體溫。",     pinyin: "Liáng tǐwēn.",             translation: "วัดอุณหภูมิ" }],
  "血壓":   [{ sentence: "血壓正常。",              pinyin: "Xiěyā zhèngcháng.",           translation: "ความดันปกติ" }, { sentence: "量血壓。",     pinyin: "Liáng xiěyā.",             translation: "วัดความดัน" }],
  "體溫":   [{ sentence: "體溫高嗎?",                pinyin: "Tǐwēn gāo ma?",               translation: "อุณหภูมิสูงไหม?" }, { sentence: "體溫 37 度。", pinyin: "Tǐwēn sānshíqī dù.",       translation: "อุณหภูมิ 37 องศา" }],
  "體重":   [{ sentence: "體重 60 公斤。",           pinyin: "Tǐzhòng liùshí gōngjīn.",     translation: "น้ำหนัก 60 กิโล" }, { sentence: "量體重。",   pinyin: "Liáng tǐzhòng.",           translation: "วัดน้ำหนัก" }],
  "高":     [{ sentence: "血壓很高。",              pinyin: "Xiěyā hěn gāo.",              translation: "ความดันสูงมาก" }, { sentence: "體溫高。",     pinyin: "Tǐwēn gāo.",               translation: "อุณหภูมิสูง" }],
  "低":     [{ sentence: "血壓低。",                pinyin: "Xiěyā dī.",                   translation: "ความดันต่ำ" }, { sentence: "體溫低。",     pinyin: "Tǐwēn dī.",                translation: "อุณหภูมิต่ำ" }],
  "正常":   [{ sentence: "都正常。",                pinyin: "Dōu zhèngcháng.",             translation: "ปกติทุกอย่าง" }, { sentence: "體溫正常。", pinyin: "Tǐwēn zhèngcháng.",         translation: "อุณหภูมิปกติ" }],
  "紀錄":   [{ sentence: "做紀錄。",                pinyin: "Zuò jìlù.",                   translation: "บันทึกข้อมูล" }, { sentence: "我要紀錄一下。", pinyin: "Wǒ yào jìlù yíxià.",     translation: "ขอจดบันทึกหน่อย" }],

  // L1-S12 上廁所·洗澡
  "上廁所": [{ sentence: "我要上廁所。",           pinyin: "Wǒ yào shàng cèsuǒ.",         translation: "ฉันจะไปห้องน้ำ" }, { sentence: "請慢慢上廁所。", pinyin: "Qǐng mànman shàng cèsuǒ.", translation: "เชิญค่อยๆ เข้าห้องน้ำ" }],
  "洗澡":   [{ sentence: "幫阿公洗澡。",           pinyin: "Bāng ā gōng xǐzǎo.",          translation: "ช่วยคุณตาอาบน้ำ" }, { sentence: "洗澡很舒服。", pinyin: "Xǐzǎo hěn shūfu.",         translation: "อาบน้ำสบายมาก" }],
  "廁所":   [{ sentence: "廁所在那邊。",           pinyin: "Cèsuǒ zài nà biān.",          translation: "ห้องน้ำอยู่ทางนั้น" }, { sentence: "我要去廁所。", pinyin: "Wǒ yào qù cèsuǒ.",         translation: "ฉันจะไปห้องน้ำ" }],
  "洗":     [{ sentence: "洗手。",                  pinyin: "Xǐ shǒu.",                    translation: "ล้างมือ" }, { sentence: "洗衣服。",         pinyin: "Xǐ yīfu.",                  translation: "ซักเสื้อผ้า" }],
  "毛巾":   [{ sentence: "請給我毛巾。",           pinyin: "Qǐng gěi wǒ máojīn.",         translation: "ขอผ้าเช็ดตัวหน่อย" }, { sentence: "毛巾濕了。", pinyin: "Máojīn shī le.",            translation: "ผ้าเช็ดตัวเปียกแล้ว" }],
  "肥皂":   [{ sentence: "用肥皂洗手。",           pinyin: "Yòng féizào xǐ shǒu.",        translation: "ใช้สบู่ล้างมือ" }, { sentence: "肥皂洗澡。",     pinyin: "Féizào xǐzǎo.",            translation: "อาบน้ำด้วยสบู่" }],
  "乾":     [{ sentence: "毛巾乾了。",              pinyin: "Máojīn gān le.",              translation: "ผ้าเช็ดตัวแห้งแล้ว" }, { sentence: "保持乾燥。",   pinyin: "Bǎochí gānzào.",           translation: "เก็บให้แห้ง" }],
  "濕":     [{ sentence: "濕毛巾。",                pinyin: "Shī máojīn.",                 translation: "ผ้าเช็ดตัวเปียก" }, { sentence: "尿布濕了。",   pinyin: "Niàobù shī le.",           translation: "ผ้าอ้อมเปียก" }],
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
  if (!lesson) {
    console.log(`  ⏭  ${lessonCode}: not found`);
    return 0;
  }
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
  console.log(`  ✅ ${lessonCode}: +${added} examples for ${updated.filter((i) => "examples" in i).length} words`);
  return added;
}

async function main() {
  console.log("=== A1 example enrichment ===\n");
  const lessons = [
    "L1-S01-VOCAB", "L1-S02-VOCAB",
    "L1-S03-VOCAB", "L1-S04-VOCAB", "L1-S05-VOCAB", "L1-S06-VOCAB", "L1-S07-VOCAB",
    "L1-S08-VOCAB", "L1-S09-VOCAB", "L1-S10-VOCAB", "L1-S11-VOCAB", "L1-S12-VOCAB",
  ];
  let total = 0;
  for (const code of lessons) {
    total += await enrichLesson(code);
  }
  console.log(`\n🎉 Total examples added: ${total} across ${lessons.length} lessons`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
