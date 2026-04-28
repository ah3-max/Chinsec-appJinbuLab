# 📋 P0 驗收清單 — 順元手動測試指南

> 📱 手機網址：`http://192.168.1.73:3003`（要在同 WiFi）
> 💻 電腦網址：`http://localhost:3003`
> 🔑 管理員：`shunyuan / ChangeMe@2026`
> 🔑 學員：`testlearner_th / testlearner_vi / testlearner_id`，密碼都是 `Test@2026`

---

## 🎯 今天驗收目標

走完 **5 個流程 + 1 個小檢查**，確認 P0 全部 5 大功能可運作。
**遇到任何問題截圖**回給 Anthropic Claude，我會立刻給修復指令。

預估時間：**20-30 分鐘**

---

## 📋 流程 1：強制改密碼（驗證 P0-2）

### 步驟
1. 打開瀏覽器（先用電腦比較好操作）
2. 輸入：`http://localhost:3003`
3. 應該自動跳到 `/zh-TW/login`
4. 輸入：
   - 帳號：`shunyuan`
   - 密碼：`ChangeMe@2026`
5. 點「登入」

### 預期看到
- ⏩ 自動跳到 `/zh-TW/change-password`（不能直接進別的頁）
- 看到「請更改您的初始密碼」之類的提示
- 有 3 個欄位：目前密碼 / 新密碼 / 確認新密碼

### 操作
6. 在「目前密碼」輸入：`ChangeMe@2026`
7. 在「新密碼」輸入：`Shun2026!Test`（記住這組密碼，後續會用）
8. 在「確認新密碼」輸入同樣：`Shun2026!Test`
9. 點「儲存」

### 預期看到
- ✅ 顯示成功訊息
- ⏩ 自動跳到 `/zh-TW/learn`
- 看到歡迎訊息「歡迎，順元」

### 🆘 如果出錯
- ❌ 沒有跳到 change-password → P0-2 失敗
- ❌ 改密碼按鈕沒反應 → 截圖
- ❌ 改完還是跳回 change-password → 截圖

---

## 📋 流程 2：超級管理員一鍵登入學員（驗證 P0-1）

### 步驟
1. 確認您現在是登入狀態（剛改密完應該是）
2. 在網址列輸入：`http://localhost:3003/zh-TW/users`
   - 或從介面找「用戶管理」/「員工管理」按鈕

### 預期看到
- 看到一個表格，列出所有學員
- 應該有 **3 個 testlearner**：
  - testlearner_th（國籍 TH，姓名 ทดสอบ）
  - testlearner_vi（國籍 VN，姓名 Kiểm Tra）
  - testlearner_id（國籍 ID，姓名 Tes Bahasa）
- 每行右側有「以此身份登入」按鈕

### 🆘 如果列表是空的
這代表 seed 還沒補完。把這段貼給 Claude Code：
```
admin/users 列表是空的，請執行：
1. cd "/Users/natpassornkaewkuljeerapat/Desktop/OPAL AI/chinese-learn"
2. export $(grep -E '^DATABASE_URL' .env.local | xargs)
3. 確認 prisma/seed/index.ts 有 testlearner_th/vi/id 三筆 LEARNER 帳號
4. npm run db:seed
5. 確認後驗證：docker exec chinese-learn-postgres psql -U chinese_learn -d chinese_learn -c "SELECT username, role FROM users;"
```

### 操作
3. 點 testlearner_th 旁的「以此身份登入」按鈕

### 預期看到
- ⏩ 自動跳到 `/th/learn`（網址變泰文）
- 介面文字大部分變成泰文（或顯示 [TH] 前綴，看翻譯完成度）
- **頂部出現橙色橫幅**寫著類似：
  「👁 您正在以 ทดสอบ 身份瀏覽（管理員：順元）」
- 橫幅右側有「結束模擬」按鈕

### 操作
4. 點「結束模擬」
5. 應該回到 `/zh-TW/users` 或 `/zh-TW/admin`

### 🆘 如果出錯
- ❌ 點按鈕沒反應 → 截圖網路請求 (F12 開 Network 看)
- ❌ 跳到 /th/learn 但沒橙色橫幅 → 截圖
- ❌ 結束模擬無效 → 截圖

---

## 📋 流程 3：注音題型 + Edge-TTS 音檔（驗證 P0-5）

### 步驟（接續流程 2 模擬中）
1. 再次點 testlearner_th 的「以此身份登入」（或目前還在模擬中）
2. 確認您現在以 testlearner_th 身份在 `/th/learn`
3. 點底部的「練習」tab
4. 應該看到「注音聽音選字」項目
5. 點進去開始

### 預期看到
- 出現一個注音符號題目
- 自動播放音檔（**這個音檔是 Edge-TTS 真人女聲**，不是合成音）
- 4 個選項可點

### 🎧 重點測試
6. 仔細聽音質：
   - ✅ 是清楚的女聲（zh-TW-HsiaoChenNeural）
   - ❌ 如果是合成音、機械音 → P0-5 失敗

### 操作
7. 答完 10 題（隨便答都行）

### 預期看到
- 結束畫面顯示「+25 XP！🎉」或類似
- 顯示「連續 1 天」

### 🆘 如果出錯
- ❌ 沒聲音 → F12 看 Network，找 `.mp3` 請求是否 200
- ❌ 只有合成音 → 還是用 Web Speech API 沒切到 MinIO，截圖
- ❌ 結束沒顯示 XP → P0-3 整合失敗

---

## 📋 流程 4：UserAttempt 寫入 DB（驗證 P0-3）

### 步驟
1. 開另一個瀏覽器分頁
2. 輸入：`http://localhost:5555`（Prisma Studio）

### 🆘 如果 Prisma Studio 沒開
把這段貼給 Claude Code：
```
請執行：cd "/Users/natpassornkaewkuljeerapat/Desktop/OPAL AI/chinese-learn" && npm run db:studio
```
然後重新開 5555 那頁

### 步驟
3. 左邊找到 `UserAttempt` 表（或 user_attempts）
4. 點進去看資料

### 預期看到
- 應該有 **10 筆紀錄**（剛才答的 10 題）
- 每筆有：
  - userId（指向 testlearner_th）
  - exerciseType: ZHUYIN_RECOGNITION 之類
  - userAnswer / isCorrect / score / timeSpentSec
  - createdAt 是剛剛的時間

### 步驟
5. 看 `User` 表
6. 找 testlearner_th 那筆

### 預期看到
- `totalXp`：應該 > 0（10 題答對的話 +50 XP，全錯也至少有少量）
- `streakDays`：應該 = 1
- `lastActiveAt`：剛剛的時間

### 🆘 如果出錯
- ❌ UserAttempt 是空的 → P0-3 沒寫入 DB
- ❌ totalXp 還是 0 → session/complete 沒被呼叫

---

## 📋 流程 5：等級鎖定（驗證 P0-4）

### 步驟（仍以 testlearner_th 身份）
1. 回到 `/th/learn`
2. 看課程列表

### 預期看到
- testlearner_th 預設是 ZHUYIN 級
- **注音預備班** → 可以進入（normal 樣式）
- **A1 入門級** → 顯示鎖定 / 灰色 / 「即將解鎖」之類提示
- **A2+** → 同樣鎖定

### 進階測試（手動升級看效果）
3. 開 Prisma Studio 5555
4. 找 User 表的 testlearner_th
5. 改 `currentLevel` 為 `A1_BEGINNER`
6. 儲存
7. 回 testlearner_th 的瀏覽器，重整 `/th/learn`

### 預期看到
- ✅ A1 課程現在可以進入了
- ⏳ A2 仍然鎖定

### 還原
8. 改回 testlearner_th 的 currentLevel = `ZHUYIN`（保持乾淨狀態）

---

## 📱 流程 6：手機端測試（額外驗證）

### 條件
- iPhone 或 Android 跟您的 Mac 在**同一個 WiFi**
- Mac 防火牆不要擋 3003 port

### 步驟
1. 確認 Mac 的 IP 是 `192.168.1.73`（如果不對，跑：`ipconfig getifaddr en0`）
2. 手機開 Safari / Chrome
3. 輸入：`http://192.168.1.73:3003`

### 預期看到
- 自動跳 `/zh-TW/login`
- 介面是手機版（縱向、字夠大、按鈕好點）

### 操作
4. 用 `shunyuan / Shun2026!Test`（剛改的新密碼）登入
5. 進入 /zh-TW/learn
6. 點底部的 tab bar 切換頁面

### 預期看到
- ✅ 底部 4 個 tab（學/練/作業/我的）固定在底部
- ✅ 內容不被 tab 遮住
- ✅ 字夠大、按鈕好點
- ✅ 切換語言（如果有 LocaleSwitcher）能用

### 🆘 如果手機連不上
- 確認 Mac IP：`ipconfig getifaddr en0`
- 確認手機跟 Mac 同 WiFi
- Mac 防火牆：系統偏好設定 → 安全性 → 防火牆 → 允許 Node.js
- 還不行：暫時關 Mac 防火牆測試

---

## 📊 終極檢查：MinIO 音檔可直接存取

### 步驟
打開瀏覽器輸入：
```
http://localhost:9000/chinese-learn-audio/zhuyin/symbols/ㄅ.mp3
```

### 預期看到
- ✅ 瀏覽器播放或下載 mp3 檔
- ❌ 顯示 403 Access Denied → bucket 沒 public

如果 ㄅ 字進不了網址（中文編碼問題），改用：
```
http://localhost:9000/chinese-learn-audio/zhuyin/tones/tone-1-媽.mp3
```

---

## ✅ 驗收完成總覽表

請順元逐一打勾，回報給 Anthropic Claude：

```
[ ] 流程 1：強制改密碼能用
[ ] 流程 2：可從 admin/users 模擬登入學員
[ ] 流程 2.1：橙色橫幅顯示
[ ] 流程 2.2：結束模擬可回管理員身份
[ ] 流程 3：注音題型有真人音檔（不是合成音）
[ ] 流程 3.1：答完顯示 +25 XP
[ ] 流程 4：Prisma Studio 看到 UserAttempt 紀錄
[ ] 流程 4.1：User 表 totalXp 有更新
[ ] 流程 5：ZHUYIN 級看不到 A1 課程入口
[ ] 流程 5.1：手動升 A1 後可進 A1 課程
[ ] 流程 6：手機能順利連線並登入
[ ] 終極檢查：MinIO 直接 URL 能播 mp3
```

---

## 📸 順元回報範本

### 全部 OK 的回報
```
P0 全部驗收通過 ✅
- 12/12 項都打勾
- 沒有遇到 bug
```

### 有問題的回報
```
P0 部分驗收通過
- 通過：流程 1, 3, 4, 6
- 失敗：流程 2 — 點「以此身份登入」沒反應
- 失敗：流程 5 — A1 課程沒鎖定
[附上 1-2 張截圖]
```

---

## 🎯 接下來的事

驗收完不論結果如何，請告訴我：

| 結果 | 我會做 |
|---|---|
| 全部 OK | 您直接貼**路徑 A 指令包**給 Claude Code，開始注音班完整化 |
| 有 bug | 我立刻寫**修復指令**給您，貼給 Claude Code 修完再驗收 |
| 部分 OK | 我寫**修復 + 路徑 A 平行**指令包 |

---

🇹🇭 **ลองใช้ดูเลยครับ — กลับมาบอกผลที่นี่นะครับ**
（去測測看吧 — 回來告訴我結果！）
