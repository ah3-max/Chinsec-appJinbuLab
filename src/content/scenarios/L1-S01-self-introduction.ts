// L1-S01 第一天上班自我介紹
//
// 場景:歐寶第一天到愛愛院上班,跟主任見面。
// 重點能力:能說姓名、國籍、身份;基本敬語「您好/我叫/來自」。

import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L1_S01: ScenarioDef = {
  code: "L1-S01",
  level: Level.A1_BEGINNER,
  orderIndex: 1,
  title: "第一天上班自我介紹",
  titleI18n: {
    "zh-TW": "第一天上班自我介紹",
    th: "วันแรกที่ทำงาน — แนะนำตัว",
    vi: "Ngày đầu đi làm — tự giới thiệu",
    id: "Hari pertama kerja — perkenalan diri",
  },
  estimatedMinutes: 25,
  mtcAlignment: {
    books: ["B1-L01", "B1-L02", "B1-L03"],
    topics: ["greeting", "self-intro", "nationality"],
  },
  hookContent: {
    storyTextI18n: {
      "zh-TW":
        "今天是歐寶第一天到愛愛院上班。她要先去找李主任報到,簡單地介紹自己。",
      th: "วันนี้เป็นวันแรกที่โอบาวมาทำงานที่บ้านพักไอ่ไอ่ เธอต้องไปรายงานตัวกับหัวหน้าหลี่และแนะนำตัวเอง",
      vi: "Hôm nay là ngày đầu Aobao đi làm tại Viện Ai-Ai. Cô cần gặp Trưởng phòng Lý báo cáo và tự giới thiệu.",
      id: "Hari ini adalah hari pertama Aobao bekerja di Panti Ai-Ai. Dia harus melapor kepada Bu Li dan memperkenalkan diri.",
    },
  },

  vocabularies: [
    {
      hanzi: "我",
      zhuyin: "ㄨㄛˇ",
      pinyin: "wǒ",
      partOfSpeech: "pron.",
      translations: { th: "ฉัน / ผม", en: "I / me" },
      category: "pronoun",
      tags: ["essential", "pronoun"],
      difficulty: 1,
      mtcReference: { book: "B1", lesson: "L01" },
    },
    {
      hanzi: "你",
      zhuyin: "ㄋㄧˇ",
      pinyin: "nǐ",
      partOfSpeech: "pron.",
      translations: { th: "คุณ", en: "you" },
      category: "pronoun",
      tags: ["essential", "pronoun"],
      difficulty: 1,
      mtcReference: { book: "B1", lesson: "L01" },
    },
    {
      hanzi: "您",
      zhuyin: "ㄋㄧㄣˊ",
      pinyin: "nín",
      partOfSpeech: "pron.",
      translations: { th: "คุณ (สุภาพ)", en: "you (polite)" },
      category: "pronoun",
      tags: ["essential", "polite", "eldercare"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L01" },
    },
    {
      hanzi: "是",
      zhuyin: "ㄕˋ",
      pinyin: "shì",
      partOfSpeech: "v.",
      translations: { th: "เป็น / คือ", en: "to be" },
      category: "verb",
      tags: ["essential"],
      difficulty: 1,
      mtcReference: { book: "B1", lesson: "L01" },
    },
    {
      hanzi: "好",
      zhuyin: "ㄏㄠˇ",
      pinyin: "hǎo",
      partOfSpeech: "adj.",
      translations: { th: "ดี", en: "good" },
      category: "greeting",
      tags: ["essential"],
      difficulty: 1,
      mtcReference: { book: "B1", lesson: "L01" },
    },
    {
      hanzi: "名字",
      zhuyin: "ㄇㄧㄥˊ ㄗ˙",
      pinyin: "míngzi",
      partOfSpeech: "n.",
      translations: { th: "ชื่อ", en: "name" },
      category: "self",
      tags: ["essential", "self-intro"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L02" },
    },
    {
      hanzi: "叫",
      zhuyin: "ㄐㄧㄠˋ",
      pinyin: "jiào",
      partOfSpeech: "v.",
      translations: { th: "เรียก / ชื่อว่า", en: "to be called" },
      category: "verb",
      tags: ["essential", "self-intro"],
      difficulty: 1,
      mtcReference: { book: "B1", lesson: "L02" },
    },
    {
      hanzi: "來自",
      zhuyin: "ㄌㄞˊ ㄗˋ",
      pinyin: "láizì",
      partOfSpeech: "v.",
      translations: { th: "มาจาก", en: "to come from" },
      category: "verb",
      tags: ["essential", "self-intro"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L03" },
    },
    {
      hanzi: "泰國",
      zhuyin: "ㄊㄞˋ ㄍㄨㄛˊ",
      pinyin: "tàiguó",
      partOfSpeech: "n.",
      translations: { th: "ประเทศไทย", en: "Thailand" },
      category: "country",
      tags: ["essential", "nationality"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L02" },
    },
    {
      // 養老院專業詞 — 不在《當代》詞表內
      hanzi: "照服員",
      zhuyin: "ㄓㄠˋ ㄈㄨˊ ㄩㄢˊ",
      pinyin: "zhàofúyuán",
      partOfSpeech: "n.",
      translations: { th: "ผู้ดูแลผู้สูงอายุ", en: "caregiver" },
      category: "eldercare",
      tags: ["essential", "eldercare", "job-title"],
      difficulty: 2,
      isEldercareVocab: true,
    },
  ],

  dialogue: [
    {
      speaker: "manager",
      speakerLabel: { "zh-TW": "李主任", th: "หัวหน้าหลี่" },
      hanzi: "你好!請問你叫什麼名字?",
      pinyin: "nǐ hǎo! qǐng wèn nǐ jiào shénme míngzi?",
      translationI18n: {
        th: "สวัสดีค่ะ! ขอถามชื่อคุณหน่อยได้ไหมคะ?",
      },
    },
    {
      speaker: "learner",
      speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" },
      hanzi: "您好!我叫歐寶,我來自泰國。",
      pinyin: "nín hǎo! wǒ jiào ōu bǎo, wǒ láizì tàiguó.",
      translationI18n: {
        th: "สวัสดีค่ะ! ฉันชื่อโอบาว มาจากประเทศไทยค่ะ",
      },
    },
    {
      speaker: "manager",
      speakerLabel: { "zh-TW": "李主任", th: "หัวหน้าหลี่" },
      hanzi: "歡迎!你是新來的照服員嗎?",
      pinyin: "huānyíng! nǐ shì xīn lái de zhàofúyuán ma?",
      translationI18n: {
        th: "ยินดีต้อนรับ! คุณเป็นพนักงานดูแลคนใหม่ใช่ไหมคะ?",
      },
    },
    {
      speaker: "learner",
      speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" },
      hanzi: "是的,我是新來的。請多指教。",
      pinyin: "shì de, wǒ shì xīn lái de. qǐng duō zhǐjiào.",
      translationI18n: {
        th: "ใช่ค่ะ ฉันเป็นพนักงานใหม่ ขอความกรุณาช่วยสอนด้วยค่ะ",
      },
    },
    {
      speaker: "manager",
      speakerLabel: { "zh-TW": "李主任", th: "หัวหน้าหลี่" },
      hanzi: "好的,歡迎加入愛愛院。",
      pinyin: "hǎo de, huānyíng jiārù ài ài yuàn.",
      translationI18n: {
        th: "ดีค่ะ ยินดีต้อนรับสู่บ้านพักไอ่ไอ่",
      },
    },
  ],

  exercises: [
    // 1. VOCAB_MCQ — 看「你好」選正確的泰文
    {
      type: ExerciseType.VOCAB_MCQ,
      difficulty: 1,
      prompt: { symbol: "你好", hanzi: "你好", pinyin: "nǐ hǎo" },
      options: [
        { value: "สวัสดี" },
        { value: "ลาก่อน" },
        { value: "ขอบคุณ" },
        { value: "ขอโทษ" },
      ],
      answer: { value: "สวัสดี" },
      explanationI18n: {
        "zh-TW": "「你好」是最常見的問候語,意思是 hello。",
        th: "「你好 nǐ hǎo」เป็นคำทักทายที่พบบ่อยที่สุด หมายถึง สวัสดี",
      },
      skillsTrained: ["vocab", "reading"],
    },
    // 2. VOCAB_LISTEN_CHOOSE — 聽 wǒ 選漢字
    {
      type: ExerciseType.VOCAB_LISTEN_CHOOSE,
      difficulty: 1,
      prompt: {
        audioUrl: "/api/audio/vocab/我",
        instructionKey: "listenPickHanzi",
      },
      options: [{ value: "我" }, { value: "你" }, { value: "是" }, { value: "好" }],
      answer: { value: "我" },
      audioUrl: "/api/audio/vocab/我",
      skillsTrained: ["listening", "vocab"],
    },
    // 3. VOCAB_MCQ_REVERSE — 「ประเทศไทย」對應哪個漢字
    {
      type: ExerciseType.VOCAB_MCQ_REVERSE,
      difficulty: 2,
      prompt: { thai: "ประเทศไทย", instructionKey: "thaiToHanzi" },
      options: [
        { value: "泰國" },
        { value: "越南" },
        { value: "印尼" },
        { value: "日本" },
      ],
      answer: { value: "泰國" },
      skillsTrained: ["vocab"],
    },
    // 4. GRAMMAR_FILL — 我 ___ 歐寶
    {
      type: ExerciseType.GRAMMAR_FILL,
      difficulty: 2,
      prompt: {
        sentenceParts: ["我", "___", "歐寶"],
        sentencePinyin: "wǒ ___ Ōu Bǎo",
        translationI18n: {
          th: "ฉัน ___ โอบาว (ฉันชื่อโอบาว)",
        },
        instructionKey: "fillBlank",
      },
      options: [{ value: "叫" }, { value: "是" }, { value: "好" }, { value: "您" }],
      answer: { value: "叫" },
      explanationI18n: {
        "zh-TW": "「我叫 + 名字」是介紹自己名字的固定句型,「叫」=「called」。",
        th: "รูปประโยค「我叫 + ชื่อ」ใช้บอกชื่อตัวเอง「叫」 = ชื่อว่า",
      },
      skillsTrained: ["grammar"],
    },
    // 5. GRAMMAR_ARRANGE — 排出「我是新來的照服員」
    {
      type: ExerciseType.GRAMMAR_ARRANGE,
      difficulty: 3,
      prompt: {
        words: ["我", "是", "新來的", "照服員"],
        targetTranslationI18n: {
          th: "ฉันเป็นพนักงานดูแลคนใหม่",
        },
        instructionKey: "arrangeWords",
      },
      options: [
        { value: "我" },
        { value: "是" },
        { value: "新來的" },
        { value: "照服員" },
      ],
      answer: { value: ["我", "是", "新來的", "照服員"] },
      skillsTrained: ["grammar", "writing"],
    },
    // 6. LISTEN_DIALOGUE_MCQ — 聽對話片段答歐寶來自哪裡
    {
      type: ExerciseType.LISTEN_DIALOGUE_MCQ,
      difficulty: 2,
      prompt: {
        audioUrl: "/api/audio/dialogue/L1-S01/2",
        questionI18n: {
          "zh-TW": "歐寶來自哪裡?",
          th: "โอบาวมาจากที่ไหน?",
        },
      },
      options: [
        { value: "泰國" },
        { value: "越南" },
        { value: "印尼" },
        { value: "中國" },
      ],
      answer: { value: "泰國" },
      audioUrl: "/api/audio/dialogue/L1-S01/2",
      skillsTrained: ["listening", "comprehension"],
    },
    // 7. SPEAK_REPEAT — 跟讀「您好!我叫歐寶」(目前 placeholder,等 Whisper)
    {
      type: ExerciseType.SPEAK_REPEAT,
      difficulty: 2,
      prompt: {
        hanzi: "您好!我叫歐寶。",
        pinyin: "nín hǎo! wǒ jiào Ōu Bǎo.",
        audioUrl: "/api/audio/sentence/L1-S01-greeting",
        instructionKey: "speakRepeat",
        notSupported: true,
      },
      options: [],
      answer: { value: "ok" },
      skillsTrained: ["speaking"],
    },
    // 8. WRITE_HANZI — 給拼音 wǒ + 泰文「ฉัน」,寫出「我」(canvas placeholder)
    {
      type: ExerciseType.WRITE_HANZI,
      difficulty: 3,
      prompt: {
        targetHanzi: "我",
        pinyin: "wǒ",
        translationI18n: { th: "ฉัน" },
        instructionKey: "writeHanzi",
        notSupported: true,
      },
      options: [],
      answer: { value: "我" },
      skillsTrained: ["writing"],
    },
  ],
};
