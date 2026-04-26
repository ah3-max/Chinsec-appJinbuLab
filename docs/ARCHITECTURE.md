# 🏗️ ChineseLearn 系統架構文件

> 最後更新：2026-04-26
> 維護者：順元 (Shun-Yuan)

---

## 1. 系統概觀

### 1.1 業務定位
為愛愛院多籍照顧服務員設計的繁體中文學習平台，整合：
- **TOCFL 標準分級** (CEFR A1-C1)
- **養老院照護情境** (專業詞彙)
- **辦公室商用中文** (中階人力)
- **零基礎日常生活**
- **手寫 + 防抄襲作業**
- **多鄰國式闖關體驗**

### 1.2 部署拓撲

```
                        ┌──────────────────────────┐
                        │  Cloudflare Tunnel       │
                        │  (lingo.your-domain.com) │
                        └───────────┬──────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   公司內網 (LAN)    │
                         └──────────┬──────────┘
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
   ┌────────▼─────────┐   ┌────────▼─────────┐   ┌─────────▼────────┐
   │  Mac Mini M4     │   │  Dell R770       │   │  LM Studio 主機  │
   │  ChineseLearn    │   │  (192.168.1.214) │   │  (順元提供 IP)   │
   │  Next.js + DB    │   │  Ollama + GPU    │   │  qwen2.5-72b     │
   │  Port: 3003      │   │  Port: 11434     │   │  Port: 1234      │
   └──────────────────┘   └──────────────────┘   └──────────────────┘
```

### 1.3 與既有系統的關係

| 系統 | 整合點 | 目前狀態 |
|---|---|---|
| 外部 HR 系統 | 員工帳號 (`hrSyncId`) | 預留接口，未啟用 |
| LTC-IMS 養老院 | 員工檔案 (`ltcImsSyncId`) | 預留接口，未啟用 |
| OpenClaw Heartbeat | 監控回報 | 已預留 webhook |
| 14-bot Telegram | 通知推播 (預留) | 未來整合 |

---

## 2. 技術選型

### 2.1 為何選擇 Next.js 全端？
- **與既有 ERP 同架構**：未來合併容易
- **單一語言 (TypeScript)**：減少維護成本
- **Server Components**：減少前端 bundle，手機友善
- **App Router**：天然支援多語系路由
- **Vercel/Docker 雙部署**：靈活

### 2.2 AI 模型分流策略

```
┌────────────────────────────────────────────────────────┐
│                    AI Router                           │
│  根據任務類型選擇最適合的模型，並提供 fallback        │
└────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   即時對話          作業批改          深度分析
   高頻任務          中度任務          低頻任務
        │                │                │
        ▼                ▼                ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ LM Studio│    │ Ollama   │    │ Claude   │
  │ qwen2.5  │    │ qwen2.5  │    │ Sonnet 4 │
  │ 內網 GPU │    │ R770 GPU │    │ API 雲端 │
  └──────────┘    └──────────┘    └──────────┘
```

**任務分配範例：**
- 對話練習 → LM Studio (反應快、零成本)
- 詞彙解釋 → LM Studio
- 作業初評 → Ollama
- 作文深度分析 → Claude (品質要求高)
- 課程設計 → Claude
- 抄襲語義檢測 → Claude

---

## 3. 資料模型核心

### 3.1 Schema 模組化結構

```
prisma/schema/
├── 01_auth.prisma          # 帳號權限 (User/Facility/Class/Session)
├── 02_curriculum.prisma    # 課程內容 (Course/Stage/Lesson/Vocab/Grammar)
├── 03_exercise.prisma      # 練習題 + SRS (Exercise/UserAttempt/SrsSchedule)
├── 04_homework.prisma      # 作業防抄襲 (Homework/Submission/PlagiarismCheck)
├── 05_speaking_writing.prisma  # 口說手寫 (SpeakingRecord/HandwritingRecord)
├── 06_exam_kpi.prisma      # 模擬考績效 (MockExam/Achievement/PerformanceMetric)
└── 07_ai_system.prisma     # AI 與系統 (AiConversation/AuditLog/Notification)
```

### 3.2 關鍵資料流

```
員工註冊 → User (含 nationality, nativeLanguage)
         → Enrollment (加入班級)
         → 開始 Stage 1.1 第一課

學習過程：
Lesson 課程內容 → Exercise 練習題 → UserAttempt 答題記錄
                                  ↓
                              SRS 排程更新 → 下次複習時間

作業繳交：
Homework → Submission (含手寫筆跡) → 防抄襲檢測 → AI 初評 → 老師批改
                                                            ↓
                                              PerformanceMetric 績效計算
                                                            ↓
                                              連動獎金 (預留 HR 同步)
```

---

## 4. 課程內容架構

### 4.1 級別系統

| 主級別 | 階段數 | 預計關卡 | 詞彙 |
|---|---|---|---|
| 0. 注音預備班 | 4 | 20 | 37 注音 |
| 1. 入門 (A1) | 8 | 40 | 500 字 |
| 2. 基礎 (A2) | 10 | 50 | 1,000 字 |
| 3. 進階 (B1) | 12 | 60 | 2,500 字 |
| 4. 高階 (B2) | 12 | 60 | 5,000 字 |
| 5. 流利 (C1) | 14 | 70 | 8,000 字 |
| 6. 精通 (C2) | 14 | 70 | 8,000+ 字 |

### 4.2 並行情境課程

**情境 A：養老院照護中文** (橫跨 A1-B2)
- A1：身體部位、基本問候、日常照護用語
- A2：交班記錄、家屬溝通、簡易病況
- B1：護理術語、緊急應變、跌倒處理
- B2：照護計畫撰寫、團隊會議

**情境 B：辦公室商用中文** (A2-B2)
- A2：接電話、Email 收發
- B1：會議發言、簡報報告
- B2：合約用語、商務談判

**情境 C：在台生活中文** (Pre-A1 救急包，跨級)
- 入境、找房、銀行
- 看醫生、買藥
- 交通、外送、便利商店

---

## 5. 安全與隱私

### 5.1 密碼與身份
- 密碼：bcrypt (cost 12)
- Session：NextAuth v5 + JWT 滑動視窗
- 多裝置：每裝置獨立 Session
- 失敗鎖定：5 次失敗鎖 15 分鐘

### 5.2 敏感資料
- 護照號碼：AES-256 加密儲存
- 語音資料：員工同意後才用於訓練
- 手寫筆跡：同上
- 隱私政策版本化追蹤

### 5.3 資料保留
- 學習記錄：員工在職期間 + 5 年
- 作業繳交：3 年
- 語音/手寫原檔：1 年（除非員工授權延長）

---

## 6. 防抄襲機制

### 6.1 4 層防護

| 層級 | 方法 | 觸發 | 處理 |
|---|---|---|---|
| L1 | SimHash 指紋 | 即時 | 同班相似度 > 85% 標警 |
| L2 | 餘弦相似度 | 繳交後 | > 75% 進入 L3 |
| L3 | AI 語義分析 | 必要時 | Claude 判斷是否「換句話說」 |
| L4 | 行為分析 | 即時 | 時間/貼上/失焦異常 |

### 6.2 強制手寫機制
- 寫作題開啟「強制手寫」模式
- 記錄完整筆畫資料 (時間戳)
- 同班內筆順模式比對
- 與該員工歷史筆跡比對 (預留)

---

## 7. 多語系實作

### 7.1 介面語言切換
```
src/i18n/
├── zh-TW.json       # 繁體中文 (預設、教學內容)
├── th.json          # 泰文
├── vi.json          # 越南文
├── id.json          # 印尼文
└── en.json          # 英文 (備援)
```

### 7.2 學員體驗策略
- **介面**：用學員母語（按鈕、提示、回饋）
- **教學內容**：永遠繁體中文 + 注音 + 母語翻譯對照
- **AI 對話**：學員初級時混合（中文為主、母語輔助）

---

## 8. 開發里程碑

### Phase 0：基礎建設 ✅ (本週)
- [x] 專案骨架
- [x] Docker Compose
- [x] Prisma Schema 完整版
- [x] AI 路由器
- [x] SRS 演算法
- [x] 防抄襲核心
- [ ] GitHub repo 建立並推送
- [ ] CI/CD 基本流程

### Phase 1：注音 + A1 入門 (4 週)
- [ ] 注音教學 + 互動測驗
- [ ] 500 詞彙 + edge-tts 音檔批次生成
- [ ] 5 種基本題型
- [ ] 學員端手機 UI (闖關地圖)
- [ ] 老師端基本後台

### Phase 2：闖關核心 + AI 對話 (4 週)
- [ ] LM Studio 對話練習
- [ ] 口說錄音 + Whisper STT
- [ ] 手寫板 + tesseract OCR
- [ ] SRS 每日複習推送

### Phase 3：作業 + 防抄襲 (3 週)
- [ ] 老師批改後台
- [ ] 4 層防抄襲完整實作
- [ ] 模擬 TOCFL 1 考試

### Phase 4：情境 + HR 整合 (4 週)
- [ ] 養老院照護中文內容
- [ ] 辦公室商用中文
- [ ] 績效獎金計算 + 預覽
- [ ] HR-IMS 同步介面 (預留)

### Phase 5：擴充與優化 (持續)
- [ ] A2-B2 課程內容
- [ ] 多養老院上線
- [ ] PWA 離線支援
- [ ] OpenClaw Heartbeat 整合

---

## 9. API 設計概要

### 9.1 學員端
```
POST   /api/auth/login
GET    /api/learn/map              # 闖關地圖
GET    /api/learn/lesson/:id       # 取得單元
POST   /api/learn/attempt          # 提交答題
GET    /api/learn/srs/today        # 今日複習
POST   /api/speak/record           # 上傳口說錄音
POST   /api/handwrite/submit       # 提交手寫
POST   /api/ai/chat                # AI 對話練習
```

### 9.2 老師端
```
GET    /api/teacher/classes
POST   /api/teacher/homework
GET    /api/teacher/submissions/:hwId
PATCH  /api/teacher/submission/:id/grade
GET    /api/teacher/plagiarism/flagged
```

### 9.3 管理員端
```
GET    /api/admin/users
POST   /api/admin/users/import     # 批次匯入員工
GET    /api/admin/performance/:period
POST   /api/admin/sync/hr          # 觸發 HR 同步
GET    /api/admin/heartbeat        # 系統健康狀態
```

---

## 10. 相關文件

- [課程設計文件](./CURRICULUM.md)
- [API 文件](./API.md)
- [部署文件](./DEPLOYMENT.md)
- [Claude Code 開發指引](./CLAUDE_CODE_GUIDE.md)
