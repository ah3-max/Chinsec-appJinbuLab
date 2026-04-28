# Path A 完成報告 — 注音班 (ZHUYIN) 完整化

> 完成日期:2026-04-28
> 對應規格:`docs/PATH_A_INSTRUCTIONS.md`
> 7 個 task 全綠

## TL;DR

注音班從骨架(僅 4 個 stage 標題)走到員工可以從零基礎走完到 Boss 通關拿證書、自動升級 A1。資料齊備、API 完整、前端可跑、自動化驗證全綠。

```
337e796 test(zhuyin): full flow walkthrough with bug fixes              ← Task 6
b43a6fc feat(learn): zhuyin boss exam with certificate issuance         ← Task 5
524d118 feat(curriculum): seed zhuyin exercises 100+ across 3 types     ← Task 4
ee5d00a feat(curriculum): seed zhuyin lessons Z1-L01 to Z8-L05          ← Task 3
3bdc350 feat(curriculum): seed zhuyin stages Z1-Z9                      ← Task 2
20dce4e docs: add P0 verification checklist and Path A spec             ← (備檔)
11af7ee fix(seed): vocabulary upsert and dedupe by hanzi unique         ← Task 1
```

## 統計

### Stages(9 個)

| Code | 標題 | 預估時間 | 是否 Boss |
|---|---|---|---|
| Z1 | 韻母基礎 ㄚㄛㄜㄝ | 60 min | |
| Z2 | 介符與複韻母 ㄧㄨㄩ + ㄞㄟㄠㄡ | 90 min | |
| Z3 | 聲隨韻 + 捲舌韻 ㄢㄣㄤㄥㄦ | 90 min | |
| Z4 | 聲符基礎 ㄅㄆㄇㄈㄉㄊㄋㄌ | 120 min | |
| Z5 | 聲符進階 ㄍㄎㄏㄐㄑㄒ | 120 min | |
| Z6 | 聲符高階 ㄓㄔㄕㄖㄗㄘㄙ | 180 min | |
| Z7 | 聲調系統 一二三四聲 + 輕聲 | 120 min | |
| Z8 | 結合韻完整應用 | 180 min | |
| Z9 | **Boss 通關 — 注音綜合測驗** | 30 min | ✓ |

### Lessons(29 個)

| Stage | Lessons | 命名範例 |
|---|---|---|
| Z1 | 3 | 認識四個基礎韻母 / 辨音聽寫 / 加聲調拼讀 |
| Z2 | 4 | 介符 / 複韻母 / 辨音 / 介+韻組合 |
| Z3 | 3 | 前鼻音 / 後鼻音 / 捲舌韻+對比 |
| Z4 | 4 | 雙唇+唇齒 / 舌尖音 / 辨音 / **送氣對比** |
| Z5 | 3 | 舌根音 / 舌面音 / 三拼結合 |
| Z6 | 5 | 翹舌 / 平舌 / **翹平對比** / ㄖ特殊 / 7 符綜合 |
| Z7 | 3 | 四聲調入門 / 輕聲與兒化 / 聲調聽寫 |
| Z8 | 4 | ㄧ系列 / ㄨ系列 / ㄩ系列 / 完整音節 |

每個 lesson `content` 是 JSON,含 50-200 字 zh-TW intro + th/vi/id 三語翻譯(_todo 標記)+ covers 陣列(對應 bopomofo)+ examples + tips。

### Exercises(249 個)

| Type | 數量 | 對應題型 |
|---|---|---|
| ZHUYIN_RECOGNITION | 157 | 聽 mp3 選注音符號 |
| VOCAB_MCQ | 74 | 看注音選範例字 |
| TONE_DISCRIMINATION | 18 | 聽 ma_X.mp3 選聲調 |

Distractor 限定在已學過的 symbol 池,不會在 Z2 出現 Z6 才教的翹舌音。

### Boss 考試

- Code:`ZHUYIN-BOSS`
- 50 題從 249 池中隨機抽
- 通過 = 80%(40/50)
- 評分在 server,client 拿不到 answer 欄位(防 devtools 作弊)
- 通過後自動:
  1. `user.currentLevel = A1_BEGINNER`
  2. 建 `Certificate` row(@@unique [userId, level])
  3. 寫 `AuditLog action=BOSS_EXAM_PASS`
- 模擬登入(impersonation)中跳過所有 stat 更新

## 設計細節

### 課程順序的考量

舊 seed 的 4 個 stage 是「聲母→介音→韻母→聲調」,符合大千鍵盤排列。新版改成「韻母→聲符→聲調→拼合」,理由:

1. **韻母先**:單純的張嘴練發音是入門最低門檻
2. **聲符後**:有韻母當載體再練聲符的送氣/捲舌
3. **Z6 給 5 個 lessons**:全注音最難的就是 ㄓㄔㄕ vs ㄗㄘㄙ,東南亞母語很多沒有翹舌,需要更多 drill
4. **Z9 抽全池而非僅最後**:Boss 必須是綜合,不能讓學員臨時抱佛腳考前複習就通過

### 證書設計

`Certificate` model 有兩個關鍵設計決定:

1. **快照式(snapshot)資料**:`fullNameSnapshot` / `scoreSnapshot` / `maxScoreSnapshot` 在發證當下凍結。學員之後改名,證書還是顯示當時的名字。
2. **userId × level @@unique**:同一個學員每個等級最多一張證書。Boss 重考可改寫(upsert update)分數,但不會重複發證。

`examAttemptId` 是 optional + onDelete: SET NULL — 如果舊的 exam attempt 被清掉,證書本身還在(歷史可查),只是失去對應到具體那次考試。

### 防作弊堆疊

- **問題不附 answer**:`/start` 回 client 的 questions 物件已剝掉 `answer` 欄位
- **Server-side rescore**:`/submit` 從 DB 重新讀 `Exercise.answer` 比對
- **questionSnapshot**:exam attempt 開始時把抽到的 50 題 ID 凍結,之後即使有人加新題目也不影響評分
- **windowBlurCount**:client 累積,server 紀錄,可疑就標 flag
- **Anti-cheat lib(P0-3)**:too_fast_avg / all_same_correct / excess_paste

## 架構檔案地圖

```
prisma/seed/curriculum/
  ├─ zhuyin-stages.ts        9 stages with titleI18n
  ├─ zhuyin-lessons.ts       29 lessons with contentI18n
  ├─ zhuyin-exercises.ts     249 exercises (3 types, distractor-aware)
  └─ zhuyin-boss.ts          ZHUYIN-BOSS MockExam shell

prisma/migrations/
  ├─ 20260428_vocabulary_hanzi_unique         Task 1
  └─ 20260428_certificate_and_exam_snapshot   Task 5

src/app/api/learn/
  ├─ boss-exam/start/route.ts    POST 抽 50 題建 attempt
  ├─ boss-exam/submit/route.ts   POST 評分 + 升級 + 發證
  └─ certificate/[id]/route.ts   GET 讀證書(owner / admin)

src/app/[locale]/(learner)/learn/boss/[courseCode]/page.tsx
  Boss 考試入口頁(server component,守等級)

src/components/learner/
  ├─ boss-exam-runner.tsx        Client,3 phase(idle/running/done)
  └─ certificate-card.tsx        證書視覺呈現(amber 邊框 + 雙線分隔)

scripts/test-zhuyin-flow.ts      自動化 E2E 驗證
```

## 已知限制與下一步

### 已知限制(spec 未要求,留給後續)

1. **沒有 lesson player UI**:`/learn/[courseCode]` 列出 lesson 但點下去沒有反應(沒題目播放器)。學員目前能體驗的只有:
   - 課程地圖
   - `/practice/zhuyin`(client 端動態生題,P0-3 寫進 UserAttempt)
   - Boss 考試(從 DB 抽題)
   - 要走完 spec 6.2 步驟 4「走完 Z1(3-5 lessons)」需要寫 lesson player。
2. **Auto-promotion 在 session/complete 永不觸發**:因為 `/practice/zhuyin` 用 client 生題,attempt 的 `exerciseId` 是 null,促使 P0-4 的 `hasMasteredLevel` 永遠回 false。Boss 路徑能正常觸發升級,但「答完所有 lesson 自動升」的路徑要等 lesson player 落地。
3. **i18n 三語**:全部 `_todo` 標記由 Claude 第一輪翻譯,**正式部署前需找母語人士校稿**(尤其 Z6 翹舌音、Z3 鼻音的解釋詞涉及聽覺感受詞,翻譯難度高)。
4. **Boss 結果頁無 PDF 下載**:目前只渲染 CertificateCard 視覺。`Certificate.pdfUrl` 欄位預留,實作可用 react-pdf。
5. **重複考 Boss 不會清舊 Certificate**:upsert 會 update 分數,但學員 currentLevel 已升到 A1 就不會被降級回去。實務不應該是 bug,但若要支援「降級重考」需另外設計。

### 下一步建議優先順序

1. **A1 第一個情境關卡**(L1-S01「自我介紹」)— 三件事:
   a) 建 Stage `L1-S01` + Lesson 結構
   b) 寫 lesson player UI(可重用 boss-exam-runner 的渲染邏輯)
   c) 灌詞彙 + 例句 + 練習題
2. **Lesson player UI**:reusable component,handle ZHUYIN_RECOGNITION / VOCAB_MCQ / TONE_DISCRIMINATION 三種題型,結束時呼叫 session/complete。
3. **handwriting board**:P1 待辦的注音手寫,Canvas + 筆畫記錄,可導入 `@/components/zhuyin/keyboard.tsx` 已有的座標系統。
4. **i18n 校稿**:找母語人士看過 Z6/Z7 的解釋,以及 Boss 考試的全部 UI 字串。
5. **PDF certificate generator**:用 react-pdf 把 CertificateCard 轉成 PDF,寫 `Certificate.pdfUrl`。

## 驗證方式

### 自動化(已通過)

```bash
cd "/Users/natpassornkaewkuljeerapat/Desktop/OPAL AI/chinese-learn"
export $(grep -E '^DATABASE_URL' .env.local | xargs)
npx tsx scripts/test-zhuyin-flow.ts
```

預期輸出:8/8 ✓ 全綠,結尾「🎉 All assertions passed.」

### 手動(順元的事)

1. shunyuan 登入 → 改密 → /admin
2. 點「學員管理」→ 點 testlearner_th 的「以此身份登入」
3. /th/learn → 注音預備班(藍色卡片) → 進入課程詳細頁
4. 應看到金色「BOSS」CTA 卡(因為 testlearner_th.currentLevel=ZHUYIN 等於 course.level)
5. 點 BOSS → 開始考試 → 50 題 → 提交
6. 預期:成績頁 + 證書卡(含 ทดสอบ ภาษาไทย 名)
7. 結束模擬 → 回 /zh-TW/admin
8. 在 Prisma Studio (5555) 確認:
   - `users.currentLevel = A1_BEGINNER` for testlearner_th
   - `certificates` 表有 1 筆
   - `exam_attempts` 有 1 筆 passed = true
