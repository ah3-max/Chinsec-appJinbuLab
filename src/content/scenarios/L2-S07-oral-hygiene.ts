// L2-S07 餵水與口腔清潔
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L2_S07: ScenarioDef = {
  code: "L2-S07",
  level: Level.A2_BASIC,
  orderIndex: 7,
  title: "餵水與口腔清潔",
  titleI18n: { "zh-TW": "餵水與口腔清潔", th: "ป้อนน้ำและทำความสะอาดช่องปาก", vi: "Cho uống nước và vệ sinh răng miệng", id: "Memberi Minum dan Kebersihan Mulut" },
  estimatedMinutes: 30,
  prerequisiteCode: "L2-S06",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "陳阿嬤吃完早餐後，歐寶要協助她喝水、漱口、刷牙。陳阿嬤戴假牙，所以還要把假牙拿出來清潔……",
      th: "หลังคุณยายเฉินทานข้าวเช้าเสร็จ อ้าวเป่าต้องช่วยให้ดื่มน้ำ บ้วนปาก แปรงฟัน คุณยายเฉินใส่ฟันปลอม จึงต้องถอดออกมาทำความสะอาดด้วย...",
      vi: "Sau khi bà Trần ăn sáng xong, Aobao phải giúp bà uống nước, súc miệng, đánh răng. Bà Trần đeo răng giả nên còn phải tháo ra vệ sinh...",
      id: "Setelah Nenek Chen sarapan, Aobao perlu membantunya minum air, kumur, sikat gigi. Nenek Chen pakai gigi palsu, jadi harus dilepas dan dibersihkan juga...",
    },
  },
  mtcAlignment: { books: ["B2-L02", "B2-L07"], topics: ["hygiene", "oral-care"] },
  vocabularies: [
    { hanzi: "喝水", zhuyin: "ㄏㄜ ㄕㄨㄟˇ", pinyin: "hē shuǐ", partOfSpeech: "v.", translations: { th: "ดื่มน้ำ", en: "drink water" }, category: "eldercare", tags: ["meal"], difficulty: 1 },
    { hanzi: "漱口", zhuyin: "ㄕㄨˋ ㄎㄡˇ", pinyin: "shùkǒu", partOfSpeech: "v.", translations: { th: "บ้วนปาก", en: "rinse mouth" }, category: "eldercare", tags: ["hygiene"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "牙刷", zhuyin: "ㄧㄚˊ ㄕㄨㄚ", pinyin: "yáshuā", partOfSpeech: "n.", translations: { th: "แปรงสีฟัน", en: "toothbrush" }, category: "eldercare", tags: ["hygiene"], difficulty: 1 },
    { hanzi: "牙膏", zhuyin: "ㄧㄚˊ ㄍㄠ", pinyin: "yágāo", partOfSpeech: "n.", translations: { th: "ยาสีฟัน", en: "toothpaste" }, category: "eldercare", tags: ["hygiene"], difficulty: 1 },
    { hanzi: "假牙", zhuyin: "ㄐㄧㄚˇ ㄧㄚˊ", pinyin: "jiǎyá", partOfSpeech: "n.", translations: { th: "ฟันปลอม", en: "dentures" }, category: "medical", tags: ["dental", "elderly"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "刷牙", zhuyin: "ㄕㄨㄚ ㄧㄚˊ", pinyin: "shuā yá", partOfSpeech: "v.", translations: { th: "แปรงฟัน", en: "brush teeth" }, category: "eldercare", tags: ["hygiene"], difficulty: 1 },
    { hanzi: "杯子", zhuyin: "ㄅㄟ ˙ㄗ", pinyin: "bēizi", partOfSpeech: "n.", translations: { th: "แก้ว", en: "cup" }, category: "daily", tags: ["object"], difficulty: 1 },
    { hanzi: "口腔", zhuyin: "ㄎㄡˇ ㄑㄧㄤ", pinyin: "kǒuqiāng", partOfSpeech: "n.", translations: { th: "ช่องปาก", en: "oral cavity" }, category: "medical", tags: ["body"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "清潔", zhuyin: "ㄑㄧㄥ ㄐㄧㄝˊ", pinyin: "qīngjié", partOfSpeech: "v/adj.", translations: { th: "ทำความสะอาด/สะอาด", en: "to clean/clean" }, category: "eldercare", tags: ["hygiene"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "張開", zhuyin: "ㄓㄤ ㄎㄞ", pinyin: "zhāng kāi", partOfSpeech: "v.", translations: { th: "อ้า/เปิดออก", en: "to open (mouth)" }, category: "eldercare", tags: ["instruction"], difficulty: 2 },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿嬤，吃完早餐了，先喝點水好嗎？", pinyin: "ā mā, chīwán zǎocān le, xiān hē diǎn shuǐ hǎo ma?", translationI18n: { th: "คุณยาย ทานข้าวเช้าเสร็จแล้ว ดื่มน้ำหน่อยได้ไหมคะ?" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "好，給我杯子。", pinyin: "hǎo, gěi wǒ bēizi.", translationI18n: { th: "ดี ส่งแก้วให้ยายหน่อย" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "慢慢喝。喝完我們漱口、刷牙，好不好？", pinyin: "mànman hē. hēwán wǒmen shùkǒu, shuā yá, hǎo bù hǎo?", translationI18n: { th: "ค่อยๆ ดื่มนะ พอดื่มเสร็จเรามาบ้วนปาก แปรงฟันกัน ได้ไหมคะ?" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "我有假牙，要先拿出來。", pinyin: "wǒ yǒu jiǎyá, yào xiān ná chūlái.", translationI18n: { th: "ยายมีฟันปลอม ต้องถอดออกก่อน" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好，請張開嘴巴，我幫您拿出來清潔。", pinyin: "hǎo, qǐng zhāng kāi zuǐba, wǒ bāng nín ná chūlái qīngjié.", translationI18n: { th: "ค่ะ กรุณาอ้าปาก หนูจะช่วยถอดออกมาทำความสะอาดให้นะคะ" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 1, prompt: { symbol: "假牙", hanzi: "假牙", pinyin: "jiǎyá" }, options: [{ value: "ฟันปลอม" }, { value: "แปรงสีฟัน" }, { value: "ยาสีฟัน" }, { value: "ช่องปาก" }], answer: { value: "ฟันปลอม" }, explanationI18n: { "zh-TW": "「假牙」= dentures，許多長輩都有。", th: "「假牙 jiǎyá」= ฟันปลอม" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 1, prompt: { audioUrl: "/api/audio/vocab/漱口", instructionKey: "listenPickHanzi" }, options: [{ value: "漱口" }, { value: "刷牙" }, { value: "喝水" }, { value: "清潔" }], answer: { value: "漱口" }, audioUrl: "/api/audio/vocab/漱口", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 1, prompt: { thai: "แปรงสีฟัน", instructionKey: "thaiToHanzi" }, options: [{ value: "牙刷" }, { value: "牙膏" }, { value: "杯子" }, { value: "假牙" }], answer: { value: "牙刷" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 2, prompt: { sentenceParts: ["請", "___", "嘴巴。"], sentencePinyin: "qǐng ___ zuǐba.", translationI18n: { th: "กรุณาอ้าปาก" }, instructionKey: "fillBlank" }, options: [{ value: "張開" }, { value: "閉上" }, { value: "清潔" }, { value: "漱口" }], answer: { value: "張開" }, explanationI18n: { "zh-TW": "「張開嘴巴」= open the mouth，協助清潔口腔時的常用指令。", th: "「張開」= อ้า/เปิดออก ใช้บอกให้อ้าปาก" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["先", "喝", "點", "水", "好嗎"], targetTranslationI18n: { th: "ดื่มน้ำหน่อยก่อนดีไหม?" }, instructionKey: "arrangeWords" }, options: [{ value: "先" }, { value: "喝" }, { value: "點" }, { value: "水" }, { value: "好嗎" }], answer: { value: ["先", "喝", "點", "水", "好嗎"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 2, prompt: { audioUrl: "/api/audio/dialogue/L2-S07/1", questionI18n: { "zh-TW": "陳阿嬤的牙齒怎麼處理？", th: "ฟันของคุณยายเฉินทำอย่างไร?" } }, options: [{ value: "拿出假牙清潔" }, { value: "用牙線" }, { value: "看牙醫" }, { value: "不刷牙" }], answer: { value: "拿出假牙清潔" }, audioUrl: "/api/audio/dialogue/L2-S07/1", skillsTrained: ["listening"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 2, prompt: { hanzi: "請張開嘴巴，我幫您清潔。", pinyin: "qǐng zhāng kāi zuǐba, wǒ bāng nín qīngjié.", audioUrl: "/api/audio/sentence/L2-S07-oral-clean", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "牙", pinyin: "yá", translationI18n: { th: "ฟัน" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "牙" }, skillsTrained: ["writing"] },
  ],
};
