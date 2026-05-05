// L3-S02 與家屬面對面溝通（探訪）
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S02: ScenarioDef = {
  code: "L3-S02",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 2,
  title: "與家屬面對面溝通",
  titleI18n: { "zh-TW": "與家屬面對面溝通", th: "การสื่อสารกับครอบครัวแบบเจอตัว", vi: "Giao tiếp trực tiếp với gia đình", id: "Komunikasi Tatap Muka dengan Keluarga" },
  estimatedMinutes: 30,
  prerequisiteCode: "L3-S01",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "陳阿嬤的女兒週末來探訪，希望聽歐寶報告母親一週的整體狀況：飲食、睡眠、情緒、運動，並關心是否有特別的事件發生……",
      th: "ลูกสาวคุณยายเฉินมาเยี่ยมในวันสุดสัปดาห์ และอยากฟังรายงานจากอ้าวเป่าเรื่องอาการของแม่ในรอบสัปดาห์ ทั้งการกิน การนอน อารมณ์ การออกกำลังกาย และมีเหตุการณ์พิเศษอะไรหรือไม่...",
      vi: "Con gái bà Trần đến thăm vào cuối tuần, muốn nghe Aobao báo cáo về tình hình mẹ trong tuần qua: ăn uống, giấc ngủ, cảm xúc, vận động, và có sự việc đặc biệt nào không...",
      id: "Anak perempuan Nenek Chen datang berkunjung di akhir pekan, ingin mendengar laporan Aobao tentang kondisi ibu seminggu ini: makan, tidur, suasana hati, olahraga, dan apakah ada peristiwa khusus...",
    },
  },
  mtcAlignment: { books: ["B3-L02"], topics: ["family", "weekly-report"] },
  vocabularies: [
    { hanzi: "探訪", zhuyin: "ㄊㄢˋ ㄈㄤˇ", pinyin: "tànfǎng", partOfSpeech: "v.", translations: { th: "เยี่ยมเยียน", en: "to visit" }, category: "social", tags: ["family"], difficulty: 2 },
    { hanzi: "整體上", zhuyin: "ㄓㄥˇ ㄊㄧˇ ㄕㄤˋ", pinyin: "zhěngtǐ shàng", partOfSpeech: "adv.", translations: { th: "โดยรวมแล้ว", en: "overall" }, category: "abstract", tags: ["abstract"], difficulty: 2 },
    { hanzi: "雖然", zhuyin: "ㄙㄨㄟ ㄖㄢˊ", pinyin: "suīrán", partOfSpeech: "conj.", translations: { th: "ถึงแม้ว่า", en: "although" }, category: "grammar", tags: ["conjunction"], difficulty: 2 },
    { hanzi: "但是", zhuyin: "ㄉㄢˋ ㄕˋ", pinyin: "dànshì", partOfSpeech: "conj.", translations: { th: "แต่ว่า", en: "but" }, category: "grammar", tags: ["conjunction"], difficulty: 1 },
    { hanzi: "情緒", zhuyin: "ㄑㄧㄥˊ ㄒㄩˋ", pinyin: "qíngxù", partOfSpeech: "n.", translations: { th: "อารมณ์", en: "emotion/mood" }, category: "emotion", tags: ["emotion"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "活動", zhuyin: "ㄏㄨㄛˊ ㄉㄨㄥˋ", pinyin: "huódòng", partOfSpeech: "n/v.", translations: { th: "กิจกรรม/ทำกิจกรรม", en: "activity" }, category: "daily", tags: ["activity"], difficulty: 1 },
    { hanzi: "參加", zhuyin: "ㄘㄢ ㄐㄧㄚ", pinyin: "cānjiā", partOfSpeech: "v.", translations: { th: "เข้าร่วม", en: "to participate" }, category: "social", tags: ["activity"], difficulty: 2 },
    { hanzi: "建議", zhuyin: "ㄐㄧㄢˋ ㄧˋ", pinyin: "jiànyì", partOfSpeech: "v/n.", translations: { th: "แนะนำ/ข้อเสนอ", en: "to suggest/suggestion" }, category: "communication", tags: ["communication"], difficulty: 2 },
    { hanzi: "特別", zhuyin: "ㄊㄜˋ ㄅㄧㄝˊ", pinyin: "tèbié", partOfSpeech: "adv/adj.", translations: { th: "พิเศษ/เป็นพิเศษ", en: "special/especially" }, category: "daily", tags: ["modifier"], difficulty: 1 },
    { hanzi: "陪伴", zhuyin: "ㄆㄟˊ ㄅㄢˋ", pinyin: "péibàn", partOfSpeech: "v.", translations: { th: "อยู่เป็นเพื่อน", en: "to accompany" }, category: "social", tags: ["companion"], difficulty: 2, isEldercareVocab: true },
  ],
  dialogue: [
    { speaker: "colleague", speakerLabel: { "zh-TW": "陳小姐", th: "คุณเฉิน" }, hanzi: "歐寶你好，我來探訪我媽。她這週怎麼樣？", pinyin: "Ōubǎo nǐ hǎo, wǒ lái tànfǎng wǒ mā. tā zhè zhōu zěnmeyàng?", translationI18n: { th: "อ้าวเป่าสวัสดีค่ะ ฉันมาเยี่ยมแม่ สัปดาห์นี้แม่เป็นยังไงบ้าง?" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "陳小姐您好。整體上阿嬤情形不錯。", pinyin: "Chén xiǎojiě nín hǎo. zhěngtǐ shàng ā mā qíngxíng bú cuò.", translationI18n: { th: "คุณเฉินสวัสดีค่ะ โดยรวมแล้วคุณยายอาการดีค่ะ" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "雖然有時候會想家，但是情緒大致穩定。", pinyin: "suīrán yǒu shíhòu huì xiǎng jiā, dànshì qíngxù dàzhì wěndìng.", translationI18n: { th: "ถึงแม้บางครั้งจะคิดถึงบ้าน แต่อารมณ์โดยรวมก็คงที่ค่ะ" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "陳小姐", th: "คุณเฉิน" }, hanzi: "她有沒有參加什麼活動？", pinyin: "tā yǒu méiyǒu cānjiā shénme huódòng?", translationI18n: { th: "แม่ได้เข้าร่วมกิจกรรมอะไรบ้างไหม?" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "有，週三的團康活動阿嬤有參加，建議您多陪伴她聊天。", pinyin: "yǒu, zhōu sān de tuánkāng huódòng ā mā yǒu cānjiā, jiànyì nín duō péibàn tā liáotiān.", translationI18n: { th: "มีค่ะ กิจกรรมกลุ่มวันพุธคุณยายเข้าร่วมด้วย ขอแนะนำให้คุณมาอยู่คุยเล่นเป็นเพื่อนบ่อยๆ ค่ะ" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 2, prompt: { symbol: "情緒", hanzi: "情緒", pinyin: "qíngxù" }, options: [{ value: "อารมณ์" }, { value: "สถานการณ์" }, { value: "กิจกรรม" }, { value: "อาการ" }], answer: { value: "อารมณ์" }, explanationI18n: { "zh-TW": "「情緒」= emotion，描述心情/心理狀態的常用詞。", th: "「情緒 qíngxù」= อารมณ์" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/陪伴", instructionKey: "listenPickHanzi" }, options: [{ value: "陪伴" }, { value: "建議" }, { value: "參加" }, { value: "活動" }], answer: { value: "陪伴" }, audioUrl: "/api/audio/vocab/陪伴", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "แนะนำ", instructionKey: "thaiToHanzi" }, options: [{ value: "建議" }, { value: "陪伴" }, { value: "參加" }, { value: "探訪" }], answer: { value: "建議" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["___", "有時候會想家，", "___", "情緒大致穩定。"], sentencePinyin: "___ yǒu shíhòu huì xiǎng jiā, ___ qíngxù dàzhì wěndìng.", translationI18n: { th: "ถึงแม้บางครั้งจะคิดถึงบ้าน แต่อารมณ์โดยรวมก็คงที่" }, instructionKey: "fillBlank" }, options: [{ value: "雖然...但是" }, { value: "因為...所以" }, { value: "如果...就" }, { value: "不但...而且" }], answer: { value: "雖然...但是" }, explanationI18n: { "zh-TW": "「雖然...但是」= although...but，表示讓步轉折，B1 重要句型。", th: "「雖然...但是」= ถึงแม้ว่า...แต่ ใช้แสดงการขัดแย้ง" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["建議", "您", "多", "陪伴", "她"], targetTranslationI18n: { th: "ขอแนะนำให้คุณมาอยู่เป็นเพื่อนเธอบ่อยๆ" }, instructionKey: "arrangeWords" }, options: [{ value: "建議" }, { value: "您" }, { value: "多" }, { value: "陪伴" }, { value: "她" }], answer: { value: ["建議", "您", "多", "陪伴", "她"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S02/1", questionI18n: { "zh-TW": "歐寶建議陳小姐做什麼？", th: "อ้าวเป่าแนะนำคุณเฉินทำอะไร?" } }, options: [{ value: "多陪伴媽媽聊天" }, { value: "帶媽媽出院" }, { value: "找新醫生" }, { value: "送禮物" }], answer: { value: "多陪伴媽媽聊天" }, audioUrl: "/api/audio/dialogue/L3-S02/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "雖然有時候會想家，但是情緒大致穩定。", pinyin: "suīrán yǒu shíhòu huì xiǎng jiā, dànshì qíngxù dàzhì wěndìng.", audioUrl: "/api/audio/sentence/L3-S02-suiran", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "陪", pinyin: "péi", translationI18n: { th: "อยู่เป็นเพื่อน" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "陪" }, skillsTrained: ["writing"] },
  ],
};
