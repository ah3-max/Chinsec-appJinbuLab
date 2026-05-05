# 歐寶測試指南 (Aobao Testing Guide)

> 最後更新: 2026-05-05

## 帳號

| 欄位 | 值 |
|------|-----|
| username | `aobao` |
| password | `Aobao@2026` (首次登入需改密) |
| email | aobao@aiai.org.tw |
| 等級 | A1_BEGINNER（直接跳過注音班） |
| 介面語 | 泰文 (th) |

## 入口

| 環境 | URL |
|------|-----|
| 本機 (電腦) | http://localhost:3003 |
| 手機 / 同 WiFi | http://192.168.1.70:3003 |
| 自動登入連結 | http://localhost:3003/th/login?email=aobao%40aiai.org.tw&password=Aobao%402026&auto=1 |

---

## 測試流程

### 步驟 1：登入
1. 用 `aobao` / `Aobao@2026` 登入
2. 系統強制要求改密碼 → 改成自己記得的（例：`Obo2026!`）
3. 改完後跳轉到 `/th/learn`

### 步驟 2：學 L1-S01 — 第一天上班自我介紹
1. `/th/learn` 看到 3 個情境卡片（S01 / S02 / S03）
2. 點 **L1-S01**
3. **詞彙頁**：10 個核心詞（我/你/您/是/好/名字/叫/來自/泰國/工作）
   - 確認注音顯示正確（小字、灰色、置漢字上方）
   - 確認拼音顯示正確（斜體、漢字下方）
   - 確認泰文翻譯是否自然
   - 點喇叭 🔊 確認音檔能播放
4. **對話頁**：歐寶第一天上班 vs 主任對話
   - 確認中文 + 拼音 + 泰文翻譯都顯示
5. **練習頁**：8 道題
   - VOCAB_MCQ、LISTEN_CHOOSE、GRAMMAR_FILL 等題型
   - 答完確認得分正確

### 步驟 3：同樣走完 S02 與 S03
- **S02**: 早安問候阿公阿嬤
- **S03**: 認識同事

### 步驟 4：標記翻譯問題（TranslationReport）
- 看到任何覺得翻譯不自然的詞彙/例句
- **長按** 或 **右鍵** 泰文文字 → 跳出「標記翻譯不對」選單
- 輸入建議翻譯 → 送出
- 確認 Prisma Studio 中 `translation_reports` 表有紀錄

### 步驟 5：回饋給順元
走完 3 個情境後，請歐寶告訴順元：
1. 哪些泰文翻譯需要修改（已用翻譯標記功能標記）
2. 哪個對話腳本語氣不對或太奇怪
3. 哪些詞彙太難或太簡單
4. UI 操作上有沒有不順手的地方
5. 音檔聽起來自然嗎？

---

## vi / id 啟動條件

等歐寶 L1-S01 ~ S03 全部走完，且：
- 至少有 5 筆 TranslationReport 提交（代表泰文翻譯基準已確認）

順元再執行：
```bash
cd "/Users/natpassornkaewkuljeerapat/Desktop/OPAL AI/chinese-learn"
export $(grep -E '^DATABASE_URL' .env.local | xargs)

# 先跑越南文
npx tsx scripts/generate-translations.ts --target vi --scenario all

# 再跑印尼文
npx tsx scripts/generate-translations.ts --target id --scenario all
```

---

## 管理員查看方式

### 查看 TranslationReport
```bash
# Prisma Studio
npm run db:studio
# 打開 http://localhost:5555 → TranslationReport 表
```

### 以歐寶身份模擬登入
1. 登入 shunyuan 帳號（`http://localhost:3003/zh-TW/login`）
2. Admin → 使用者管理 → 找到 aobao
3. 點「以此身份登入」

---

## 已知限制
- vi / id 翻譯目前填充 `[VI-AUTO-PENDING]` / `[ID-AUTO-PENDING]`，等歐寶確認泰文後再批次生成
- SPEAK_REPEAT 題型（跟讀）目前不計分，Whisper STT 整合在 P2
- WRITE_HANZI 題型（手寫）canvas 展示中，批改功能在 P2
