// L2-S10 簡單情緒安撫
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L2_S10: ScenarioDef = {
  code: "L2-S10",
  level: Level.A2_BASIC,
  orderIndex: 10,
  title: "簡單情緒安撫",
  titleI18n: { "zh-TW": "簡單情緒安撫", th: "การปลอบโยนอารมณ์เบื้องต้น", vi: "An ủi cảm xúc đơn giản", id: "Menenangkan Emosi Sederhana" },
  estimatedMinutes: 25,
  prerequisiteCode: "L2-S09",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "陳阿嬤今天看著家人的照片在哭。她說想念兒子，覺得寂寞。歐寶要安慰阿嬤，告訴她「不要哭」「慢慢來」「家人很愛您」……",
      th: "วันนี้คุณยายเฉินมองรูปครอบครัวแล้วร้องไห้ ยายบอกว่าคิดถึงลูกชาย รู้สึกเหงา อ้าวเป่าต้องปลอบยายว่า「อย่าร้องไห้」「ค่อยๆ เป็นไป」「ครอบครัวรักคุณยายมาก」...",
      vi: "Hôm nay bà Trần nhìn ảnh gia đình rồi khóc. Bà nói nhớ con trai, cảm thấy cô đơn. Aobao phải an ủi bà, nói 「đừng khóc」「từ từ」「gia đình rất yêu bà」...",
      id: "Hari ini Nenek Chen melihat foto keluarga lalu menangis. Nenek bilang merindukan anaknya, merasa kesepian. Aobao perlu menenangkan Nenek, mengatakan「jangan menangis」「pelan-pelan」「keluarga sangat menyayangi」...",
    },
  },
  mtcAlignment: { books: ["B2-L10", "B2-L11"], topics: ["emotion", "comfort"] },
  vocabularies: [
    { hanzi: "想家", zhuyin: "ㄒㄧㄤˇ ㄐㄧㄚ", pinyin: "xiǎng jiā", partOfSpeech: "v.", translations: { th: "คิดถึงบ้าน", en: "to miss home" }, category: "emotion", tags: ["emotion"], difficulty: 1, isEldercareVocab: true },
    { hanzi: "難過", zhuyin: "ㄋㄢˊ ㄍㄨㄛˋ", pinyin: "nánguò", partOfSpeech: "adj.", translations: { th: "เศร้า/เสียใจ", en: "sad" }, category: "emotion", tags: ["emotion"], difficulty: 1, isEldercareVocab: true },
    { hanzi: "別擔心", zhuyin: "ㄅㄧㄝˊ ㄉㄢ ㄒㄧㄣ", pinyin: "bié dānxīn", partOfSpeech: "exp.", translations: { th: "ไม่ต้องห่วง", en: "don't worry" }, category: "comfort", tags: ["comfort"], difficulty: 1, isEldercareVocab: true },
    { hanzi: "慢慢來", zhuyin: "ㄇㄢˋ ㄇㄢˋ ㄌㄞˊ", pinyin: "mànman lái", partOfSpeech: "exp.", translations: { th: "ค่อยๆ เป็นไป", en: "take it slow" }, category: "comfort", tags: ["comfort"], difficulty: 1 },
    { hanzi: "家人", zhuyin: "ㄐㄧㄚ ㄖㄣˊ", pinyin: "jiārén", partOfSpeech: "n.", translations: { th: "ครอบครัว/คนในครอบครัว", en: "family" }, category: "social", tags: ["family"], difficulty: 1 },
    { hanzi: "想念", zhuyin: "ㄒㄧㄤˇ ㄋㄧㄢˋ", pinyin: "xiǎngniàn", partOfSpeech: "v.", translations: { th: "คิดถึง/ระลึกถึง", en: "to miss (someone)" }, category: "emotion", tags: ["emotion"], difficulty: 2 },
    { hanzi: "寂寞", zhuyin: "ㄐㄧˊ ㄇㄛˋ", pinyin: "jímò", partOfSpeech: "adj.", translations: { th: "เหงา", en: "lonely" }, category: "emotion", tags: ["emotion"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "陪", zhuyin: "ㄆㄟˊ", pinyin: "péi", partOfSpeech: "v.", translations: { th: "อยู่เป็นเพื่อน/ดูแล", en: "to accompany" }, category: "comfort", tags: ["companion"], difficulty: 1 },
    { hanzi: "聊天", zhuyin: "ㄌㄧㄠˊ ㄊㄧㄢ", pinyin: "liáotiān", partOfSpeech: "v.", translations: { th: "คุยเล่น/พูดคุย", en: "to chat" }, category: "social", tags: ["communication"], difficulty: 1 },
    { hanzi: "笑", zhuyin: "ㄒㄧㄠˋ", pinyin: "xiào", partOfSpeech: "v.", translations: { th: "ยิ้ม/หัวเราะ", en: "to smile/laugh" }, category: "emotion", tags: ["emotion"], difficulty: 1 },
  ],
  dialogue: [
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "我好想兒子......我很寂寞。", pinyin: "wǒ hǎo xiǎng érzi...... wǒ hěn jímò.", translationI18n: { th: "ยายคิดถึงลูกชายมาก... ยายเหงาจัง" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿嬤，別擔心。家人很愛您。", pinyin: "ā mā, bié dānxīn. jiārén hěn ài nín.", translationI18n: { th: "คุณยาย ไม่ต้องห่วง ครอบครัวรักคุณยายมากค่ะ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "他們都太忙了，很少來看我。", pinyin: "tāmen dōu tài máng le, hěn shǎo lái kàn wǒ.", translationI18n: { th: "พวกเขายุ่งกันหมด มาเยี่ยมยายน้อย" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "我陪您聊天，慢慢來，不要難過。", pinyin: "wǒ péi nín liáotiān, mànman lái, bú yào nánguò.", translationI18n: { th: "หนูจะอยู่คุยเล่นเป็นเพื่อนค่ะ ค่อยๆ เป็นไปนะคะ อย่าเสียใจ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "謝謝你，歐寶。", pinyin: "xièxiè nǐ, Ōubǎo.", translationI18n: { th: "ขอบใจมากนะ อ้าวเป่า" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 1, prompt: { symbol: "想家", hanzi: "想家", pinyin: "xiǎng jiā" }, options: [{ value: "คิดถึงบ้าน" }, { value: "กลับบ้าน" }, { value: "อยากกินข้าว" }, { value: "เหงา" }], answer: { value: "คิดถึงบ้าน" }, explanationI18n: { "zh-TW": "「想家」= miss home，常見於離家在外的長輩或員工。", th: "「想家 xiǎng jiā」= คิดถึงบ้าน" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 1, prompt: { audioUrl: "/api/audio/vocab/別擔心", instructionKey: "listenPickHanzi" }, options: [{ value: "別擔心" }, { value: "別生氣" }, { value: "別哭" }, { value: "慢慢來" }], answer: { value: "別擔心" }, audioUrl: "/api/audio/vocab/別擔心", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 1, prompt: { thai: "เหงา", instructionKey: "thaiToHanzi" }, options: [{ value: "寂寞" }, { value: "難過" }, { value: "想念" }, { value: "想家" }], answer: { value: "寂寞" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 2, prompt: { sentenceParts: ["別擔心，", "___", "來。"], sentencePinyin: "bié dānxīn, ___ lái.", translationI18n: { th: "ไม่ต้องห่วง ค่อยๆ เป็นไป" }, instructionKey: "fillBlank" }, options: [{ value: "慢慢" }, { value: "快點" }, { value: "馬上" }, { value: "認真" }], answer: { value: "慢慢" }, explanationI18n: { "zh-TW": "「慢慢來」是常見的安慰語，請對方放鬆、不必急。", th: "「慢慢來」= ค่อยๆ เป็นไป ใช้ปลอบไม่ให้รีบ" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["我", "陪", "您", "聊天"], targetTranslationI18n: { th: "หนูจะอยู่คุยเป็นเพื่อนค่ะ" }, instructionKey: "arrangeWords" }, options: [{ value: "我" }, { value: "陪" }, { value: "您" }, { value: "聊天" }], answer: { value: ["我", "陪", "您", "聊天"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 2, prompt: { audioUrl: "/api/audio/dialogue/L2-S10/1", questionI18n: { "zh-TW": "陳阿嬤為什麼難過？", th: "ทำไมคุณยายเฉินถึงเสียใจ?" } }, options: [{ value: "想念兒子，很寂寞" }, { value: "身體不舒服" }, { value: "肚子餓" }, { value: "看不到電視" }], answer: { value: "想念兒子，很寂寞" }, audioUrl: "/api/audio/dialogue/L2-S10/1", skillsTrained: ["listening"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 2, prompt: { hanzi: "別擔心，我陪您聊天，慢慢來。", pinyin: "bié dānxīn, wǒ péi nín liáotiān, mànman lái.", audioUrl: "/api/audio/sentence/L2-S10-comfort", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "陪", pinyin: "péi", translationI18n: { th: "อยู่เป็นเพื่อน" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "陪" }, skillsTrained: ["writing"] },
  ],
};
