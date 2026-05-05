// L3-S10 帶活動：團康遊戲
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S10: ScenarioDef = {
  code: "L3-S10",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 10,
  title: "帶活動：團康遊戲",
  titleI18n: { "zh-TW": "帶活動：團康遊戲", th: "นำกิจกรรม: เกมกลุ่ม", vi: "Dẫn dắt hoạt động: trò chơi nhóm", id: "Memimpin Aktivitas: Permainan Kelompok" },
  estimatedMinutes: 30,
  prerequisiteCode: "L3-S09",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "今天下午有團康活動。歐寶要帶幾位長輩玩「丟沙包進框」的小遊戲，邀請大家參與，鼓勵動手動腦，過程中要注意安全與每位長輩的反應……",
      th: "บ่ายวันนี้มีกิจกรรมกลุ่ม อ้าวเป่าจะนำผู้สูงอายุเล่นเกม「ปาถุงทรายเข้ากล่อง」ชวนทุกคนเข้าร่วม กระตุ้นให้ขยับมือและสมอง ระหว่างเล่นต้องระวังเรื่องความปลอดภัยและสังเกตปฏิกิริยาของแต่ละคน...",
      vi: "Chiều nay có hoạt động nhóm. Aobao sẽ dẫn dắt mấy cụ chơi trò 「ném túi cát vào khung」, mời mọi người tham gia, khuyến khích vận động tay và đầu, chú ý an toàn và phản ứng của từng cụ...",
      id: "Sore ini ada aktivitas kelompok. Aobao akan memimpin para lansia bermain 「melempar kantong pasir ke kotak」, mengajak semua ikut, mendorong gerak tangan dan pikiran, sambil memperhatikan keamanan dan reaksi setiap lansia...",
    },
  },
  mtcAlignment: { books: ["B3-L10"], topics: ["activity", "group", "engagement"] },
  vocabularies: [
    { hanzi: "團康", zhuyin: "ㄊㄨㄢˊ ㄎㄤ", pinyin: "tuánkāng", partOfSpeech: "n.", translations: { th: "กิจกรรมกลุ่มสันทนาการ", en: "group recreation" }, category: "activity", tags: ["group"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "遊戲", zhuyin: "ㄧㄡˊ ㄒㄧˋ", pinyin: "yóuxì", partOfSpeech: "n.", translations: { th: "เกม", en: "game" }, category: "activity", tags: ["recreation"], difficulty: 1 },
    { hanzi: "邀請", zhuyin: "ㄧㄠ ㄑㄧㄥˇ", pinyin: "yāoqǐng", partOfSpeech: "v.", translations: { th: "เชิญ/ชวน", en: "to invite" }, category: "social", tags: ["invitation"], difficulty: 2 },
    { hanzi: "輪流", zhuyin: "ㄌㄨㄣˊ ㄌㄧㄡˊ", pinyin: "lúnliú", partOfSpeech: "v.", translations: { th: "ผลัดกัน/หมุนเวียน", en: "to take turns" }, category: "daily", tags: ["activity"], difficulty: 2 },
    { hanzi: "規則", zhuyin: "ㄍㄨㄟ ㄗㄜˊ", pinyin: "guīzé", partOfSpeech: "n.", translations: { th: "กฎ/ระเบียบ", en: "rules" }, category: "activity", tags: ["instruction"], difficulty: 2 },
    { hanzi: "丟", zhuyin: "ㄉㄧㄡ", pinyin: "diū", partOfSpeech: "v.", translations: { th: "โยน/ปา", en: "to throw" }, category: "movement", tags: ["movement"], difficulty: 1 },
    { hanzi: "沙包", zhuyin: "ㄕㄚ ㄅㄠ", pinyin: "shābāo", partOfSpeech: "n.", translations: { th: "ถุงทราย", en: "beanbag" }, category: "object", tags: ["game"], difficulty: 2 },
    { hanzi: "歡呼", zhuyin: "ㄏㄨㄢ ㄏㄨ", pinyin: "huānhū", partOfSpeech: "v.", translations: { th: "ปรบมือ/ไชโย", en: "to cheer" }, category: "emotion", tags: ["emotion"], difficulty: 2 },
    { hanzi: "氣氛", zhuyin: "ㄑㄧˋ ㄈㄣ", pinyin: "qìfēn", partOfSpeech: "n.", translations: { th: "บรรยากาศ", en: "atmosphere" }, category: "abstract", tags: ["mood"], difficulty: 2 },
    { hanzi: "開心", zhuyin: "ㄎㄞ ㄒㄧㄣ", pinyin: "kāixīn", partOfSpeech: "adj.", translations: { th: "สบายใจ/มีความสุข", en: "happy" }, category: "emotion", tags: ["emotion"], difficulty: 1 },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "各位阿公阿嬤，下午我們玩團康遊戲，邀請大家一起來。", pinyin: "gèwèi ā gōng ā mā, xiàwǔ wǒmen wán tuánkāng yóuxì, yāoqǐng dàjiā yīqǐ lái.", translationI18n: { th: "คุณปู่คุณยายทุกท่านค่ะ บ่ายนี้เราจะเล่นเกมกลุ่ม เชิญทุกท่านมาร่วมกันค่ะ" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "陳阿嬤", th: "คุณยายเฉิน" }, hanzi: "玩什麼？", pinyin: "wán shénme?", translationI18n: { th: "เล่นอะไรกัน?" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "丟沙包進框。規則簡單：每人輪流丟三次。", pinyin: "diū shābāo jìn kuàng. guīzé jiǎndān: měi rén lúnliú diū sān cì.", translationI18n: { th: "ปาถุงทรายเข้ากล่องค่ะ กฎง่ายๆ ทุกคนผลัดกันโยน 3 ครั้ง" } },
    { speaker: "elder", speakerLabel: { "zh-TW": "王阿公", th: "คุณปู่หวัง" }, hanzi: "我先試試看！", pinyin: "wǒ xiān shìshì kàn!", translationI18n: { th: "ฉันลองก่อน!" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好棒！大家給阿公歡呼！氣氛真好，看大家這麼開心，我也很高興。", pinyin: "hǎo bàng! dàjiā gěi ā gōng huānhū! qìfēn zhēn hǎo, kàn dàjiā zhème kāixīn, wǒ yě hěn gāoxìng.", translationI18n: { th: "เยี่ยมมาก! ทุกคนปรบมือให้คุณปู่หน่อยค่ะ! บรรยากาศดีมาก เห็นทุกคนมีความสุข หนูก็ดีใจค่ะ" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 2, prompt: { symbol: "團康", hanzi: "團康", pinyin: "tuánkāng" }, options: [{ value: "กิจกรรมกลุ่มสันทนาการ" }, { value: "การประชุม" }, { value: "การกายภาพ" }, { value: "การออกกำลัง" }], answer: { value: "กิจกรรมกลุ่มสันทนาการ" }, explanationI18n: { "zh-TW": "「團康」= group recreation activity，養老院增進社交與認知的活動。", th: "「團康 tuánkāng」= กิจกรรมกลุ่มสันทนาการ ช่วยกระตุ้นสังคมและสมอง" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/邀請", instructionKey: "listenPickHanzi" }, options: [{ value: "邀請" }, { value: "歡呼" }, { value: "輪流" }, { value: "規則" }], answer: { value: "邀請" }, audioUrl: "/api/audio/vocab/邀請", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "ผลัดกัน", instructionKey: "thaiToHanzi" }, options: [{ value: "輪流" }, { value: "邀請" }, { value: "歡呼" }, { value: "丟" }], answer: { value: "輪流" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["每人", "___", "丟三次。"], sentencePinyin: "měi rén ___ diū sān cì.", translationI18n: { th: "แต่ละคนผลัดกันโยน 3 ครั้ง" }, instructionKey: "fillBlank" }, options: [{ value: "輪流" }, { value: "馬上" }, { value: "一起" }, { value: "繼續" }], answer: { value: "輪流" }, explanationI18n: { "zh-TW": "「輪流 + 動詞」= take turns to ...，團體活動的常用句型。", th: "「輪流 + กริยา」= ผลัดกัน... ใช้ในกิจกรรมกลุ่ม" }, skillsTrained: ["grammar", "vocab"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["邀請", "大家", "一起", "來"], targetTranslationI18n: { th: "เชิญทุกคนมาร่วม" }, instructionKey: "arrangeWords" }, options: [{ value: "邀請" }, { value: "大家" }, { value: "一起" }, { value: "來" }], answer: { value: ["邀請", "大家", "一起", "來"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S10/1", questionI18n: { "zh-TW": "今天的團康遊戲是什麼？", th: "เกมกลุ่มวันนี้เล่นอะไร?" } }, options: [{ value: "丟沙包進框" }, { value: "唱歌比賽" }, { value: "猜謎語" }, { value: "下棋" }], answer: { value: "丟沙包進框" }, audioUrl: "/api/audio/dialogue/L3-S10/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "邀請大家一起來，每人輪流丟三次。", pinyin: "yāoqǐng dàjiā yīqǐ lái, měi rén lúnliú diū sān cì.", audioUrl: "/api/audio/sentence/L3-S10-game", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "遊", pinyin: "yóu", translationI18n: { th: "เล่น/ท่องเที่ยว" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "遊" }, skillsTrained: ["writing"] },
  ],
};
