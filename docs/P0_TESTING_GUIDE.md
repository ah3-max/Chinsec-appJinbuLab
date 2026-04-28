# P0 功能測試指南

> 最後更新:2026-04-28
> 對應 commit:`feat(audio): edge-tts pregenerated bopomofo audio with minio` 之後加上 admin 儀表板 + 手機優化

## 開始前

- 開電腦本機:<http://localhost:3003>
- **手機/平板**(同一個 WiFi):<http://192.168.1.73:3003>
- Prisma Studio:`npm run db:studio` → <http://localhost:5555>
- MinIO Console:<http://localhost:9001>(admin 帳:`minioadmin` / 密:`chinese_learn_minio_pwd`)

## 帳號清單

| 帳號 | 密碼 | 角色 | UI 語言 | 等級 |
|---|---|---|---|---|
| `shunyuan` | `ChangeMe@2026` | SUPER_ADMIN | zh-TW | ZHUYIN |
| `testlearner_th` | `Test@2026` | LEARNER | th | ZHUYIN |
| `testlearner_vi` | `Test@2026` | LEARNER | vi | ZHUYIN |
| `testlearner_id` | `Test@2026` | LEARNER | id | ZHUYIN |

⚠️ 全部帳號 `mustChangePassword: true` — 第一次登入會被強制改密。

## 測試流程

### 流程 A — 強制首次改密碼(P0-2)

1. 開 <http://localhost:3003> 或手機的 `http://192.168.1.73:3003`
2. 用 `shunyuan / ChangeMe@2026` 登入
3. **預期**:自動轉到 `/zh-TW/change-password`,網址列直接打 `/zh-TW/learn` 也會被 middleware 擋回來
4. 故意輸入錯誤目前密碼 → 顯示「目前密碼錯誤」
5. 故意把新密碼設成跟目前一樣 → 顯示「新密碼不可與目前密碼相同」
6. 故意設弱密碼如 `abc12345` → 顯示「密碼不符規則」(需大寫+小寫+數字 ≥ 8 字)
7. 設 `Pass2026!`(含大寫小寫數字) → toast「密碼修改成功」→ 自動進管理員首頁

### 流程 B — 超管首頁與「以此身份登入」(P0-1)

1. 用 shunyuan(已改完密)登入 → 應進 `/zh-TW/admin`(超管儀表板,不是學員 /learn)
2. **預期看到**:
   - 紫紅漸層 hero「你好,順元」+「超級管理員」徽章
   - 三格統計:**學員總數**、**本週活躍**、**本週答題**
   - 兩張導航卡:「學員管理」(可點)、「稽核日誌」(灰色 即將推出)
   - 最近操作:應有 PASSWORD_CHANGED entry
3. 點「學員管理」進 `/zh-TW/users`
4. 看到 3 筆學員(testlearner_th/vi/id),手機版顯示卡片堆疊,桌機版顯示表格
5. 上方有搜尋框,試打「th」應只剩泰籍那筆
6. 點 testlearner_th 旁的「以此身份登入」
7. **預期**:自動跳到 `/th/learn`(注意 URL locale 變泰文),頂部有橙色橫幅「กำลังเข้าสู่ระบบในชื่อ ทดสอบ ภาษาไทย (ผู้ดูแล: 順元)」
8. 從橫幅按「結束模擬」→ 回到 `/zh-TW/users`

### 流程 C — UserAttempt 寫入 + XP/Streak(P0-3)

兩種測法都行,差別在「以誰的身份累積資料」:

**做法 1(推薦,impersonation 不污染學員資料)**:用 shunyuan 登入後 impersonate testlearner_th,然後在 `/th/practice/zhuyin` 答完 10 題。

**做法 2**:直接登入 testlearner_th(會先強迫改密 → 改完進 /th/learn → 點 /th/practice/zhuyin),這樣資料會記到該學員身上。

1. 進注音題型(impersonation 模式下會看到上方仍有橙色橫幅)
2. 完整答完 10 題,任意對錯
3. **預期完成畫面**:
   - 🎉 + 得分 + 剩餘血量
   - **如果是 impersonation**:顯示「模擬登入中,本次練習不計入學員數據」(這是 Task 3 寫的反污染保護)
   - **如果是直接登入**:顯示「+N XP」+「連續 N 天 🔥」
4. 開 Prisma Studio (<http://localhost:5555>) → 看 `user_attempts` 表 → 應有 10 筆紀錄,sessionKey 相同
5. impersonation 模式下:看 `users` 表 testlearner_th 的 `total_xp` **不變**(impersonation 跳過更新)
6. 直接登入模式下:`users.total_xp` 增加,`streak_days = 1`,`last_streak_date` 是今天

### 流程 D — 等級過濾(P0-4)

1. 用 testlearner_th 直接登入(改完密)→ 進 `/th/learn`
2. **預期**:三張課程卡:
   - 「ห้องเตรียมจู้อิน ㄅㄆㄇ」(注音預備班)— 開放,藍色卡片,點得進去
   - 「Cấp độ nhập môn A1」/「ระดับเริ่มต้น A1」— 半透明虛線邊,「即將解鎖」
   - 「養老院照護中文」/「ภาษาจีน...」— 跟 A1 一樣是 preview 狀態
3. 點 A1 課程 → **不會跳轉**(被 disabled wrap 包住,不可點)
4. 直接打網址 `/th/learn/A1` 試圖繞過 → 應 redirect 回 `/th/learn?error=locked` + toast「คอร์สนี้ยังไม่ปลดล็อก」
5. 點注音預備班 → 進入課程詳細頁(目前還沒有 lesson 內容,顯示「本課程尚無單元」)

### 流程 E — Edge-TTS 音檔(P0-5)

1. 直接打 <http://localhost:9000/chinese-learn-audio/zhuyin/symbols/ㄅ.mp3> — 應下載一個 mp3 檔(瀏覽器可能直接撥放)
2. 進注音題型 — **聽到的應是 Edge-TTS 的 zh-TW-HsiaoChenNeural 真人女聲**(不是 Chrome 內建合成音)
3. 點題目卡上的播音 icon → 重播
4. 用瀏覽器 devtools Network tab → 應看到 `/api/audio/zhuyin/...` 302 redirect 到 `localhost:9000/chinese-learn-audio/...`
5. **fallback 測試**(可選):停掉 MinIO `docker stop chinese-learn-minio`,API 會 fallback 到 public 靜態檔(因為 .gitignore 但本機檔還在)。完全停掉 public 也沒了才會降級成 Web Speech。

## 額外:稽核日誌

每個敏感動作都會寫進 `audit_logs`:
- IMPERSONATE_START / IMPERSONATE_END
- PASSWORD_CHANGED

```sql
SELECT action, resource, "createdAt" FROM audit_logs ORDER BY "createdAt" DESC LIMIT 10;
```

## Rebuild 流程

只有改了 `src/`、`prisma/`、`docker/` 的東西需要 rebuild:

```bash
cd "/Users/natpassornkaewkuljeerapat/Desktop/OPAL AI/chinese-learn/docker"
export $(grep AUTH_SECRET ../.env.local | xargs)
docker compose -f docker-compose.yml -f docker-compose.app.yml up -d --build app
```

## 已知限制 / 待辦

- A1 / 養老院 課程目前沒 lesson 內容,進不了實際題目
- 自動升級條件需要每個 exercise 都有 score≥80 的 attempt → 沒有 exercise 就永遠不升,需要先補課程內容
- Anti-cheat 規則只覆蓋 too_fast / paste / window blur,語音 / 寫字題型尚未接入
- LEARNER seed 帳號 `mustChangePassword=true`,所以 impersonation 後的學員 session 雖然不會被 middleware 擋(JWT 中沒有此欄位),但他們本人首次登入會被強制改密。如要保留「未改密」狀態做測試,從 impersonation 進入即可
