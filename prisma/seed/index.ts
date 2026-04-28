/**
 * Prisma Seed — 初始化種子資料
 *
 * 執行: npm run db:seed
 *
 * 內容:
 * 1. 養老院 (愛愛院、湖水綠)
 * 2. 預設管理員帳號 (順元)
 * 3. 注音符號 37 個
 * 4. A1 入門級基本詞彙 (50 個示範)
 * 5. 養老院情境第一課
 */

import { PrismaClient, Level, UserRole, Nationality, CourseCategory } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedZhuyinStages } from "./curriculum/zhuyin-stages";
import { seedZhuyinLessons } from "./curriculum/zhuyin-lessons";
import { seedZhuyinExercises } from "./curriculum/zhuyin-exercises";
import { seedZhuyinBossExam } from "./curriculum/zhuyin-boss";
import { seedScenarioL1S01 } from "./scenarios/L1-S01";
import { seedScenarioL1S02 } from "./scenarios/L1-S02";
import { seedScenarioL1S03 } from "./scenarios/L1-S03";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 開始灌入種子資料...");

  // ----------------------------------------
  // 1. 養老院 (Facility)
  // ----------------------------------------
  console.log("📍 建立養老院...");
  const facilities = await Promise.all([
    prisma.facility.upsert({
      where: { code: "AAY-WH" },
      update: {},
      create: {
        code: "AAY-WH",
        name: "愛愛院（萬華）",
        shortName: "愛愛",
        group: "愛愛",
        address: "台北市萬華區",
      },
    }),
    prisma.facility.upsert({
      where: { code: "HSL-A20" },
      update: {},
      create: {
        code: "HSL-A20",
        name: "湖水綠 A20 養護中心",
        shortName: "湖水綠 A20",
        group: "湖水綠",
        bedCount: 400,
      },
    }),
  ]);
  console.log(`✓ ${facilities.length} 間養老院建立完成`);

  // ----------------------------------------
  // 2. 管理員帳號
  // ----------------------------------------
  console.log("👤 建立管理員帳號...");
  const adminPassword = await bcrypt.hash("ChangeMe@2026", 12);

  const admin = await prisma.user.upsert({
    where: { username: "shunyuan" },
    update: {},
    create: {
      username: "shunyuan",
      email: "shunyuan@example.com",
      passwordHash: adminPassword,
      fullName: "順元",
      nationality: Nationality.TW,
      nativeLanguage: "zh-TW",
      uiLanguage: "zh-TW",
      role: UserRole.SUPER_ADMIN,
      employeeId: "ADMIN-001",
      mustChangePassword: true,
    },
  });
  console.log(`✓ 管理員帳號建立: ${admin.username} (預設密碼: ChangeMe@2026 — 請首次登入後立即修改)`);

  // ----------------------------------------
  // 2b. 測試學員帳號 (供 impersonation / 多語介面測試用)
  // ----------------------------------------
  console.log("👥 建立測試學員帳號...");
  const learnerPassword = await bcrypt.hash("Test@2026", 12);
  const aayWh = facilities.find((f) => f.code === "AAY-WH");
  const testLearners = [
    {
      username: "testlearner_th",
      fullName: "ทดสอบ ภาษาไทย",
      nationality: Nationality.TH,
      nativeLanguage: "th",
      uiLanguage: "th",
    },
    {
      username: "testlearner_vi",
      fullName: "Kiểm Tra Tiếng Việt",
      nationality: Nationality.VN,
      nativeLanguage: "vi",
      uiLanguage: "vi",
    },
    {
      username: "testlearner_id",
      fullName: "Tes Bahasa Indonesia",
      nationality: Nationality.ID,
      nativeLanguage: "id",
      uiLanguage: "id",
    },
  ];
  for (const l of testLearners) {
    await prisma.user.upsert({
      where: { username: l.username },
      update: {
        // refresh names + facility on every seed run so spec changes land
        // without requiring a wipe.
        fullName: l.fullName,
        nationality: l.nationality,
        nativeLanguage: l.nativeLanguage,
        uiLanguage: l.uiLanguage,
        facilityId: aayWh?.id,
      },
      create: {
        ...l,
        passwordHash: learnerPassword,
        role: UserRole.LEARNER,
        currentLevel: Level.ZHUYIN,
        mustChangePassword: true,
        facilityId: aayWh?.id,
      },
    });
  }
  console.log(`✓ ${testLearners.length} 位測試學員建立 (密碼: Test@2026)`);

  // Aobao — 順元的伴侶,Path B 的第一個真實使用者。跳過注音班直接 A1。
  const aobaoPassword = await bcrypt.hash("Aobao@2026", 12);
  await prisma.user.upsert({
    where: { username: "aobao" },
    update: {
      fullName: "โอภาส (Aobao)",
      nationality: Nationality.TH,
      nativeLanguage: "th",
      uiLanguage: "th",
      currentLevel: Level.A1_BEGINNER,
      facilityId: aayWh?.id,
    },
    create: {
      username: "aobao",
      email: "aobao@aiai.org.tw",
      passwordHash: aobaoPassword,
      fullName: "โอภาส (Aobao)",
      nationality: Nationality.TH,
      nativeLanguage: "th",
      uiLanguage: "th",
      role: UserRole.LEARNER,
      currentLevel: Level.A1_BEGINNER,
      mustChangePassword: true,
      facilityId: aayWh?.id,
    },
  });
  console.log("✓ 歐寶帳號建立 (aobao / Aobao@2026, A1_BEGINNER, uiLanguage=th)");

  // ----------------------------------------
  // 3. 注音符號課程 (Course → Stage → Lessons)
  // ----------------------------------------
  console.log("📚 建立注音預備班課程...");
  const zhuyinCourse = await prisma.course.upsert({
    where: { code: "ZHUYIN" },
    update: {},
    create: {
      code: "ZHUYIN",
      title: "注音預備班 ㄅㄆㄇ",
      titleI18n: {
        th: "ห้องเตรียมจู้อิน ㄅㄆㄇ",
        vi: "Lớp dự bị Bopomofo ㄅㄆㄇ",
        id: "Kelas Persiapan Zhuyin ㄅㄆㄇ",
        en: "Zhuyin Preparation Class",
      },
      description: "從零開始學會台灣注音符號 37 個 + 4 聲調",
      level: Level.ZHUYIN,
      category: CourseCategory.ZHUYIN,
      estimatedHours: 20,
      vocabularyCount: 37,
      themeColor: "#A78BFA",
      orderIndex: 0,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  const stageCount = await seedZhuyinStages(prisma, zhuyinCourse.id);
  console.log(`✓ 注音預備班 + ${stageCount} 個階段建立完成 (Z1-Z9)`);

  const lessonCount = await seedZhuyinLessons(prisma);
  console.log(`✓ 注音預備班 ${lessonCount} 個課時建立完成`);

  const exStats = await seedZhuyinExercises(prisma);
  console.log(
    `✓ 注音預備班 ${exStats.total} 個練習題建立完成 (${Object.entries(
      exStats.byType,
    )
      .map(([k, v]) => `${k}=${v}`)
      .join(", ")})`,
  );

  await seedZhuyinBossExam(prisma);
  console.log(`✓ 注音預備班 Boss 考試建立完成 (ZHUYIN-BOSS, 50 題, 80% 通過)`);

  // ----------------------------------------
  // Path B 情境關卡(歐寶 A1)— 灌入 L1-S01 ~ L1-S03
  // ----------------------------------------
  console.log("🏥 灌入 A1 養老院情境關卡 (歐寶體驗版)...");
  const s01 = await seedScenarioL1S01(prisma);
  console.log(
    `✓ L1-S01 ${s01.vocabCount} 詞彙 + ${s01.exerciseCount} 練習題建立完成`,
  );
  const s02 = await seedScenarioL1S02(prisma);
  console.log(
    `✓ L1-S02 ${s02.vocabCount} 詞彙 + ${s02.exerciseCount} 練習題建立完成`,
  );
  const s03 = await seedScenarioL1S03(prisma);
  console.log(
    `✓ L1-S03 ${s03.vocabCount} 詞彙 + ${s03.exerciseCount} 練習題建立完成`,
  );

  // ----------------------------------------
  // 4. A1 入門級課程
  // ----------------------------------------
  console.log("📚 建立 A1 入門級課程...");
  const a1Course = await prisma.course.upsert({
    where: { code: "A1" },
    update: {},
    create: {
      code: "A1",
      title: "入門級 A1 — 從零開始說中文",
      titleI18n: {
        th: "ระดับเริ่มต้น A1 — เริ่มพูดภาษาจีนจากศูนย์",
        vi: "Cấp độ nhập môn A1 — Bắt đầu nói tiếng Trung từ con số 0",
        id: "Tingkat Pemula A1 — Mulai Berbicara Mandarin dari Nol",
        en: "Beginner A1 — Start Speaking Chinese from Zero",
      },
      description: "對應 TOCFL 1，500 字詞彙，60 小時學習內容",
      level: Level.A1_BEGINNER,
      category: CourseCategory.GENERAL,
      estimatedHours: 60,
      vocabularyCount: 500,
      tocflTarget: "TOCFL 1 (A1)",
      themeColor: "#60A5FA",
      orderIndex: 1,
      isPublished: true,
    },
  });
  console.log(`✓ A1 入門級建立完成`);

  // ----------------------------------------
  // 5. 養老院情境課程
  // ----------------------------------------
  console.log("📚 建立養老院情境課程...");
  const eldercareCourse = await prisma.course.upsert({
    where: { code: "SCENARIO-ELDERCARE" },
    update: {},
    create: {
      code: "SCENARIO-ELDERCARE",
      title: "養老院照護中文",
      titleI18n: {
        th: "ภาษาจีนสำหรับการดูแลผู้สูงอายุ",
        vi: "Tiếng Trung trong chăm sóc người cao tuổi",
        id: "Mandarin untuk Perawatan Lansia",
        en: "Chinese for Eldercare",
      },
      description: "從基本問候到專業照護術語，配合多級別並行學習",
      level: Level.A1_BEGINNER,
      category: CourseCategory.SCENARIO_ELDERCARE,
      estimatedHours: 40,
      vocabularyCount: 300,
      themeColor: "#10B981",
      orderIndex: 2,
      isPublished: true,
    },
  });
  console.log(`✓ 養老院情境課程建立完成`);

  // ----------------------------------------
  // 6. 起始詞彙 (示範 10 個養老院常用詞)
  // ----------------------------------------
  console.log("📖 灌入起始詞彙 (示範 10 個)...");
  const sampleVocabularies = [
    {
      hanzi: "你好",
      zhuyin: "ㄋㄧˇ ㄏㄠˇ",
      pinyin: "nǐ hǎo",
      partOfSpeech: "interj.",
      translations: { th: "สวัสดี", vi: "xin chào", id: "halo", en: "hello" },
      category: "greeting",
      tags: ["essential", "eldercare"],
    },
    {
      hanzi: "謝謝",
      zhuyin: "ㄒㄧㄝˋ ㄒㄧㄝ˙",
      pinyin: "xiè xie",
      partOfSpeech: "v.",
      translations: { th: "ขอบคุณ", vi: "cảm ơn", id: "terima kasih", en: "thank you" },
      category: "greeting",
      tags: ["essential", "eldercare"],
    },
    {
      hanzi: "對不起",
      zhuyin: "ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ",
      pinyin: "duì bù qǐ",
      partOfSpeech: "v.",
      translations: { th: "ขอโทษ", vi: "xin lỗi", id: "maaf", en: "sorry" },
      category: "greeting",
      tags: ["essential"],
    },
    {
      hanzi: "阿公",
      zhuyin: "ㄚ ㄍㄨㄥ",
      pinyin: "ā gōng",
      partOfSpeech: "n.",
      translations: { th: "คุณตา/คุณปู่", vi: "ông", id: "kakek", en: "grandfather" },
      category: "eldercare",
      tags: ["essential", "eldercare", "taiwan-local"],
    },
    {
      hanzi: "阿嬤",
      zhuyin: "ㄚ ㄇㄚˋ",
      pinyin: "ā mà",
      partOfSpeech: "n.",
      translations: { th: "คุณยาย", vi: "bà", id: "nenek", en: "grandmother" },
      category: "eldercare",
      tags: ["essential", "eldercare", "taiwan-local"],
    },
    {
      hanzi: "吃飯",
      zhuyin: "ㄔ ㄈㄢˋ",
      pinyin: "chī fàn",
      partOfSpeech: "v.",
      translations: { th: "กินข้าว", vi: "ăn cơm", id: "makan", en: "eat (a meal)" },
      category: "daily",
      tags: ["essential", "eldercare"],
    },
    {
      hanzi: "吃藥",
      zhuyin: "ㄔ ㄧㄠˋ",
      pinyin: "chī yào",
      partOfSpeech: "v.",
      translations: { th: "กินยา", vi: "uống thuốc", id: "minum obat", en: "take medicine" },
      category: "eldercare",
      tags: ["essential", "eldercare", "medical"],
    },
    {
      hanzi: "睡覺",
      zhuyin: "ㄕㄨㄟˋ ㄐㄧㄠˋ",
      pinyin: "shuì jiào",
      partOfSpeech: "v.",
      translations: { th: "นอน", vi: "ngủ", id: "tidur", en: "sleep" },
      category: "daily",
      tags: ["essential"],
    },
    {
      hanzi: "洗澡",
      zhuyin: "ㄒㄧˇ ㄗㄠˇ",
      pinyin: "xǐ zǎo",
      partOfSpeech: "v.",
      translations: { th: "อาบน้ำ", vi: "tắm", id: "mandi", en: "take a bath" },
      category: "eldercare",
      tags: ["essential", "eldercare"],
    },
    {
      hanzi: "廁所",
      zhuyin: "ㄘㄜˋ ㄙㄨㄛˇ",
      pinyin: "cè suǒ",
      partOfSpeech: "n.",
      translations: { th: "ห้องน้ำ", vi: "nhà vệ sinh", id: "toilet", en: "toilet" },
      category: "daily",
      tags: ["essential", "eldercare"],
    },
  ];

  for (const v of sampleVocabularies) {
    await prisma.vocabulary.upsert({
      where: { hanzi: v.hanzi },
      update: {
        // refresh translations / category / tags on every seed run.
        zhuyin: v.zhuyin,
        pinyin: v.pinyin,
        partOfSpeech: v.partOfSpeech,
        translations: v.translations,
        category: v.category,
        tags: v.tags,
        level: Level.A1_BEGINNER,
        tocflBand: "A1",
      },
      create: {
        ...v,
        level: Level.A1_BEGINNER,
        tocflBand: "A1",
      },
    });
  }
  console.log(`✓ ${sampleVocabularies.length} 個起始詞彙建立完成 (idempotent upsert)`);

  // ----------------------------------------
  // 完成
  // ----------------------------------------
  console.log("");
  console.log("🎉 種子資料灌入完成！");
  console.log("");
  console.log("📊 統計:");
  console.log(`   - 養老院: ${facilities.length} 間`);
  console.log(`   - 課程: 3 門 (注音 + A1 + 養老院情境)`);
  console.log(`   - 詞彙: ${sampleVocabularies.length} 個 (示範用)`);
  console.log(`   - 管理員: 1 位 (帳號: shunyuan)`);
  console.log("");
  console.log("🔑 預設登入:");
  console.log("   帳號: shunyuan");
  console.log("   密碼: ChangeMe@2026");
  console.log("   ⚠️  請首次登入後立即修改密碼");
  console.log("");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
