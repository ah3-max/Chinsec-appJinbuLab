// L3-S08 復健協助
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S08: ScenarioDef = {
  code: "L3-S08",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 8,
  title: "復健協助",
  titleI18n: { "zh-TW": "復健協助", th: "การช่วยเหลือการฟื้นฟูสมรรถภาพ", vi: "Hỗ trợ phục hồi chức năng", id: "Bantuan Rehabilitasi" },
  estimatedMinutes: 30,
  prerequisiteCode: "L3-S07",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "王阿公中風後正在做復健，物理治療師指導他每天做手腳關節運動，歐寶要協助阿公完成練習，鼓勵他不要放棄……",
      th: "หลังคุณปู่หวังเป็นอัมพาต กำลังฟื้นฟูสมรรถภาพอยู่ นักกายภาพบำบัดสอนให้ทำกายบริหารข้อมือข้อเท้าทุกวัน อ้าวเป่าต้องช่วยปู่ทำตามและให้กำลังใจไม่ให้ท้อ...",
      vi: "Sau khi ông Wang bị đột quỵ, ông đang phục hồi, kỹ thuật viên vật lý trị liệu hướng dẫn tập khớp tay chân hàng ngày. Aobao phải giúp ông hoàn thành bài tập, động viên không bỏ cuộc...",
      id: "Setelah Kakek Wang stroke, sedang menjalani rehabilitasi. Fisioterapis mengajarkan gerakan sendi tangan dan kaki setiap hari. Aobao perlu membantu Kakek menyelesaikan latihan, menyemangati agar tidak menyerah...",
    },
  },
  mtcAlignment: { books: ["B3-L08"], topics: ["rehabilitation", "exercise"] },
  vocabularies: [
    { hanzi: "復健", zhuyin: "ㄈㄨˋ ㄐㄧㄢˋ", pinyin: "fùjiàn", partOfSpeech: "n/v.", translations: { th: "ฟื้นฟูสมรรถภาพ/กายภาพ", en: "rehabilitation" }, category: "medical", tags: ["therapy"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "中風", zhuyin: "ㄓㄨㄥˋ ㄈㄥ", pinyin: "zhòng fēng", partOfSpeech: "v/n.", translations: { th: "เป็นอัมพาต/สโตรก", en: "stroke" }, category: "medical", tags: ["disease"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "關節", zhuyin: "ㄍㄨㄢ ㄐㄧㄝˊ", pinyin: "guānjié", partOfSpeech: "n.", translations: { th: "ข้อต่อ", en: "joint" }, category: "body", tags: ["body"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "運動", zhuyin: "ㄩㄣˋ ㄉㄨㄥˋ", pinyin: "yùndòng", partOfSpeech: "n/v.", translations: { th: "การออกกำลังกาย", en: "exercise" }, category: "daily", tags: ["activity"], difficulty: 1 },
    { hanzi: "練習", zhuyin: "ㄌㄧㄢˋ ㄒㄧˊ", pinyin: "liànxí", partOfSpeech: "v/n.", translations: { th: "ฝึกซ้อม", en: "to practice" }, category: "daily", tags: ["activity"], difficulty: 1 },
    { hanzi: "鼓勵", zhuyin: "ㄍㄨˇ ㄌㄧˋ", pinyin: "gǔlì", partOfSpeech: "v.", translations: { th: "ให้กำลังใจ", en: "to encourage" }, category: "communication", tags: ["motivation"], difficulty: 2 },
    { hanzi: "放棄", zhuyin: "ㄈㄤˋ ㄑㄧˋ", pinyin: "fàngqì", partOfSpeech: "v.", translations: { th: "ยอมแพ้/ละทิ้ง", en: "to give up" }, category: "emotion", tags: ["determination"], difficulty: 2 },
    { hanzi: "彎曲", zhuyin: "ㄨㄢ ㄑㄩ", pinyin: "wānqū", partOfSpeech: "v.", translations: { th: "งอ/โค้ง", en: "to bend" }, category: "movement", tags: ["movement"], difficulty: 2 },
    { hanzi: "伸直", zhuyin: "ㄕㄣ ㄓˊ", pinyin: "shēnzhí", partOfSpeech: "v.", translations: { th: "เหยียดตรง", en: "to stretch" }, category: "movement", tags: ["movement"], difficulty: 2 },
    { hanzi: "物理治療", zhuyin: "ㄨˋ ㄌㄧˇ ㄓˋ ㄌㄧㄠˊ", pinyin: "wùlǐ zhìliáo", partOfSpeech: "n.", translations: { th: "กายภาพบำบัด", en: "physical therapy" }, category: "medical", tags: ["therapy"], difficulty: 3, isEldercareVocab: true },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿公，今天要練習手關節運動。慢慢彎曲，再伸直。", pinyin: "ā gōng, jīntiān yào liànxí shǒu guānjié yùndòng. mànman wānqū, zài shēnzhí.", translationI18n: { th: "คุณปู่ วันนี้เราต้องฝึกข้อต่อมือ ค่อยๆ งอแล้วเหยียดตรงนะคะ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "我手很沒力，做不來。", pinyin: "wǒ shǒu hěn méi lì, zuò bù lái.", translationI18n: { th: "มือฉันไม่มีแรง ทำไม่ได้" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "阿公不要放棄。慢慢來，每天進步一點點。", pinyin: "ā gōng bú yào fàngqì. mànman lái, měitiān jìnbù yīdiǎndiǎn.", translationI18n: { th: "คุณปู่อย่ายอมแพ้นะคะ ค่อยๆ ทำ ทุกวันจะดีขึ้นทีละนิดค่ะ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "好，我試試看。", pinyin: "hǎo, wǒ shìshì kàn.", translationI18n: { th: "ได้ ฉันลองดู" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "很好！您做得很好！物理治療師會看到您的努力。", pinyin: "hěn hǎo! nín zuò de hěn hǎo! wùlǐ zhìliáo shī huì kàn dào nín de nǔlì.", translationI18n: { th: "ดีมาก! คุณปู่ทำได้ดีมาก! นักกายภาพจะเห็นความพยายามของคุณปู่ค่ะ" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 3, prompt: { symbol: "復健", hanzi: "復健", pinyin: "fùjiàn" }, options: [{ value: "ฟื้นฟูสมรรถภาพ" }, { value: "วัดความดัน" }, { value: "ทานยา" }, { value: "ตรวจร่างกาย" }], answer: { value: "ฟื้นฟูสมรรถภาพ" }, explanationI18n: { "zh-TW": "「復健」= rehabilitation，中風、骨折等病後恢復功能的訓練。", th: "「復健 fùjiàn」= ฟื้นฟูสมรรถภาพ การฝึกหลังป่วย" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/中風", instructionKey: "listenPickHanzi" }, options: [{ value: "中風" }, { value: "感冒" }, { value: "復健" }, { value: "頭暈" }], answer: { value: "中風" }, audioUrl: "/api/audio/vocab/中風", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "ให้กำลังใจ", instructionKey: "thaiToHanzi" }, options: [{ value: "鼓勵" }, { value: "放棄" }, { value: "練習" }, { value: "復健" }], answer: { value: "鼓勵" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["阿公不要", "___", "，慢慢來，每天進步一點點。"], sentencePinyin: "ā gōng bú yào ___, mànman lái, měitiān jìnbù yīdiǎndiǎn.", translationI18n: { th: "คุณปู่อย่ายอมแพ้ ค่อยๆ ทำ ทุกวันจะดีขึ้นทีละนิด" }, instructionKey: "fillBlank" }, options: [{ value: "放棄" }, { value: "鼓勵" }, { value: "練習" }, { value: "彎曲" }], answer: { value: "放棄" }, explanationI18n: { "zh-TW": "復健是長期過程，鼓勵長輩不要放棄是照服員的重要任務。", th: "การฟื้นฟูใช้เวลานาน ให้กำลังใจไม่ให้ท้อสำคัญมาก" }, skillsTrained: ["grammar", "vocab"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["慢慢", "彎曲", "，", "再", "伸直"], targetTranslationI18n: { th: "ค่อยๆ งอ แล้วเหยียดตรง" }, instructionKey: "arrangeWords" }, options: [{ value: "慢慢" }, { value: "彎曲" }, { value: "，" }, { value: "再" }, { value: "伸直" }], answer: { value: ["慢慢", "彎曲", "，", "再", "伸直"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S08/1", questionI18n: { "zh-TW": "歐寶怎麼鼓勵阿公？", th: "อ้าวเป่าให้กำลังใจคุณปู่ยังไง?" } }, options: [{ value: "慢慢來，每天進步一點點" }, { value: "做不到沒關係" }, { value: "等護士來做" }, { value: "改天再做" }], answer: { value: "慢慢來，每天進步一點點" }, audioUrl: "/api/audio/dialogue/L3-S08/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "阿公不要放棄，慢慢來，每天進步一點點。", pinyin: "ā gōng bú yào fàngqì, mànman lái, měitiān jìnbù yīdiǎndiǎn.", audioUrl: "/api/audio/sentence/L3-S08-encourage", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "復", pinyin: "fù", translationI18n: { th: "กลับมา/ฟื้น" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "復" }, skillsTrained: ["writing"] },
  ],
};
