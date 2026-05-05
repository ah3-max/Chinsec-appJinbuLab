// L3-S07 尿管照護
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S07: ScenarioDef = {
  code: "L3-S07",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 7,
  title: "尿管照護",
  titleI18n: { "zh-TW": "尿管照護", th: "การดูแลสายปัสสาวะ", vi: "Chăm sóc ống thông tiểu", id: "Perawatan Kateter" },
  estimatedMinutes: 30,
  prerequisiteCode: "L3-S06",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "陳阿嬤裝有導尿管。歐寶要每天觀察尿量、顏色、清澈度，並注意有沒有血尿、混濁、異味，這些都可能是感染徵兆，需要立即報告……",
      th: "คุณยายเฉินใส่สายปัสสาวะ อ้าวเป่าต้องสังเกตปริมาณ สี ความใสของปัสสาวะทุกวัน และต้องสังเกตว่ามีเลือดปน ขุ่น หรือมีกลิ่นไม่ดีไหม ทั้งหมดนี้อาจเป็นสัญญาณการติดเชื้อ ต้องรายงานทันที...",
      vi: "Bà Trần đặt ống thông tiểu. Aobao cần quan sát lượng nước tiểu, màu sắc, độ trong mỗi ngày, và chú ý xem có máu, đục, mùi lạ không. Đây có thể là dấu hiệu nhiễm trùng, cần báo cáo ngay...",
      id: "Nenek Chen dipasang kateter. Aobao perlu mengamati jumlah, warna, kejernihan urin setiap hari, serta memperhatikan apakah ada darah, keruh, atau bau aneh. Ini bisa jadi tanda infeksi, harus segera dilaporkan...",
    },
  },
  mtcAlignment: { books: ["B3-L07"], topics: ["catheter", "infection"] },
  vocabularies: [
    { hanzi: "尿管", zhuyin: "ㄋㄧㄠˋ ㄍㄨㄢˇ", pinyin: "niào guǎn", partOfSpeech: "n.", translations: { th: "สายปัสสาวะ/สวนปัสสาวะ", en: "urinary catheter" }, category: "medical", tags: ["device"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "尿量", zhuyin: "ㄋㄧㄠˋ ㄌㄧㄤˋ", pinyin: "niào liàng", partOfSpeech: "n.", translations: { th: "ปริมาณปัสสาวะ", en: "urine output" }, category: "medical", tags: ["assessment"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "顏色", zhuyin: "ㄧㄢˊ ㄙㄜˋ", pinyin: "yánsè", partOfSpeech: "n.", translations: { th: "สี", en: "color" }, category: "daily", tags: ["observation"], difficulty: 1 },
    { hanzi: "清澈", zhuyin: "ㄑㄧㄥ ㄔㄜˋ", pinyin: "qīngchè", partOfSpeech: "adj.", translations: { th: "ใส", en: "clear" }, category: "medical", tags: ["observation"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "混濁", zhuyin: "ㄏㄨㄣˋ ㄓㄨㄛˊ", pinyin: "hùnzhuó", partOfSpeech: "adj.", translations: { th: "ขุ่น", en: "cloudy/turbid" }, category: "medical", tags: ["observation"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "血尿", zhuyin: "ㄒㄧㄝˇ ㄋㄧㄠˋ", pinyin: "xiě niào", partOfSpeech: "n.", translations: { th: "ปัสสาวะมีเลือด", en: "blood in urine" }, category: "medical", tags: ["symptom"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "異味", zhuyin: "ㄧˋ ㄨㄟˋ", pinyin: "yìwèi", partOfSpeech: "n.", translations: { th: "กลิ่นผิดปกติ", en: "odd smell" }, category: "medical", tags: ["observation"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "感染", zhuyin: "ㄍㄢˇ ㄖㄢˇ", pinyin: "gǎnrǎn", partOfSpeech: "v/n.", translations: { th: "ติดเชื้อ", en: "infection" }, category: "medical", tags: ["risk"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "徵兆", zhuyin: "ㄓㄥ ㄓㄠˋ", pinyin: "zhēngzhào", partOfSpeech: "n.", translations: { th: "สัญญาณ/เครื่องหมาย", en: "sign/indication" }, category: "medical", tags: ["assessment"], difficulty: 3 },
    { hanzi: "記錄", zhuyin: "ㄐㄧˋ ㄌㄨˋ", pinyin: "jìlù", partOfSpeech: "v/n.", translations: { th: "บันทึก", en: "to record" }, category: "work", tags: ["report"], difficulty: 2 },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "李護士，我觀察到陳阿嬤的尿色比較深，有點混濁。", pinyin: "Lǐ hùshi, wǒ guānchá dào Chén ā mā de niào sè bǐjiào shēn, yǒu diǎn hùnzhuó.", translationI18n: { th: "พยาบาลหลี่ค่ะ หนูสังเกตว่าปัสสาวะคุณยายเฉินสีเข้ม และขุ่นนิดหน่อย" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "尿量怎麼樣？有沒有血尿或異味？", pinyin: "niào liàng zěnmeyàng? yǒu méiyǒu xiě niào huò yìwèi?", translationI18n: { th: "ปริมาณเป็นยังไง? มีเลือดปนหรือกลิ่นผิดปกติไหม?" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "尿量比昨天少，沒有血尿，但有點異味。", pinyin: "niào liàng bǐ zuótiān shǎo, méiyǒu xiě niào, dàn yǒu diǎn yìwèi.", translationI18n: { th: "ปริมาณน้อยกว่าเมื่อวาน ไม่มีเลือดปน แต่มีกลิ่นนิดหน่อยค่ะ" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "這可能是感染徵兆，我們要立即記錄並通知醫師。", pinyin: "zhè kěnéng shì gǎnrǎn zhēngzhào, wǒmen yào lìjí jìlù bìng tōngzhī yīshī.", translationI18n: { th: "นี่อาจเป็นสัญญาณการติดเชื้อ เราต้องบันทึกและแจ้งหมอทันที" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好，我也會多注意阿嬤的水分攝取。", pinyin: "hǎo, wǒ yě huì duō zhùyì ā mā de shuǐfèn shèqǔ.", translationI18n: { th: "ค่ะ หนูจะใส่ใจให้คุณยายดื่มน้ำมากขึ้นด้วยค่ะ" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 3, prompt: { symbol: "感染", hanzi: "感染", pinyin: "gǎnrǎn" }, options: [{ value: "ติดเชื้อ" }, { value: "อาเจียน" }, { value: "เลือดออก" }, { value: "เป็นไข้" }], answer: { value: "ติดเชื้อ" }, explanationI18n: { "zh-TW": "「感染」= infection，尿管病人最常見的併發症。", th: "「感染 gǎnrǎn」= ติดเชื้อ ภาวะแทรกซ้อนที่พบบ่อยในผู้ใช้สายปัสสาวะ" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/混濁", instructionKey: "listenPickHanzi" }, options: [{ value: "混濁" }, { value: "清澈" }, { value: "異味" }, { value: "顏色" }], answer: { value: "混濁" }, audioUrl: "/api/audio/vocab/混濁", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "ปัสสาวะมีเลือด", instructionKey: "thaiToHanzi" }, options: [{ value: "血尿" }, { value: "尿量" }, { value: "異味" }, { value: "感染" }], answer: { value: "血尿" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["尿量", "___", "昨天", "少", "。"], sentencePinyin: "niào liàng ___ zuótiān shǎo.", translationI18n: { th: "ปริมาณปัสสาวะน้อยกว่าเมื่อวาน" }, instructionKey: "fillBlank" }, options: [{ value: "比" }, { value: "和" }, { value: "跟" }, { value: "從" }], answer: { value: "比" }, explanationI18n: { "zh-TW": "「A 比 B + 形容詞」= A is more ... than B，是 B1 重要比較句型。", th: "「A 比 B + คำคุณศัพท์」= A ... กว่า B รูปประโยคเปรียบเทียบ" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["這", "可能", "是", "感染", "徵兆"], targetTranslationI18n: { th: "นี่อาจเป็นสัญญาณการติดเชื้อ" }, instructionKey: "arrangeWords" }, options: [{ value: "這" }, { value: "可能" }, { value: "是" }, { value: "感染" }, { value: "徵兆" }], answer: { value: ["這", "可能", "是", "感染", "徵兆"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S07/1", questionI18n: { "zh-TW": "歐寶觀察到尿液有什麼異常？", th: "อ้าวเป่าสังเกตเห็นปัสสาวะมีความผิดปกติอะไร?" } }, options: [{ value: "顏色深、混濁、有異味" }, { value: "顏色淡、量多" }, { value: "完全正常" }, { value: "尿量增加" }], answer: { value: "顏色深、混濁、有異味" }, audioUrl: "/api/audio/dialogue/L3-S07/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "尿色比較深，有點混濁，可能是感染徵兆。", pinyin: "niào sè bǐjiào shēn, yǒu diǎn hùnzhuó, kěnéng shì gǎnrǎn zhēngzhào.", audioUrl: "/api/audio/sentence/L3-S07-urine", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "尿", pinyin: "niào", translationI18n: { th: "ปัสสาวะ" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "尿" }, skillsTrained: ["writing"] },
  ],
};
