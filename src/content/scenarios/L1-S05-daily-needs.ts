// L1-S05 詢問長輩需求
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L1_S05: ScenarioDef = {
  code: "L1-S05",
  level: Level.A1_BEGINNER,
  orderIndex: 5,
  title: "詢問長輩需求",
  titleI18n: { "zh-TW": "詢問長輩需求", th: "ถามความต้องการของผู้สูงอายุ", vi: "Hỏi nhu cầu của người cao tuổi", id: "Menanyakan Kebutuhan Lansia" },
  estimatedMinutes: 25,
  prerequisiteCode: "L1-S04",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "歐寶巡視房間，看到陳阿嬤一個人坐著。她想關心阿嬤有什麼需要，但不確定怎麼問……",
      th: "อ้าวเป่าเดินตรวจห้อง เห็นคุณยายเฉินนั่งอยู่คนเดียว เธออยากถามว่าคุณยายต้องการอะไรบ้าง แต่ไม่รู้จะพูดอย่างไร...",
      vi: "Aobao đi tuần các phòng, thấy bà Chen ngồi một mình. Cô muốn hỏi xem bà cần gì...",
      id: "Aobao memeriksa kamar dan melihat Nenek Chen duduk sendirian. Dia ingin menanyakan apa yang dibutuhkan nenek...",
    },
  },
  mtcAlignment: { books: ["B1-L04"], topics: ["needs", "daily-care"] },
  vocabularies: [
    { hanzi: "要", zhuyin: "ㄧㄠˋ", pinyin: "yào", partOfSpeech: "v.", translations: { th: "ต้องการ / อยาก", en: "to want" }, category: "verb", tags: ["essential"], difficulty: 1 },
    { hanzi: "不要", zhuyin: "ㄅㄨˋ ㄧㄠˋ", pinyin: "búyào", partOfSpeech: "v.", translations: { th: "ไม่ต้องการ", en: "don't want" }, category: "verb", tags: ["essential"], difficulty: 1 },
    { hanzi: "喝水", zhuyin: "ㄏㄜ ㄕㄨㄟˇ", pinyin: "hē shuǐ", partOfSpeech: "v.", translations: { th: "ดื่มน้ำ", en: "drink water" }, category: "daily", tags: ["daily", "care"], difficulty: 1, isEldercareVocab: true },
    { hanzi: "吃飯", zhuyin: "ㄔ ㄈㄢˋ", pinyin: "chī fàn", partOfSpeech: "v.", translations: { th: "กินข้าว", en: "eat a meal" }, category: "daily", tags: ["daily"], difficulty: 1, isEldercareVocab: true },
    { hanzi: "上廁所", zhuyin: "ㄕㄤˋ ㄘㄜˋ ˙ㄙㄨㄛ", pinyin: "shàng cèsuǒ", partOfSpeech: "v.", translations: { th: "เข้าห้องน้ำ", en: "use the restroom" }, category: "daily", tags: ["daily", "care"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "休息", zhuyin: "ㄒㄧㄡ ˙ㄒㄧ", pinyin: "xiūxi", partOfSpeech: "v.", translations: { th: "พัก", en: "to rest" }, category: "daily", tags: ["daily"], difficulty: 1 },
    { hanzi: "冷", zhuyin: "ㄌㄥˇ", pinyin: "lěng", partOfSpeech: "adj.", translations: { th: "หนาว", en: "cold" }, category: "feeling", tags: ["feeling"], difficulty: 1 },
    { hanzi: "熱", zhuyin: "ㄖㄜˋ", pinyin: "rè", partOfSpeech: "adj.", translations: { th: "ร้อน", en: "hot" }, category: "feeling", tags: ["feeling"], difficulty: 1 },
    { hanzi: "舒服", zhuyin: "ㄕㄨ ˙ㄈㄨ", pinyin: "shūfu", partOfSpeech: "adj.", translations: { th: "สบาย", en: "comfortable" }, category: "feeling", tags: ["feeling"], difficulty: 2 },
    { hanzi: "謝謝", zhuyin: "ㄒㄧㄝˋ ˙ㄒㄧㄝ", pinyin: "xièxie", partOfSpeech: "exp.", translations: { th: "ขอบคุณ", en: "thank you" }, category: "greeting", tags: ["essential"], difficulty: 1 },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿嬤，您好！您要喝水嗎？", pinyin: "ā mà, nín hǎo! nín yào hē shuǐ ma?", translationI18n: { th: "คุณยายสวัสดีครับ/ค่ะ! ต้องการดื่มน้ำไหม?" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "要，謝謝你。", pinyin: "yào, xièxie nǐ.", translationI18n: { th: "ต้องการค่ะ ขอบคุณ" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿嬤，您冷嗎？要蓋毯子嗎？", pinyin: "ā mà, nín lěng ma? yào gài tǎnzi ma?", translationI18n: { th: "คุณยายหนาวไหมครับ/ค่ะ? ต้องการผ้าห่มไหม?" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "不要，我很舒服。", pinyin: "bú yào, wǒ hěn shūfu.", translationI18n: { th: "ไม่ต้องการค่ะ สบายดี" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好的，阿嬤需要什麼請叫我。", pinyin: "hǎo de, ā mà xūyào shénme qǐng jiào wǒ.", translationI18n: { th: "ได้เลยครับ/ค่ะ ต้องการอะไรเรียกหนูได้เลยนะ" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 1, prompt: { symbol: "要", hanzi: "要", pinyin: "yào" }, options: [{ value: "ต้องการ" }, { value: "ไม่ต้องการ" }, { value: "พัก" }, { value: "หนาว" }], answer: { value: "ต้องการ" }, explanationI18n: { "zh-TW": "「要」表示想要、需要。", th: "「要 yào」= ต้องการ" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 1, prompt: { audioUrl: "/api/audio/vocab/喝水", instructionKey: "listenPickHanzi" }, options: [{ value: "喝水" }, { value: "吃飯" }, { value: "休息" }, { value: "謝謝" }], answer: { value: "喝水" }, audioUrl: "/api/audio/vocab/喝水", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 1, prompt: { thai: "เข้าห้องน้ำ", instructionKey: "thaiToHanzi" }, options: [{ value: "上廁所" }, { value: "吃飯" }, { value: "喝水" }, { value: "休息" }], answer: { value: "上廁所" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 2, prompt: { sentenceParts: ["您要喝水", "___", "？"], sentencePinyin: "nín yào hē shuǐ ___?", translationI18n: { th: "คุณยายต้องการดื่มน้ำ___?" }, instructionKey: "fillBlank" }, options: [{ value: "嗎" }, { value: "吧" }, { value: "呢" }, { value: "的" }], answer: { value: "嗎" }, explanationI18n: { "zh-TW": "「嗎」用於疑問句末。", th: "「嗎」ใช้ท้ายประโยคคำถาม" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["您", "要", "休息", "嗎"], targetTranslationI18n: { th: "คุณยายต้องการพักไหม?" }, instructionKey: "arrangeWords" }, options: [{ value: "您" }, { value: "要" }, { value: "休息" }, { value: "嗎" }], answer: { value: ["您", "要", "休息", "嗎"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 2, prompt: { audioUrl: "/api/audio/dialogue/L1-S05/1", questionI18n: { "zh-TW": "陳阿嬤想要什麼？", th: "คุณยายเฉินต้องการอะไร?" } }, options: [{ value: "喝水" }, { value: "吃飯" }, { value: "休息" }, { value: "上廁所" }], answer: { value: "喝水" }, audioUrl: "/api/audio/dialogue/L1-S05/1", skillsTrained: ["listening"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 2, prompt: { hanzi: "您要喝水嗎？", pinyin: "nín yào hē shuǐ ma?", audioUrl: "/api/audio/sentence/L1-S05-water", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "水", pinyin: "shuǐ", translationI18n: { th: "น้ำ" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "水" }, skillsTrained: ["writing"] },
  ],
};
