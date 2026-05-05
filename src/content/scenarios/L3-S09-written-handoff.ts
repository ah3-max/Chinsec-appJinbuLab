// L3-S09 寫交班記錄（書面）
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S09: ScenarioDef = {
  code: "L3-S09",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 9,
  title: "寫交班記錄",
  titleI18n: { "zh-TW": "寫交班記錄", th: "เขียนบันทึกส่งเวร", vi: "Viết nhật ký bàn giao ca", id: "Menulis Catatan Serah Terima" },
  estimatedMinutes: 35,
  prerequisiteCode: "L3-S08",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "歐寶白天班結束，要在交班簿上寫下王阿公今天的飲食、睡眠、用藥、特殊情況，下一班才能接手。書面要簡潔、客觀、避免主觀推測……",
      th: "หลังเลิกกะกลางวัน อ้าวเป่าต้องเขียนบันทึกในสมุดส่งเวรเรื่องการกิน การนอน การใช้ยา และเหตุการณ์พิเศษของคุณปู่หวังในวันนี้ เพื่อให้กะถัดไปรับช่วงต่อ การเขียนต้องสั้น ตรงประเด็น และเลี่ยงการคาดเดาส่วนตัว...",
      vi: "Sau khi ca ngày kết thúc, Aobao phải ghi vào sổ bàn giao về ăn uống, giấc ngủ, dùng thuốc, tình huống đặc biệt của ông Wang hôm nay, để ca sau tiếp quản. Viết phải ngắn gọn, khách quan, tránh suy đoán...",
      id: "Setelah shift siang berakhir, Aobao perlu menulis di buku serah terima tentang makan, tidur, obat, dan situasi khusus Kakek Wang hari ini, agar shift berikutnya dapat melanjutkan. Penulisan harus singkat, objektif, hindari spekulasi...",
    },
  },
  mtcAlignment: { books: ["B3-L09"], topics: ["documentation", "handoff", "writing"] },
  vocabularies: [
    { hanzi: "交班簿", zhuyin: "ㄐㄧㄠ ㄅㄢ ㄅㄨˋ", pinyin: "jiāo bān bù", partOfSpeech: "n.", translations: { th: "สมุดส่งเวร", en: "handoff log" }, category: "work", tags: ["documentation"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "記載", zhuyin: "ㄐㄧˋ ㄗㄞˇ", pinyin: "jìzǎi", partOfSpeech: "v.", translations: { th: "บันทึก/ลง", en: "to record" }, category: "work", tags: ["documentation"], difficulty: 2 },
    { hanzi: "簡潔", zhuyin: "ㄐㄧㄢˇ ㄐㄧㄝˊ", pinyin: "jiǎnjié", partOfSpeech: "adj.", translations: { th: "กระชับ/สั้นได้ใจความ", en: "concise" }, category: "writing", tags: ["style"], difficulty: 3 },
    { hanzi: "客觀", zhuyin: "ㄎㄜˋ ㄍㄨㄢ", pinyin: "kèguān", partOfSpeech: "adj.", translations: { th: "ตามจริง/เป็นกลาง", en: "objective" }, category: "writing", tags: ["style"], difficulty: 3 },
    { hanzi: "主觀", zhuyin: "ㄓㄨˇ ㄍㄨㄢ", pinyin: "zhǔguān", partOfSpeech: "adj.", translations: { th: "อัตนัย/ความเห็นส่วนตัว", en: "subjective" }, category: "writing", tags: ["style"], difficulty: 3 },
    { hanzi: "推測", zhuyin: "ㄊㄨㄟ ㄘㄜˋ", pinyin: "tuīcè", partOfSpeech: "v.", translations: { th: "คาดเดา/สันนิษฐาน", en: "to speculate" }, category: "cognitive", tags: ["thought"], difficulty: 3 },
    { hanzi: "事實", zhuyin: "ㄕˋ ㄕˊ", pinyin: "shìshí", partOfSpeech: "n.", translations: { th: "ข้อเท็จจริง", en: "fact" }, category: "writing", tags: ["truth"], difficulty: 2 },
    { hanzi: "如下", zhuyin: "ㄖㄨˊ ㄒㄧㄚˋ", pinyin: "rúxià", partOfSpeech: "adv.", translations: { th: "ดังต่อไปนี้", en: "as follows" }, category: "writing", tags: ["formal"], difficulty: 2 },
    { hanzi: "備註", zhuyin: "ㄅㄟˋ ㄓㄨˋ", pinyin: "bèizhù", partOfSpeech: "n.", translations: { th: "หมายเหตุ", en: "note/remark" }, category: "writing", tags: ["formal"], difficulty: 2 },
    { hanzi: "簽名", zhuyin: "ㄑㄧㄢ ㄇㄧㄥˊ", pinyin: "qiānmíng", partOfSpeech: "v/n.", translations: { th: "เซ็นชื่อ/ลายเซ็น", en: "to sign/signature" }, category: "work", tags: ["documentation"], difficulty: 2 },
  ],
  dialogue: [
    { speaker: "colleague", speakerLabel: { "zh-TW": "林學姊", th: "พี่หลิน" }, hanzi: "歐寶，下班前記得寫交班簿。", pinyin: "Ōubǎo, xià bān qián jìde xiě jiāo bān bù.", translationI18n: { th: "อ้าวเป่า ก่อนเลิกงานอย่าลืมเขียนสมุดส่งเวรนะ" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好的，我寫了王阿公今天的情況。", pinyin: "hǎo de, wǒ xiě le Wáng ā gōng jīntiān de qíngkuàng.", translationI18n: { th: "ได้ค่ะ หนูเขียนเรื่องคุณปู่หวังของวันนี้แล้ว" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "林學姊", th: "พี่หลิน" }, hanzi: "記住，要簡潔、客觀，寫事實，不要主觀推測。", pinyin: "jìzhu, yào jiǎnjié, kèguān, xiě shìshí, bú yào zhǔguān tuīcè.", translationI18n: { th: "จำไว้นะ ต้องกระชับ ตรงประเด็น เขียนข้อเท็จจริง อย่าคาดเดาความรู้สึกส่วนตัว" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "我寫：「下午阿公咳嗽 5 次，已通報李護士。備註如下：飲食 8 分滿。」", pinyin: "wǒ xiě: 'xiàwǔ ā gōng késou 5 cì, yǐ tōngbào Lǐ hùshi. bèizhù rúxià: yǐnshí 8 fēn mǎn.'", translationI18n: { th: "หนูเขียนว่า「ตอนบ่ายคุณปู่ไอ 5 ครั้ง รายงานพยาบาลหลี่แล้ว หมายเหตุ: ทานข้าว 8 ส่วน」" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "林學姊", th: "พี่หลิน" }, hanzi: "很好，最後別忘記簽名！", pinyin: "hěn hǎo, zuìhòu bié wàngjì qiānmíng!", translationI18n: { th: "ดีมาก สุดท้ายอย่าลืมเซ็นชื่อ!" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 3, prompt: { symbol: "客觀", hanzi: "客觀", pinyin: "kèguān" }, options: [{ value: "ตามจริง/เป็นกลาง" }, { value: "ความเห็นส่วนตัว" }, { value: "คาดเดา" }, { value: "หมายเหตุ" }], answer: { value: "ตามจริง/เป็นกลาง" }, explanationI18n: { "zh-TW": "「客觀」= objective，書寫照護記錄要客觀，避免主觀。", th: "「客觀 kèguān」= ตามจริง/เป็นกลาง การเขียนบันทึกต้องเป็นกลาง" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/簽名", instructionKey: "listenPickHanzi" }, options: [{ value: "簽名" }, { value: "備註" }, { value: "事實" }, { value: "推測" }], answer: { value: "簽名" }, audioUrl: "/api/audio/vocab/簽名", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "กระชับ", instructionKey: "thaiToHanzi" }, options: [{ value: "簡潔" }, { value: "客觀" }, { value: "事實" }, { value: "備註" }], answer: { value: "簡潔" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["寫", "___", "，不要", "___", "推測。"], sentencePinyin: "xiě ___, bú yào ___ tuīcè.", translationI18n: { th: "เขียนข้อเท็จจริง อย่าคาดเดาส่วนตัว" }, instructionKey: "fillBlank" }, options: [{ value: "事實...主觀" }, { value: "備註...客觀" }, { value: "簽名...簡潔" }, { value: "如下...主觀" }], answer: { value: "事實...主觀" }, explanationI18n: { "zh-TW": "照護記錄的黃金原則：寫事實，不寫主觀推測。", th: "หลักการเขียนบันทึก: เขียนข้อเท็จจริง อย่าคาดเดาส่วนตัว" }, skillsTrained: ["grammar", "vocab"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["別", "忘記", "簽名"], targetTranslationI18n: { th: "อย่าลืมเซ็นชื่อ" }, instructionKey: "arrangeWords" }, options: [{ value: "別" }, { value: "忘記" }, { value: "簽名" }], answer: { value: ["別", "忘記", "簽名"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S09/1", questionI18n: { "zh-TW": "交班簿應該怎麼寫？", th: "สมุดส่งเวรควรเขียนยังไง?" } }, options: [{ value: "簡潔、客觀、寫事實" }, { value: "詳細描述心情" }, { value: "用故事方式寫" }, { value: "只寫好事" }], answer: { value: "簡潔、客觀、寫事實" }, audioUrl: "/api/audio/dialogue/L3-S09/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "下午阿公咳嗽 5 次，已通報李護士。", pinyin: "xiàwǔ ā gōng késou 5 cì, yǐ tōngbào Lǐ hùshi.", audioUrl: "/api/audio/sentence/L3-S09-record", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "簽", pinyin: "qiān", translationI18n: { th: "เซ็น/ลงนาม" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "簽" }, skillsTrained: ["writing"] },
  ],
};
