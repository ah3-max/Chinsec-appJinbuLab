// L1-S09 緊急呼叫
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L1_S09: ScenarioDef = {
  code: "L1-S09",
  level: Level.A1_BEGINNER,
  orderIndex: 9,
  title: "緊急呼叫",
  titleI18n: { "zh-TW": "緊急呼叫", th: "การเรียกในกรณีฉุกเฉิน", vi: "Gọi khẩn cấp", id: "Panggilan Darurat" },
  estimatedMinutes: 25,
  prerequisiteCode: "L1-S08",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "王阿公突然說頭很暈，叫歐寶快來。歐寶衝進去看到阿公臉色不好，她必須馬上叫護士李護士來……",
      th: "คุณปู่หวังบอกว่าวิงเวียนหัวมาก และเรียกอ้าวเป่าให้รีบมา อ้าวเป่าวิ่งเข้าไปเห็นว่าหน้าปู่ไม่ดี เธอต้องรีบเรียกพยาบาลหลี่มาทันที...",
      vi: "Ông Wang đột nhiên nói chóng mặt và gọi Aobao lại gấp. Aobao chạy vào thấy sắc mặt ông không tốt, cô phải gọi y tá Lý ngay lập tức...",
      id: "Kakek Wang tiba-tiba bilang pusing dan memanggil Aobao untuk cepat datang. Aobao berlari masuk dan melihat wajah Kakek pucat, dia harus segera memanggil Perawat Li...",
    },
  },
  mtcAlignment: { books: ["B1-L09"], topics: ["emergency", "medical"] },
  vocabularies: [
    { hanzi: "快點", zhuyin: "ㄎㄨㄞˋ ˙ㄉㄧㄢˇ", pinyin: "kuài diǎn", partOfSpeech: "adv.", translations: { th: "รีบๆ / เร็วๆ", en: "hurry up" }, category: "emergency", tags: ["emergency"], difficulty: 1 },
    { hanzi: "護士", zhuyin: "ㄏㄨˋ ˙ㄕˋ", pinyin: "hùshi", partOfSpeech: "n.", translations: { th: "พยาบาล", en: "nurse" }, category: "medical", tags: ["medical", "staff"], difficulty: 1, isEldercareVocab: true },
    { hanzi: "頭暈", zhuyin: "ˊㄊㄡ ˙ㄩㄣ", pinyin: "tóuyūn", partOfSpeech: "adj.", translations: { th: "วิงเวียน", en: "dizzy" }, category: "symptom", tags: ["symptom", "medical"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "跌倒", zhuyin: "ˊㄉㄧㄝ ˙ㄉㄠˇ", pinyin: "diēdǎo", partOfSpeech: "v.", translations: { th: "ล้ม / หกล้ม", en: "to fall down" }, category: "emergency", tags: ["emergency", "safety"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "沒事", zhuyin: "ˊㄇㄟ ˙ㄕˋ", pinyin: "méishì", partOfSpeech: "exp.", translations: { th: "ไม่เป็นไร", en: "it's okay/fine" }, category: "daily", tags: ["reassurance"], difficulty: 1 },
    { hanzi: "幫忙", zhuyin: "ㄅㄤ ˙ㄇㄤˊ", pinyin: "bāngmáng", partOfSpeech: "v.", translations: { th: "ช่วยด้วย / ช่วยเหลือ", en: "to help" }, category: "emergency", tags: ["emergency", "help"], difficulty: 1 },
    { hanzi: "緊急", zhuyin: "ˋㄐㄧㄣ ˙ㄐㄧˊ", pinyin: "jǐnjí", partOfSpeech: "adj.", translations: { th: "ฉุกเฉิน / เร่งด่วน", en: "urgent/emergency" }, category: "emergency", tags: ["emergency"], difficulty: 2 },
    { hanzi: "血壓", zhuyin: "ˋㄒㄩㄝ ˙ㄧㄚ", pinyin: "xuèyā", partOfSpeech: "n.", translations: { th: "ความดันโลหิต", en: "blood pressure" }, category: "medical", tags: ["medical", "vital"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "心跳", zhuyin: "ˋㄒㄧㄣ ˙ㄊㄧㄠˋ", pinyin: "xīntiào", partOfSpeech: "n.", translations: { th: "ชีพจร / อัตราการเต้นหัวใจ", en: "heartbeat/pulse" }, category: "medical", tags: ["medical", "vital"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "沒關係", zhuyin: "ˊㄇㄟ ˙ㄍㄨㄢ ˙ˋㄒㄧ", pinyin: "méi guānxi", partOfSpeech: "exp.", translations: { th: "ไม่เป็นไร / ไม่ต้องกังวล", en: "it doesn't matter/no worries" }, category: "daily", tags: ["reassurance"], difficulty: 1 },
  ],
  dialogue: [
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "歐寶，快來！我頭暈！", pinyin: "Ōubǎo, kuài lái! wǒ tóuyūn!", translationI18n: { th: "อ้าวเป่า รีบมาเลย! ฉันวิงเวียน!" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿公，您沒事吧？快坐下，不要動。", pinyin: "ā gōng, nín méishì ba? kuài zuòxia, bú yào dòng.", translationI18n: { th: "คุณปู่ ไม่เป็นไรนะ รีบนั่งลง อย่าขยับ" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "我去叫護士，請您等一下。", pinyin: "wǒ qù jiào hùshi, qǐng nín děng yīxià.", translationI18n: { th: "หนูจะไปเรียกพยาบาล กรุณารอสักครู่นะครับ/ค่ะ" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "怎麼了？是緊急狀況嗎？", pinyin: "zěnme le? shì jǐnjí zhuàngkuàng ma?", translationI18n: { th: "เป็นอะไรไป? เป็นเหตุฉุกเฉินไหม?" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "是的！王阿公頭暈，請快來幫忙！", pinyin: "shì de! Wáng ā gōng tóuyūn, qǐng kuài lái bāngmáng!", translationI18n: { th: "ใช่ครับ/ค่ะ! คุณปู่หวังวิงเวียน กรุณารีบมาช่วยด้วย!" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 1, prompt: { symbol: "護士", hanzi: "護士", pinyin: "hùshi" }, options: [{ value: "พยาบาล" }, { value: "แพทย์" }, { value: "เภสัชกร" }, { value: "ผู้ดูแล" }], answer: { value: "พยาบาล" }, explanationI18n: { "zh-TW": "「護士」= 護理人員，在養老院照顧長輩的重要角色。", th: "「護士 hùshi」= พยาบาล" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 1, prompt: { audioUrl: "/api/audio/vocab/頭暈", instructionKey: "listenPickHanzi" }, options: [{ value: "頭暈" }, { value: "頭痛" }, { value: "跌倒" }, { value: "緊急" }], answer: { value: "頭暈" }, audioUrl: "/api/audio/vocab/頭暈", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 1, prompt: { thai: "ช่วยด้วย", instructionKey: "thaiToHanzi" }, options: [{ value: "幫忙" }, { value: "謝謝" }, { value: "沒事" }, { value: "快點" }], answer: { value: "幫忙" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 2, prompt: { sentenceParts: ["我去", "___", "護士。"], sentencePinyin: "wǒ qù ___ hùshi.", translationI18n: { th: "หนูจะไปเรียกพยาบาล" }, instructionKey: "fillBlank" }, options: [{ value: "叫" }, { value: "找" }, { value: "問" }, { value: "幫" }], answer: { value: "叫" }, explanationI18n: { "zh-TW": "「叫」在這裡是呼叫、喊人的意思。「我去叫護士」= 我去通知護士。", th: "「叫」ในที่นี้แปลว่า เรียก / ตะโกนหา" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["阿公", "，", "您", "沒事", "吧"], targetTranslationI18n: { th: "คุณปู่ ไม่เป็นไรนะ?" }, instructionKey: "arrangeWords" }, options: [{ value: "阿公" }, { value: "，" }, { value: "您" }, { value: "沒事" }, { value: "吧" }], answer: { value: ["阿公", "，", "您", "沒事", "吧"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 2, prompt: { audioUrl: "/api/audio/dialogue/L1-S09/1", questionI18n: { "zh-TW": "歐寶要做什麼？", th: "อ้าวเป่าจะทำอะไร?" } }, options: [{ value: "叫護士" }, { value: "叫醫生" }, { value: "打電話" }, { value: "量血壓" }], answer: { value: "叫護士" }, audioUrl: "/api/audio/dialogue/L1-S09/1", skillsTrained: ["listening"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 2, prompt: { hanzi: "阿公，您沒事吧？我去叫護士。", pinyin: "ā gōng, nín méishì ba? wǒ qù jiào hùshi.", audioUrl: "/api/audio/sentence/L1-S09-emergency", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "護", pinyin: "hù", translationI18n: { th: "ดูแล / พยาบาล" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "護" }, skillsTrained: ["writing"] },
  ],
};
