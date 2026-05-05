// L3-S04 跌倒處理流程
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S04: ScenarioDef = {
  code: "L3-S04",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 4,
  title: "跌倒處理流程",
  titleI18n: { "zh-TW": "跌倒處理流程", th: "ขั้นตอนการรับมือเมื่อล้ม", vi: "Quy trình xử lý té ngã", id: "Prosedur Penanganan Jatuh" },
  estimatedMinutes: 35,
  prerequisiteCode: "L3-S03",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "歐寶巡房時發現王阿公從輪椅上跌倒在地。她需要保持冷靜，先不要急著扶起來，先檢查有沒有外傷、呼喊看反應，立刻通報護士……",
      th: "ขณะตรวจห้อง อ้าวเป่าพบคุณปู่หวังตกจากรถเข็นลงพื้น เธอต้องใจเย็น อย่าเพิ่งรีบดึงให้ลุก เช็คก่อนว่ามีบาดแผลไหม ตะโกนเรียกดูปฏิกิริยา และรีบแจ้งพยาบาลทันที...",
      vi: "Khi đi tuần phòng, Aobao phát hiện ông Wang ngã từ xe lăn xuống đất. Cô phải bình tĩnh, không vội đỡ dậy, kiểm tra vết thương trước, gọi xem phản ứng, lập tức báo y tá...",
      id: "Saat patroli kamar, Aobao menemukan Kakek Wang jatuh dari kursi roda. Dia harus tetap tenang, jangan terburu-buru mengangkat, periksa cedera dulu, panggil untuk lihat reaksi, langsung lapor perawat...",
    },
  },
  mtcAlignment: { books: ["B3-L04"], topics: ["fall", "emergency", "protocol"] },
  vocabularies: [
    { hanzi: "跌倒", zhuyin: "ㄉㄧㄝˊ ㄉㄠˇ", pinyin: "diē dǎo", partOfSpeech: "v.", translations: { th: "ล้ม", en: "to fall down" }, category: "emergency", tags: ["safety"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "外傷", zhuyin: "ㄨㄞˋ ㄕㄤ", pinyin: "wàishāng", partOfSpeech: "n.", translations: { th: "บาดแผลภายนอก", en: "external injury" }, category: "medical", tags: ["injury"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "出血", zhuyin: "ㄔㄨ ㄒㄩㄝˇ", pinyin: "chū xiě", partOfSpeech: "v.", translations: { th: "เลือดออก", en: "to bleed" }, category: "medical", tags: ["injury"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "意識", zhuyin: "ㄧˋ ㄕˋ", pinyin: "yìshì", partOfSpeech: "n.", translations: { th: "สติ/ความรู้สึกตัว", en: "consciousness" }, category: "medical", tags: ["assessment"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "反應", zhuyin: "ㄈㄢˇ ㄧㄥˋ", pinyin: "fǎnyìng", partOfSpeech: "n/v.", translations: { th: "ปฏิกิริยา/ตอบสนอง", en: "reaction" }, category: "medical", tags: ["assessment"], difficulty: 2 },
    { hanzi: "通報", zhuyin: "ㄊㄨㄥ ㄅㄠˋ", pinyin: "tōngbào", partOfSpeech: "v.", translations: { th: "แจ้งข่าว/รายงาน", en: "to notify" }, category: "communication", tags: ["report"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "處理", zhuyin: "ㄔㄨˇ ㄌㄧˇ", pinyin: "chǔlǐ", partOfSpeech: "v.", translations: { th: "จัดการ/รับมือ", en: "to handle" }, category: "work", tags: ["action"], difficulty: 2 },
    { hanzi: "搬動", zhuyin: "ㄅㄢ ㄉㄨㄥˋ", pinyin: "bāndòng", partOfSpeech: "v.", translations: { th: "เคลื่อนย้าย", en: "to move" }, category: "care", tags: ["movement"], difficulty: 2 },
    { hanzi: "立刻", zhuyin: "ㄌㄧˋ ㄎㄜˋ", pinyin: "lìkè", partOfSpeech: "adv.", translations: { th: "ทันทีทันใด", en: "immediately" }, category: "time", tags: ["time"], difficulty: 2 },
    { hanzi: "檢查", zhuyin: "ㄐㄧㄢˇ ㄔㄚˊ", pinyin: "jiǎnchá", partOfSpeech: "v/n.", translations: { th: "ตรวจสอบ/ตรวจ", en: "to check/examine" }, category: "medical", tags: ["assessment"], difficulty: 2 },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿公！您怎麼了？聽得到我嗎？", pinyin: "ā gōng! nín zěnme le? tīng de dào wǒ ma?", translationI18n: { th: "คุณปู่! เป็นอะไร? ได้ยินหนูไหมคะ?" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "我......頭好痛......", pinyin: "wǒ...... tóu hǎo tòng......", translationI18n: { th: "ฉัน... หัวเจ็บมาก..." } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "您不要動！我先檢查有沒有外傷。", pinyin: "nín bú yào dòng! wǒ xiān jiǎnchá yǒu méiyǒu wàishāng.", translationI18n: { th: "อย่าขยับนะคะ! หนูตรวจดูก่อนว่ามีบาดแผลไหม" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "李護士！王阿公從輪椅上跌倒，意識清楚但頭痛！", pinyin: "Lǐ hùshi! Wáng ā gōng cóng lúnyǐ shàng diē dǎo, yìshì qīngchu dàn tóu tòng!", translationI18n: { th: "พยาบาลหลี่! คุณปู่หวังตกจากรถเข็น สติยังดี แต่ปวดหัว!" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "好，先不要搬動，我立刻過去處理。", pinyin: "hǎo, xiān bú yào bāndòng, wǒ lìkè guòqù chǔlǐ.", translationI18n: { th: "โอเค อย่าเพิ่งเคลื่อนย้าย ฉันจะรีบไปจัดการทันที" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 2, prompt: { symbol: "意識", hanzi: "意識", pinyin: "yìshì" }, options: [{ value: "สติ/ความรู้สึกตัว" }, { value: "เลือดออก" }, { value: "บาดแผล" }, { value: "ปฏิกิริยา" }], answer: { value: "สติ/ความรู้สึกตัว" }, explanationI18n: { "zh-TW": "「意識」= consciousness，跌倒急救時要先確認意識是否清楚。", th: "「意識 yìshì」= สติ/ความรู้สึกตัว" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/通報", instructionKey: "listenPickHanzi" }, options: [{ value: "通報" }, { value: "處理" }, { value: "檢查" }, { value: "搬動" }], answer: { value: "通報" }, audioUrl: "/api/audio/vocab/通報", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "เลือดออก", instructionKey: "thaiToHanzi" }, options: [{ value: "出血" }, { value: "外傷" }, { value: "意識" }, { value: "反應" }], answer: { value: "出血" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["阿公跌倒了，先不要", "___", "，立刻", "___", "護士。"], sentencePinyin: "ā gōng diē dǎo le, xiān bú yào ___, lìkè ___ hùshi.", translationI18n: { th: "คุณปู่ล้ม อย่าเพิ่งเคลื่อนย้าย รีบแจ้งพยาบาลทันที" }, instructionKey: "fillBlank" }, options: [{ value: "搬動...通報" }, { value: "檢查...處理" }, { value: "扶起來...叫" }, { value: "走路...找" }], answer: { value: "搬動...通報" }, explanationI18n: { "zh-TW": "跌倒急救原則：先不搬動（避免脊椎傷害），先通報專業人員。", th: "หลักการช่วยเหลือเมื่อล้ม: อย่าเคลื่อนย้าย แจ้งบุคลากรก่อน" }, skillsTrained: ["grammar", "vocab"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["先", "檢查", "有沒有", "外傷"], targetTranslationI18n: { th: "ตรวจดูก่อนว่ามีบาดแผลไหม" }, instructionKey: "arrangeWords" }, options: [{ value: "先" }, { value: "檢查" }, { value: "有沒有" }, { value: "外傷" }], answer: { value: ["先", "檢查", "有沒有", "外傷"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S04/1", questionI18n: { "zh-TW": "歐寶向護士報告了什麼？", th: "อ้าวเป่ารายงานอะไรกับพยาบาล?" } }, options: [{ value: "阿公跌倒，意識清楚但頭痛" }, { value: "阿公頭暈" }, { value: "阿公胃口不好" }, { value: "阿公需要洗澡" }], answer: { value: "阿公跌倒，意識清楚但頭痛" }, audioUrl: "/api/audio/dialogue/L3-S04/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "王阿公從輪椅上跌倒，意識清楚但頭痛。", pinyin: "Wáng ā gōng cóng lúnyǐ shàng diē dǎo, yìshì qīngchu dàn tóu tòng.", audioUrl: "/api/audio/sentence/L3-S04-fall", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "傷", pinyin: "shāng", translationI18n: { th: "บาดเจ็บ" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "傷" }, skillsTrained: ["writing"] },
  ],
};
