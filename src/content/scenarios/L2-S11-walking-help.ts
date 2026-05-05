// L2-S11 帶長輩散步
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L2_S11: ScenarioDef = {
  code: "L2-S11",
  level: Level.A2_BASIC,
  orderIndex: 11,
  title: "帶長輩散步",
  titleI18n: { "zh-TW": "帶長輩散步", th: "พาผู้สูงอายุไปเดินเล่น", vi: "Dẫn người già đi dạo", id: "Membawa Lansia Berjalan-jalan" },
  estimatedMinutes: 25,
  prerequisiteCode: "L2-S10",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "天氣不錯，歐寶要扶王阿公到院子散步。阿公膝蓋有點痛，所以要慢慢走、扶著扶手，走累就坐下來休息……",
      th: "อากาศดี อ้าวเป่าจะพาคุณปู่หวังไปเดินเล่นที่สนาม คุณปู่เข่าเจ็บนิดหน่อย จึงต้องเดินช้า จับราวกันตก เมื่อเหนื่อยก็นั่งพัก...",
      vi: "Thời tiết đẹp, Aobao sẽ đỡ ông Wang ra sân đi dạo. Đầu gối ông hơi đau, nên đi từ từ, vịn lan can, mệt thì ngồi nghỉ...",
      id: "Cuaca bagus, Aobao akan memapah Kakek Wang ke halaman jalan-jalan. Lutut Kakek agak sakit, jadi harus jalan pelan, pegang pegangan, capek istirahat...",
    },
  },
  mtcAlignment: { books: ["B2-L11"], topics: ["walking", "exercise"] },
  vocabularies: [
    { hanzi: "站起來", zhuyin: "ㄓㄢˋ ㄑㄧˇ ㄌㄞˊ", pinyin: "zhàn qǐlái", partOfSpeech: "v.", translations: { th: "ลุกขึ้นยืน", en: "stand up" }, category: "eldercare", tags: ["instruction", "movement"], difficulty: 1 },
    { hanzi: "走路", zhuyin: "ㄗㄡˇ ㄌㄨˋ", pinyin: "zǒu lù", partOfSpeech: "v.", translations: { th: "เดิน", en: "to walk" }, category: "daily", tags: ["movement"], difficulty: 1 },
    { hanzi: "扶著", zhuyin: "ㄈㄨˊ ˙ㄓㄜ", pinyin: "fú zhe", partOfSpeech: "v.", translations: { th: "พยุง/จับ", en: "hold onto" }, category: "eldercare", tags: ["assistance"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "扶手", zhuyin: "ㄈㄨˊ ㄕㄡˇ", pinyin: "fúshǒu", partOfSpeech: "n.", translations: { th: "ราวจับ", en: "handrail" }, category: "safety", tags: ["safety"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "膝蓋", zhuyin: "ㄒㄧ ㄍㄞˋ", pinyin: "xīgài", partOfSpeech: "n.", translations: { th: "เข่า", en: "knee" }, category: "body", tags: ["body"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "累", zhuyin: "ㄌㄟˋ", pinyin: "lèi", partOfSpeech: "adj.", translations: { th: "เหนื่อย", en: "tired" }, category: "feeling", tags: ["feeling"], difficulty: 1 },
    { hanzi: "休息", zhuyin: "ㄒㄧㄡ ㄒㄧˊ", pinyin: "xiūxí", partOfSpeech: "v.", translations: { th: "พักผ่อน", en: "to rest" }, category: "daily", tags: ["rest"], difficulty: 1 },
    { hanzi: "院子", zhuyin: "ㄩㄢˋ ˙ㄗ", pinyin: "yuànzi", partOfSpeech: "n.", translations: { th: "สนาม/ลาน", en: "yard/courtyard" }, category: "place", tags: ["place"], difficulty: 1 },
    { hanzi: "天氣", zhuyin: "ㄊㄧㄢ ㄑㄧˋ", pinyin: "tiānqì", partOfSpeech: "n.", translations: { th: "อากาศ", en: "weather" }, category: "daily", tags: ["nature"], difficulty: 1 },
    { hanzi: "曬太陽", zhuyin: "ㄕㄞˋ ㄊㄞˋ ㄧㄤˊ", pinyin: "shài tàiyáng", partOfSpeech: "v.", translations: { th: "อาบแดด", en: "to sunbathe" }, category: "eldercare", tags: ["activity"], difficulty: 2, isEldercareVocab: true },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿公，今天天氣很好，我們去院子散步好嗎？", pinyin: "ā gōng, jīntiān tiānqì hěn hǎo, wǒmen qù yuànzi sàn bù hǎo ma?", translationI18n: { th: "คุณปู่ วันนี้อากาศดี เราออกไปเดินเล่นที่สนามกันไหมคะ?" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "好，但是我膝蓋有點痛。", pinyin: "hǎo, dànshì wǒ xīgài yǒu diǎn tòng.", translationI18n: { th: "ดีๆ แต่เข่าฉันเจ็บนิดหน่อย" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "沒關係，慢慢走。請扶著扶手。", pinyin: "méi guānxi, mànman zǒu. qǐng fú zhe fúshǒu.", translationI18n: { th: "ไม่เป็นไรค่ะ ค่อยๆ เดิน กรุณาจับราวด้วยนะคะ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "好。走累了我要休息。", pinyin: "hǎo. zǒu lèi le wǒ yào xiūxí.", translationI18n: { th: "ได้ ถ้าเดินเหนื่อยฉันจะนั่งพัก" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好，您累就坐下，曬曬太陽也很好。", pinyin: "hǎo, nín lèi jiù zuòxia, shài shài tàiyáng yě hěn hǎo.", translationI18n: { th: "ค่ะ ถ้าเหนื่อยก็นั่งลง อาบแดดก็ดีเหมือนกัน" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 1, prompt: { symbol: "扶手", hanzi: "扶手", pinyin: "fúshǒu" }, options: [{ value: "ราวจับ" }, { value: "เก้าอี้" }, { value: "เตียง" }, { value: "ผนัง" }], answer: { value: "ราวจับ" }, explanationI18n: { "zh-TW": "「扶手」= handrail，走廊牆上幫長輩平衡的把手。", th: "「扶手 fúshǒu」= ราวจับ" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 1, prompt: { audioUrl: "/api/audio/vocab/休息", instructionKey: "listenPickHanzi" }, options: [{ value: "休息" }, { value: "走路" }, { value: "站起來" }, { value: "曬太陽" }], answer: { value: "休息" }, audioUrl: "/api/audio/vocab/休息", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 1, prompt: { thai: "เข่า", instructionKey: "thaiToHanzi" }, options: [{ value: "膝蓋" }, { value: "腳" }, { value: "手" }, { value: "肚子" }], answer: { value: "膝蓋" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 2, prompt: { sentenceParts: ["請", "___", "扶手，慢慢走。"], sentencePinyin: "qǐng ___ fúshǒu, mànman zǒu.", translationI18n: { th: "กรุณาจับราว ค่อยๆ เดิน" }, instructionKey: "fillBlank" }, options: [{ value: "扶著" }, { value: "看著" }, { value: "拿著" }, { value: "走著" }], answer: { value: "扶著" }, explanationI18n: { "zh-TW": "「扶著扶手」= holding the handrail，提醒長輩維持平衡。", th: "「扶著」= จับ/พยุง ใช้กับ「扶手」= ราวจับ" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["走累了", "，", "我們", "坐下", "休息"], targetTranslationI18n: { th: "เดินเหนื่อยแล้ว นั่งลงพักกัน" }, instructionKey: "arrangeWords" }, options: [{ value: "走累了" }, { value: "，" }, { value: "我們" }, { value: "坐下" }, { value: "休息" }], answer: { value: ["走累了", "，", "我們", "坐下", "休息"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 2, prompt: { audioUrl: "/api/audio/dialogue/L2-S11/1", questionI18n: { "zh-TW": "王阿公哪裡不舒服？", th: "คุณปู่หวังไม่สบายตรงไหน?" } }, options: [{ value: "膝蓋有點痛" }, { value: "頭很暈" }, { value: "肚子餓" }, { value: "眼睛累" }], answer: { value: "膝蓋有點痛" }, audioUrl: "/api/audio/dialogue/L2-S11/1", skillsTrained: ["listening"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 2, prompt: { hanzi: "請扶著扶手，慢慢走。", pinyin: "qǐng fú zhe fúshǒu, mànman zǒu.", audioUrl: "/api/audio/sentence/L2-S11-walk", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "走", pinyin: "zǒu", translationI18n: { th: "เดิน" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "走" }, skillsTrained: ["writing"] },
  ],
};
