# P0 完成報告 — 2026-04-27

## TL;DR

5/5 完成,7 個 commit(5 個 P0 task + 2 個額外:dev quick-login、v2 memory system)。

| Task | 描述 | 狀態 | Commit |
|---|---|---|---|
| 1 | 超級管理員一鍵登入(impersonation) | ✅ | `97128f3 feat(admin): super-admin impersonation with audit trail` |
| 2 | 強制首次改密碼 | ✅ | `ffe8b49 feat(auth): force password change on first login` |
| 3 | UserAttempt 寫入 + XP/streak + anti-cheat | ✅ | `effb27a feat(learn): persist attempts with xp streak and anti-cheat` |
| 4 | 依使用者 level 過濾課程 + 自動升級 | ✅ | `a90650f feat(learn): level-based course gating with auto-promotion` |
| 5 | Edge-TTS + MinIO 預載音檔 | ✅ | `777662b feat(audio): edge-tts pregenerated bopomofo audio with minio` |

額外:
- `09dae38 feat(dev): quick admin login button gated by NEXT_PUBLIC_ENABLE_QUICK_LOGIN` — 既存未 commit 改動,先處理掉
- `034ce55 feat(memory): v2 memory system with auto-update script` — 中途部署的 CLAUDE.md / .claude-context/

## 驗證

```
npm run type-check  # 通過,無錯誤
npm run lint        # 通過(僅有一個 pre-existing warning:src/lib/ai/router.ts 的 fallbackUsed)
git log --oneline -10   # 7 個新 commit
```

## Task 細節重點

### Task 1 — Impersonation
- 流程:`/zh-TW/users` 列 LEARNER → 「以此身份登入」 POST `/api/admin/impersonate/start` 拿 5 分鐘 jose JWT(jti + Redis 一次性)→ GET `/consume?token=…` 直接用 `next-auth/jwt` 的 `encode` 寫一張帶 `_impersonatedBy` 的新 session cookie → redirect 到 `target.uiLanguage/learn`。
- POST `/stop` 反向:用 `_impersonatedBy` 載 admin 重新簽 JWT。
- 拒絕:non-admin / 模擬自己 / 模擬 SUPER_ADMIN / 巢狀 impersonate。
- 橙色橫幅 server component (auth() 讀 session) + client stop button。每個動作寫 `AuditLog (IMPERSONATE_START / IMPERSONATE_END)`。
- 新檔:`src/lib/{redis,audit,auth-impersonate,cookie-name}.ts`、`(admin)/{layout,users/page}.tsx`、`api/admin/impersonate/{start,consume,stop}`、`components/{admin/users-table,impersonation-banner,impersonation-banner-client}.tsx`。

### Task 2 — Force First Password Change
- Migration `20260427_add_must_change_password`(欄位 `mustChangePassword`、`passwordChangedAt`)。
- seed 為 `shunyuan` 標 `mustChangePassword: true`,並現場 UPDATE 已存在 admin 的 row。
- `auth.ts` 把 `mustChangePassword` 帶進 JWT/session;middleware 用 `getToken()` 解 cookie,若是 true 且非 impersonation 期間就 redirect 到 `/[locale]/change-password`(白名單:`/login`、`/change-password`)。
- 新頁面 `(auth)/change-password/page.tsx` + `change-password-form.tsx`(zod:≥8 字、需大小寫+數字、不能與目前同)。
- POST `/api/auth/change-password`:bcrypt compare → hash 新密 → 更新欄位 → `audit IMPERSONATE_START`(action=`PASSWORD_CHANGED`)→ 重簽 JWT cookie。impersonation 中拒絕。
- i18n `auth.changePassword.*` 4 種語言齊備(三語標 `_todo`)。

### Task 3 — UserAttempt + XP/Streak + Anti-Cheat
- Migration `20260427_allow_attempt_without_exercise`:`exerciseId` 改 optional + `ON DELETE SET NULL`、新增 `exerciseSnapshot Json?`、`exerciseType ExerciseType`、`sessionKey String?`、`suspicious Boolean`、`suspiciousReasons String[]`,加 `(userId, sessionKey)` index。
- `POST /api/learn/attempt`:zod 驗證 → `detectSuspiciousAttempt`(too_fast / paste_detected / excess_window_blur)→ 寫 row。
- `POST /api/learn/session/complete`:重撈 session 的 attempts → `detectSuspiciousSession`(all_same_correct / too_fast_avg / excess_paste)→ 可疑就 awardedXp = 0(仍記錄)。在 transaction 中:`totalXp/weeklyXp += awardedXp`、`computeNewStreak`(today / yesterday / reset)、`totalStudyMin += sum(timeSpentSec)/60`。impersonation 期間整個跳過。
- 注音題型 `zhuyin-tap-exercise.tsx`:每題 POST attempt(含 windowBlurCount)→ 結束 POST session/complete → 顯示 `+N XP / 連續 N 天 🔥` 或可疑警示。
- profile page 改成從 DB 即時撈 totalXp / weeklyXp / streakDays / totalStudyMin / 嘗試數 / 正確率 / 7 日嘗試數。
- 新 lib:`anti-cheat.ts`、`streak.ts`。

### Task 4 — Level Gating + Auto-Promotion
- `src/lib/level.ts`:`LEVEL_ORDER`、`canAccess` / `canPreview`(下一級)/ `isLocked` / `nextLevel` / `previousLevel` / `classifyCourse`。
- `/learn` 列出 isPublished 課程,4 種狀態:**completed**(目前等級之下,顯「複習」)/ **open**(可進)/ **preview**(下一級,半透明,「即將解鎖」)/ **locked**(`先完成 {prevLevel}`,Lock icon)。
- `/learn/[courseCode]` 新頁,server-side `canAccess` 檢查 + redirect `?error=locked`;`LearnLockedToast` client 元件讀取 query 參數 toast 並清掉。
- `session/complete` 加自動升級:檢查目前 level 內所有 isPublished course 之所有 active exercise 是否都有 score≥80 的 attempt;成立就 increment `currentLevel`(可疑 session 不升)。
- `LevelUpModal`(framer-motion 五彩紙花)由 zhuyin-tap-exercise 在 `leveledUp:true` 時觸發。
- i18n:`learn.{startOrContinue,review,comingSoon,finishPrevToUnlock,courseLocked,levelUp.*}`。

### Task 5 — Edge-TTS + MinIO Audio
- `scripts/generate-zhuyin-audio.ts`:`spawn python3 -m edge_tts` 不依賴 PATH。產出兩種速度:每個 37 注音、每個範例字、`媽/麻/馬/罵/嗎` ma_1..ma_5 聲調對比 + 5 個聲調介紹語音。已存在的檔跳過。
  - **bug 修正**:argparse 把 `--rate -30%` 當 flag → 改成 `--rate=-30%`。
- `scripts/upload-audio-to-minio.ts`:walk → fPutObject 到 bucket(自動建立 + 設 public-read policy);相同 size 已存在跳過。
- `GET /api/audio/zhuyin/[symbol]?slow=1[&cat=…]`:從符號 code point 推斷子資料夾(注音/範例/聲調),先試 MinIO `statObject` redirect → 否則 redirect public/ 靜態檔 → 都無就 404。
- 注音題型改成 `new Audio('/api/audio/zhuyin/' + symbol)`,`error` / `play().catch` 自動 fallback Web Speech API。
- npm scripts: `audio:zhuyin` / `audio:upload`。`.gitignore` 新增 `public/audio/zhuyin/`(audio 在 MinIO 才是 canonical)。
- **edge-tts 安裝指引**(本機):`python3 -m pip install --user edge-tts`。執行 `npm run audio:zhuyin` 時需 `export PATH="$HOME/Library/Python/3.9/bin:$PATH"` 或直接吃 `python3 -m edge_tts`(本 script 已是)。

## 沒做(待人工/後續)的事

- **截圖 5 張**:沒辦法在 CLI 中操作瀏覽器拍圖。Container `chinese-learn-app` 是 production build(無 hot reload),要看新功能需 `docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml up -d --build`。建議的測試順序:
  1. 用 `shunyuan / ChangeMe@2026` 登入 → 應被導向 `/zh-TW/change-password`(Task 2 截圖)
  2. 改完密碼後到 `/zh-TW/users` → admin/users 列表(Task 1 截圖)
  3. 點某 LEARNER 的「以此身份登入」 → `/th/learn` 含橙色橫幅(Task 1 截圖)
  4. 結束模擬,進注音題型完整答完一輪 → 看完成畫面 +XP / 連續 N 天(Task 3 截圖)
  5. `npm run db:studio` → 開 UserAttempt 表(Task 3 截圖)
- **音檔產生**:已跑過一次,共 ~158 個 mp3。實際部署到 MinIO 需 `npm run audio:upload`(剛跑出的副本還沒上 MinIO,會在報告附帶後續處理)。

## 後續建議

- LEARNER seed 帳號(`testlearner_th/vi/id`)CLAUDE.md 有提到但 seed 還沒寫。Task 1 的 admin/users 頁目前只看得到一筆 (shunyuan 自己排除掉因為它是 SUPER_ADMIN),所以列表會空。建議下一輪補 seed。
- Task 3 的 anti-cheat 規則目前以 timeSpentSec/blurCount 為主;PRONUNCIATION 等需要錄音的題型還沒接,SRS schedule 也沒在 attempt 路徑更新。
- Task 4 的「completed」目前用「課程 level < 使用者 level」當代理判定,真正的 lesson-progress 表還沒建。
- Task 5 的 edge-tts 慢速語音是 -30%,可能對純粹聲母/介符發音用處不大(那些字本來就只有一拍)。
- Audio API 目前 redirect 到 MinIO 的 public URL,生產環境若有 reverse proxy(Cloudflare Tunnel)需要設定 `MINIO_PUBLIC_HOST` / `MINIO_PUBLIC_PORT` 指向對外可達的網址。
