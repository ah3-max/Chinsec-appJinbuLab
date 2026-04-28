// L1-S03 認識同事
//
// 場景:歐寶在交班時間遇見資深學姊小玲,學職場稱謂與禮貌客氣語。

import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L1_S03: ScenarioDef = {
  code: "L1-S03",
  level: Level.A1_BEGINNER,
  orderIndex: 3,
  title: "認識同事",
  titleI18n: {
    "zh-TW": "認識同事",
    th: "ทำความรู้จักเพื่อนร่วมงาน",
    vi: "Làm quen đồng nghiệp",
    id: "Mengenal rekan kerja",
  },
  estimatedMinutes: 25,
  prerequisiteCode: "L1-S02",
  mtcAlignment: {
    books: ["B1-L03", "B1-L04", "B1-L06"],
    topics: ["self-intro", "polite-form", "workplace-titles"],
  },
  hookContent: {
    storyTextI18n: {
      "zh-TW":
        "歐寶在交班時間遇到資深學姊小玲。她要學會用尊稱跟同事打招呼,並用禮貌客氣語請求對方多多幫忙。",
      th: "ในเวลาเปลี่ยนกะ โอบาวเจอรุ่นพี่ผู้มีประสบการณ์ชื่อเสี่ยวหลิง เธอต้องรู้จักทักทายเพื่อนร่วมงานด้วยคำสุภาพ และใช้ภาษาขอความช่วยเหลือ",
      vi: "Tại thời điểm đổi ca, Aobao gặp đàn chị Tiểu Linh giàu kinh nghiệm. Cô cần học dùng kính ngữ chào đồng nghiệp và lời lẽ lịch sự nhờ giúp đỡ.",
      id: "Saat pergantian shift, Aobao bertemu kakak senior bernama Xiaoling. Dia harus belajar menyapa rekan kerja dengan hormat dan menggunakan bahasa sopan untuk meminta bantuan.",
    },
  },

  vocabularies: [
    {
      hanzi: "學姊",
      zhuyin: "ㄒㄩㄝˊ ㄐㄧㄝˇ",
      pinyin: "xuéjiě",
      partOfSpeech: "n.",
      translations: { th: "รุ่นพี่ (หญิง)", en: "senior schoolmate (female)" },
      category: "workplace",
      tags: ["essential", "workplace", "title"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L03" },
    },
    {
      hanzi: "學長",
      zhuyin: "ㄒㄩㄝˊ ㄓㄤˇ",
      pinyin: "xuézhǎng",
      partOfSpeech: "n.",
      translations: { th: "รุ่นพี่ (ชาย)", en: "senior schoolmate (male)" },
      category: "workplace",
      tags: ["essential", "workplace", "title"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L03" },
    },
    {
      hanzi: "護理師",
      zhuyin: "ㄏㄨˋ ㄌㄧˇ ㄕ",
      pinyin: "hùlǐshī",
      partOfSpeech: "n.",
      translations: { th: "พยาบาล", en: "registered nurse" },
      category: "eldercare",
      tags: ["essential", "eldercare", "job-title"],
      difficulty: 2,
      isEldercareVocab: true,
    },
    {
      hanzi: "主任",
      zhuyin: "ㄓㄨˇ ㄖㄣˋ",
      pinyin: "zhǔrèn",
      partOfSpeech: "n.",
      translations: { th: "หัวหน้า / ผู้อำนวยการ", en: "director / supervisor" },
      category: "workplace",
      tags: ["essential", "workplace", "title"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L04" },
    },
    {
      hanzi: "同事",
      zhuyin: "ㄊㄨㄥˊ ㄕˋ",
      pinyin: "tóngshì",
      partOfSpeech: "n.",
      translations: { th: "เพื่อนร่วมงาน", en: "colleague" },
      category: "workplace",
      tags: ["essential", "workplace"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L04" },
    },
    {
      hanzi: "認識",
      zhuyin: "ㄖㄣˋ ㄕˋ",
      pinyin: "rènshi",
      partOfSpeech: "v.",
      translations: { th: "รู้จัก", en: "to know / to meet" },
      category: "verb",
      tags: ["essential", "social"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L03" },
    },
    {
      hanzi: "高興",
      zhuyin: "ㄍㄠ ㄒㄧㄥˋ",
      pinyin: "gāoxìng",
      partOfSpeech: "adj.",
      translations: { th: "ดีใจ", en: "glad / happy" },
      category: "emotion",
      tags: ["essential", "emotion"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L03" },
    },
    {
      hanzi: "麻煩",
      zhuyin: "ㄇㄚˊ ㄈㄢˊ",
      pinyin: "máfan",
      partOfSpeech: "v./adj.",
      translations: { th: "รบกวน / ยุ่งยาก", en: "to bother / troublesome" },
      category: "polite",
      tags: ["essential", "polite"],
      difficulty: 3,
      mtcReference: { book: "B1", lesson: "L06" },
    },
    {
      hanzi: "請多指教",
      zhuyin: "ㄑㄧㄥˇ ㄉㄨㄛ ㄓˇ ㄐㄧㄠˋ",
      pinyin: "qǐng duō zhǐjiào",
      partOfSpeech: "phrase",
      translations: {
        th: "ขอความกรุณาช่วยสอน",
        en: "please give me your guidance (humble)",
      },
      category: "polite",
      tags: ["essential", "polite", "workplace"],
      difficulty: 3,
      mtcReference: { book: "B1", lesson: "L06" },
    },
    {
      hanzi: "謝謝",
      zhuyin: "ㄒㄧㄝˋ ㄒㄧㄝ˙",
      pinyin: "xièxie",
      partOfSpeech: "v.",
      translations: { th: "ขอบคุณ", en: "thank you" },
      category: "greeting",
      tags: ["essential"],
      difficulty: 1,
      mtcReference: { book: "B1", lesson: "L01" },
    },
  ],

  dialogue: [
    {
      speaker: "colleague",
      speakerLabel: { "zh-TW": "小玲學姊", th: "รุ่นพี่เสี่ยวหลิง" },
      hanzi: "你好!我是這裡的學姊,叫小玲。",
      pinyin: "nǐ hǎo! wǒ shì zhèlǐ de xuéjiě, jiào Xiǎo Líng.",
      translationI18n: {
        th: "สวัสดีค่ะ! ฉันเป็นรุ่นพี่ที่นี่ ชื่อเสี่ยวหลิง",
      },
    },
    {
      speaker: "learner",
      speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" },
      hanzi: "學姊您好!我叫歐寶,請多指教。",
      pinyin: "xuéjiě nín hǎo! wǒ jiào ōu bǎo, qǐng duō zhǐjiào.",
      translationI18n: {
        th: "รุ่นพี่ค่ะ สวัสดีค่ะ! ฉันชื่อโอบาว ขอความกรุณาช่วยสอนด้วยค่ะ",
      },
    },
    {
      speaker: "colleague",
      speakerLabel: { "zh-TW": "小玲學姊", th: "รุ่นพี่เสี่ยวหลิง" },
      hanzi: "不客氣!有問題隨時問我。",
      pinyin: "bú kèqi! yǒu wèntí suíshí wèn wǒ.",
      translationI18n: {
        th: "ไม่เป็นไรค่ะ! มีปัญหาเมื่อไหร่ถามฉันได้ตลอดเลย",
      },
    },
    {
      speaker: "learner",
      speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" },
      hanzi: "麻煩您了,謝謝!",
      pinyin: "máfan nín le, xièxie!",
      translationI18n: {
        th: "รบกวนคุณด้วยนะคะ ขอบคุณค่ะ!",
      },
    },
    {
      speaker: "colleague",
      speakerLabel: { "zh-TW": "小玲學姊", th: "รุ่นพี่เสี่ยวหลิง" },
      hanzi: "別客氣,我們是同事嘛。",
      pinyin: "bié kèqi, wǒmen shì tóngshì ma.",
      translationI18n: {
        th: "ไม่ต้องเกรงใจ พวกเราเป็นเพื่อนร่วมงานนะ",
      },
    },
  ],

  exercises: [
    // 1. VOCAB_MCQ — 學姊
    {
      type: ExerciseType.VOCAB_MCQ,
      difficulty: 2,
      prompt: { symbol: "學姊", hanzi: "學姊", pinyin: "xuéjiě" },
      options: [
        { value: "รุ่นพี่ (หญิง)" },
        { value: "รุ่นน้อง" },
        { value: "เพื่อน" },
        { value: "ครู" },
      ],
      answer: { value: "รุ่นพี่ (หญิง)" },
      explanationI18n: {
        "zh-TW": "「學姊」是對年紀稍長/資深的女同學或同事的尊稱。",
        th: "「學姊 xuéjiě」เป็นคำเรียกผู้หญิงที่อายุมากกว่าหรือมีประสบการณ์มากกว่าด้วยความเคารพ",
      },
      skillsTrained: ["vocab"],
    },
    // 2. VOCAB_LISTEN_CHOOSE — 聽 hùlǐshī
    {
      type: ExerciseType.VOCAB_LISTEN_CHOOSE,
      difficulty: 2,
      prompt: {
        audioUrl: "/api/audio/vocab/護理師",
        instructionKey: "listenPickHanzi",
      },
      options: [
        { value: "護理師" },
        { value: "主任" },
        { value: "同事" },
        { value: "學姊" },
      ],
      answer: { value: "護理師" },
      audioUrl: "/api/audio/vocab/護理師",
      skillsTrained: ["listening", "vocab"],
    },
    // 3. VOCAB_MCQ_REVERSE — 「ขอความกรุณาช่วยสอน」對應哪個
    {
      type: ExerciseType.VOCAB_MCQ_REVERSE,
      difficulty: 3,
      prompt: { thai: "ขอความกรุณาช่วยสอน", instructionKey: "thaiToHanzi" },
      options: [
        { value: "請多指教" },
        { value: "謝謝" },
        { value: "對不起" },
        { value: "再見" },
      ],
      answer: { value: "請多指教" },
      explanationI18n: {
        "zh-TW":
          "「請多指教」是常見的職場、社交客氣語,意思是希望對方多教導/多包涵。",
        th: "「請多指教」เป็นคำสุภาพที่ใช้ในงาน/สังคม หมายถึงขอให้ช่วยสอนและรับฟังด้วย",
      },
      skillsTrained: ["vocab", "polite"],
    },
    // 4. GRAMMAR_FILL — 「很___認識您」
    {
      type: ExerciseType.GRAMMAR_FILL,
      difficulty: 2,
      prompt: {
        sentenceParts: ["很", "___", "認識", "您"],
        sentencePinyin: "hěn ___ rènshi nín",
        translationI18n: {
          th: "ดีใจมากที่ได้รู้จักคุณ",
        },
        instructionKey: "fillBlank",
      },
      options: [
        { value: "高興" },
        { value: "麻煩" },
        { value: "謝謝" },
        { value: "認識" },
      ],
      answer: { value: "高興" },
      explanationI18n: {
        "zh-TW": "「很高興認識您」是初次見面常用語,表達禮貌。",
        th: "「很高興認識您」เป็นวลีพบกันครั้งแรก แสดงความสุภาพ",
      },
      skillsTrained: ["grammar"],
    },
    // 5. GRAMMAR_ARRANGE — 「我們/是/同事」
    {
      type: ExerciseType.GRAMMAR_ARRANGE,
      difficulty: 2,
      prompt: {
        words: ["我們", "是", "同事"],
        targetTranslationI18n: {
          th: "พวกเราเป็นเพื่อนร่วมงาน",
        },
        instructionKey: "arrangeWords",
      },
      options: [{ value: "我們" }, { value: "是" }, { value: "同事" }],
      answer: { value: ["我們", "是", "同事"] },
      skillsTrained: ["grammar"],
    },
    // 6. LISTEN_DIALOGUE_MCQ — 聽小玲怎麼介紹自己
    {
      type: ExerciseType.LISTEN_DIALOGUE_MCQ,
      difficulty: 2,
      prompt: {
        audioUrl: "/api/audio/dialogue/L1-S03/0",
        questionI18n: {
          "zh-TW": "小玲在這裡的身份是什麼?",
          th: "เสี่ยวหลิงมีตำแหน่งอะไรที่นี่?",
        },
      },
      options: [
        { value: "學姊" },
        { value: "主任" },
        { value: "護理師" },
        { value: "新來的" },
      ],
      answer: { value: "學姊" },
      audioUrl: "/api/audio/dialogue/L1-S03/0",
      skillsTrained: ["listening", "comprehension"],
    },
    // 7. SPEAK_REPEAT
    {
      type: ExerciseType.SPEAK_REPEAT,
      difficulty: 2,
      prompt: {
        hanzi: "麻煩您了,謝謝!",
        pinyin: "máfan nín le, xièxie!",
        audioUrl: "/api/audio/dialogue/L1-S03/3",
        instructionKey: "speakRepeat",
        notSupported: true,
      },
      options: [],
      answer: { value: "ok" },
      skillsTrained: ["speaking"],
    },
    // 8. WRITE_HANZI — 寫「謝」
    {
      type: ExerciseType.WRITE_HANZI,
      difficulty: 4,
      prompt: {
        targetHanzi: "謝",
        pinyin: "xiè",
        translationI18n: { th: "ขอบคุณ" },
        instructionKey: "writeHanzi",
        notSupported: true,
      },
      options: [],
      answer: { value: "謝" },
      skillsTrained: ["writing"],
    },
  ],
};
