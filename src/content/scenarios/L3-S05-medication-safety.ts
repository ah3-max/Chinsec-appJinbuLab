// L3-S05 用藥安全進階
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S05: ScenarioDef = {
  code: "L3-S05",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 5,
  title: "用藥安全進階",
  titleI18n: { "zh-TW": "用藥安全進階", th: "ความปลอดภัยในการใช้ยาขั้นสูง", vi: "An toàn dùng thuốc nâng cao", id: "Keamanan Obat Tingkat Lanjut" },
  estimatedMinutes: 35,
  prerequisiteCode: "L3-S04",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "陳阿嬤吃完降血壓藥半小時後說有點頭暈、想吐。歐寶要識別這可能是副作用，不能自己決定要不要繼續吃，必須立即向護士報告……",
      th: "หลังคุณยายเฉินทานยาลดความดันได้ครึ่งชั่วโมง บอกว่าวิงเวียนหัว คลื่นไส้ อ้าวเป่าต้องรู้ว่านี่อาจเป็นผลข้างเคียง ไม่ควรตัดสินใจเองว่าจะให้ทานต่อหรือไม่ ต้องรายงานพยาบาลทันที...",
      vi: "Sau khi bà Trần uống thuốc hạ huyết áp nửa giờ, bà nói hơi chóng mặt, buồn nôn. Aobao phải nhận biết đây có thể là tác dụng phụ, không được tự quyết định có cho uống tiếp không, phải báo cáo y tá ngay...",
      id: "Setengah jam setelah Nenek Chen minum obat penurun tekanan darah, dia bilang agak pusing dan mual. Aobao harus mengenali ini mungkin efek samping, tidak boleh memutuskan sendiri apakah lanjut atau tidak, harus segera melapor perawat...",
    },
  },
  mtcAlignment: { books: ["B3-L05"], topics: ["medication", "safety", "side-effect"] },
  vocabularies: [
    { hanzi: "副作用", zhuyin: "ㄈㄨˋ ㄗㄨㄛˋ ㄩㄥˋ", pinyin: "fùzuòyòng", partOfSpeech: "n.", translations: { th: "ผลข้างเคียง", en: "side effect" }, category: "medical", tags: ["medication"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "降血壓", zhuyin: "ㄐㄧㄤˋ ㄒㄧㄝˇ ㄧㄚ", pinyin: "jiàng xiěyā", partOfSpeech: "v.", translations: { th: "ลดความดันโลหิต", en: "lower blood pressure" }, category: "medical", tags: ["medication"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "想吐", zhuyin: "ㄒㄧㄤˇ ㄊㄨˋ", pinyin: "xiǎng tù", partOfSpeech: "v.", translations: { th: "คลื่นไส้/อยากอาเจียน", en: "feel like vomiting" }, category: "symptom", tags: ["symptom"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "識別", zhuyin: "ㄕˋ ㄅㄧㄝˊ", pinyin: "shíbié", partOfSpeech: "v.", translations: { th: "ระบุ/แยกแยะ", en: "to identify" }, category: "cognitive", tags: ["judgement"], difficulty: 3 },
    { hanzi: "決定", zhuyin: "ㄐㄩㄝˊ ㄉㄧㄥˋ", pinyin: "juédìng", partOfSpeech: "v/n.", translations: { th: "ตัดสินใจ", en: "to decide" }, category: "cognitive", tags: ["decision"], difficulty: 2 },
    { hanzi: "繼續", zhuyin: "ㄐㄧˋ ㄒㄩˋ", pinyin: "jìxù", partOfSpeech: "v/adv.", translations: { th: "ต่อไป/ดำเนินต่อ", en: "to continue" }, category: "daily", tags: ["modifier"], difficulty: 2 },
    { hanzi: "確認", zhuyin: "ㄑㄩㄝˋ ㄖㄣˋ", pinyin: "quèrèn", partOfSpeech: "v.", translations: { th: "ยืนยัน", en: "to confirm" }, category: "work", tags: ["check"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "症狀", zhuyin: "ㄓㄥˋ ㄓㄨㄤˋ", pinyin: "zhèngzhuàng", partOfSpeech: "n.", translations: { th: "อาการ", en: "symptom" }, category: "medical", tags: ["health"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "停藥", zhuyin: "ㄊㄧㄥˊ ㄧㄠˋ", pinyin: "tíng yào", partOfSpeech: "v.", translations: { th: "หยุดยา", en: "to stop medication" }, category: "medical", tags: ["medication"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "可能", zhuyin: "ㄎㄜˇ ㄋㄥˊ", pinyin: "kěnéng", partOfSpeech: "adv/v.", translations: { th: "อาจจะ/เป็นไปได้", en: "possibly/maybe" }, category: "modal", tags: ["modal"], difficulty: 1 },
  ],
  dialogue: [
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "歐寶，我吃完藥後有點頭暈，想吐。", pinyin: "Ōubǎo, wǒ chīwán yào hòu yǒu diǎn tóu yūn, xiǎng tù.", translationI18n: { th: "อ้าวเป่า ฉันทานยาเสร็จแล้วรู้สึกวิงเวียน คลื่นไส้นิดหน่อย" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿嬤，我先確認一下。您剛才吃的是降血壓藥嗎？", pinyin: "ā mā, wǒ xiān quèrèn yīxià. nín gāngcái chī de shì jiàng xiěyā yào ma?", translationI18n: { th: "คุณยาย หนูขอเช็คก่อนนะคะ ที่ทานไปคือยาลดความดันใช่ไหมคะ?" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "對，半小時前吃的。", pinyin: "duì, bàn xiǎoshí qián chī de.", translationI18n: { th: "ใช่ ครึ่งชั่วโมงที่แล้วทาน" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "這可能是副作用。我馬上通報李護士，您先休息。", pinyin: "zhè kěnéng shì fùzuòyòng. wǒ mǎshàng tōngbào Lǐ hùshi, nín xiān xiūxí.", translationI18n: { th: "นี่อาจเป็นผลข้างเคียง หนูจะรีบแจ้งพยาบาลหลี่ คุณยายพักก่อนนะคะ" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "好，謝謝你的觀察。我來決定要不要停藥，先讓阿嬤躺下。", pinyin: "hǎo, xièxiè nǐ de guānchá. wǒ lái juédìng yào bú yào tíng yào, xiān ràng ā mā tǎngxia.", translationI18n: { th: "ดี ขอบคุณที่สังเกต ฉันจะเป็นคนตัดสินใจว่าจะหยุดยาหรือไม่ ให้คุณยายนอนพักก่อน" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 2, prompt: { symbol: "副作用", hanzi: "副作用", pinyin: "fùzuòyòng" }, options: [{ value: "ผลข้างเคียง" }, { value: "ลดความดัน" }, { value: "อาการ" }, { value: "ยา" }], answer: { value: "ผลข้างเคียง" }, explanationI18n: { "zh-TW": "「副作用」= side effect，藥物除了治療效果之外的不良反應。", th: "「副作用 fùzuòyòng」= ผลข้างเคียง" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/症狀", instructionKey: "listenPickHanzi" }, options: [{ value: "症狀" }, { value: "副作用" }, { value: "停藥" }, { value: "確認" }], answer: { value: "症狀" }, audioUrl: "/api/audio/vocab/症狀", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "ยืนยัน", instructionKey: "thaiToHanzi" }, options: [{ value: "確認" }, { value: "決定" }, { value: "識別" }, { value: "繼續" }], answer: { value: "確認" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["這", "___", "是副作用，要", "___", "護士。"], sentencePinyin: "zhè ___ shì fùzuòyòng, yào ___ hùshi.", translationI18n: { th: "นี่อาจเป็นผลข้างเคียง ต้องแจ้งพยาบาล" }, instructionKey: "fillBlank" }, options: [{ value: "可能...通報" }, { value: "一定...停藥" }, { value: "好像...問" }, { value: "已經...告訴" }], answer: { value: "可能...通報" }, explanationI18n: { "zh-TW": "副作用判斷不確定時用「可能」+「通報」交給專業，這是長照黃金原則。", th: "เมื่อไม่แน่ใจว่าเป็นผลข้างเคียงใช้「可能」+「通報」ให้บุคลากรตัดสิน หลักการดูแลผู้สูงอายุที่สำคัญ" }, skillsTrained: ["grammar", "vocab"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["我", "馬上", "通報", "李護士"], targetTranslationI18n: { th: "หนูจะรีบแจ้งพยาบาลหลี่ทันที" }, instructionKey: "arrangeWords" }, options: [{ value: "我" }, { value: "馬上" }, { value: "通報" }, { value: "李護士" }], answer: { value: ["我", "馬上", "通報", "李護士"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S05/1", questionI18n: { "zh-TW": "誰來決定要不要停藥？", th: "ใครเป็นผู้ตัดสินใจว่าจะหยุดยาหรือไม่?" } }, options: [{ value: "李護士" }, { value: "歐寶" }, { value: "阿嬤自己" }, { value: "陳小姐" }], answer: { value: "李護士" }, audioUrl: "/api/audio/dialogue/L3-S05/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "這可能是副作用，我馬上通報護士。", pinyin: "zhè kěnéng shì fùzuòyòng, wǒ mǎshàng tōngbào hùshi.", audioUrl: "/api/audio/sentence/L3-S05-side-effect", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "藥", pinyin: "yào", translationI18n: { th: "ยา" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "藥" }, skillsTrained: ["writing"] },
  ],
};
