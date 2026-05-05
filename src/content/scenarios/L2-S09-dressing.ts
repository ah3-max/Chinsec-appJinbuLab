// L2-S09 穿脫衣服
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L2_S09: ScenarioDef = {
  code: "L2-S09",
  level: Level.A2_BASIC,
  orderIndex: 9,
  title: "穿脫衣服",
  titleI18n: { "zh-TW": "穿脫衣服", th: "การช่วยใส่และถอดเสื้อผ้า", vi: "Mặc và cởi quần áo", id: "Memakai dan Melepas Pakaian" },
  estimatedMinutes: 25,
  prerequisiteCode: "L2-S08",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "洗完澡後，歐寶要協助劉阿嬤穿衣服。阿嬤的手不太靈活，她需要幫忙扣鈕扣、拉拉鍊、套上襪子……",
      th: "หลังอาบน้ำเสร็จ อ้าวเป่าต้องช่วยคุณยายหลิวสวมเสื้อผ้า ยายมือไม่ค่อยคล่อง ต้องช่วยติดกระดุม รูดซิป สวมถุงเท้า...",
      vi: "Sau khi tắm xong, Aobao phải giúp bà Lưu mặc quần áo. Tay bà không khéo léo, cần được giúp cài nút, kéo khóa, đi vớ...",
      id: "Setelah mandi, Aobao perlu membantu Nenek Liu memakai pakaian. Tangan Nenek tidak terlalu lincah, perlu dibantu mengancing kancing, tarik resleting, memakai kaos kaki...",
    },
  },
  mtcAlignment: { books: ["B2-L09"], topics: ["dressing", "assistance"] },
  vocabularies: [
    { hanzi: "上衣", zhuyin: "ㄕㄤˋ ㄧ", pinyin: "shàngyī", partOfSpeech: "n.", translations: { th: "เสื้อ", en: "top/upper garment" }, category: "clothing", tags: ["clothing"], difficulty: 1 },
    { hanzi: "褲子", zhuyin: "ㄎㄨˋ ˙ㄗ", pinyin: "kùzi", partOfSpeech: "n.", translations: { th: "กางเกง", en: "pants" }, category: "clothing", tags: ["clothing"], difficulty: 1 },
    { hanzi: "鈕扣", zhuyin: "ㄋㄧㄡˇ ㄎㄡˋ", pinyin: "niǔkòu", partOfSpeech: "n.", translations: { th: "กระดุม", en: "button" }, category: "clothing", tags: ["clothing"], difficulty: 2 },
    { hanzi: "拉鍊", zhuyin: "ㄌㄚ ㄌㄧㄢˋ", pinyin: "lāliàn", partOfSpeech: "n.", translations: { th: "ซิป", en: "zipper" }, category: "clothing", tags: ["clothing"], difficulty: 2 },
    { hanzi: "襪子", zhuyin: "ㄨㄚˋ ˙ㄗ", pinyin: "wàzi", partOfSpeech: "n.", translations: { th: "ถุงเท้า", en: "socks" }, category: "clothing", tags: ["clothing"], difficulty: 1 },
    { hanzi: "扣", zhuyin: "ㄎㄡˋ", pinyin: "kòu", partOfSpeech: "v.", translations: { th: "ติด/รัด", en: "to button up" }, category: "clothing", tags: ["action"], difficulty: 1 },
    { hanzi: "拉", zhuyin: "ㄌㄚ", pinyin: "lā", partOfSpeech: "v.", translations: { th: "ดึง/รูด", en: "to pull" }, category: "daily", tags: ["action"], difficulty: 1 },
    { hanzi: "套", zhuyin: "ㄊㄠˋ", pinyin: "tào", partOfSpeech: "v.", translations: { th: "สวม", en: "to put on (over)" }, category: "clothing", tags: ["action"], difficulty: 1 },
    { hanzi: "舉手", zhuyin: "ㄐㄩˇ ㄕㄡˇ", pinyin: "jǔ shǒu", partOfSpeech: "v.", translations: { th: "ยกมือ", en: "raise hand" }, category: "eldercare", tags: ["instruction"], difficulty: 1 },
    { hanzi: "鞋子", zhuyin: "ㄒㄧㄝˊ ˙ㄗ", pinyin: "xiézi", partOfSpeech: "n.", translations: { th: "รองเท้า", en: "shoes" }, category: "clothing", tags: ["clothing"], difficulty: 1 },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿嬤，先穿上衣，請舉手。", pinyin: "ā mā, xiān chuān shàngyī, qǐng jǔ shǒu.", translationI18n: { th: "คุณยาย ใส่เสื้อก่อน กรุณายกแขนค่ะ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "劉阿嬤", th: "คุณยายหลิว" }, hanzi: "好。鈕扣我自己扣不了。", pinyin: "hǎo. niǔkòu wǒ zìjǐ kòu bù liǎo.", translationI18n: { th: "โอเค กระดุมยายติดเองไม่ได้" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "我幫您扣。再來穿褲子，拉拉鍊。", pinyin: "wǒ bāng nín kòu. zàilái chuān kùzi, lā lāliàn.", translationI18n: { th: "หนูช่วยติดให้ค่ะ ต่อไปสวมกางเกง รูดซิปค่ะ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "劉阿嬤", th: "คุณยายหลิว" }, hanzi: "襪子幫我套，腳冷。", pinyin: "wàzi bāng wǒ tào, jiǎo lěng.", translationI18n: { th: "ช่วยสวมถุงเท้าให้หน่อย เท้าหนาว" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好，再穿上鞋子，這樣就完成了。", pinyin: "hǎo, zài chuān shàng xiézi, zhèyàng jiù wánchéng le.", translationI18n: { th: "ได้ค่ะ แล้วสวมรองเท้า เสร็จแล้วค่ะ" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 1, prompt: { symbol: "鈕扣", hanzi: "鈕扣", pinyin: "niǔkòu" }, options: [{ value: "กระดุม" }, { value: "ซิป" }, { value: "ถุงเท้า" }, { value: "รองเท้า" }], answer: { value: "กระดุม" }, explanationI18n: { "zh-TW": "「鈕扣」= button，襯衫上的圓形扣子。", th: "「鈕扣 niǔkòu」= กระดุม" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 1, prompt: { audioUrl: "/api/audio/vocab/襪子", instructionKey: "listenPickHanzi" }, options: [{ value: "襪子" }, { value: "鞋子" }, { value: "褲子" }, { value: "上衣" }], answer: { value: "襪子" }, audioUrl: "/api/audio/vocab/襪子", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 1, prompt: { thai: "ซิป", instructionKey: "thaiToHanzi" }, options: [{ value: "拉鍊" }, { value: "鈕扣" }, { value: "扣" }, { value: "拉" }], answer: { value: "拉鍊" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 2, prompt: { sentenceParts: ["先穿上衣，請", "___", "手。"], sentencePinyin: "xiān chuān shàngyī, qǐng ___ shǒu.", translationI18n: { th: "ใส่เสื้อก่อน กรุณายกมือ" }, instructionKey: "fillBlank" }, options: [{ value: "舉" }, { value: "拉" }, { value: "扣" }, { value: "套" }], answer: { value: "舉" }, explanationI18n: { "zh-TW": "「舉手」= raise hand，幫長輩穿上衣時請他舉手。", th: "「舉」= ยก ใช้กับ「舉手」= ยกแขน" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["我", "幫", "您", "扣", "鈕扣"], targetTranslationI18n: { th: "หนูช่วยติดกระดุมให้คุณ" }, instructionKey: "arrangeWords" }, options: [{ value: "我" }, { value: "幫" }, { value: "您" }, { value: "扣" }, { value: "鈕扣" }], answer: { value: ["我", "幫", "您", "扣", "鈕扣"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 2, prompt: { audioUrl: "/api/audio/dialogue/L2-S09/1", questionI18n: { "zh-TW": "阿嬤為什麼要穿襪子？", th: "ทำไมคุณยายต้องสวมถุงเท้า?" } }, options: [{ value: "腳冷" }, { value: "腳痛" }, { value: "要出門" }, { value: "要洗澡" }], answer: { value: "腳冷" }, audioUrl: "/api/audio/dialogue/L2-S09/1", skillsTrained: ["listening"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 2, prompt: { hanzi: "我幫您扣鈕扣、拉拉鍊。", pinyin: "wǒ bāng nín kòu niǔkòu, lā lāliàn.", audioUrl: "/api/audio/sentence/L2-S09-dress", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "穿", pinyin: "chuān", translationI18n: { th: "สวมใส่" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "穿" }, skillsTrained: ["writing"] },
  ],
};
