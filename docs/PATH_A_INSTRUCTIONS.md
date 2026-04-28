路徑 A：注音班 (ZHUYIN) 完整化 — 從骨架到員工可用

═══════════════════════════════════════
工作模式
═══════════════════════════════════════
- 7 個 task 順序執行
- 每完成 1 個 task 立即 git commit
- 每 task 自我驗收後再下一個
- 遇到方向級問題才停下問順元
- 全程用 todo 工具追蹤進度
- 預估時間：2-3 天

═══════════════════════════════════════
背景與目標
═══════════════════════════════════════
注音班 (ZHUYIN Course) 目前架構就緒但內容空白：
- ✅ Course 已建（isPublished=true）
- ✅ 4 個 Stage 標題 (Z1-Z4)
- ✅ src/lib/zhuyin/data.ts 含 21 聲符 + 3 介符 + 13 韻符 + 5 聲調
- ✅ 157 個 mp3 在 MinIO
- ❌ Lessons 是空的
- ❌ Exercises 是空的（題型 component 已寫好，只缺 DB 資料）
- ❌ Z5-Z9 stages 不存在

目標：完成 Z1-Z9 全部內容，讓員工可以從注音零基礎學到通過 Boss 考試。
完成後 testlearner_th/vi/id 可走完完整 ZHUYIN 學習流程。

═══════════════════════════════════════
TASK 1：修 seed bug + 詞彙去重
═══════════════════════════════════════

【1.1 確認 seed bug】
cd "/Users/natpassornkaewkuljeerapat/Desktop/OPAL AI/chinese-learn"
export $(grep -E '^DATABASE_URL' .env.local | xargs)

執行：
  docker exec chinese-learn-postgres psql -U chinese_learn -d chinese_learn -c "SELECT hanzi, COUNT(*) FROM vocabularies GROUP BY hanzi HAVING COUNT(*) > 1;"

應該看到 10 個 hanzi 各重複 3 次。

【1.2 修 prisma/seed/index.ts】
把所有 vocabulary create 改成 upsert：
  await prisma.vocabulary.upsert({
    where: { hanzi: '...' },
    update: {},
    create: { hanzi: '...', zhuyin: '...', ... }
  });

確保 Vocabulary 的 hanzi 欄位有 @unique（檢查 prisma/schema/02_curriculum.prisma）：
若沒有，加上：
  hanzi  String  @unique
然後跑 npx prisma migrate dev --name vocabulary_hanzi_unique

【1.3 清理重複資料】
docker exec chinese-learn-postgres psql -U chinese_learn -d chinese_learn -c "
DELETE FROM vocabularies a USING vocabularies b
WHERE a.id > b.id AND a.hanzi = b.hanzi;
"

驗證：
  SELECT hanzi, COUNT(*) FROM vocabularies GROUP BY hanzi HAVING COUNT(*) > 1;
應該回 0 筆。

【1.4 重跑 seed 驗證冪等】
npm run db:seed
再次跑 1.3 的查詢，仍應 0 筆。

git commit -m "fix(seed): vocabulary upsert and dedupe by hanzi unique"

═══════════════════════════════════════
TASK 2：注音 stages 結構 (Z1-Z9)
═══════════════════════════════════════

【2.1 規劃 9 個 stages】
依 .claude-context/03_curriculum.md 的 Level 0 章節：

Z1 韻母基礎       (ㄚㄛㄜㄝ)         estimatedMin: 60
Z2 介符與複韻母   (ㄧㄨㄩ + ㄞㄟㄠㄡ) estimatedMin: 90
Z3 聲隨韻母+捲舌  (ㄢㄣㄤㄥㄦ)        estimatedMin: 90
Z4 聲符基礎       (ㄅㄆㄇㄈㄉㄊㄋㄌ)  estimatedMin: 120
Z5 聲符進階       (ㄍㄎㄏㄐㄑㄒ)      estimatedMin: 120
Z6 聲符高階       (ㄓㄔㄕㄖㄗㄘㄙ)    estimatedMin: 180
Z7 聲調系統       (1234 聲 + 輕聲)   estimatedMin: 120
Z8 結合韻完整     (22 個結合韻)      estimatedMin: 180
Z9 Boss 通關      (50 題綜合測驗)    estimatedMin: 60

【2.2 寫 prisma/seed/curriculum/zhuyin-stages.ts】
建立獨立 seed 模組，匯出 seedZhuyinStages(prisma, courseId)：
- 找 ZHUYIN course id
- upsert 9 個 Stage（用 code 作 unique）
- 每個 stage 有 titleI18n（zh-TW / th / vi / id）
- orderIndex 1-9

【2.3 main seed 引入】
prisma/seed/index.ts 結尾加：
  await seedZhuyinStages(prisma, zhuyinCourse.id);

跑 npm run db:seed 驗證：
  docker exec chinese-learn-postgres psql ... -c "SELECT code, title FROM stages WHERE course_id = (SELECT id FROM courses WHERE code = 'ZHUYIN') ORDER BY order_index;"

應有 9 筆 Z1-Z9。

git commit -m "feat(curriculum): seed zhuyin stages Z1-Z9"

═══════════════════════════════════════
TASK 3：每個 Stage 的 Lessons
═══════════════════════════════════════

【3.1 Lesson 設計原則】
每個 Z1-Z8 stage 切成 3-5 個 lessons：
- Lesson 1：認識符號（看符號 + 聽音 + 跟讀）
- Lesson 2：辨音練習（聽音選符號）
- Lesson 3：拼讀練習（看符號讀出來）
- (進階 stage 多一個) Lesson 4：對比練習（如送氣/不送氣對比）

Z9 Boss 不切 lesson，是一個大綜合測驗（後面 Task 5 處理）。

【3.2 Lesson 資料結構】
參考 prisma/schema/02_curriculum.prisma 的 Lesson model。
每個 Lesson 包含：
- code (stage_code-LXX 例：Z1-L01)
- title + titleI18n
- contentI18n（教學內容，4 語）
- estimatedMinutes
- orderIndex
- isPublished: true

【3.3 寫 prisma/seed/curriculum/zhuyin-lessons.ts】
依 src/lib/zhuyin/data.ts 的資料動態產生 lesson 內容。
範例 Z1-L01「認識 ㄚ」的 contentI18n：

zh-TW: "ㄚ 是中文最常見的母音之一。發音時嘴巴張大，舌頭平放。例字：阿、媽、爸"
th: "ㄚ เป็นสระที่พบบ่อยในภาษาจีน ออกเสียงโดยอ้าปากกว้าง ลิ้นแบน ตัวอย่าง: 阿(อาก), 媽(แม่), 爸(พ่อ)"
vi: "ㄚ là một nguyên âm phổ biến trong tiếng Trung. Mở rộng miệng, lưỡi phẳng. Ví dụ: 阿, 媽, 爸"
id: "ㄚ adalah vokal umum dalam bahasa Mandarin. Buka mulut lebar, lidah datar. Contoh: 阿, 媽, 爸"

每個 Lesson 約 50-150 字內容。

【3.4 灌入】
seed/index.ts 結尾加：
  await seedZhuyinLessons(prisma);

驗證：
  SELECT s.code as stage, l.code as lesson, l.title FROM lessons l
  JOIN stages s ON l.stage_id = s.id
  JOIN courses c ON s.course_id = c.id
  WHERE c.code = 'ZHUYIN' ORDER BY s.order_index, l.order_index;

應該有 24-32 筆 lessons（Z1-Z8 各 3-5 個）。

git commit -m "feat(curriculum): seed zhuyin lessons Z1-L01 to Z8-L05"

═══════════════════════════════════════
TASK 4：Exercises（題目庫）
═══════════════════════════════════════

【4.1 題型對應規則】
從現有 ExerciseType enum 選 3 種：
- ZHUYIN_RECOGNITION（聽音選符號）→ 已有 component
- VOCAB_MCQ（看符號選讀音）→ 新題型，反向題
- TONE_DISCRIMINATION（聽音辨聲調）→ 新題型，給 4 個聲調選

每個 Lesson 配 5-10 題。

【4.2 寫 prisma/seed/curriculum/zhuyin-exercises.ts】
為每個 Lesson 動態生成題目。

範例：Z1-L01「認識 ㄚ」的 exercises：
- 聽 "ㄚ" 音，選哪個是 ㄚ → ZHUYIN_RECOGNITION × 3 題
- 看 "ㄚ" 符號，選音檔 → VOCAB_MCQ × 3 題（反向）
- 聽 "媽" 字，是哪個聲調 → TONE_DISCRIMINATION × 2 題

每個 Exercise 的 prompt / options / answer 都用 JSON：

prompt: { audioUrl: "/api/audio/zhuyin/ㄚ", instructionI18n: {...} }
options: [{ value: "ㄚ", label: "ㄚ" }, { value: "ㄛ", ...}, ...]
answer: { value: "ㄚ" }

【4.3 安全檢查】
不要產 Z6 翹舌音 vs Z6 平舌音的對比題目在 Z1-Z5（學員還沒學到）。
題目難度依 stage 漸進。

【4.4 灌入 + 驗證】
seed/index.ts 結尾加：
  await seedZhuyinExercises(prisma);

跑 npm run db:seed
驗證：
  SELECT type, COUNT(*) FROM exercises GROUP BY type;
應該有 100+ 筆 exercises 分散在 3 種題型。

git commit -m "feat(curriculum): seed zhuyin exercises 100+ across 3 types"

═══════════════════════════════════════
TASK 5：Z9 Boss 通關考試
═══════════════════════════════════════

【5.1 Boss 設計】
- 50 題（30 聽 + 20 寫）
- 通過 80% 升級到 A1_BEGINNER
- 通過後發證書（Certificate model）+ 觸發績效獎金事件

【5.2 確認 Certificate model】
查 prisma/schema/06_exam_kpi.prisma 是否已有 Certificate model（v2 設計裡有）。
若沒有：
  加上 model + 跑 migrate dev --name add_certificate_model

【5.3 Boss 考試 API】
新增：
- POST /api/learn/boss-exam/start
  body: { courseCode: "ZHUYIN" }
  生成 50 題隨機從 Z1-Z8 exercises pool
  記錄 ExamAttempt
  
- POST /api/learn/boss-exam/submit
  body: { examAttemptId, answers }
  計算分數 + 通過則：
    1. 升級 user.currentLevel 為 A1_BEGINNER
    2. 建 Certificate 紀錄
    3. 寫 AuditLog

【5.4 前端 Boss 入口】
src/app/[locale]/(learner)/learn/boss/[courseCode]/page.tsx
- 進入前確認所有 Z1-Z8 lesson 已完成
- 進入後跑 50 題（用現有題型 component）
- 結束顯示成績 + 證書圖

【5.5 證書元件】
src/components/learner/certificate-card.tsx
- 顯示證書資訊（學員名 / 通過級別 / 日期）
- 提供下載 PDF（可暫時用 react-pdf 簡單版）

git commit -m "feat(learn): zhuyin boss exam with certificate issuance"

═══════════════════════════════════════
TASK 6：學員體驗測試（自我驗收）
═══════════════════════════════════════

【6.1 重啟容器】
docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml up -d --build

【6.2 跑完整流程】
1. 用 shunyuan 登入 → 改密 → /admin/users
2. 以 testlearner_th 身份模擬登入
3. 進 /th/learn → 點注音預備班
4. 走完 Z1（3-5 lessons）
5. 走完 Z2 → ... → Z8
6. 進 Z9 Boss 通關
7. 通過後檢查：
   - testlearner_th.currentLevel == 'A1_BEGINNER' ✓
   - 有 1 筆 Certificate 紀錄 ✓
   - /th/learn 現在能看到 A1 課程 ✓

【6.3 用 Prisma Studio 檢查】
- UserAttempt 應有 100+ 筆
- ExamAttempt 應有 1 筆 (Boss)
- Certificate 應有 1 筆
- User.totalXp 應 > 1000

【6.4 修任何發現的 bug】
直接修，commit 訊息標 fix(...)。

git commit -m "test(zhuyin): full flow walkthrough with bug fixes"

═══════════════════════════════════════
TASK 7：產出測試報告 + 文件更新
═══════════════════════════════════════

【7.1 寫 docs/PATH_A_REPORT.md】
內容含：
- 9 個 stages 清單
- 24-32 個 lessons 摘要
- 100+ exercises 統計（按題型）
- Boss 通關設計細節
- 已知問題（如有）
- 下一步建議（如：A1 第一個情境）

【7.2 更新 CLAUDE.md 進度】
npm run claude:update

【7.3 手動更新 .claude-context/05_progress.md】
把 Phase 2 注音班完整化標記為 ✅

git commit -m "docs: path A completion report and progress update"

═══════════════════════════════════════
全部完成後回報順元
═══════════════════════════════════════

寫 markdown 給順元，包含：
1. 7 個 commit 的 hash
2. 統計：stages / lessons / exercises 各幾個
3. 自我測試結果（testlearner_th 走完整流程通過）
4. 5 張截圖：
   - /th/learn 課程地圖（注音班可進入、A1 鎖定）
   - 任一個 lesson 內容頁
   - 任一個 exercise 答題畫面
   - Boss 通關成績頁
   - 證書展示
5. 提示：「順元可以用 testlearner_th 親自走一遍」

═══════════════════════════════════════
重要規則
═══════════════════════════════════════
- 每完成 1 task 立即 commit
- 不要堆積到最後一起 commit
- 內容用繁中為主，4 語都要有翻譯（先用 [TH]/[VI]/[ID] 前綴標 TODO 也可）
- 每個 lesson 內容控制在 50-200 字（不要寫成論文）
- 題目難度依 stage 漸進
- Z9 Boss 必須是真的綜合題，不能只考最近一個 stage
- 任何 schema 變更走 migrate dev，不要手改 migration 檔
- npm run type-check && npm run lint 在每次 commit 前要綠
- 遇到 npm 套件版本問題自己 --legacy-peer-deps 解
- 內容寫不出來時不要瞎掰，用 TODO 標記讓順元補

═══════════════════════════════════════
不要做的事
═══════════════════════════════════════
- ❌ 不要動 P0 已完成的程式碼（impersonation / change-password / level gating / TTS）
- ❌ 不要重構既有檔案結構
- ❌ 不要在 main 直接做大改（如要重構，開 feature/path-a 分支）
- ❌ 不要刪 v1 的舊資料
- ❌ 不要動 .claude-context/ 主要結構（只能更新 05_progress.md）

═══════════════════════════════════════
參考檔案
═══════════════════════════════════════
- CLAUDE.md（你的入口）
- .claude-context/03_curriculum.md（課程設計細節）
- .claude-context/04_data_model.md（schema 結構）
- src/lib/zhuyin/data.ts（注音原始資料）
- prisma/schema/02_curriculum.prisma（Course/Stage/Lesson）
- prisma/schema/03_exercise.prisma（Exercise/UserAttempt）

開工。先列 todo 清單給順元看，等他確認後從 Task 1 開始。
