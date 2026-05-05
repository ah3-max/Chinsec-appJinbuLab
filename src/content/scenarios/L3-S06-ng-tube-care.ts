// L3-S06 鼻胃管照護基礎
import { ExerciseType, Level } from "@prisma/client";
import type { ScenarioDef } from "./_types";

export const L3_S06: ScenarioDef = {
  code: "L3-S06",
  level: Level.B1_INTERMEDIATE,
  orderIndex: 6,
  title: "鼻胃管照護基礎",
  titleI18n: { "zh-TW": "鼻胃管照護基礎", th: "การดูแลสายให้อาหารทางจมูกเบื้องต้น", vi: "Chăm sóc ống thông mũi-dạ dày cơ bản", id: "Perawatan Dasar Selang NGT" },
  estimatedMinutes: 35,
  prerequisiteCode: "L3-S05",
  hookContent: {
    storyTextI18n: {
      "zh-TW": "張阿公裝有鼻胃管，今天歐寶要協助管灌進食。她要先確認管路位置正確、灌奶速度不能太快、灌完要保持半坐臥 30 分鐘避免逆流……",
      th: "คุณปู่จางใส่สายให้อาหารทางจมูก วันนี้อ้าวเป่าต้องช่วยป้อนอาหารผ่านสาย ต้องตรวจสอบตำแหน่งสายให้ถูกต้อง ความเร็วในการให้นมไม่เร็วเกินไป หลังป้อนเสร็จต้องให้ปู่อยู่ในท่ากึ่งนั่งกึ่งนอน 30 นาที เพื่อไม่ให้กรดไหลย้อน...",
      vi: "Ông Trương đặt ống thông mũi-dạ dày, hôm nay Aobao phải giúp cho ăn qua ống. Cô cần kiểm tra vị trí ống đúng, tốc độ cho sữa không quá nhanh, sau khi cho ăn phải giữ tư thế nửa ngồi 30 phút để tránh trào ngược...",
      id: "Kakek Zhang dipasang selang NGT, hari ini Aobao harus membantu memberi makan melalui selang. Dia perlu memastikan posisi selang benar, kecepatan memasukkan susu tidak terlalu cepat, setelah selesai harus posisi setengah duduk 30 menit untuk hindari refluks...",
    },
  },
  mtcAlignment: { books: ["B3-L06"], topics: ["NG-tube", "feeding", "nursing"] },
  vocabularies: [
    { hanzi: "鼻胃管", zhuyin: "ㄅㄧˊ ㄨㄟˋ ㄍㄨㄢˇ", pinyin: "bí wèi guǎn", partOfSpeech: "n.", translations: { th: "สายให้อาหารทางจมูก/NGT", en: "nasogastric tube" }, category: "medical", tags: ["medical", "device"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "管灌", zhuyin: "ㄍㄨㄢˇ ㄍㄨㄢˋ", pinyin: "guǎn guàn", partOfSpeech: "v.", translations: { th: "ให้อาหารทางสาย", en: "tube feeding" }, category: "medical", tags: ["nursing"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "灌奶", zhuyin: "ㄍㄨㄢˋ ㄋㄞˇ", pinyin: "guàn nǎi", partOfSpeech: "v.", translations: { th: "ให้นมทางสาย", en: "tube feed milk" }, category: "medical", tags: ["nursing"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "速度", zhuyin: "ㄙㄨˋ ㄉㄨˋ", pinyin: "sùdù", partOfSpeech: "n.", translations: { th: "ความเร็ว", en: "speed" }, category: "daily", tags: ["measure"], difficulty: 2 },
    { hanzi: "位置", zhuyin: "ㄨㄟˋ ㄓˋ", pinyin: "wèizhì", partOfSpeech: "n.", translations: { th: "ตำแหน่ง", en: "position" }, category: "daily", tags: ["place"], difficulty: 2 },
    { hanzi: "半坐臥", zhuyin: "ㄅㄢˋ ㄗㄨㄛˋ ㄨㄛˋ", pinyin: "bàn zuò wò", partOfSpeech: "n.", translations: { th: "ท่ากึ่งนั่งกึ่งนอน", en: "semi-Fowler position" }, category: "medical", tags: ["nursing"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "逆流", zhuyin: "ㄋㄧˋ ㄌㄧㄡˊ", pinyin: "nìliú", partOfSpeech: "v/n.", translations: { th: "กรดไหลย้อน", en: "reflux" }, category: "medical", tags: ["risk"], difficulty: 3, isEldercareVocab: true },
    { hanzi: "嗆到", zhuyin: "ㄑㄧㄤˋ ㄉㄠˋ", pinyin: "qiàng dào", partOfSpeech: "v.", translations: { th: "สำลัก", en: "to choke" }, category: "medical", tags: ["risk"], difficulty: 2, isEldercareVocab: true },
    { hanzi: "確保", zhuyin: "ㄑㄩㄝˋ ㄅㄠˇ", pinyin: "quèbǎo", partOfSpeech: "v.", translations: { th: "ทำให้แน่ใจ/ให้แน่ใจว่า", en: "to ensure" }, category: "work", tags: ["check"], difficulty: 2 },
    { hanzi: "標準", zhuyin: "ㄅㄧㄠ ㄓㄨㄣˇ", pinyin: "biāozhǔn", partOfSpeech: "n/adj.", translations: { th: "มาตรฐาน", en: "standard" }, category: "work", tags: ["protocol"], difficulty: 2 },
  ],
  dialogue: [
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "李護士，我要為張阿公管灌，請您指導一下。", pinyin: "Lǐ hùshi, wǒ yào wèi Zhāng ā gōng guǎn guàn, qǐng nín zhǐdǎo yīxià.", translationI18n: { th: "พยาบาลหลี่ค่ะ หนูต้องป้อนอาหารทางสายให้คุณปู่จาง ช่วยแนะนำหน่อยค่ะ" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "好。第一步，先確認鼻胃管位置正確。", pinyin: "hǎo. dì yī bù, xiān quèrèn bí wèi guǎn wèizhì zhèngquè.", translationI18n: { th: "ดี ขั้นแรก ตรวจตำแหน่งสายก่อน" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "好。然後灌奶的速度要怎麼控制？", pinyin: "hǎo. ránhòu guàn nǎi de sùdù yào zěnme kòngzhì?", translationI18n: { th: "ค่ะ แล้วความเร็วในการให้นมต้องควบคุมยังไงคะ?" } },
    { speaker: "colleague", speakerLabel: { "zh-TW": "李護士", th: "พยาบาลหลี่" }, hanzi: "速度不能太快，避免阿公嗆到。標準是 30 分鐘灌完 200 毫升。", pinyin: "sùdù bù néng tài kuài, bìmiǎn ā gōng qiàng dào. biāozhǔn shì 30 fēnzhōng guànwán 200 háoshēng.", translationI18n: { th: "ความเร็วต้องไม่เร็วเกินไป กันสำลัก มาตรฐานคือใน 30 นาทีให้ 200 มิลลิลิตร" } },
    { speaker: "learner", speakerLabel: { "zh-TW": "歐寶", th: "โอบาว" }, hanzi: "灌完讓阿公保持半坐臥 30 分鐘，避免逆流，對嗎？", pinyin: "guànwán ràng ā gōng bǎochí bàn zuò wò 30 fēnzhōng, bìmiǎn nìliú, duì ma?", translationI18n: { th: "พอให้เสร็จแล้ว ให้คุณปู่อยู่ท่ากึ่งนั่งกึ่งนอน 30 นาที เพื่อไม่ให้กรดไหลย้อน ใช่ไหมคะ?" } },
  ],
  exercises: [
    { type: ExerciseType.VOCAB_MCQ, difficulty: 3, prompt: { symbol: "鼻胃管", hanzi: "鼻胃管", pinyin: "bí wèi guǎn" }, options: [{ value: "สายให้อาหารทางจมูก" }, { value: "เครื่องช่วยหายใจ" }, { value: "สายน้ำเกลือ" }, { value: "เข็มฉีดยา" }], answer: { value: "สายให้อาหารทางจมูก" }, explanationI18n: { "zh-TW": "「鼻胃管」= NG tube，從鼻子放入胃部給食物或藥物的管路。", th: "「鼻胃管 bí wèi guǎn」= สายให้อาหารทางจมูก ใส่จากจมูกไปกระเพาะ" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.VOCAB_LISTEN_CHOOSE, difficulty: 2, prompt: { audioUrl: "/api/audio/vocab/逆流", instructionKey: "listenPickHanzi" }, options: [{ value: "逆流" }, { value: "嗆到" }, { value: "管灌" }, { value: "速度" }], answer: { value: "逆流" }, audioUrl: "/api/audio/vocab/逆流", skillsTrained: ["listening"] },
    { type: ExerciseType.VOCAB_MCQ_REVERSE, difficulty: 2, prompt: { thai: "สำลัก", instructionKey: "thaiToHanzi" }, options: [{ value: "嗆到" }, { value: "逆流" }, { value: "頭暈" }, { value: "想吐" }], answer: { value: "嗆到" }, skillsTrained: ["vocab"] },
    { type: ExerciseType.GRAMMAR_FILL, difficulty: 3, prompt: { sentenceParts: ["速度不能太快，", "___", "阿公嗆到。"], sentencePinyin: "sùdù bù néng tài kuài, ___ ā gōng qiàng dào.", translationI18n: { th: "ความเร็วต้องไม่เร็วเกินไป เพื่อไม่ให้คุณปู่สำลัก" }, instructionKey: "fillBlank" }, options: [{ value: "避免" }, { value: "因為" }, { value: "如果" }, { value: "但是" }], answer: { value: "避免" }, explanationI18n: { "zh-TW": "「避免 + 動詞」= 防止、不讓某事發生，B1 護理常用句型。", th: "「避免 + กริยา」= เพื่อหลีกเลี่ยง/ไม่ให้... รูปประโยคทางการแพทย์" }, skillsTrained: ["grammar", "vocab"] },
    { type: ExerciseType.GRAMMAR_ARRANGE, difficulty: 3, prompt: { words: ["灌完", "保持", "半坐臥", "30 分鐘"], targetTranslationI18n: { th: "พอให้เสร็จแล้วอยู่ท่ากึ่งนั่งกึ่งนอน 30 นาที" }, instructionKey: "arrangeWords" }, options: [{ value: "灌完" }, { value: "保持" }, { value: "半坐臥" }, { value: "30 分鐘" }], answer: { value: ["灌完", "保持", "半坐臥", "30 分鐘"] }, skillsTrained: ["grammar"] },
    { type: ExerciseType.LISTEN_DIALOGUE_MCQ, difficulty: 3, prompt: { audioUrl: "/api/audio/dialogue/L3-S06/1", questionI18n: { "zh-TW": "為什麼灌完要保持半坐臥 30 分鐘？", th: "ทำไมต้องอยู่ท่ากึ่งนั่งกึ่งนอน 30 นาทีหลังป้อน?" } }, options: [{ value: "避免逆流" }, { value: "防止跌倒" }, { value: "讓阿公睡覺" }, { value: "等護士來" }], answer: { value: "避免逆流" }, audioUrl: "/api/audio/dialogue/L3-S06/1", skillsTrained: ["listening", "comprehension"] },
    { type: ExerciseType.SPEAK_REPEAT, difficulty: 3, prompt: { hanzi: "灌完保持半坐臥 30 分鐘，避免逆流。", pinyin: "guànwán bǎochí bàn zuò wò 30 fēnzhōng, bìmiǎn nìliú.", audioUrl: "/api/audio/sentence/L3-S06-tube", instructionKey: "speakRepeat", notSupported: true }, options: [], answer: { value: "ok" }, skillsTrained: ["speaking"] },
    { type: ExerciseType.WRITE_HANZI, difficulty: 3, prompt: { targetHanzi: "管", pinyin: "guǎn", translationI18n: { th: "ท่อ/สาย" }, instructionKey: "writeHanzi", notSupported: true }, options: [], answer: { value: "管" }, skillsTrained: ["writing"] },
  ],
};
