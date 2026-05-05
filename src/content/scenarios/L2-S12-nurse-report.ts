// L2-S12 向護理師報告
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L2_S12: ScenarioDef = {
  code: "L2-S12",
  level: Level.A2_BASIC,
  orderIndex: 12,
  title: "向護理師報告",
  titleI18n: { "zh-TW": "向護理師報告", th: "การรายงานต่อพยาบาล", vi: "Báo cáo với y tá", id: "Melapor Kepada Perawat" },
  estimatedMinutes: 30,
  prerequisiteCode: "L2-S11",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "歐寶觀察到王阿公今天吃得不太多，下午還咳嗽了好幾次，看起來臉色不好。她要把這些情況報告給李護士……",
      th: "อ้าวเป่าสังเกตเห็นว่าคุณปู่หวังวันนี้ทานข้าวไม่มาก ตอนบ่ายไอหลายครั้ง สีหน้าไม่ดี เธอจะรายงานเรื่องนี้ให้พยาบาลหลี่ทราบ...",
      vi: "Aobao quan sát thấy ông Wang hôm nay ăn không nhiều, buổi chiều còn ho nhiều lần, sắc mặt không tốt. Cô phải báo cáo tình hình này cho y tá Lý...",
      id: "Aobao memperhatikan Kakek Wang hari ini makan tidak banyak, sore juga batuk beberapa kali, wajah pucat. Dia harus melaporkan ini kepada Perawat Li...",
    },
  },
  mtcAlignment: { books: ["B2-L12"], topics: ["report", "nursing"] },
  vocabularies: [
    { hanzi: "報告", zhuyin: "ㄅㄠˋ ㄍㄠˋ", pinyin: "bàogào", partOfSpeech: "v/n.", translations: { th: "รายงาน", en: "to report" }, category: "work", tags: ["communication"], difficulty: 2 },
    { hanzi: "不太", zhuyin: "ㄅㄨˋ ㄊㄞˋ", pinyin: "bú tài", partOfSpeech: "adv.", translations: { th: "ไม่ค่อย", en: "not very" }, category: "daily", tags: ["modifier"], difficulty: 1 },
    { hanzi: "好像", zhuyin: "ㄏㄠˇ ㄒㄧㄤˋ", pinyin: "hǎoxiàng", partOfSpeech: "adv.", translations: { th: "ดูเหมือน/ราวกับ", en: "seems like" }, category: "daily", tags: ["modifier"], difficulty: 2 },
    { hanzi: "咳嗽", zhuyin: "ㄎㄜˊ ˙ㄙㄡ", pinyin: "késou", partOfSpeech: "v/n.", translations: { th: "ไอ", en: "to cough" }, category: "symptom", tags: ["symptom"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "臉色", zhuyin: "ㄌㄧㄢˇ ㄙㄜˋ", pinyin: "liǎnsè", partOfSpeech: "n.", translations: { th: "สีหน้า", en: "complexion" }, category: "medical", tags: ["observation"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "觀察", zhuyin: "ㄍㄨㄢ ㄔㄚˊ", pinyin: "guānchá", partOfSpeech: "v.", translations: { th: "สังเกต", en: "to observe" }, category: "work", tags: ["nursing"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "情況", zhuyin: "ㄑㄧㄥˊ ㄎㄨㄤˋ", pinyin: "qíngkuàng", partOfSpeech: "n.", translations: { th: "สถานการณ์/อาการ", en: "situation" }, category: "work", tags: ["report"], difficulty: 2 },
    { hanzi: "胃口", zhuyin: "ㄨㄟˋ ㄎㄡˇ", pinyin: "wèikǒu", partOfSpeech: "n.", translations: { th: "ความอยากอาหาร", en: "appetite" }, category: "medical", tags: ["health"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "幾次", zhuyin: "ㄐㄧˇ ㄘˋ", pinyin: "jǐ cì", partOfSpeech: "q.", translations: { th: "กี่ครั้ง", en: "how many times" }, category: "question", tags: ["question"], difficulty: 1 },
    { hanzi: "需要", zhuyin: "ㄒㄩ ㄧㄠˋ", pinyin: "xūyào", partOfSpeech: "v.", translations: { th: "ต้องการ", en: "to need" }, category: "daily", tags: ["modal"], difficulty: 1 },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "李護士，我要報告王阿公的情況。", pinyin: "Lǐ hùshi, wǒ yào bàogào Wáng ā gōng de qíngkuàng.", translationI18n: { th: "พยาบาลหลี่ค่ะ หนูขอรายงานอาการคุณปู่หวัง" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "好，怎麼樣？", pinyin: "hǎo, zěnmeyàng?", translationI18n: { th: "ดี เป็นยังไงบ้าง?" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿公今天胃口不太好，吃飯吃得少。", pinyin: "ā gōng jīntiān wèikǒu bú tài hǎo, chī fàn chī de shǎo.", translationI18n: { th: "วันนี้คุณปู่ความอยากอาหารไม่ค่อยดี ทานข้าวน้อย" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "下午咳嗽了好幾次，臉色好像不太好。", pinyin: "xiàwǔ késou le hǎo jǐ cì, liǎnsè hǎoxiàng bú tài hǎo.", translationI18n: { th: "ตอนบ่ายไอหลายครั้ง สีหน้าดูเหมือนไม่ค่อยดีค่ะ" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "好，我馬上去看，可能需要量體溫。", pinyin: "hǎo, wǒ mǎshàng qù kàn, kěnéng xūyào liáng tǐwēn.", translationI18n: { th: "โอเค ฉันจะไปดูทันที อาจจะต้องวัดอุณหภูมิ" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 1, prompt: { symbol: "咳嗽", hanzi: "咳嗽", pinyin: "késou" }, options: [{ value: "ไอ" }, { value: "จาม" }, { value: "หายใจ" }, { value: "ไข้" }], answer: { value: "ไอ" }, explanationI18n: { "zh-TW": "「咳嗽」= cough，常見症狀，要報告給護士。", th: "「咳嗽 késou」= ไอ" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 1, prompt: { audioUrl: "/api/audio/vocab/臉色", instructionKey: "listenPickHanzi" }, options: [{ value: "臉色" }, { value: "胃口" }, { value: "情況" }, { value: "報告" }], answer: { value: "臉色" }, audioUrl: "/api/audio/vocab/臉色", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 1, prompt: { thai: "สังเกต", instructionKey: "thaiToHanzi" }, options: [{ value: "觀察" }, { value: "報告" }, { value: "情況" }, { value: "需要" }], answer: { value: "觀察" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 2, prompt: { sentenceParts: ["阿公今天胃口", "___", "好。"], sentencePinyin: "ā gōng jīntiān wèikǒu ___ hǎo.", translationI18n: { th: "วันนี้คุณปู่ความอยากอาหารไม่ค่อยดี" }, instructionKey: "fillBlank" }, options: [{ value: "不太" }, { value: "很" }, { value: "非常" }, { value: "好像" }], answer: { value: "不太" }, explanationI18n: { "zh-TW": "「不太 + 形容詞」= 不是很，是委婉的負面說法。", th: "「不太」= ไม่ค่อย ใช้กับคำคุณศัพท์เพื่อพูดในทางลบอย่างสุภาพ" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["臉色", "好像", "不太", "好"], targetTranslationI18n: { th: "สีหน้าดูเหมือนไม่ค่อยดี" }, instructionKey: "arrangeWords" }, options: [{ value: "臉色" }, { value: "好像" }, { value: "不太" }, { value: "好" }], answer: { value: ["臉色", "好像", "不太", "好"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 2, prompt: { audioUrl: "/api/audio/dialogue/L2-S12/1", questionI18n: { "zh-TW": "歐寶報告了哪三件事？", th: "อ้าวเป่ารายงานอะไรสามอย่าง?" } }, options: [{ value: "胃口、咳嗽、臉色" }, { value: "頭暈、跌倒、發燒" }, { value: "尿布、洗澡、吃藥" }, { value: "睡覺、聊天、散步" }], answer: { value: "胃口、咳嗽、臉色" }, audioUrl: "/api/audio/dialogue/L2-S12/1", skillsTrained: ["listening"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 2, prompt: { hanzi: "阿公今天胃口不太好，咳嗽了好幾次。", pinyin: "ā gōng jīntiān wèikǒu bú tài hǎo, késou le hǎo jǐ cì.", audioUrl: "/api/audio/sentence/L2-S12-report", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "報", pinyin: "bào", translationI18n: { th: "รายงาน" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "報" }, skillsTrained: ["writing"] },
  ],
};
