// L1-S08 餐飲服務
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L1_S08: ScenarioDef = {
  code: "L1-S08",
  level: Level.A1_BEGINNER,
  orderIndex: 8,
  title: "餐飲服務",
  titleI18n: { "zh-TW": "餐飲服務", th: "บริการอาหาร", vi: "Phục vụ bữa ăn", id: "Layanan Makan" },
  estimatedMinutes: 25,
  prerequisiteCode: "L1-S07",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "午餐時間到了，歐寶端著托盤走進陳阿嬤的房間。她要詢問阿嬤今天的飯菜合不合口味，還想關心她吃多少……",
      th: "ถึงเวลาอาหารกลางวัน อ้าวเป่าถือถาดอาหารเดินเข้าไปในห้องคุณยายเฉิน เธอต้องถามว่าอาหารวันนี้ถูกปากไหม และอยากถามว่าคุณยายทานมากแค่ไหน...",
      vi: "Đến giờ ăn trưa, Aobao bưng khay vào phòng bà Chen. Cô muốn hỏi thức ăn hôm nay có hợp khẩu vị không và quan tâm đến việc bà ăn bao nhiêu...",
      id: "Tiba waktunya makan siang, Aobao membawa baki masuk ke kamar Nenek Chen. Dia ingin menanyakan apakah makanan hari ini cocok dan ingin tahu sudah berapa banyak nenek makan...",
    },
  },
  mtcAlignment: { books: ["B1-L08"], topics: ["food", "meal-service", "eldercare"] },
  vocabularies: [
    { hanzi: "飯", zhuyin: "ㄈㄢˋ", pinyin: "fàn", partOfSpeech: "n.", translations: { th: "ข้าว / อาหาร", en: "rice/meal" }, category: "food", tags: ["food", "meal"], difficulty: 1 },
    { hanzi: "湯", zhuyin: "ㄊㄤ", pinyin: "tāng", partOfSpeech: "n.", translations: { th: "ซุป / น้ำแกง", en: "soup" }, category: "food", tags: ["food", "meal"], difficulty: 1 },
    { hanzi: "菜", zhuyin: "ㄘㄞˋ", pinyin: "cài", partOfSpeech: "n.", translations: { th: "ผัก / กับข้าว", en: "vegetable/dish" }, category: "food", tags: ["food", "meal"], difficulty: 1 },
    { hanzi: "好吃", zhuyin: "ㄏㄠˇ ˙ㄔ", pinyin: "hǎochī", partOfSpeech: "adj.", translations: { th: "อร่อย", en: "delicious" }, category: "food", tags: ["food", "taste"], difficulty: 1 },
    { hanzi: "飽了", zhuyin: "ㄅㄠˇ ˙ㄌㄜ", pinyin: "bǎo le", partOfSpeech: "adj.", translations: { th: "อิ่มแล้ว", en: "full/satiated" }, category: "food", tags: ["food", "meal"], difficulty: 1 },
    { hanzi: "甜", zhuyin: "ㄊㄧㄢˊ", pinyin: "tián", partOfSpeech: "adj.", translations: { th: "หวาน", en: "sweet" }, category: "food", tags: ["food", "taste"], difficulty: 1 },
    { hanzi: "鹹", zhuyin: "ㄒㄧㄢˊ", pinyin: "xián", partOfSpeech: "adj.", translations: { th: "เค็ม", en: "salty" }, category: "food", tags: ["food", "taste"], difficulty: 1 },
    { hanzi: "軟", zhuyin: "ㄖㄨㄢˇ", pinyin: "ruǎn", partOfSpeech: "adj.", translations: { th: "นุ่ม", en: "soft" }, category: "food", tags: ["food", "eldercare"], difficulty: 1, isEldercareVocab: true },
    { hanzi: "多一點", zhuyin: "ㄉㄨㄛ ˙ㄧˋ ˙ㄉㄧㄢˇ", pinyin: "duō yīdiǎn", partOfSpeech: "exp.", translations: { th: "เพิ่มอีกหน่อย", en: "a little more" }, category: "food", tags: ["food", "meal"], difficulty: 2 },
    { hanzi: "夠了", zhuyin: "ˋㄍㄡ ˙ㄌㄜ", pinyin: "gòu le", partOfSpeech: "exp.", translations: { th: "พอแล้ว", en: "enough" }, category: "food", tags: ["food", "meal"], difficulty: 1 },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿嬤，午飯來了。今天有飯、湯和菜。", pinyin: "ā mà, wǔfàn lái le. jīntiān yǒu fàn, tāng hé cài.", translationI18n: { th: "คุณยายครับ/ค่ะ อาหารกลางวันมาแล้ว วันนี้มีข้าว ซุป และกับข้าว" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "好，這個湯好喝！", pinyin: "hǎo, zhège tāng hǎo hē!", translationI18n: { th: "ได้ ซุปนี้อร่อยมาก!" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿嬤要不要多一點湯？", pinyin: "ā mà yào bú yào duō yīdiǎn tāng?", translationI18n: { th: "คุณยายต้องการซุปเพิ่มอีกหน่อยไหมครับ/ค่ะ?" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "不要了，夠了，我快飽了。", pinyin: "bú yào le, gòu le, wǒ kuài bǎo le.", translationI18n: { th: "ไม่ต้องแล้วค่ะ พอแล้ว กำลังจะอิ่มแล้ว" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好的，菜夠軟嗎？", pinyin: "hǎo de, cài gòu ruǎn ma?", translationI18n: { th: "ได้เลยครับ/ค่ะ กับข้าวนุ่มพอไหม?" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 1, prompt: { symbol: "好吃", hanzi: "好吃", pinyin: "hǎochī" }, options: [{ value: "อร่อย" }, { value: "หวาน" }, { value: "เค็ม" }, { value: "นุ่ม" }], answer: { value: "อร่อย" }, explanationI18n: { "zh-TW": "「好吃」= 食物美味可口。", th: "「好吃 hǎochī」= อร่อย" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 1, prompt: { audioUrl: "/api/audio/vocab/湯", instructionKey: "listenPickHanzi" }, options: [{ value: "湯" }, { value: "飯" }, { value: "菜" }, { value: "水" }], answer: { value: "湯" }, audioUrl: "/api/audio/vocab/湯", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 1, prompt: { thai: "อิ่มแล้ว", instructionKey: "thaiToHanzi" }, options: [{ value: "飽了" }, { value: "夠了" }, { value: "好吃" }, { value: "軟" }], answer: { value: "飽了" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 2, prompt: { sentenceParts: ["湯好喝嗎？要不要", "___", "一點？"], sentencePinyin: "tāng hǎo hē ma? yào bú yào ___ yīdiǎn?", translationI18n: { th: "ซุปอร่อยไหม? ต้องการ___อีกหน่อยไหม?" }, instructionKey: "fillBlank" }, options: [{ value: "多" }, { value: "少" }, { value: "大" }, { value: "小" }], answer: { value: "多" }, explanationI18n: { "zh-TW": "「多一點」= 再多一些的意思。", th: "「多一點」= เพิ่มอีกหน่อย" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["這個", "湯", "好", "喝"], targetTranslationI18n: { th: "ซุปนี้อร่อยมาก" }, instructionKey: "arrangeWords" }, options: [{ value: "這個" }, { value: "湯" }, { value: "好" }, { value: "喝" }], answer: { value: ["這個", "湯", "好", "喝"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 2, prompt: { audioUrl: "/api/audio/dialogue/L1-S08/1", questionI18n: { "zh-TW": "陳阿嬤覺得湯怎麼樣？", th: "คุณยายเฉินรู้สึกอย่างไรกับซุป?" } }, options: [{ value: "好喝" }, { value: "太鹹" }, { value: "太甜" }, { value: "不好喝" }], answer: { value: "好喝" }, audioUrl: "/api/audio/dialogue/L1-S08/1", skillsTrained: ["listening"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 2, prompt: { hanzi: "飯好吃嗎？要不要多一點？", pinyin: "fàn hǎochī ma? yào bú yào duō yīdiǎn?", audioUrl: "/api/audio/sentence/L1-S08-meal", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "飯", pinyin: "fàn", translationI18n: { th: "ข้าว / อาหาร" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "飯" }, skillsTrained: ["writing"] },
  ],
};
