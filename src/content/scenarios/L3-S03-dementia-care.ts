// L3-S03 失智症基礎應對
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S03: ScenarioDef = {
  code: "L3-S03",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 3,
  title: "失智症基礎應對",
  titleI18n: { "zh-TW": "失智症基礎應對", th: "การรับมือผู้ป่วยภาวะสมองเสื่อมเบื้องต้น", vi: "Ứng phó cơ bản với chứng sa sút trí tuệ", id: "Penanganan Dasar Demensia" },
  estimatedMinutes: 35,
  prerequisiteCode: "L3-S02",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "張阿公患有失智症，今天突然不認得歐寶，還說要回老家找媽媽。歐寶要保持冷靜、不糾正、用溫和方式引導，避免讓阿公更加焦慮……",
      th: "คุณปู่จางมีภาวะสมองเสื่อม วันนี้จู่ๆ จำอ้าวเป่าไม่ได้ และบอกว่าจะกลับบ้านเก่าไปหาแม่ อ้าวเป่าต้องใจเย็น ไม่แก้ไขสิ่งที่ปู่พูด ใช้วิธีอ่อนโยนชี้แนะ เพื่อไม่ให้ปู่กังวลมากขึ้น...",
      vi: "Ông Trương bị sa sút trí tuệ, hôm nay đột nhiên không nhận ra Aobao, còn nói muốn về quê tìm mẹ. Aobao phải bình tĩnh, không sửa lời, dùng cách nhẹ nhàng dẫn dắt, tránh khiến ông lo lắng thêm...",
      id: "Kakek Zhang menderita demensia, hari ini tiba-tiba tidak mengenali Aobao, dan bilang ingin pulang ke kampung mencari ibu. Aobao perlu tetap tenang, tidak mengoreksi, membimbing dengan lembut agar Kakek tidak makin cemas...",
    },
  },
  mtcAlignment: { books: ["B3-L03"], topics: ["dementia", "communication"] },
  vocabularies: [
    { hanzi: "失智", zhuyin: "ㄕ ㄓˋ", pinyin: "shī zhì", partOfSpeech: "n.", translations: { th: "ภาวะสมองเสื่อม", en: "dementia" }, category: "medical", tags: ["medical", "elderly"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "認得", zhuyin: "ㄖㄣˋ ˙ㄉㄜ", pinyin: "rèn de", partOfSpeech: "v.", translations: { th: "จำได้", en: "to recognize" }, category: "cognitive", tags: ["memory"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "糾正", zhuyin: "ㄐㄧㄡ ㄓㄥˋ", pinyin: "jiūzhèng", partOfSpeech: "v.", translations: { th: "แก้ไข/ทักท้วง", en: "to correct" }, category: "communication", tags: ["correction"], difficulty: 2 },
    { hanzi: "冷靜", zhuyin: "ㄌㄥˇ ㄐㄧㄥˋ", pinyin: "lěngjìng", partOfSpeech: "adj.", translations: { th: "ใจเย็น/สงบนิ่ง", en: "calm" }, category: "emotion", tags: ["emotion"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "焦慮", zhuyin: "ㄐㄧㄠ ㄌㄩˋ", pinyin: "jiāolǜ", partOfSpeech: "adj.", translations: { th: "วิตกกังวล", en: "anxious" }, category: "emotion", tags: ["emotion"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "溫和", zhuyin: "ㄨㄣ ㄏㄜˊ", pinyin: "wēnhé", partOfSpeech: "adj.", translations: { th: "อ่อนโยน/นุ่มนวล", en: "gentle" }, category: "personality", tags: ["manner"], difficulty: 2 },
    { hanzi: "引導", zhuyin: "ㄧㄣˇ ㄉㄠˇ", pinyin: "yǐndǎo", partOfSpeech: "v.", translations: { th: "ชี้แนะ/นำทาง", en: "to guide" }, category: "care", tags: ["nursing"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "回憶", zhuyin: "ㄏㄨㄟˊ ㄧˋ", pinyin: "huíyì", partOfSpeech: "n/v.", translations: { th: "ความทรงจำ/หวนคิด", en: "memory/recall" }, category: "cognitive", tags: ["memory"], difficulty: 3 },
    { hanzi: "不要緊", zhuyin: "ㄅㄨˋ ㄧㄠˋ ㄐㄧㄣˇ", pinyin: "bú yào jǐn", partOfSpeech: "exp.", translations: { th: "ไม่เป็นไร", en: "it doesn't matter" }, category: "comfort", tags: ["comfort"], difficulty: 1 },
    { hanzi: "迷路", zhuyin: "ㄇㄧˊ ㄌㄨˋ", pinyin: "mí lù", partOfSpeech: "v.", translations: { th: "หลงทาง", en: "to get lost" }, category: "safety", tags: ["safety"], difficulty: 2, isEldercareVocab: true },
  ],
  dialogue: [
    { speaker: "elder", speakerLabel: { "zh-TW": "張阿公", th: "คุณปู่จาง" }, hanzi: "你是誰？我要回家找我媽。", pinyin: "nǐ shì shéi? wǒ yào huí jiā zhǎo wǒ mā.", translationI18n: { th: "เธอเป็นใคร? ฉันจะกลับบ้านไปหาแม่" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿公，不要緊。我是歐寶，照顧您的人。", pinyin: "ā gōng, bú yào jǐn. wǒ shì Ōubǎo, zhàogu nín de rén.", translationI18n: { th: "คุณปู่ ไม่เป็นไรค่ะ หนูชื่ออ้าวเป่า เป็นคนที่ดูแลคุณปู่ค่ะ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "張阿公", th: "คุณปู่จาง" }, hanzi: "我媽在家裡等我。", pinyin: "wǒ mā zài jiā lǐ děng wǒ.", translationI18n: { th: "แม่อยู่ที่บ้านรอฉันอยู่" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "您媽媽愛您，跟我說說小時候的事好嗎？", pinyin: "nín māma ài nín, gēn wǒ shuōshuo xiǎo shíhòu de shì hǎo ma?", translationI18n: { th: "คุณแม่รักคุณปู่ มาเล่าเรื่องตอนเด็กๆ ให้หนูฟังได้ไหมคะ?" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "張阿公", th: "คุณปู่จาง" }, hanzi: "好，我小時候......", pinyin: "hǎo, wǒ xiǎo shíhòu......", translationI18n: { th: "ได้สิ ตอนฉันยังเด็ก..." } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 2, prompt: { symbol: "失智", hanzi: "失智", pinyin: "shī zhì" }, options: [{ value: "ภาวะสมองเสื่อม" }, { value: "ปวดหัว" }, { value: "เป็นหวัด" }, { value: "หายใจไม่ออก" }], answer: { value: "ภาวะสมองเสื่อม" }, explanationI18n: { "zh-TW": "「失智」= dementia，記憶與認知功能退化的疾病。", th: "「失智 shī zhì」= ภาวะสมองเสื่อม" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/冷靜", instructionKey: "listenPickHanzi" }, options: [{ value: "冷靜" }, { value: "焦慮" }, { value: "溫和" }, { value: "認得" }], answer: { value: "冷靜" }, audioUrl: "/api/audio/vocab/冷靜", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "หลงทาง", instructionKey: "thaiToHanzi" }, options: [{ value: "迷路" }, { value: "失智" }, { value: "回憶" }, { value: "焦慮" }], answer: { value: "迷路" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["失智長輩說錯時，不要", "___", "他們，避免", "___", "。"], sentencePinyin: "shī zhì zhǎngbèi shuōcuò shí, bú yào ___ tāmen, bìmiǎn ___.", translationI18n: { th: "เมื่อผู้สูงอายุที่มีภาวะสมองเสื่อมพูดผิด อย่าทักท้วงเขา เพื่อหลีกเลี่ยงไม่ให้เขาวิตกกังวล" }, instructionKey: "fillBlank" }, options: [{ value: "糾正...焦慮" }, { value: "幫助...健康" }, { value: "陪伴...安心" }, { value: "引導...冷靜" }], answer: { value: "糾正...焦慮" }, explanationI18n: { "zh-TW": "失智照護的核心原則：不糾正，避免引發焦慮。", th: "หลักการดูแลผู้ป่วยสมองเสื่อม: ไม่ทักท้วง เพื่อไม่ให้เกิดความวิตก" }, skillsTrained: ["grammar", "vocab"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["請", "用", "溫和", "的", "方式", "引導"], targetTranslationI18n: { th: "กรุณาใช้วิธีที่อ่อนโยนชี้แนะ" }, instructionKey: "arrangeWords" }, options: [{ value: "請" }, { value: "用" }, { value: "溫和" }, { value: "的" }, { value: "方式" }, { value: "引導" }], answer: { value: ["請", "用", "溫和", "的", "方式", "引導"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S03/1", questionI18n: { "zh-TW": "歐寶為什麼不糾正阿公說「找媽媽」？", th: "ทำไมอ้าวเป่าไม่แก้ไขเรื่องที่คุณปู่บอกว่า「หาแม่」?" } }, options: [{ value: "避免讓阿公焦慮" }, { value: "因為不知道答案" }, { value: "因為很忙" }, { value: "因為媽媽真的在" }], answer: { value: "避免讓阿公焦慮" }, audioUrl: "/api/audio/dialogue/L3-S03/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "阿公，不要緊。我是歐寶，照顧您的人。", pinyin: "ā gōng, bú yào jǐn. wǒ shì Ōubǎo, zhàogu nín de rén.", audioUrl: "/api/audio/sentence/L3-S03-reassure", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "智", pinyin: "zhì", translationI18n: { th: "ปัญญา/สติ" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "智" }, skillsTrained: ["writing"] },
  ],
};
