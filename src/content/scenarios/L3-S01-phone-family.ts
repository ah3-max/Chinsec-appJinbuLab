// L3-S01 接電話：家屬來電問候
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S01: ScenarioDef = {
  code: "L3-S01",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 1,
  title: "接電話：家屬來電問候",
  titleI18n: { "zh-TW": "接電話：家屬來電問候", th: "รับโทรศัพท์: ครอบครัวโทรมาเยี่ยมอาการ", vi: "Nghe điện thoại: gia đình hỏi thăm", id: "Menerima Telepon: Keluarga Menanyakan Kabar" },
  estimatedMinutes: 30,
  prerequisiteCode: "L2-S12",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "王阿公的兒子王先生從美國打電話來，想知道父親最近的狀況。歐寶要禮貌應答、簡單描述阿公一週的飲食、睡眠、心情，並轉達阿公的話……",
      th: "ลูกชายคุณปู่หวัง คุณวังโทรมาจากอเมริกา อยากทราบอาการคุณพ่อในช่วงนี้ อ้าวเป่าต้องตอบรับอย่างสุภาพ อธิบายเรื่องการกิน การนอน และอารมณ์ของปู่ในรอบสัปดาห์ และส่งคำพูดของปู่ให้ฟัง...",
      vi: "Con trai ông Wang gọi từ Mỹ về, muốn biết tình hình cha gần đây. Aobao cần trả lời lịch sự, mô tả tình hình ăn uống, giấc ngủ, tâm trạng của ông trong tuần qua, và chuyển lời của ông...",
      id: "Anak Kakek Wang menelepon dari Amerika, ingin tahu kondisi ayahnya belakangan. Aobao perlu menjawab dengan sopan, menggambarkan pola makan, tidur, dan suasana hati Kakek dalam seminggu, serta menyampaikan pesan Kakek...",
    },
  },
  mtcAlignment: { books: ["B3-L01"], topics: ["phone", "family", "communication"] },
  vocabularies: [
    { hanzi: "請問", zhuyin: "ㄑㄧㄥˇ ㄨㄣˋ", pinyin: "qǐng wèn", partOfSpeech: "exp.", translations: { th: "ขอถามหน่อย/รบกวน", en: "may I ask" }, category: "communication", tags: ["polite"], difficulty: 1 },
    { hanzi: "找", zhuyin: "ㄓㄠˇ", pinyin: "zhǎo", partOfSpeech: "v.", translations: { th: "หา/มาหา", en: "to look for" }, category: "daily", tags: ["action"], difficulty: 1 },
    { hanzi: "轉達", zhuyin: "ㄓㄨㄢˇ ㄉㄚˊ", pinyin: "zhuǎndá", partOfSpeech: "v.", translations: { th: "ฝากบอก/ส่งต่อข้อความ", en: "to convey/relay" }, category: "communication", tags: ["communication"], difficulty: 2 },
    { hanzi: "最近", zhuyin: "ㄗㄨㄟˋ ㄐㄧㄣˋ", pinyin: "zuìjìn", partOfSpeech: "adv.", translations: { th: "เร็วๆ นี้/ช่วงนี้", en: "recently" }, category: "time", tags: ["time"], difficulty: 1 },
    { hanzi: "情形", zhuyin: "ㄑㄧㄥˊ ㄒㄧㄥˊ", pinyin: "qíngxíng", partOfSpeech: "n.", translations: { th: "สถานการณ์/อาการ", en: "situation" }, category: "report", tags: ["report"], difficulty: 2 },
    { hanzi: "整體", zhuyin: "ㄓㄥˇ ㄊㄧˇ", pinyin: "zhěngtǐ", partOfSpeech: "n/adv.", translations: { th: "โดยรวม/ภาพรวม", en: "overall" }, category: "abstract", tags: ["abstract"], difficulty: 2 },
    { hanzi: "穩定", zhuyin: "ㄨㄣˇ ㄉㄧㄥˋ", pinyin: "wěndìng", partOfSpeech: "adj.", translations: { th: "คงที่/มั่นคง", en: "stable" }, category: "medical", tags: ["health"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "問候", zhuyin: "ㄨㄣˋ ㄏㄡˋ", pinyin: "wènhòu", partOfSpeech: "v.", translations: { th: "ทักทาย/ถามอาการ", en: "to greet" }, category: "communication", tags: ["greeting"], difficulty: 2 },
    { hanzi: "告訴", zhuyin: "ㄍㄠˋ ㄙㄨˋ", pinyin: "gàosu", partOfSpeech: "v.", translations: { th: "บอก", en: "to tell" }, category: "communication", tags: ["communication"], difficulty: 1 },
    { hanzi: "電話", zhuyin: "ㄉㄧㄢˋ ㄏㄨㄚˋ", pinyin: "diànhuà", partOfSpeech: "n.", translations: { th: "โทรศัพท์", en: "phone" }, category: "daily", tags: ["communication"], difficulty: 1 },
  ],
  dialogue: [
    { speaker: "colleague", speakerLabel: { "zh-TW": "王先生", th: "คุณวัง" }, hanzi: "您好，我是王阿公的兒子，請問我父親最近怎麼樣？", pinyin: "nín hǎo, wǒ shì Wáng ā gōng de érzi, qǐng wèn wǒ fùqīn zuìjìn zěnmeyàng?", translationI18n: { th: "สวัสดีครับ ผมเป็นลูกชายคุณปู่หวัง ขอถามหน่อยครับ ช่วงนี้คุณพ่อเป็นยังไงบ้างครับ?" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "王先生您好，阿公整體情形穩定。", pinyin: "Wáng xiānshēng nín hǎo, ā gōng zhěngtǐ qíngxíng wěndìng.", translationI18n: { th: "คุณวังสวัสดีค่ะ คุณปู่โดยรวมอาการคงที่ค่ะ" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "這週吃飯睡覺都正常，心情也不錯。", pinyin: "zhè zhōu chī fàn shuì jiào dōu zhèngcháng, xīnqíng yě bú cuò.", translationI18n: { th: "สัปดาห์นี้ทานข้าวและนอนหลับเป็นปกติ อารมณ์ก็ดีค่ะ" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "王先生", th: "คุณวัง" }, hanzi: "謝謝。請告訴他我問候，下週末我會去看他。", pinyin: "xièxiè. qǐng gàosu tā wǒ wènhòu, xià zhōumò wǒ huì qù kàn tā.", translationI18n: { th: "ขอบคุณครับ ฝากบอกพ่อด้วยว่าผมฝากความระลึกถึง สุดสัปดาห์หน้าผมจะไปเยี่ยม" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好的，我馬上轉達給阿公。", pinyin: "hǎo de, wǒ mǎshàng zhuǎndá gěi ā gōng.", translationI18n: { th: "ค่ะ หนูจะรีบไปบอกคุณปู่ค่ะ" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 2, prompt: { symbol: "轉達", hanzi: "轉達", pinyin: "zhuǎndá" }, options: [{ value: "ฝากบอก/ส่งต่อข้อความ" }, { value: "หาตัว" }, { value: "พูดคุย" }, { value: "ทักทาย" }], answer: { value: "ฝากบอก/ส่งต่อข้อความ" }, explanationI18n: { "zh-TW": "「轉達」= relay a message，把別人的話傳達給第三方。", th: "「轉達 zhuǎndá」= ฝากบอก/ส่งต่อข้อความ" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/穩定", instructionKey: "listenPickHanzi" }, options: [{ value: "穩定" }, { value: "整體" }, { value: "情形" }, { value: "問候" }], answer: { value: "穩定" }, audioUrl: "/api/audio/vocab/穩定", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "เร็วๆ นี้", instructionKey: "thaiToHanzi" }, options: [{ value: "最近" }, { value: "現在" }, { value: "之前" }, { value: "後來" }], answer: { value: "最近" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["阿公整體情形", "___", "。"], sentencePinyin: "ā gōng zhěngtǐ qíngxíng ___.", translationI18n: { th: "คุณปู่โดยรวมอาการคงที่" }, instructionKey: "fillBlank" }, options: [{ value: "穩定" }, { value: "嚴重" }, { value: "緊急" }, { value: "平安" }], answer: { value: "穩定" }, explanationI18n: { "zh-TW": "「穩定」用於描述病況/狀況沒有惡化、處於可預期範圍。", th: "「穩定」= คงที่ ใช้บอกว่าอาการไม่แย่ลง" }, skillsTrained: ["grammar", "vocab"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["請", "告訴", "他", "我", "問候"], targetTranslationI18n: { th: "กรุณาบอกท่านด้วยว่าฉันฝากความระลึกถึง" }, instructionKey: "arrangeWords" }, options: [{ value: "請" }, { value: "告訴" }, { value: "他" }, { value: "我" }, { value: "問候" }], answer: { value: ["請", "告訴", "他", "我", "問候"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S01/1", questionI18n: { "zh-TW": "王先生希望歐寶轉達什麼？", th: "คุณวังต้องการให้อ้าวเป่าฝากบอกอะไร?" } }, options: [{ value: "問候，下週末會來看阿公" }, { value: "明天要帶阿公出院" }, { value: "送花來" }, { value: "要打給醫師" }], answer: { value: "問候，下週末會來看阿公" }, audioUrl: "/api/audio/dialogue/L3-S01/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "阿公整體情形穩定，吃飯睡覺都正常。", pinyin: "ā gōng zhěngtǐ qíngxíng wěndìng, chī fàn shuì jiào dōu zhèngcháng.", audioUrl: "/api/audio/sentence/L3-S01-report", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "穩", pinyin: "wěn", translationI18n: { th: "มั่นคง" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "穩" }, skillsTrained: ["writing"] },
  ],
};
