/**
 * AAY-JOBS 必修課 — 愛愛院職別對照表
 *
 * 來源：`/Users/.../Downloads/My AI/Chinese practice app/職別對照表 ตารางคำศัพท์ตำแหน่งงาน.xlsx`
 * 結構：4 個類別 (職別 / 任別 / 性別 / 學歷) × 55 個詞彙
 *
 * 規格與 AAY-FINANCE 相同：對所有學員開放、orderIndex = -1、
 * 一個 Stage 一個 LessonType.VOCAB Lesson、自動產生 VOCAB_MCQ。
 */

import {
  PrismaClient,
  Level,
  CourseCategory,
  LessonType,
  ExerciseType,
} from "@prisma/client";
import data from "./aay-jobs.data.json";

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

export async function seedAayJobs(prisma: PrismaClient) {
  const course = await prisma.course.upsert({
    where: { code: COURSE.courseCode },
    update: {
      title: COURSE.titleZh,
      titleI18n: COURSE.titleI18n,
      description: COURSE.descriptionI18n["zh-TW"],
      descriptionI18n: COURSE.descriptionI18n,
      level: Level.ZHUYIN,
      category: CourseCategory.GENERAL,
      estimatedHours: 4,
      vocabularyCount: COURSE.stages.reduce((n, s) => n + s.items.length, 0),
      themeColor: "#0D9488", // teal — distinct from finance orange
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
      level: Level.ZHUYIN,
      category: CourseCategory.GENERAL,
      estimatedHours: 4,
      vocabularyCount: COURSE.stages.reduce((n, s) => n + s.items.length, 0),
      themeColor: "#0D9488",
      orderIndex: -1,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  let stageOrder = 0;
  let totalVocab = 0;
  let totalExercises = 0;

  for (const s of COURSE.stages) {
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

    await prisma.lessonVocabulary.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });

    let i = 0;
    for (const it of s.items) {
      const vocab = await prisma.vocabulary.upsert({
        where: { hanzi: it.hanzi },
        update: {
          pinyin: it.pinyin,
          translations: { th: it.thai },
          partOfSpeech: null,
          level: Level.A1_BEGINNER,
          category: s.code.toLowerCase(),
          tags: ["jobs", "aay-required", s.code.toLowerCase()],
          difficulty: 2,
          isEldercareVocab: false,
        },
        create: {
          hanzi: it.hanzi,
          zhuyin: "",
          pinyin: it.pinyin,
          translations: { th: it.thai },
          level: Level.A1_BEGINNER,
          category: s.code.toLowerCase(),
          tags: ["jobs", "aay-required", s.code.toLowerCase()],
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

      const distractorPool = s.items.filter((x) => x.hanzi !== it.hanzi);
      const distractorThais = pickN(
        distractorPool.map((x) => x.thai).filter((t): t is string => !!t),
        3,
      );
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
