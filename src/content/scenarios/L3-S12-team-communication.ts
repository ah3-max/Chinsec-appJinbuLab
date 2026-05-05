// L3-S12 與專業團隊溝通
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S12: ScenarioDef = {
  code: "L3-S12",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 12,
  title: "與專業團隊溝通",
  titleI18n: { "zh-TW": "與專業團隊溝通", th: "การสื่อสารกับทีมวิชาชีพ", vi: "Giao tiếp với đội chuyên môn", id: "Komunikasi dengan Tim Profesional" },
  estimatedMinutes: 35,
  prerequisiteCode: "L3-S11",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "週會時，醫師、護理師、社工和歐寶一起討論王阿公的照護計畫。歐寶要清楚陳述觀察到的細節，並適當提出建議或疑問，以團隊合作為目標……",
      th: "ในการประชุมประจำสัปดาห์ หมอ พยาบาล นักสังคมสงเคราะห์ และอ้าวเป่า ร่วมประชุมแผนการดูแลคุณปู่หวัง อ้าวเป่าต้องบรรยายรายละเอียดที่สังเกตเห็นอย่างชัดเจน และเสนอความเห็นหรือคำถามอย่างเหมาะสม โดยมีเป้าหมายในการทำงานเป็นทีม...",
      vi: "Trong buổi họp tuần, bác sĩ, y tá, nhân viên xã hội và Aobao cùng thảo luận kế hoạch chăm sóc ông Wang. Aobao phải trình bày chi tiết quan sát rõ ràng, đề xuất ý kiến hoặc thắc mắc phù hợp, với mục tiêu hợp tác đội nhóm...",
      id: "Saat rapat mingguan, dokter, perawat, pekerja sosial, dan Aobao bersama membahas rencana perawatan Kakek Wang. Aobao perlu menjelaskan detail observasi dengan jelas, mengusulkan saran atau pertanyaan yang sesuai, dengan tujuan kerja sama tim...",
    },
  },
  mtcAlignment: { books: ["B3-L12"], topics: ["teamwork", "professional-communication"] },
  vocabularies: [
    { hanzi: "醫師", zhuyin: "ㄧ ㄕ", pinyin: "yīshī", partOfSpeech: "n.", translations: { th: "แพทย์/หมอ", en: "doctor" }, category: "person", tags: ["staff"], difficulty: 1, isEldercareVocab: true },
    { hanzi: "社工", zhuyin: "ㄕㄜˋ ㄍㄨㄥ", pinyin: "shègōng", partOfSpeech: "n.", translations: { th: "นักสังคมสงเคราะห์", en: "social worker" }, category: "person", tags: ["staff"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "團隊", zhuyin: "ㄊㄨㄢˊ ㄉㄨㄟˋ", pinyin: "tuánduì", partOfSpeech: "n.", translations: { th: "ทีม", en: "team" }, category: "work", tags: ["work"], difficulty: 2 },
    { hanzi: "計畫", zhuyin: "ㄐㄧˋ ㄏㄨㄚˋ", pinyin: "jìhuà", partOfSpeech: "n/v.", translations: { th: "แผน/วางแผน", en: "plan" }, category: "work", tags: ["planning"], difficulty: 2 },
    { hanzi: "陳述", zhuyin: "ㄔㄣˊ ㄕㄨˋ", pinyin: "chénshù", partOfSpeech: "v.", translations: { th: "เล่า/อธิบาย", en: "to state" }, category: "communication", tags: ["formal"], difficulty: 3 },
    { hanzi: "細節", zhuyin: "ㄒㄧˋ ㄐㄧㄝˊ", pinyin: "xìjié", partOfSpeech: "n.", translations: { th: "รายละเอียด", en: "detail" }, category: "abstract", tags: ["report"], difficulty: 2 },
    { hanzi: "提出", zhuyin: "ㄊㄧˊ ㄔㄨ", pinyin: "tíchū", partOfSpeech: "v.", translations: { th: "เสนอ", en: "to propose" }, category: "communication", tags: ["formal"], difficulty: 2 },
    { hanzi: "疑問", zhuyin: "ㄧˊ ㄨㄣˋ", pinyin: "yíwèn", partOfSpeech: "n.", translations: { th: "ข้อสงสัย/คำถาม", en: "question/doubt" }, category: "communication", tags: ["question"], difficulty: 2 },
    { hanzi: "合作", zhuyin: "ㄏㄜˊ ㄗㄨㄛˋ", pinyin: "hézuò", partOfSpeech: "v/n.", translations: { th: "ร่วมมือ", en: "to cooperate" }, category: "work", tags: ["work"], difficulty: 2 },
    { hanzi: "目標", zhuyin: "ㄇㄨˋ ㄅㄧㄠ", pinyin: "mùbiāo", partOfSpeech: "n.", translations: { th: "เป้าหมาย", en: "goal" }, category: "abstract", tags: ["work"], difficulty: 2 },
  ],
  dialogue: [
    { speaker: "colleague", speakerLabel: { "zh-TW": "陳醫師", th: "หมอเฉิน" }, hanzi: "歐寶，請陳述王阿公這週的細節觀察。", pinyin: "Ōubǎo, qǐng chénshù Wáng ā gōng zhè zhōu de xìjié guānchá.", translationI18n: { th: "อ้าวเป่า กรุณาเล่ารายละเอียดที่สังเกตของคุณปู่หวังในสัปดาห์นี้" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "陳醫師您好。阿公這週胃口不太好，咳嗽次數比上週多。", pinyin: "Chén yīshī nín hǎo. ā gōng zhè zhōu wèikǒu bú tài hǎo, késou cìshù bǐ shàng zhōu duō.", translationI18n: { th: "หมอเฉินสวัสดีค่ะ คุณปู่สัปดาห์นี้ความอยากอาหารไม่ค่อยดี และไอบ่อยกว่าสัปดาห์ก่อนค่ะ" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "我也觀察到他下午常常想睡覺，不太想動。", pinyin: "wǒ yě guānchá dào tā xiàwǔ chángcháng xiǎng shuì jiào, bú tài xiǎng dòng.", translationI18n: { th: "ฉันก็สังเกตว่าตอนบ่ายคุณปู่ง่วงนอนบ่อยและไม่ค่อยอยากขยับ" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "我有疑問，是否需要安排血液檢查？", pinyin: "wǒ yǒu yíwèn, shìfǒu xūyào ānpái xiěyè jiǎnchá?", translationI18n: { th: "หนูมีข้อสงสัยค่ะ จำเป็นต้องนัดเจาะเลือดตรวจไหมคะ?" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "陳醫師", th: "หมอเฉิน" }, hanzi: "好建議。我們團隊合作，目標是讓阿公早日康復。", pinyin: "hǎo jiànyì. wǒmen tuánduì hézuò, mùbiāo shì ràng ā gōng zǎorì kāngfù.", translationI18n: { th: "ข้อเสนอดีมาก เราทำงานเป็นทีมร่วมกัน เป้าหมายคือให้คุณปู่ฟื้นฟูเร็ววัน" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 2, prompt: { symbol: "細節", hanzi: "細節", pinyin: "xìjié" }, options: [{ value: "รายละเอียด" }, { value: "ภาพรวม" }, { value: "เป้าหมาย" }, { value: "แผน" }], answer: { value: "รายละเอียด" }, explanationI18n: { "zh-TW": "「細節」= detail，向專業團隊報告時要陳述細節。", th: "「細節 xìjié」= รายละเอียด ใช้เมื่อรายงานทีมวิชาชีพ" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/合作", instructionKey: "listenPickHanzi" }, options: [{ value: "合作" }, { value: "團隊" }, { value: "提出" }, { value: "陳述" }], answer: { value: "合作" }, audioUrl: "/api/audio/vocab/合作", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "เป้าหมาย", instructionKey: "thaiToHanzi" }, options: [{ value: "目標" }, { value: "計畫" }, { value: "細節" }, { value: "團隊" }], answer: { value: "目標" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["我有疑問，", "___", "需要安排血液檢查？"], sentencePinyin: "wǒ yǒu yíwèn, ___ xūyào ānpái xiěyè jiǎnchá?", translationI18n: { th: "หนูมีข้อสงสัย จำเป็นต้องนัดเจาะเลือดตรวจหรือไม่?" }, instructionKey: "fillBlank" }, options: [{ value: "是否" }, { value: "因為" }, { value: "如果" }, { value: "雖然" }], answer: { value: "是否" }, explanationI18n: { "zh-TW": "「是否 + 動詞」= whether ...，書面/正式場合詢問用法。", th: "「是否 + กริยา」= ว่า...หรือไม่ ใช้ในบริบทที่เป็นทางการ" }, skillsTrained: ["grammar"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["團隊合作", "，", "目標", "是", "讓阿公康復"], targetTranslationI18n: { th: "ทำงานเป็นทีม เป้าหมายคือให้คุณปู่ฟื้นฟู" }, instructionKey: "arrangeWords" }, options: [{ value: "團隊合作" }, { value: "，" }, { value: "目標" }, { value: "是" }, { value: "讓阿公康復" }], answer: { value: ["團隊合作", "，", "目標", "是", "讓阿公康復"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S12/1", questionI18n: { "zh-TW": "歐寶提出什麼建議？", th: "อ้าวเป่าเสนอข้อเสนออะไร?" } }, options: [{ value: "安排血液檢查" }, { value: "換醫院" }, { value: "出院回家" }, { value: "增加用藥" }], answer: { value: "安排血液檢查" }, audioUrl: "/api/audio/dialogue/L3-S12/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "我有疑問，是否需要安排血液檢查？", pinyin: "wǒ yǒu yíwèn, shìfǒu xūyào ānpái xiěyè jiǎnchá?", audioUrl: "/api/audio/sentence/L3-S12-question", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "團", pinyin: "tuán", translationI18n: { th: "กลุ่ม/ทีม" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "團" }, skillsTrained: ["writing"] },
  ],
};
