// L1-S07 協助日常照護
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L1_S07: ScenarioDef = {
  code: "L1-S07",
  level: Level.A1_BEGINNER,
  orderIndex: 7,
  title: "協助日常照護",
  titleI18n: { "zh-TW": "協助日常照護", th: "ช่วยเหลือการดูแลประจำวัน", vi: "Hỗ trợ chăm sóc hàng ngày", id: "Membantu Perawatan Harian" },
  estimatedMinutes: 25,
  prerequisiteCode: "L1-S06",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "早上八點，歐寶需要幫王阿公從床上起身，然後坐上輪椅去餐廳吃早飯。這是她第一次獨立協助長輩起床……",
      th: "เวลา 8 โมงเช้า อ้าวเป่าต้องช่วยคุณปู่หวังลุกจากเตียง แล้วนั่งรถเข็นไปห้องอาหารเพื่อกินอาหารเช้า นี่เป็นครั้งแรกที่เธอช่วยผู้สูงอายุลุกจากเตียงคนเดียว...",
      vi: "Lúc 8 giờ sáng, Aobao cần giúp ông Wang dậy khỏi giường rồi ngồi vào xe lăn để đến phòng ăn. Đây là lần đầu tiên cô tự mình hỗ trợ người cao tuổi dậy giường...",
      id: "Pukul 8 pagi, Aobao perlu membantu Kakek Wang bangun dari tempat tidur, lalu duduk di kursi roda untuk pergi ke ruang makan. Ini pertama kalinya dia sendiri membantu lansia bangun tidur...",
    },
  },
  mtcAlignment: { books: ["B1-L07"], topics: ["assistance", "mobility", "eldercare"] },
  vocabularies: [
    { hanzi: "起來", zhuyin: "ㄑㄧˇ ˙ㄌㄞˊ", pinyin: "qǐlái", partOfSpeech: "v.", translations: { th: "ลุกขึ้น", en: "get up/rise" }, category: "eldercare", tags: ["care", "mobility"], difficulty: 1, isEldercareVocab: true },
    { hanzi: "坐下", zhuyin: "ㄗㄨㄛˋ ˙ㄒㄧㄚˋ", pinyin: "zuòxia", partOfSpeech: "v.", translations: { th: "นั่งลง", en: "sit down" }, category: "eldercare", tags: ["care", "mobility"], difficulty: 1, isEldercareVocab: true },
    { hanzi: "扶", zhuyin: "ㄈㄨˊ", pinyin: "fú", partOfSpeech: "v.", translations: { th: "พยุง / ช่วยพยุง", en: "to support/hold up" }, category: "eldercare", tags: ["care", "mobility"], difficulty: 1, isEldercareVocab: true },
    { hanzi: "輪椅", zhuyin: "ㄌㄨㄣˊ ˙ㄧˇ", pinyin: "lúnyǐ", partOfSpeech: "n.", translations: { th: "รถเข็น", en: "wheelchair" }, category: "eldercare", tags: ["care", "equipment"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "換衣服", zhuyin: "ㄏㄨㄢˋ ˙ㄧ ˙ㄈㄨ", pinyin: "huàn yīfu", partOfSpeech: "v.", translations: { th: "เปลี่ยนเสื้อผ้า", en: "change clothes" }, category: "eldercare", tags: ["care", "daily"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "小心", zhuyin: "ㄒㄧㄠˇ ˙ㄒㄧㄣ", pinyin: "xiǎoxīn", partOfSpeech: "adj.", translations: { th: "ระวัง", en: "be careful" }, category: "safety", tags: ["safety", "care"], difficulty: 1 },
    { hanzi: "慢慢", zhuyin: "ㄇㄢˋ ˙ㄇㄢ", pinyin: "mànman", partOfSpeech: "adv.", translations: { th: "ค่อยๆ", en: "slowly" }, category: "eldercare", tags: ["care", "safety"], difficulty: 1 },
    { hanzi: "好了", zhuyin: "ㄏㄠˇ ˙ㄌㄜ", pinyin: "hǎo le", partOfSpeech: "exp.", translations: { th: "เสร็จแล้ว", en: "done/ready" }, category: "daily", tags: ["daily"], difficulty: 1 },
    { hanzi: "用力", zhuyin: "ㄩㄥˋ ˙ㄌㄧˋ", pinyin: "yònglì", partOfSpeech: "v.", translations: { th: "ออกแรง", en: "use strength" }, category: "eldercare", tags: ["care", "mobility"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "沒問題", zhuyin: "ˊㄇㄟ ˙ㄨㄣˋ ˙ㄊㄧˊ", pinyin: "méi wèntí", partOfSpeech: "exp.", translations: { th: "ไม่มีปัญหา", en: "no problem" }, category: "daily", tags: ["daily", "reassurance"], difficulty: 1 },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿公，我來扶您起來了，小心一點。", pinyin: "ā gōng, wǒ lái fú nín qǐlái le, xiǎoxīn yīdiǎn.", translationI18n: { th: "คุณปู่ หนูมาพยุงคุณปู่ลุกขึ้นนะ ระวังด้วยนะครับ/ค่ะ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "好，謝謝你。慢慢來。", pinyin: "hǎo, xièxie nǐ. mànman lái.", translationI18n: { th: "ได้ ขอบคุณ ค่อยๆ นะ" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿公，請用力，我扶著您。", pinyin: "ā gōng, qǐng yònglì, wǒ fú zhe nín.", translationI18n: { th: "คุณปู่ออกแรงหน่อยนะครับ/ค่ะ หนูพยุงอยู่" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "好了！我坐好了。", pinyin: "hǎo le! wǒ zuò hǎo le.", translationI18n: { th: "เสร็จแล้ว! ฉันนั่งเรียบร้อยแล้ว" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "太好了！我們推輪椅去餐廳吧。", pinyin: "tài hǎo le! wǒmen tuī lúnyǐ qù cāntīng ba.", translationI18n: { th: "เยี่ยมเลย! เราไปห้องอาหารด้วยรถเข็นเลยนะครับ/ค่ะ" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 1, prompt: { symbol: "扶", hanzi: "扶", pinyin: "fú" }, options: [{ value: "พยุง" }, { value: "ลุกขึ้น" }, { value: "นั่งลง" }, { value: "ออกแรง" }], answer: { value: "พยุง" }, explanationI18n: { "zh-TW": "「扶」= 用手支撐幫助對方。", th: "「扶 fú」= พยุง / ช่วยพยุง" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 1, prompt: { audioUrl: "/api/audio/vocab/輪椅", instructionKey: "listenPickHanzi" }, options: [{ value: "輪椅" }, { value: "換衣服" }, { value: "起來" }, { value: "好了" }], answer: { value: "輪椅" }, audioUrl: "/api/audio/vocab/輪椅", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 1, prompt: { thai: "ระวัง", instructionKey: "thaiToHanzi" }, options: [{ value: "小心" }, { value: "慢慢" }, { value: "用力" }, { value: "好了" }], answer: { value: "小心" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 2, prompt: { sentenceParts: ["我來", "___", "您起來。"], sentencePinyin: "wǒ lái ___ nín qǐlái.", translationI18n: { th: "หนูมาพยุงคุณปู่ลุกขึ้น" }, instructionKey: "fillBlank" }, options: [{ value: "扶" }, { value: "推" }, { value: "拿" }, { value: "走" }], answer: { value: "扶" }, explanationI18n: { "zh-TW": "「扶」用於扶持幫助對方站起或行走。", th: "「扶」ใช้เมื่อพยุงช่วยให้ผู้อื่นลุกหรือเดิน" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["慢慢", "來", "，", "不", "急"], targetTranslationI18n: { th: "ค่อยๆ ไม่รีบ" }, instructionKey: "arrangeWords" }, options: [{ value: "慢慢" }, { value: "來" }, { value: "，" }, { value: "不" }, { value: "急" }], answer: { value: ["慢慢", "來", "，", "不", "急"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 2, prompt: { audioUrl: "/api/audio/dialogue/L1-S07/1", questionI18n: { "zh-TW": "歐寶要幫阿公做什麼？", th: "อ้าวเป่าจะช่วยคุณปู่ทำอะไร?" } }, options: [{ value: "起床坐輪椅" }, { value: "換衣服" }, { value: "吃飯" }, { value: "量血壓" }], answer: { value: "起床坐輪椅" }, audioUrl: "/api/audio/dialogue/L1-S07/1", skillsTrained: ["listening"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 2, prompt: { hanzi: "我來扶您，小心。", pinyin: "wǒ lái fú nín, xiǎoxīn.", audioUrl: "/api/audio/sentence/L1-S07-assist", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "扶", pinyin: "fú", translationI18n: { th: "พยุง" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "扶" }, skillsTrained: ["writing"] },
  ],
};
