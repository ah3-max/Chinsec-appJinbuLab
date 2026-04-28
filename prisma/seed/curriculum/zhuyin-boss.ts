// ZHUYIN-BOSS MockExam: a comprehensive 50-question test that draws
// dynamically from the Zhuyin exercise pool at attempt time. We seed the
// MockExam shell here; questions live on Exercise rows and are sampled by
// /api/learn/boss-exam/start.

import type { PrismaClient } from "@prisma/client";
import { ExamType, Level } from "@prisma/client";

const BOSS_CODE = "ZHUYIN-BOSS";

export async function seedZhuyinBossExam(prisma: PrismaClient): Promise<string> {
  const exam = await prisma.mockExam.upsert({
    where: { code: BOSS_CODE },
    update: {
      title: "注音預備班 Boss 通關",
      titleI18n: {
        th: "บอสปลายทางจู้อิน",
        vi: "Boss vượt ải Bopomofo",
        id: "Boss Akhir Zhuyin",
        en: "Zhuyin Boss Exam",
      },
      description: "綜合測驗:聽音、辨符號、辨聲調 — 50 題,通過 80% 升級到 A1",
      durationMin: 30,
      passingScore: 40,
      maxScore: 50,
      totalQuestions: 50,
      isPublished: true,
      isActive: true,
      issueCertificate: true,
    },
    create: {
      code: BOSS_CODE,
      title: "注音預備班 Boss 通關",
      titleI18n: {
        th: "บอสปลายทางจู้อิน",
        vi: "Boss vượt ải Bopomofo",
        id: "Boss Akhir Zhuyin",
        en: "Zhuyin Boss Exam",
      },
      description: "綜合測驗:聽音、辨符號、辨聲調 — 50 題,通過 80% 升級到 A1",
      level: Level.ZHUYIN,
      type: ExamType.COMPREHENSIVE,
      totalQuestions: 50,
      durationMin: 30,
      passingScore: 40,
      maxScore: 50,
      isPublished: true,
      isActive: true,
      issueCertificate: true,
    },
    select: { id: true },
  });
  return exam.id;
}

export const ZHUYIN_BOSS_CODE = BOSS_CODE;
