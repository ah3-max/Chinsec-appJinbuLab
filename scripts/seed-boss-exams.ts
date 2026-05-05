/**
 * Seed Boss exam metadata records for courses that have published exercises.
 *
 * The Boss exam endpoint (`/api/learn/boss-exam/start`) samples N random
 * exercises from the course pool — so we only need a MockExam row with the
 * matching `<COURSE_CODE>-BOSS` code, not pre-built questions.
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient, Level, ExamType } from "@prisma/client";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const db = new PrismaClient();

interface BossSpec {
  courseCode: string;
  level: Level;
  title: string;
  titleEn: string;
  titleTh: string;
  description: string;
  totalQuestions: number;
  durationMin: number;
}

const BOSS_EXAMS: BossSpec[] = [
  {
    courseCode: "AAY-FINANCE",
    level: Level.ZHUYIN, // Course is marked ZHUYIN level (required for everyone)
    title: "AAY-FINANCE Boss · 財務報表大考",
    titleEn: "AAY-FINANCE Boss · Financial Reports Mastery",
    titleTh: "บอสจบคอร์ส · การเงินบ้านพักคนชรา",
    description:
      "30 道隨機抽題,涵蓋全 14 個關卡。\n30 random questions sampled from all 14 stages.",
    totalQuestions: 30,
    durationMin: 25,
  },
  {
    courseCode: "A1",
    level: Level.A1_BEGINNER,
    title: "A1 Boss · 入門級畢業考",
    titleEn: "A1 Boss · Beginner Graduation",
    titleTh: "บอสจบ A1 · พื้นฐานเริ่มต้น",
    description:
      "30 道隨機抽題,跨 12 個關卡。\n30 random questions across all 12 stages.",
    totalQuestions: 30,
    durationMin: 25,
  },
];

async function seedOne(spec: BossSpec) {
  const code = `${spec.courseCode}-BOSS`;

  // Check that the source course has enough exercises in the pool
  const exerciseCount = await db.exercise.count({
    where: {
      isActive: true,
      lesson: {
        isPublished: true,
        stage: { course: { code: spec.courseCode } },
      },
    },
  });

  if (exerciseCount < 10) {
    console.log(`  ⏭  ${code}: only ${exerciseCount} exercises available, skipping`);
    return;
  }

  const target = Math.min(spec.totalQuestions, exerciseCount);
  const passingScore = Math.ceil(target * 0.8); // 80% to pass

  await db.mockExam.upsert({
    where: { code },
    create: {
      code,
      title: spec.title,
      titleI18n: { en: spec.titleEn, th: spec.titleTh },
      description: spec.description,
      level: spec.level,
      type: ExamType.COMPREHENSIVE,
      totalQuestions: target,
      durationMin: spec.durationMin,
      passingScore,
      maxScore: target * 10, // matches typical maxScore=10 per exercise
      issueCertificate: true,
      isActive: true,
      isPublished: true,
    },
    update: {
      title: spec.title,
      titleI18n: { en: spec.titleEn, th: spec.titleTh },
      description: spec.description,
      level: spec.level,
      totalQuestions: target,
      durationMin: spec.durationMin,
      passingScore,
      maxScore: target * 10,
      isActive: true,
      isPublished: true,
    },
  });

  console.log(`  ✅ ${code} — ${target} q (pool ${exerciseCount}), pass ${passingScore}/${target}`);
}

async function main() {
  console.log("=== Seeding Boss exam metadata ===\n");
  for (const spec of BOSS_EXAMS) {
    await seedOne(spec);
  }
  console.log("\n🎉 Done");
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
