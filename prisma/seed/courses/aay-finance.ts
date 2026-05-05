/**
 * AAY-FINANCE 必修課 — 愛愛院財務報表詞彙對照表
 *
 * 來源:`/Users/.../Downloads/收支表詞彙對照表 中泰拼音.xlsx` (順元提供)
 * 結構:14 個類別(Stage) × 共 207 個詞彙
 *
 * 規格:
 *   - Course 等級 A2_BASIC、orderIndex = -1(永遠排在 ZHUYIN/A1 之前)
 *   - 每個類別一個 Stage,每個 Stage 一個 LessonType.VOCAB
 *   - 每個詞彙 → Vocabulary upsert(by hanzi) + LessonVocabulary
 *     + 一題 VOCAB_MCQ(中文 → 泰文翻譯)
 *
 * Pinyin 來自 Excel(已校對),zhuyin 留空字串 — 此課程是詞彙對照表,
 * 不教發音注音。
 */

import {
  PrismaClient,
  Level,
  CourseCategory,
  LessonType,
  ExerciseType,
} from "@prisma/client";
import data from "./aay-finance.data.json";

interface VocabRow {
  idx: number;
  hanzi: string;
  pinyin: string;
  thai: string;
  note: string;
}

interface StageRow {
  code: string;
  titleZh: string;
  titleEn: string;
  titleTh: string;
  items: VocabRow[];
}

interface CourseData {
  courseCode: string;
  titleZh: string;
  titleI18n: Record<string, string>;
  descriptionI18n: Record<string, string>;
  stages: StageRow[];
}

const COURSE = data as CourseData;

export async function seedAayFinance(prisma: PrismaClient) {
  // 1) Course
  const course = await prisma.course.upsert({
    where: { code: COURSE.courseCode },
    update: {
      title: COURSE.titleZh,
      titleI18n: COURSE.titleI18n,
      description: COURSE.descriptionI18n["zh-TW"],
      descriptionI18n: COURSE.descriptionI18n,
      // 必修課:對所有學員開放,跟 Level 線性進度脫鉤,所以放在 ZHUYIN
      // 等級(rank 0)。內容難度其實偏 A2,但這只是用來繞過 canAccess 的
      // gating;dashboard 會特別處理避免顯示成 "completed"。
      level: Level.ZHUYIN,
      category: CourseCategory.GENERAL,
      estimatedHours: 12,
      vocabularyCount: COURSE.stages.reduce((n, s) => n + s.items.length, 0),
      themeColor: "#F26B1F", // brand orange — 必修
      orderIndex: -1,
      isPublished: true,
      publishedAt: new Date(),
    },
    create: {
      code: COURSE.courseCode,
      title: COURSE.titleZh,
      titleI18n: COURSE.titleI18n,
      description: COURSE.descriptionI18n["zh-TW"],
      descriptionI18n: COURSE.descriptionI18n,
      // 必修課:對所有學員開放,跟 Level 線性進度脫鉤,所以放在 ZHUYIN
      // 等級(rank 0)。內容難度其實偏 A2,但這只是用來繞過 canAccess 的
      // gating;dashboard 會特別處理避免顯示成 "completed"。
      level: Level.ZHUYIN,
      category: CourseCategory.GENERAL,
      estimatedHours: 12,
      vocabularyCount: COURSE.stages.reduce((n, s) => n + s.items.length, 0),
      themeColor: "#F26B1F",
      orderIndex: -1,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  let stageOrder = 0;
  let totalVocab = 0;
  let totalExercises = 0;

  for (const s of COURSE.stages) {
    // 2) Stage
    const stage = await prisma.stage.upsert({
      where: { courseId_code: { courseId: course.id, code: s.code } },
      update: {
        title: s.titleZh,
        titleI18n: { th: s.titleTh, en: s.titleEn },
        description: `${s.items.length} 個詞彙 · ${s.titleEn}`,
        orderIndex: stageOrder,
        hasBossLevel: false,
      },
      create: {
        courseId: course.id,
        code: s.code,
        title: s.titleZh,
        titleI18n: { th: s.titleTh, en: s.titleEn },
        description: `${s.items.length} 個詞彙 · ${s.titleEn}`,
        orderIndex: stageOrder,
        hasBossLevel: false,
      },
    });
    stageOrder++;

    // 3) Lesson — one per stage, all vocab
    const lessonCode = `${s.code}-VOCAB`;
    const lessonContent = {
      type: "vocabulary-list",
      heading: s.titleZh,
      headingI18n: { th: s.titleTh, en: s.titleEn },
      items: s.items.map((it) => ({
        hanzi: it.hanzi,
        pinyin: it.pinyin,
        translations: { th: it.thai },
        note: it.note || undefined,
      })),
    };

    const lesson = await prisma.lesson.upsert({
      where: { stageId_code: { stageId: stage.id, code: lessonCode } },
      update: {
        title: s.titleZh,
        titleI18n: { th: s.titleTh, en: s.titleEn },
        description: `${s.items.length} 個必修詞彙`,
        type: LessonType.VOCAB,
        content: lessonContent,
        difficulty: 2,
        estimatedMinutes: Math.max(10, Math.ceil(s.items.length * 0.8)),
        xpReward: 10 + s.items.length,
        orderIndex: 0,
        isPublished: true,
      },
      create: {
        stageId: stage.id,
        code: lessonCode,
        title: s.titleZh,
        titleI18n: { th: s.titleTh, en: s.titleEn },
        description: `${s.items.length} 個必修詞彙`,
        type: LessonType.VOCAB,
        content: lessonContent,
        difficulty: 2,
        estimatedMinutes: Math.max(10, Math.ceil(s.items.length * 0.8)),
        xpReward: 10 + s.items.length,
        orderIndex: 0,
        isPublished: true,
      },
    });

    // 4) Vocabulary + LessonVocabulary (rebuild link table cleanly)
    await prisma.lessonVocabulary.deleteMany({ where: { lessonId: lesson.id } });

    // Wipe old auto-generated MCQs for this lesson before regenerating.
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });

    let i = 0;
    for (const it of s.items) {
      const vocab = await prisma.vocabulary.upsert({
        where: { hanzi: it.hanzi },
        update: {
          pinyin: it.pinyin,
          translations: { th: it.thai },
          partOfSpeech: null,
          level: Level.A2_BASIC,
          category: s.code.toLowerCase(),
          tags: ["finance", "aay-required", s.code.toLowerCase()],
          difficulty: 2,
          isEldercareVocab: false,
        },
        create: {
          hanzi: it.hanzi,
          zhuyin: "", // 此詞彙表不教注音,留空字串
          pinyin: it.pinyin,
          translations: { th: it.thai },
          level: Level.A2_BASIC,
          category: s.code.toLowerCase(),
          tags: ["finance", "aay-required", s.code.toLowerCase()],
          difficulty: 2,
          isEldercareVocab: false,
        },
      });

      await prisma.lessonVocabulary.create({
        data: {
          lessonId: lesson.id,
          vocabularyId: vocab.id,
          isCore: true,
          orderIndex: i,
        },
      });
      totalVocab++;

      // 5) Auto-generate VOCAB_MCQ — Hanzi → Thai meaning, with 3 distractors
      //    pulled from the same stage. (If stage has < 4 items we fall back
      //    to a different stage's items so the MCQ always has 4 options.)
      const distractorPool = s.items.filter((x) => x.hanzi !== it.hanzi);
      const distractorThais = pickN(
        distractorPool.map((x) => x.thai).filter((t): t is string => !!t),
        3,
      );

      // Pad if stage too small.
      while (distractorThais.length < 3) {
        distractorThais.push(`(${distractorThais.length + 1})`);
      }

      const allOptions = shuffle([it.thai, ...distractorThais]);

      const audioUrl = `/api/audio/vocab/${encodeURIComponent(it.hanzi)}`;
      await prisma.exercise.create({
        data: {
          lessonId: lesson.id,
          type: ExerciseType.VOCAB_MCQ,
          difficulty: 2,
          prompt: {
            // `symbol` is what the LessonRunner shows as the big card text.
            symbol: it.hanzi,
            hanzi: it.hanzi,
            pinyin: it.pinyin,
            audioUrl,
          },
          options: allOptions.map((v) => ({ value: v })),
          answer: { value: it.thai },
          audioUrl,
          isActive: true,
          maxScore: 1,
        },
      });
      totalExercises++;

      i++;
    }
  }

  return {
    courseCode: COURSE.courseCode,
    stages: COURSE.stages.length,
    vocab: totalVocab,
    exercises: totalExercises,
  };
}

function pickN<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a.slice(0, n);
}

function shuffle<T>(arr: T[]): T[] {
  return pickN(arr, arr.length);
}
