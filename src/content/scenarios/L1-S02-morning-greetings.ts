// L1-S02 早安問候阿公阿嬤
//
// 場景:早晨歐寶在愛愛院大廳遇見王阿公,要用敬稱問候,展現關心。
// 重點能力:時段問候 (早安/午安/晚安) + 敬稱 + 動詞重疊 (慢慢) 表示緩和。

import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L1_S02: ScenarioDef = {
  code: "L1-S02",
  level: Level.A1_BEGINNER,
  orderIndex: 2,
  title: "早安問候阿公阿嬤",
  titleI18n: {
    "zh-TW": "早安問候阿公阿嬤",
    th: "ทักทายอรุณสวัสดิ์คุณตาคุณยาย",
    vi: "Chào buổi sáng ông bà",
    id: "Salam pagi kepada kakek nenek",
  },
  estimatedMinutes: 25,
  prerequisiteCode: "L1-S01",
  mtcAlignment: {
    books: ["B1-L01", "B1-L02", "B1-L05"],
    topics: ["greeting", "time-of-day", "polite-request"],
  },
  hookContent: {
    storyTextI18n: {
      "zh-TW":
        "早上八點,歐寶看到王阿公坐在大廳曬太陽。她要用敬稱跟阿公道早安,還要關心阿公今天好不好。",
      th: "ตอนแปดโมงเช้า โอบาวเห็นคุณตาวังนั่งอาบแดดที่โถง เธอต้องทักทายอรุณสวัสดิ์ด้วยคำสุภาพ และถามว่าวันนี้คุณตาเป็นอย่างไร",
      vi: "Lúc 8 giờ sáng, Aobao thấy ông Vương ngồi sưởi nắng ở sảnh. Cô cần chào ông buổi sáng bằng kính ngữ và hỏi thăm ông hôm nay thế nào.",
      id: "Pukul delapan pagi, Aobao melihat Kakek Wang duduk berjemur di lobi. Dia harus menyapa kakek dengan sapaan hormat dan menanyakan kabarnya hari ini.",
    },
  },

  vocabularies: [
    {
      hanzi: "阿公",
      zhuyin: "ㄚ ㄍㄨㄥ",
      pinyin: "ā gōng",
      partOfSpeech: "n.",
      translations: { th: "คุณตา / คุณปู่", en: "grandfather (Taiwanese)" },
      category: "eldercare",
      tags: ["essential", "eldercare", "taiwan-local"],
      difficulty: 1,
      isEldercareVocab: true,
    },
    {
      hanzi: "阿嬤",
      zhuyin: "ㄚ ㄇㄚˋ",
      pinyin: "ā mà",
      partOfSpeech: "n.",
      translations: { th: "คุณยาย / คุณย่า", en: "grandmother (Taiwanese)" },
      category: "eldercare",
      tags: ["essential", "eldercare", "taiwan-local"],
      difficulty: 1,
      isEldercareVocab: true,
    },
    {
      hanzi: "早安",
      zhuyin: "ㄗㄠˇ ㄢ",
      pinyin: "zǎo'ān",
      partOfSpeech: "interj.",
      translations: { th: "อรุณสวัสดิ์", en: "good morning" },
      category: "greeting",
      tags: ["essential", "greeting"],
      difficulty: 1,
      mtcReference: { book: "B1", lesson: "L01" },
    },
    {
      hanzi: "午安",
      zhuyin: "ㄨˇ ㄢ",
      pinyin: "wǔ'ān",
      partOfSpeech: "interj.",
      translations: { th: "สวัสดีตอนบ่าย", en: "good afternoon" },
      category: "greeting",
      tags: ["essential", "greeting"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L01" },
    },
    {
      hanzi: "晚安",
      zhuyin: "ㄨㄢˇ ㄢ",
      pinyin: "wǎn'ān",
      partOfSpeech: "interj.",
      translations: { th: "ราตรีสวัสดิ์", en: "good night" },
      category: "greeting",
      tags: ["essential", "greeting"],
      difficulty: 1,
      mtcReference: { book: "B1", lesson: "L01" },
    },
    {
      hanzi: "早上",
      zhuyin: "ㄗㄠˇ ㄕㄤˋ",
      pinyin: "zǎoshang",
      partOfSpeech: "n.",
      translations: { th: "ตอนเช้า", en: "morning" },
      category: "time",
      tags: ["essential", "time"],
      difficulty: 1,
      mtcReference: { book: "B1", lesson: "L02" },
    },
    {
      hanzi: "今天",
      zhuyin: "ㄐㄧㄣ ㄊㄧㄢ",
      pinyin: "jīntiān",
      partOfSpeech: "n.",
      translations: { th: "วันนี้", en: "today" },
      category: "time",
      tags: ["essential", "time"],
      difficulty: 1,
      mtcReference: { book: "B1", lesson: "L02" },
    },
    {
      hanzi: "怎麼樣",
      zhuyin: "ㄗㄣˇ ㄇㄜ˙ ㄧㄤˋ",
      pinyin: "zěnmeyàng",
      partOfSpeech: "pron.",
      translations: { th: "เป็นอย่างไร", en: "how / how about" },
      category: "question",
      tags: ["essential"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L05" },
    },
    {
      hanzi: "請坐",
      zhuyin: "ㄑㄧㄥˇ ㄗㄨㄛˋ",
      pinyin: "qǐng zuò",
      partOfSpeech: "phrase",
      translations: { th: "เชิญนั่ง", en: "please have a seat" },
      category: "polite",
      tags: ["essential", "polite", "eldercare"],
      difficulty: 2,
      mtcReference: { book: "B1", lesson: "L02" },
    },
    {
      hanzi: "慢慢來",
      zhuyin: "ㄇㄢˋ ㄇㄢˋ ㄌㄞˊ",
      pinyin: "màn man lái",
      partOfSpeech: "phrase",
      translations: { th: "ค่อย ๆ", en: "take your time" },
      category: "eldercare",
      tags: ["essential", "eldercare"],
      difficulty: 3,
      isEldercareVocab: true,
    },
  ],

  dialogue: [
    {
      speaker: "learner",
      speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" },
      hanzi: "阿公,您早安!",
      pinyin: "ā gōng, nín zǎo'ān!",
      translationI18n: {
        th: "คุณตาคะ อรุณสวัสดิ์ค่ะ!",
      },
    },
    {
      speaker: "elder",
      speakerLabel: { "zh-TW": "王阿公", th: "คุณตาหวัง" },
      hanzi: "啊,早早早!",
      pinyin: "à, zǎo zǎo zǎo!",
      translationI18n: {
        th: "อ้อ อรุณสวัสดิ์จ้ะ!",
      },
    },
    {
      speaker: "learner",
      speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" },
      hanzi: "您今天怎麼樣?",
      pinyin: "nín jīntiān zěnmeyàng?",
      translationI18n: {
        th: "วันนี้คุณตาเป็นอย่างไรบ้างคะ?",
      },
    },
    {
      speaker: "elder",
      speakerLabel: { "zh-TW": "王阿公", th: "คุณตาหวัง" },
      hanzi: "還好,謝謝你關心。",
      pinyin: "hái hǎo, xièxie nǐ guānxīn.",
      translationI18n: {
        th: "ก็พอใช้ได้ ขอบคุณที่เป็นห่วงนะจ๊ะ",
      },
    },
    {
      speaker: "learner",
      speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" },
      hanzi: "阿公,請慢慢來,我扶您。",
      pinyin: "ā gōng, qǐng màn man lái, wǒ fú nín.",
      translationI18n: {
        th: "คุณตา ค่อย ๆ นะคะ ฉันจะช่วยพยุง",
      },
    },
  ],

  exercises: [
    // 1. VOCAB_MCQ — 阿公的意思
    {
      type: ExerciseType.VOCAB_MCQ,
      difficulty: 1,
      prompt: { symbol: "阿公", hanzi: "阿公", pinyin: "ā gōng" },
      options: [
        { value: "คุณตา / คุณปู่" },
        { value: "คุณยาย / คุณย่า" },
        { value: "คุณพ่อ" },
        { value: "คุณแม่" },
      ],
      answer: { value: "คุณตา / คุณปู่" },
      explanationI18n: {
        "zh-TW": "「阿公」是台語/台灣國語對年長男性的尊稱(grandfather)。",
        th: "「阿公 ā gōng」เป็นคำเรียกผู้ชายสูงอายุในภาษาไต้หวัน (คุณตา/คุณปู่)",
      },
      skillsTrained: ["vocab"],
    },
    // 2. VOCAB_LISTEN_CHOOSE — 聽 zǎo'ān 選漢字
    {
      type: ExerciseType.VOCAB_LISTEN_CHOOSE,
      difficulty: 1,
      prompt: {
        audioUrl: "/api/audio/vocab/早安",
        instructionKey: "listenPickHanzi",
      },
      options: [
        { value: "早安" },
        { value: "午安" },
        { value: "晚安" },
        { value: "再見" },
      ],
      answer: { value: "早安" },
      audioUrl: "/api/audio/vocab/早安",
      skillsTrained: ["listening", "vocab"],
    },
    // 3. VOCAB_MCQ_REVERSE — 「ค่อย ๆ」對應哪個漢字
    {
      type: ExerciseType.VOCAB_MCQ_REVERSE,
      difficulty: 2,
      prompt: { thai: "ค่อย ๆ", instructionKey: "thaiToHanzi" },
      options: [
        { value: "慢慢來" },
        { value: "請坐" },
        { value: "謝謝" },
        { value: "對不起" },
      ],
      answer: { value: "慢慢來" },
      skillsTrained: ["vocab"],
    },
    // 4. GRAMMAR_FILL — 您今天 ___? 問候
    {
      type: ExerciseType.GRAMMAR_FILL,
      difficulty: 2,
      prompt: {
        sentenceParts: ["您", "今天", "___", "?"],
        sentencePinyin: "nín jīntiān ___?",
        translationI18n: {
          th: "วันนี้คุณ ___? (วันนี้คุณเป็นอย่างไร?)",
        },
        instructionKey: "fillBlank",
      },
      options: [
        { value: "怎麼樣" },
        { value: "好" },
        { value: "是" },
        { value: "工作" },
      ],
      answer: { value: "怎麼樣" },
      explanationI18n: {
        "zh-TW": "「怎麼樣?」放在問句尾,問對方狀況或意見,翻成 how about?",
        th: "「怎麼樣?」วางท้ายประโยคใช้ถามสภาพหรือความเห็น เทียบกับ how about?",
      },
      skillsTrained: ["grammar"],
    },
    // 5. GRAMMAR_ARRANGE — 「阿公,請慢慢來」
    {
      type: ExerciseType.GRAMMAR_ARRANGE,
      difficulty: 3,
      prompt: {
        words: ["阿公", "請", "慢慢來"],
        targetTranslationI18n: {
          th: "คุณตา ค่อย ๆ นะคะ",
        },
        instructionKey: "arrangeWords",
      },
      options: [{ value: "阿公" }, { value: "請" }, { value: "慢慢來" }],
      answer: { value: ["阿公", "請", "慢慢來"] },
      skillsTrained: ["grammar", "writing"],
    },
    // 6. LISTEN_DIALOGUE_MCQ — 阿公感覺怎麼樣
    {
      type: ExerciseType.LISTEN_DIALOGUE_MCQ,
      difficulty: 2,
      prompt: {
        audioUrl: "/api/audio/dialogue/L1-S02/3",
        questionI18n: {
          "zh-TW": "阿公今天怎麼樣?",
          th: "วันนี้คุณตาเป็นอย่างไร?",
        },
      },
      options: [
        { value: "還好" },
        { value: "很累" },
        { value: "生病" },
        { value: "很忙" },
      ],
      answer: { value: "還好" },
      audioUrl: "/api/audio/dialogue/L1-S02/3",
      skillsTrained: ["listening", "comprehension"],
    },
    // 7. SPEAK_REPEAT — 跟讀「阿公,您早安!」
    {
      type: ExerciseType.SPEAK_REPEAT,
      difficulty: 1,
      prompt: {
        hanzi: "阿公,您早安!",
        pinyin: "ā gōng, nín zǎo'ān!",
        audioUrl: "/api/audio/dialogue/L1-S02/0",
        instructionKey: "speakRepeat",
        notSupported: true,
      },
      options: [],
      answer: { value: "ok" },
      skillsTrained: ["speaking"],
    },
    // 8. WRITE_HANZI — 寫「早」
    {
      type: ExerciseType.WRITE_HANZI,
      difficulty: 3,
      prompt: {
        targetHanzi: "早",
        pinyin: "zǎo",
        translationI18n: { th: "เช้า / ก่อน" },
        instructionKey: "writeHanzi",
        notSupported: true,
      },
      options: [],
      answer: { value: "早" },
      skillsTrained: ["writing"],
    },
  ],
};
