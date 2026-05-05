// L2-S08 洗澡協助
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L2_S08: ScenarioDef = {
  code: "L2-S08",
  level: Level.A2_BASIC,
  orderIndex: 8,
  title: "洗澡協助",
  titleI18n: { "zh-TW": "洗澡協助", th: "ช่วยเหลือเรื่องการอาบน้ำ", vi: "Hỗ trợ tắm rửa", id: "Bantuan Mandi" },
  estimatedMinutes: 30,
  prerequisiteCode: "L2-S07",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "今天是星期四，是王阿公洗澡的日子。歐寶要準備熱水、肥皂、毛巾，並小心扶他到浴室，避免在濕滑的地板上跌倒……",
      th: "วันนี้วันพฤหัส เป็นวันที่คุณปู่หวังต้องอาบน้ำ อ้าวเป่าต้องเตรียมน้ำอุ่น สบู่ ผ้าเช็ดตัว และพยุงปู่ไปห้องน้ำอย่างระมัดระวัง อย่าให้ลื่นล้มในห้องน้ำที่เปียก...",
      vi: "Hôm nay thứ Năm, là ngày ông Wang tắm. Aobao phải chuẩn bị nước nóng, xà phòng, khăn tắm, và đỡ ông vào phòng tắm cẩn thận, tránh trượt ngã trên sàn ướt...",
      id: "Hari ini Kamis, hari Kakek Wang mandi. Aobao perlu menyiapkan air hangat, sabun, handuk, dan memapahnya ke kamar mandi dengan hati-hati, hindari terpeleset di lantai basah...",
    },
  },
  mtcAlignment: { books: ["B2-L08", "B2-L09"], topics: ["bathing", "safety"] },
  vocabularies: [
    { hanzi: "熱水", zhuyin: "ㄖㄜˋ ㄕㄨㄟˇ", pinyin: "rè shuǐ", partOfSpeech: "n.", translations: { th: "น้ำอุ่น/น้ำร้อน", en: "hot water" }, category: "eldercare", tags: ["bathing"], difficulty: 1 },
    { hanzi: "肥皂", zhuyin: "ㄈㄟˊ ㄗㄠˋ", pinyin: "féizào", partOfSpeech: "n.", translations: { th: "สบู่", en: "soap" }, category: "eldercare", tags: ["bathing", "hygiene"], difficulty: 1 },
    { hanzi: "毛巾", zhuyin: "ㄇㄠˊ ㄐㄧㄣ", pinyin: "máojīn", partOfSpeech: "n.", translations: { th: "ผ้าเช็ดตัว/ผ้าขนหนู", en: "towel" }, category: "eldercare", tags: ["bathing"], difficulty: 1 },
    { hanzi: "浴室", zhuyin: "ㄩˋ ㄕˋ", pinyin: "yùshì", partOfSpeech: "n.", translations: { th: "ห้องน้ำ/ห้องอาบน้ำ", en: "bathroom" }, category: "eldercare", tags: ["bathing", "place"], difficulty: 1 },
    { hanzi: "滑倒", zhuyin: "ㄏㄨㄚˊ ㄉㄠˇ", pinyin: "huá dǎo", partOfSpeech: "v.", translations: { th: "ลื่นล้ม", en: "to slip and fall" }, category: "safety", tags: ["safety", "danger"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "衣服", zhuyin: "ㄧ ˙ㄈㄨ", pinyin: "yīfu", partOfSpeech: "n.", translations: { th: "เสื้อผ้า", en: "clothes" }, category: "daily", tags: ["clothing"], difficulty: 1 },
    { hanzi: "脫", zhuyin: "ㄊㄨㄛ", pinyin: "tuō", partOfSpeech: "v.", translations: { th: "ถอด", en: "to take off (clothes)" }, category: "eldercare", tags: ["assistance"], difficulty: 1 },
    { hanzi: "穿", zhuyin: "ㄔㄨㄢ", pinyin: "chuān", partOfSpeech: "v.", translations: { th: "สวมใส่", en: "to wear/put on" }, category: "daily", tags: ["clothing"], difficulty: 1 },
    { hanzi: "擦乾", zhuyin: "ㄘㄚ ㄍㄢ", pinyin: "cā gān", partOfSpeech: "v.", translations: { th: "เช็ดให้แห้ง", en: "to wipe dry" }, category: "eldercare", tags: ["bathing"], difficulty: 2 },
    { hanzi: "感冒", zhuyin: "ㄍㄢˇ ㄇㄠˋ", pinyin: "gǎnmào", partOfSpeech: "v/n.", translations: { th: "เป็นหวัด", en: "to catch a cold" }, category: "medical", tags: ["health"], difficulty: 1, isEldercareVocab: true },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿公，今天星期四，要洗澡了。", pinyin: "ā gōng, jīntiān xīngqīsì, yào xǐzǎo le.", translationI18n: { th: "คุณปู่ วันนี้วันพฤหัส ถึงเวลาอาบน้ำแล้วค่ะ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "好，水會不會太熱？", pinyin: "hǎo, shuǐ huì bù huì tài rè?", translationI18n: { th: "โอเค น้ำจะร้อนเกินไปไหม?" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "我先試一下，溫度剛好。請小心，地板濕，不要滑倒。", pinyin: "wǒ xiān shì yīxià, wēndù gāng hǎo. qǐng xiǎoxīn, dìbǎn shī, bú yào huá dǎo.", translationI18n: { th: "หนูลองดูก่อน อุณหภูมิพอดี กรุณาระวังนะคะ พื้นเปียก อย่าลื่นล้ม" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "好，幫我脫衣服。", pinyin: "hǎo, bāng wǒ tuō yīfu.", translationI18n: { th: "โอเค ช่วยถอดเสื้อผ้าให้หน่อย" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好的。洗完馬上擦乾、穿衣服，不要感冒。", pinyin: "hǎo de. xǐwán mǎshàng cā gān, chuān yīfu, bú yào gǎnmào.", translationI18n: { th: "ค่ะ พออาบเสร็จต้องรีบเช็ดให้แห้งและสวมเสื้อผ้าทันที จะได้ไม่เป็นหวัด" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 1, prompt: { symbol: "肥皂", hanzi: "肥皂", pinyin: "féizào" }, options: [{ value: "สบู่" }, { value: "ยาสีฟัน" }, { value: "ผ้าเช็ดตัว" }, { value: "น้ำ" }], answer: { value: "สบู่" }, explanationI18n: { "zh-TW": "「肥皂」= soap，洗澡用品。", th: "「肥皂 féizào」= สบู่" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 1, prompt: { audioUrl: "/api/audio/vocab/滑倒", instructionKey: "listenPickHanzi" }, options: [{ value: "滑倒" }, { value: "跌倒" }, { value: "感冒" }, { value: "頭暈" }], answer: { value: "滑倒" }, audioUrl: "/api/audio/vocab/滑倒", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 1, prompt: { thai: "ผ้าเช็ดตัว", instructionKey: "thaiToHanzi" }, options: [{ value: "毛巾" }, { value: "肥皂" }, { value: "衣服" }, { value: "牙刷" }], answer: { value: "毛巾" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 2, prompt: { sentenceParts: ["請小心，不要", "___", "。"], sentencePinyin: "qǐng xiǎoxīn, bú yào ___.", translationI18n: { th: "กรุณาระวัง อย่าลื่นล้ม" }, instructionKey: "fillBlank" }, options: [{ value: "滑倒" }, { value: "感冒" }, { value: "睡覺" }, { value: "吃飯" }], answer: { value: "滑倒" }, explanationI18n: { "zh-TW": "浴室地板濕滑，要提醒長輩「不要滑倒」。", th: "พื้นห้องน้ำเปียกลื่น ต้องเตือน「不要滑倒」= อย่าลื่นล้ม" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["洗完", "馬上", "擦乾", "，", "不要", "感冒"], targetTranslationI18n: { th: "อาบเสร็จรีบเช็ดให้แห้ง อย่าให้เป็นหวัด" }, instructionKey: "arrangeWords" }, options: [{ value: "洗完" }, { value: "馬上" }, { value: "擦乾" }, { value: "，" }, { value: "不要" }, { value: "感冒" }], answer: { value: ["洗完", "馬上", "擦乾", "，", "不要", "感冒"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 2, prompt: { audioUrl: "/api/audio/dialogue/L2-S08/1", questionI18n: { "zh-TW": "歐寶提醒阿公注意什麼？", th: "อ้าวเป่าเตือนคุณปู่ให้ระวังอะไร?" } }, options: [{ value: "地板濕，不要滑倒" }, { value: "水太冷" }, { value: "肥皂用完了" }, { value: "毛巾不夠" }], answer: { value: "地板濕，不要滑倒" }, audioUrl: "/api/audio/dialogue/L2-S08/1", skillsTrained: ["listening"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 2, prompt: { hanzi: "請小心，地板濕，不要滑倒。", pinyin: "qǐng xiǎoxīn, dìbǎn shī, bú yào huá dǎo.", audioUrl: "/api/audio/sentence/L2-S08-bath-warn", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "洗", pinyin: "xǐ", translationI18n: { th: "ล้าง/ชำระ" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "洗" }, skillsTrained: ["writing"] },
  ],
};
