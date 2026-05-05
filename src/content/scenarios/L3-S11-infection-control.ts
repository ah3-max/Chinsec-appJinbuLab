// L3-S11 感染控制基礎
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S11: ScenarioDef = {
  code: "L3-S11",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 11,
  title: "感染控制基礎",
  titleI18n: { "zh-TW": "感染控制基礎", th: "การควบคุมการติดเชื้อเบื้องต้น", vi: "Kiểm soát nhiễm khuẩn cơ bản", id: "Pengendalian Infeksi Dasar" },
  estimatedMinutes: 30,
  prerequisiteCode: "L3-S10",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "院內最近有流感病例，新人歐寶要學習感染控制：洗手七步驟、戴口罩、隔離區規則。每接觸一位長輩前後都要洗手，避免交叉感染……",
      th: "เมื่อเร็วๆ นี้มีผู้ป่วยไข้หวัดใหญ่ในศูนย์ พี่ใหม่อ้าวเป่าต้องเรียนรู้การควบคุมการติดเชื้อ: ขั้นตอนล้างมือ 7 ขั้น สวมหน้ากากอนามัย กฎของพื้นที่กักตัว ทุกครั้งก่อนและหลังสัมผัสผู้สูงอายุต้องล้างมือ เพื่อไม่ให้ติดเชื้อข้าม...",
      vi: "Gần đây có ca cúm trong viện, nhân viên mới Aobao cần học kiểm soát nhiễm khuẩn: 7 bước rửa tay, đeo khẩu trang, quy tắc vùng cách ly. Trước và sau khi tiếp xúc với mỗi cụ phải rửa tay, tránh lây nhiễm chéo...",
      id: "Belakangan ada kasus flu di panti, Aobao yang baru perlu belajar pengendalian infeksi: 7 langkah cuci tangan, pakai masker, aturan area isolasi. Setiap sebelum dan sesudah kontak dengan lansia harus cuci tangan, menghindari infeksi silang...",
    },
  },
  mtcAlignment: { books: ["B3-L11"], topics: ["infection-control", "safety"] },
  vocabularies: [
    { hanzi: "感染控制", zhuyin: "ㄍㄢˇ ㄖㄢˇ ㄎㄨㄥˋ ㄓˋ", pinyin: "gǎnrǎn kòngzhì", partOfSpeech: "n.", translations: { th: "การควบคุมการติดเชื้อ", en: "infection control" }, category: "medical", tags: ["safety"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "洗手", zhuyin: "ㄒㄧˇ ㄕㄡˇ", pinyin: "xǐ shǒu", partOfSpeech: "v.", translations: { th: "ล้างมือ", en: "wash hands" }, category: "hygiene", tags: ["hygiene"], difficulty: 1 },
    { hanzi: "口罩", zhuyin: "ㄎㄡˇ ㄓㄠˋ", pinyin: "kǒuzhào", partOfSpeech: "n.", translations: { th: "หน้ากากอนามัย", en: "face mask" }, category: "medical", tags: ["PPE"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "隔離", zhuyin: "ㄍㄜˊ ㄌㄧˊ", pinyin: "gélí", partOfSpeech: "v.", translations: { th: "กักตัว/แยก", en: "to isolate" }, category: "medical", tags: ["safety"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "病例", zhuyin: "ㄅㄧㄥˋ ㄌㄧˋ", pinyin: "bìnglì", partOfSpeech: "n.", translations: { th: "ผู้ป่วย/ราย", en: "case (medical)" }, category: "medical", tags: ["disease"], difficulty: 3 },
    { hanzi: "流感", zhuyin: "ㄌㄧㄡˊ ㄍㄢˇ", pinyin: "liúgǎn", partOfSpeech: "n.", translations: { th: "ไข้หวัดใหญ่", en: "influenza/flu" }, category: "medical", tags: ["disease"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "接觸", zhuyin: "ㄐㄧㄝ ㄔㄨˋ", pinyin: "jiēchù", partOfSpeech: "v.", translations: { th: "สัมผัส", en: "to contact" }, category: "medical", tags: ["transmission"], difficulty: 2 },
    { hanzi: "交叉感染", zhuyin: "ㄐㄧㄠ ㄔㄚ ㄍㄢˇ ㄖㄢˇ", pinyin: "jiāochā gǎnrǎn", partOfSpeech: "n.", translations: { th: "การติดเชื้อข้าม", en: "cross-infection" }, category: "medical", tags: ["risk"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "預防", zhuyin: "ㄩˋ ㄈㄤˊ", pinyin: "yùfáng", partOfSpeech: "v.", translations: { th: "ป้องกัน", en: "to prevent" }, category: "medical", tags: ["safety"], difficulty: 2 },
    { hanzi: "步驟", zhuyin: "ㄅㄨˋ ㄗㄡˋ", pinyin: "bùzòu", partOfSpeech: "n.", translations: { th: "ขั้นตอน", en: "step/procedure" }, category: "work", tags: ["protocol"], difficulty: 2 },
  ],
  dialogue: [
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "歐寶，最近院內有流感病例，要做好感染控制。", pinyin: "Ōubǎo, zuìjìn yuàn nèi yǒu liúgǎn bìnglì, yào zuòhǎo gǎnrǎn kòngzhì.", translationI18n: { th: "อ้าวเป่า ช่วงนี้ในศูนย์มีผู้ป่วยไข้หวัดใหญ่ ต้องควบคุมการติดเชื้อให้ดี" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好。我每接觸長輩前後都會洗手，戴口罩。", pinyin: "hǎo. wǒ měi jiēchù zhǎngbèi qián hòu dōu huì xǐ shǒu, dài kǒuzhào.", translationI18n: { th: "ค่ะ หนูจะล้างมือก่อนและหลังสัมผัสคุณยายคุณปู่ทุกครั้ง และสวมหน้ากากค่ะ" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "對。洗手要照七步驟，至少 20 秒。", pinyin: "duì. xǐ shǒu yào zhào qī bùzòu, zhìshǎo 20 miǎo.", translationI18n: { th: "ใช่ ล้างมือต้องตามขั้นตอน 7 ขั้น อย่างน้อย 20 วินาที" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "隔離區的長輩要怎麼處理？", pinyin: "gélí qū de zhǎngbèi yào zěnme chǔlǐ?", translationI18n: { th: "ผู้สูงอายุในพื้นที่กักตัวต้องปฏิบัติยังไงคะ?" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "進去前要穿防護衣，避免交叉感染。最重要是預防。", pinyin: "jìnqù qián yào chuān fánghù yī, bìmiǎn jiāochā gǎnrǎn. zuì zhòngyào shì yùfáng.", translationI18n: { th: "ก่อนเข้าไปต้องสวมชุดป้องกัน หลีกเลี่ยงการติดเชื้อข้าม การป้องกันสำคัญที่สุด" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 3, prompt: { symbol: "交叉感染", hanzi: "交叉感染", pinyin: "jiāochā gǎnrǎn" }, options: [{ value: "การติดเชื้อข้าม" }, { value: "ภาวะติดเชื้อในกระแสเลือด" }, { value: "การแพ้ยา" }, { value: "การติดเชื้อทางอากาศ" }], answer: { value: "การติดเชื้อข้าม" }, explanationI18n: { "zh-TW": "「交叉感染」= cross-infection，從一個病人傳染到另一個病人。", th: "「交叉感染」= การติดเชื้อข้าม จากคนหนึ่งสู่อีกคน" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/隔離", instructionKey: "listenPickHanzi" }, options: [{ value: "隔離" }, { value: "感染" }, { value: "預防" }, { value: "接觸" }], answer: { value: "隔離" }, audioUrl: "/api/audio/vocab/隔離", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "ขั้นตอน", instructionKey: "thaiToHanzi" }, options: [{ value: "步驟" }, { value: "規則" }, { value: "標準" }, { value: "流程" }], answer: { value: "步驟" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["接觸長輩", "___", "都要洗手，", "___", "交叉感染。"], sentencePinyin: "jiēchù zhǎngbèi ___ dōu yào xǐ shǒu, ___ jiāochā gǎnrǎn.", translationI18n: { th: "ก่อนและหลังสัมผัสผู้สูงอายุต้องล้างมือ เพื่อหลีกเลี่ยงการติดเชื้อข้าม" }, instructionKey: "fillBlank" }, options: [{ value: "前後...避免" }, { value: "之前...因為" }, { value: "中間...雖然" }, { value: "以後...如果" }], answer: { value: "前後...避免" }, explanationI18n: { "zh-TW": "「動詞 + 前後」= 動作前和動作後都要做，B1 重要句型。", th: "「กริยา + 前後」= ทำทั้งก่อนและหลังกริยานั้น" }, skillsTrained: ["grammar", "vocab"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["最", "重要", "的", "是", "預防"], targetTranslationI18n: { th: "ที่สำคัญที่สุดคือการป้องกัน" }, instructionKey: "arrangeWords" }, options: [{ value: "最" }, { value: "重要" }, { value: "的" }, { value: "是" }, { value: "預防" }], answer: { value: ["最", "重要", "的", "是", "預防"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S11/1", questionI18n: { "zh-TW": "洗手要洗多久？", th: "ล้างมือต้องล้างกี่นาที?" } }, options: [{ value: "至少 20 秒" }, { value: "5 秒" }, { value: "1 分鐘" }, { value: "10 分鐘" }], answer: { value: "至少 20 秒" }, audioUrl: "/api/audio/dialogue/L3-S11/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "接觸長輩前後都要洗手，避免交叉感染。", pinyin: "jiēchù zhǎngbèi qián hòu dōu yào xǐ shǒu, bìmiǎn jiāochā gǎnrǎn.", audioUrl: "/api/audio/sentence/L3-S11-handwash", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "預", pinyin: "yù", translationI18n: { th: "ล่วงหน้า/ป้องกัน" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "預" }, skillsTrained: ["writing"] },
  ],
};
