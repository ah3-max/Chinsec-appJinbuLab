# 04_data_model.md — 資料模型 v2

> 此檔記錄 Prisma schema 主要 model 摘要、關聯關係、v1 → v2 遷移計畫。
> 改 schema 前必讀。

---

## 🗂️ Schema 模組分布

```
prisma/schema/
├── 00_config.prisma            generator + datasource
├── 01_auth.prisma              帳號權限 (User, Facility, Class, Session)
├── 02_curriculum.prisma        課程內容 (Course, Stage, Lesson, Vocab)
├── 03_exercise.prisma          練習題 (Exercise, UserAttempt, SrsSchedule)
├── 04_homework.prisma          作業 (Homework, Submission, PlagiarismCheck)
├── 05_speaking_writing.prisma  口說手寫 (SpeakingRecord, HandwritingRecord)
├── 06_exam_kpi.prisma          考試績效 (MockExam, Achievement, PerformanceMetric)
└── 07_ai_system.prisma         AI 系統 (AiConversation, AuditLog, Notification)
```

---

## 📊 v1 → v2 主要變更

### 變更 1：新增 Competency（能力指標）系統
**v1**：只記「完成哪課」
**v2**：記「會做什麼」+ 課程能力指標關聯

```prisma
// 新增 model
model Competency {
  id          String   @id @default(cuid())
  code        String   @unique          // COM-001, GREET-005
  category    String                    // greet/care/comm/emer/admin
  description String                    // "能對長輩說您早安"
  descriptionI18n Json?                 // 4 語翻譯
  level       Level                     // 對應級別
  
  scenarios   ScenarioCompetency[]
  unlocked    UserCompetency[]
}

model UserCompetency {
  userId        String
  user          User       @relation(fields: [userId], references: [id])
  competencyId  String
  competency    Competency @relation(fields: [competencyId], references: [id])
  unlockedAt    DateTime
  proficiencyLevel Int     @default(1)  // 1-5 熟練度
  lastUsedAt    DateTime?
  
  @@id([userId, competencyId])
}
```

### 變更 2：Scenario 獨立 model（取代原 Lesson 內嵌情境）
**v1**：Lesson 既是語言課也是情境
**v2**：Scenario 是養老院情境關卡，Lesson 是主軸語言課，兩者並列

```prisma
model Scenario {
  id          String   @id @default(cuid())
  code        String   @unique          // L1-S02
  title       String                    // 早安問候阿公阿嬤
  titleI18n   Json
  
  level       Level                     // A1_BEGINNER 等
  orderIndex  Int                       // 1-12 在該 Level 內的順序
  
  // 5 階段內容 (JSON 結構化)
  hookContent      Json                 // 故事引入
  vocabularies     ScenarioVocab[]      // 核心詞彙
  grammars         ScenarioGrammar[]
  dialogue         Json                 // 對話腳本
  exercises        Exercise[]           // 應用測驗
  
  // 解鎖條件
  prerequisiteScenarioId String?
  prerequisite     Scenario? @relation("ScenarioChain", fields: [prerequisiteScenarioId], references: [id])
  unlocks          Scenario[] @relation("ScenarioChain")
  
  // 能力指標
  competencies     ScenarioCompetency[]
  
  estimatedMinutes Int      @default(25)
  isPublished      Boolean  @default(false)
}

model ScenarioVocab {
  scenarioId    String
  vocabularyId  String
  isCore        Boolean  @default(true)
  orderIndex    Int
  
  @@id([scenarioId, vocabularyId])
}

model ScenarioCompetency {
  scenarioId   String
  competencyId String
  
  @@id([scenarioId, competencyId])
}
```

### 變更 3：UI Language Mode 新欄位
**v1**：只記 `uiLanguage`
**v2**：自動依等級切換 UI 模式

```prisma
model User {
  // 原有欄位...
  uiLanguage      String   @default("zh-TW")
  uiLanguageMode  UiLanguageMode @default(NATIVE)  // 自動依 currentLevel 計算
}

enum UiLanguageMode {
  NATIVE          // 純母語 (Level 0)
  NATIVE_FIRST    // 母語為主 (Level 1)
  BILINGUAL       // 雙語對照 (Level 2-3)
  IMMERSION       // 中文沉浸 (Level 4-6)
}
```

### 變更 4：Boss 通關證書系統
```prisma
model Certificate {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  level       Level
  type        CertificateType   // LEVEL_BOSS / SPECIAL_ACHIEVEMENT
  
  // 通過資料
  bossExamAttemptId String?
  scoreListening    Int
  scoreSpeaking     Int
  scoreReading      Int
  scoreWriting      Int
  totalScore        Int
  
  // 證書檔案
  pdfUrl       String?           // MinIO 路徑
  qrCode       String            // 驗證 QR code
  
  // 績效獎金連動
  bonusOneTime      Decimal? @db.Decimal(10, 2)
  monthlyAllowance  Decimal? @db.Decimal(10, 2)
  bonusPaidAt       DateTime?
  bonusPaidBy       String?       // HR 員工 ID
  
  issuedAt    DateTime @default(now())
  validUntil  DateTime?           // 預留有效期
  isRevoked   Boolean  @default(false)
}

enum CertificateType {
  LEVEL_BOSS              // 等級 Boss 通關
  SPECIAL_ACHIEVEMENT     // 特殊成就
  COMPETENCY_BUNDLE       // 能力組合認證
}
```

### 變更 5：Placement Test 入學測驗
```prisma
model PlacementTest {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  questions   Json     // 15 題完整內容
  answers     Json     // 學員作答
  
  scoreZhuyin    Int
  scoreA1        Int
  scoreA2        Int
  scoreB1        Int
  scoreB2        Int
  scoreC1        Int
  totalScore     Int
  
  recommendedLevel Level
  acceptedLevel    Level    // 學員接受的等級（可手動覆蓋）
  
  takenAt     DateTime @default(now())
}
```

### 變更 6：強制改密碼欄位
```prisma
model User {
  // 原有...
  mustChangePassword  Boolean  @default(false)
  passwordChangedAt   DateTime?
  passwordExpiresAt   DateTime?  // 預留密碼過期
}
```

### 變更 7：UserAttempt 改 exerciseId 為 optional
```prisma
model UserAttempt {
  // 原本: exerciseId String
  exerciseId        String?              // 改為 optional
  exerciseSnapshot  Json?                // 存題目快照（exercise 不存在時用）
  
  // 新增 sessionKey 串聯同一輪練習
  sessionKey        String?
  
  // 加 index
  @@index([userId, sessionKey])
}
```

---

## 🔗 主要關聯圖

```
User (帳號)
 ├─ Sessions (登入)
 ├─ Enrollments → Class
 ├─ UserAttempts (答題記錄)
 ├─ UserCompetencies (能力解鎖) ← 新增
 ├─ Certificates (證書) ← 新增
 ├─ PlacementTest (入學測驗) ← 新增
 ├─ SrsSchedules (間隔重複)
 ├─ SpeakingRecords / HandwritingRecords
 ├─ ExamAttempts
 ├─ PerformanceMetrics
 ├─ AiConversations
 └─ Notifications

Course (課程)
 └─ Stages → Lessons (主軸語言)
 └─ Scenarios (情境關卡) ← v2 新增獨立關聯

Scenario (情境關卡) ← 新 model
 ├─ ScenarioVocabs → Vocabulary
 ├─ ScenarioCompetencies → Competency
 ├─ Exercises (應用測驗)
 ├─ Prerequisites (前置情境)
 └─ Unlocks (解鎖後續情境)

Vocabulary (詞彙)
 ├─ LessonVocabularies (主軸用)
 ├─ ScenarioVocabs (情境用) ← 新增
 ├─ ExampleSentences
 └─ SrsSchedules

Facility (機構)
 ├─ Staff (User)
 ├─ Classes
 └─ Managers
```

---

## 📝 主要 Model 速查表

### User（使用者）
- **PK**：`id` (cuid)
- **Unique**：`username`, `email`, `employeeId`
- **必填**：`username`, `passwordHash`, `fullName`, `nationality`, `nativeLanguage`
- **角色**：LEARNER / TEACHER / FACILITY_MGR / HR / ADMIN / SUPER_ADMIN
- **預留接口**：`hrSyncId`, `ltcImsSyncId`, `externalIds`

### Course（課程）
- **代號規則**：`ZHUYIN`, `A1`, `A2`, `B1`, `B2`, `C1`, `C2`
- **每門課對應一個 Level**

### Scenario（情境關卡，v2 新增）
- **代號規則**：`L?-S??`（L1-S02 = Level 1 第 2 個情境）
- **每 Level 12 個 Scenario**

### Vocabulary（詞彙）
- **核心欄位**：hanzi, zhuyin, pinyin, level, category, translations
- **多媒體**：audioUrl, audioSlowUrl, imageUrl, strokeOrder
- **量級分類**：tocflBand (A1/A2/B1...)

### Exercise（練習題）
- **30 種題型**：詳見 `prisma/schema/03_exercise.prisma` ExerciseType enum
- **多型結構**：prompt, options, answer 都是 JSON

### UserAttempt（答題記錄，v2 改 optional exerciseId）
- **記錄**：每次答題的詳細資料
- **行為分析**：timeSpentSec, pasteCount, windowBlurCount

### Certificate（證書，v2 新增）
- **觸發**：Level Boss 通關
- **連動**：bonusOneTime, monthlyAllowance（HR 績效獎金）

---

## 🔢 Enum 速查

### Level（等級）
```
ZHUYIN < A1_BEGINNER < A2_BASIC < B1_INTERMEDIATE < B2_UPPER_INTER < C1_ADVANCED < C2_PROFICIENT
```

### UserRole（角色）
```
LEARNER < TEACHER < FACILITY_MGR < HR < ADMIN < SUPER_ADMIN
```

### Nationality（國籍）
```
TW / TH / VN / ID / PH / MY / KH / MM / OTHER
```

### ExerciseType（題型，30 種）
```
注音類: ZHUYIN_RECOGNITION, ZHUYIN_PRODUCTION, TONE_DISCRIMINATION, PRONUNCIATION
詞彙類: VOCAB_MCQ, VOCAB_MCQ_REVERSE, VOCAB_MATCH, VOCAB_LISTEN_CHOOSE, VOCAB_FLASHCARD
語法類: GRAMMAR_MCQ, GRAMMAR_FILL, GRAMMAR_ARRANGE, GRAMMAR_TRANSFORM
聽力類: LISTEN_DIALOGUE_MCQ, LISTEN_FILL, LISTEN_DICTATION
閱讀類: READ_COMPREHENSION, READ_TRUE_FALSE
口說類: SPEAK_REPEAT, SPEAK_RESPOND, SPEAK_DESCRIBE, SPEAK_DIALOGUE
寫作類: WRITE_HANZI, WRITE_SENTENCE, WRITE_PARAGRAPH, WRITE_COMPOSITION
互動類: DRAG_DROP, IMAGE_LABELING, SCENARIO_CHOICE
```

### CourseCategory
```
ZHUYIN              注音
GENERAL             通用級別 (主軸)
SCENARIO_ELDERCARE  養老院情境 (新主類)
EXAM_PREP           考試準備 (內部認證 / 未來 TOCFL)
```

⚠️ v1 有的 `SCENARIO_OFFICE` 與 `SCENARIO_DAILY` 在 v2 中**移除**——因為您決定全部 12 個情境都是養老院。

---

## 🚧 v1 → v2 遷移計畫

### 步驟 1：新增不破壞性的欄位
```bash
# 創建 migration
npx prisma migrate dev --name v2_add_must_change_password
npx prisma migrate dev --name v2_add_ui_language_mode
npx prisma migrate dev --name v2_attempt_exercise_optional
```

### 步驟 2：新增 model
```bash
npx prisma migrate dev --name v2_add_competency_system
npx prisma migrate dev --name v2_add_scenario_model
npx prisma migrate dev --name v2_add_certificate_model
npx prisma migrate dev --name v2_add_placement_test
```

### 步驟 3：資料遷移腳本
```typescript
// scripts/migrate-v1-to-v2.ts
// 1. 把現有 SCENARIO_ELDERCARE Course 拆成 12 個 Scenario
// 2. 為每個 Stage 自動建對應的 Competency
// 3. 為現有用戶補 mustChangePassword=true
// 4. 為現有 UserAttempt 補 exerciseSnapshot (從 exerciseId 反推)
```

### 步驟 4：移除廢棄的 enum 值
```sql
-- 等所有相關資料遷移完成後
-- ALTER TYPE "CourseCategory" 移除 SCENARIO_OFFICE / SCENARIO_DAILY
```

⚠️ **重要**：v1 已上線（Phase 1 完成），任何欄位變更必須走 migration，不能直接 drop。

---

## 📐 Schema 設計慣例

### 命名
- 表名：snake_case 複數（`user_attempts`）
- Model：PascalCase 單數（`UserAttempt`）
- Enum：UPPER_SNAKE_CASE
- 欄位：camelCase（DB 自動轉 snake_case）

### 必加欄位
- 所有 model 都要 `id` (cuid)
- 重要 model 加 `createdAt` + `updatedAt`
- 軟刪除用 `deletedAt`，不要硬刪

### 索引
- 外鍵自動有索引
- 高頻查詢欄位加 `@@index`
- 唯一查詢加 `@unique`

### JSON 欄位使用時機
- 動態結構（如 `prompt`, `options`, `answer`）
- 多語翻譯（`translations`, `titleI18n`）
- 不太查詢的元資料

### 不要做的事
- ❌ 用 `String` 存 JSON（用 `Json` 型別）
- ❌ 在 model 之間互相直接 fetch（透過 `include`）
- ❌ 用 string 比較等級（用 enum + 比較函式）
- ❌ 直接 update `currentLevel`（要走 promotion 邏輯）

---

## 🔍 常用查詢範例

### 取得學員當前可進入的關卡
```typescript
const accessibleScenarios = await prisma.scenario.findMany({
  where: {
    level: { in: getLevelsUpTo(user.currentLevel) },
    isPublished: true,
  },
  include: {
    vocabularies: { include: { vocabulary: true } },
    competencies: { include: { competency: true } },
    prerequisite: true,
  },
  orderBy: [{ level: 'asc' }, { orderIndex: 'asc' }],
});
```

### 計算學員的能力指標統計
```typescript
const competencyStats = await prisma.userCompetency.groupBy({
  by: ['competencyId'],
  where: { userId: user.id },
  _count: true,
});

const totalUnlocked = await prisma.userCompetency.count({
  where: { userId: user.id },
});
```

### 觸發 Boss 通關（含證書 + 績效）
```typescript
await prisma.$transaction(async (tx) => {
  // 1. 記錄考試成績
  const exam = await tx.examAttempt.create({ ... });
  
  // 2. 升級
  await tx.user.update({
    where: { id: user.id },
    data: { currentLevel: nextLevel },
  });
  
  // 3. 發證
  const cert = await tx.certificate.create({
    data: {
      userId: user.id,
      level: completedLevel,
      type: 'LEVEL_BOSS',
      ...scoreData,
      bonusOneTime: BONUS_TABLE[completedLevel].oneTime,
      monthlyAllowance: BONUS_TABLE[completedLevel].monthly,
    },
  });
  
  // 4. 通知 HR (Webhook)
  await tx.integrationSync.create({
    data: {
      targetSystem: 'hr-ims',
      syncType: 'bonus',
      payload: { userId, certificateId: cert.id },
      status: 'PENDING',
    },
  });
  
  // 5. 寄通知給學員
  await tx.notification.create({ ... });
});
```

---

**See also**：
- `prisma/schema/*.prisma` 完整 schema 檔
- `06_decisions.md` 為何選 Prisma 而非 Drizzle
- `07_known_issues.md` Schema 相關 known issues
