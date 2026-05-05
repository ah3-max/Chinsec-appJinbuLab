// L1-S06 數字與時間
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L1_S06: ScenarioDef = {
  code: "L1-S06",
  level: Level.A1_BEGINNER,
  orderIndex: 6,
  title: "數字與時間",
  titleI18n: { "zh-TW": "數字與時間", th: "ตัวเลขและเวลา", vi: "Số và thời gian", id: "Angka dan Waktu" },
  estimatedMinutes: 25,
  prerequisiteCode: "L1-S05",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "早上七點五十，歐寶要告訴王阿公現在幾點，以及九點要吃藥。但她不知道怎麼說時間……",
      th: "เวลา 07:50 น. อ้าวเป่าต้องบอกคุณปู่หวังว่าตอนนี้กี่โมง และต้องทานยาตอน 9 โมง แต่เธอไม่รู้จะพูดเรื่องเวลาอย่างไร...",
      vi: "Lúc 7 giờ 50 phút, Aobao phải nói với ông Wang bây giờ mấy giờ và 9 giờ phải uống thuốc. Nhưng cô không biết nói về thời gian...",
      id: "Pukul 7:50 pagi, Aobao harus memberitahu Kakek Wang sekarang jam berapa dan jam 9 harus minum obat. Tapi dia tidak tahu cara bicara soal waktu...",
    },
  },
  mtcAlignment: { books: ["B1-L06"], topics: ["numbers", "time", "daily-schedule"] },
  vocabularies: [
    { hanzi: "幾點", zhuyin: "ㄐㄧˇ ㄉㄧㄢˇ", pinyin: "jǐ diǎn", partOfSpeech: "q.", translations: { th: "กี่โมง", en: "what time" }, category: "time", tags: ["time", "question"], difficulty: 1 },
    { hanzi: "點", zhuyin: "ㄉㄧㄢˇ", pinyin: "diǎn", partOfSpeech: "m.", translations: { th: "นาฬิกา / โมง", en: "o'clock" }, category: "time", tags: ["time"], difficulty: 1 },
    { hanzi: "分", zhuyin: "ㄈㄣ", pinyin: "fēn", partOfSpeech: "m.", translations: { th: "นาที", en: "minute" }, category: "time", tags: ["time"], difficulty: 1 },
    { hanzi: "現在", zhuyin: "ㄒㄧㄢˋ ˙ㄗㄞ", pinyin: "xiànzài", partOfSpeech: "n.", translations: { th: "ตอนนี้", en: "now" }, category: "time", tags: ["time"], difficulty: 1 },
    { hanzi: "早上", zhuyin: "ㄗㄠˇ ˙ㄕㄤ", pinyin: "zǎoshang", partOfSpeech: "n.", translations: { th: "ตอนเช้า", en: "morning" }, category: "time", tags: ["time"], difficulty: 1 },
    { hanzi: "下午", zhuyin: "ㄒㄧㄚˋ ˙ㄨ", pinyin: "xiàwǔ", partOfSpeech: "n.", translations: { th: "บ่าย", en: "afternoon" }, category: "time", tags: ["time"], difficulty: 1 },
    { hanzi: "晚上", zhuyin: "ㄨㄢˇ ˙ㄕㄤ", pinyin: "wǎnshang", partOfSpeech: "n.", translations: { th: "ตอนเย็น / กลางคืน", en: "evening/night" }, category: "time", tags: ["time"], difficulty: 1 },
    { hanzi: "等一下", zhuyin: "ㄉㄥˇ ˙ㄧˋ ˙ㄒㄧㄚ", pinyin: "děng yīxià", partOfSpeech: "exp.", translations: { th: "รอสักครู่", en: "wait a moment" }, category: "daily", tags: ["polite", "care"], difficulty: 1 },
    { hanzi: "準時", zhuyin: "ㄓㄨㄣˇ ˙ㄕˊ", pinyin: "zhǔnshí", partOfSpeech: "adj.", translations: { th: "ตรงเวลา", en: "on time" }, category: "time", tags: ["time"], difficulty: 2 },
    { hanzi: "吃藥", zhuyin: "ㄔ ˙ㄧㄠˋ", pinyin: "chī yào", partOfSpeech: "v.", translations: { th: "ทานยา", en: "take medicine" }, category: "eldercare", tags: ["medical", "care"], difficulty: 1, isEldercareVocab: true },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿公早安！現在早上八點了。", pinyin: "ā gōng zǎo ān! xiànzài zǎoshang bā diǎn le.", translationI18n: { th: "อรุณสวัสดิ์ครับ/ค่ะคุณปู่! ตอนนี้แปดโมงเช้าแล้ว" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "這麼早！幾點吃早飯？", pinyin: "zhème zǎo! jǐ diǎn chī zǎofàn?", translationI18n: { th: "เช้าขนาดนี้เลย! กินอาหารเช้ากี่โมง?" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "八點半吃早飯。九點要吃藥，請準時。", pinyin: "bā diǎn bàn chī zǎofàn. jiǔ diǎn yào chī yào, qǐng zhǔnshí.", translationI18n: { th: "แปดโมงครึ่งกินอาหารเช้า เก้าโมงต้องทานยา กรุณาตรงเวลานะครับ/ค่ะ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "好，我記住了。", pinyin: "hǎo, wǒ jì zhù le.", translationI18n: { th: "ได้ ฉันจำไว้แล้ว" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "九點我會來提醒您，請等一下。", pinyin: "jiǔ diǎn wǒ huì lái tíxǐng nín, qǐng děng yīxià.", translationI18n: { th: "เก้าโมงหนูจะมาเตือนคุณปู่ กรุณารอสักครู่นะครับ/ค่ะ" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 1, prompt: { symbol: "幾點", hanzi: "幾點", pinyin: "jǐ diǎn" }, options: [{ value: "กี่โมง" }, { value: "ตอนนี้" }, { value: "ตอนเช้า" }, { value: "รอสักครู่" }], answer: { value: "กี่โมง" }, explanationI18n: { "zh-TW": "「幾點」用來詢問時間。", th: "「幾點 jǐ diǎn」ใช้ถามเวลา" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 1, prompt: { audioUrl: "/api/audio/vocab/現在", instructionKey: "listenPickHanzi" }, options: [{ value: "現在" }, { value: "早上" }, { value: "下午" }, { value: "晚上" }], answer: { value: "現在" }, audioUrl: "/api/audio/vocab/現在", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 1, prompt: { thai: "ตอนนี้", instructionKey: "thaiToHanzi" }, options: [{ value: "現在" }, { value: "早上" }, { value: "下午" }, { value: "晚上" }], answer: { value: "現在" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 2, prompt: { sentenceParts: ["現在早上八", "___", "。"], sentencePinyin: "xiànzài zǎoshang bā ___.", translationI18n: { th: "ตอนนี้แปดโมงเช้า" }, instructionKey: "fillBlank" }, options: [{ value: "點" }, { value: "分" }, { value: "時" }, { value: "刻" }], answer: { value: "點" }, explanationI18n: { "zh-TW": "「點」表示幾時（o'clock），如「八點」= 8 o'clock。", th: "「點」ใช้บอกชั่วโมง เช่น 八點 = แปดโมง" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["現在", "下午", "三", "點"], targetTranslationI18n: { th: "ตอนนี้บ่ายสามโมง" }, instructionKey: "arrangeWords" }, options: [{ value: "現在" }, { value: "下午" }, { value: "三" }, { value: "點" }], answer: { value: ["現在", "下午", "三", "點"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 2, prompt: { audioUrl: "/api/audio/dialogue/L1-S06/1", questionI18n: { "zh-TW": "幾點吃藥？", th: "กี่โมงทานยา?" } }, options: [{ value: "九點" }, { value: "八點" }, { value: "十點" }, { value: "七點" }], answer: { value: "九點" }, audioUrl: "/api/audio/dialogue/L1-S06/1", skillsTrained: ["listening"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 2, prompt: { hanzi: "現在幾點？", pinyin: "xiànzài jǐ diǎn?", audioUrl: "/api/audio/sentence/L1-S06-time", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "點", pinyin: "diǎn", translationI18n: { th: "โมง / นาฬิกา" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "點" }, skillsTrained: ["writing"] },
  ],
};
