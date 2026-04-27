# 08_glossary.md — 術語表

> 此檔記錄專案會用到的所有專有名詞（語言學、長照、技術）。
> 寫文件、code comment、提示文字時對齊用語。

---

## 📚 語言學習相關

### TOCFL（Test of Chinese as a Foreign Language）
華語文能力測驗。台灣國家級中文檢定，由國家華語測驗推動工作委員會（華測會）主辦。
- 採 CEFR 對照（A1-C2）
- 分聽讀、口說、寫作三類測驗
- 證書效期 2 年
- 官網：https://tocfl.edu.tw

### CEFR（Common European Framework of Reference for Languages）
歐洲共同語言參考框架。國際通用的語言能力分級標準。
- A1 / A2：基礎使用者
- B1 / B2：獨立使用者
- C1 / C2：熟練使用者

### 注音符號 / Bopomofo / ㄅㄆㄇ
台灣使用的中文標音系統，37 個符號。
- 21 個聲符（ㄅ-ㄙ）
- 3 個介符（ㄧㄨㄩ）
- 13 個韻符（ㄚ-ㄦ）
- 4 個聲調（一二三四聲）+ 輕聲

### 拼音 / Pinyin
中國使用的中文標音系統（用拉丁字母）。
- 雖然中國用拼音，但**台灣繁中系統優先用注音**
- 平台會同時提供注音 + 拼音對照

### SRS（Spaced Repetition System）
間隔重複系統。基於遺忘曲線，動態調整複習間隔的演算法。
- 本專案用 **SM-2 演算法**（源自 Anki）
- 答對拉長間隔，答錯縮短間隔

### EaseFactor / IntervalDays
SRS 演算法的核心參數。
- EaseFactor：簡易係數（預設 2.5，最低 1.3）
- IntervalDays：下次複習間隔（天）

### 漸進式介面（Progressive UI Language）
本專案獨創的漸進式語言切換策略。
- 4 階段：NATIVE → NATIVE_FIRST → BILINGUAL → IMMERSION
- 隨學員等級自動調整

### TTS（Text-to-Speech）
文字轉語音。本專案用 **Microsoft Edge TTS**（zh-TW-HsiaoChenNeural 女聲）。

### STT（Speech-to-Text）
語音轉文字。本專案用 **Whisper**（large-v3 模型）。

### Boss 通關（Level Boss）
每個 Level 結束的綜合考試，通過後升級。
- 含聽/說/讀/寫四項
- 通過 → 發證書 + 觸發績效獎金事件

### Competency（能力指標）
學員學完後「能做什麼」的具體描述。
- 編號：COM-001, GREET-005 等
- 與 Scenario 多對多關聯
- 績效獎金的客觀依據

### Placement Test（入學測驗）
新員工註冊時的快速分級測驗。
- 10-15 題
- 自動推薦起始等級
- 學員可手動覆蓋

---

## 🏥 長照相關

### 照顧服務員 / 照服員
台灣長照系統的正式職稱。
- 需完成 90 小時資格訓練（核心 50 小時 + 實習 40 小時）
- 取得「長照服務人員證明」（俗稱長照小卡）
- 證書 6 年內需累積 120 點繼續教育積分

### 長照 2.0
台灣 2017 年起推行的長期照顧政策。
- 服務對象：65 歲以上失能者、55 歲以上失能原住民、50 歲以上失智者、身心障礙者
- 補助：由政府支付 84-100%

### 養老院 / 養護中心 / 護理之家
不同類型的長照機構：
- **養老院**：自理或輕度照顧（住宿型）
- **養護中心**：中重度照顧（24 小時專業照護）
- **護理之家**：醫療照護（含管路照護）

### 居家照顧 / 居服員
照服員到客戶家提供服務（區別於養老院）。
- 本專案目前**不做居家**，聚焦養老院

### 日間照顧中心
白天照護、晚上回家。本專案不主推但情境課程可能涉及。

### 失智症照護
針對失智症患者的特殊照護。需 20 小時專項訓練。
- 課程 L3-L4 會涵蓋

### 三管照護
鼻胃管、尿管、氣切管的照護。屬進階技術。
- 課程 L3-L4 涵蓋

### 交班 / 交班記錄
照服員換班時的口頭與書面交接。
- L1 學口頭基礎、L3 學書面記錄

### 阿公 / 阿嬤
台語對長輩的親切稱謂。比「老先生/老太太」更常用。
- L1-S02 重點教學

### 長者 / 住民
正式書面用語，指養老院內的老人。

### 失能等級
長照 2.0 把失能分 8 級（第 2-8 級可申請補助）。
- 越高失能越嚴重，補助越多

---

## 🤖 AI 與技術相關

### LM Studio
本地端跑 LLM 的軟體。提供 OpenAI 相容 API。
- 順元的內網主機跑 qwen2.5-72b-instruct

### Ollama
另一個本地 LLM runner。R770 跑 Ollama 為主。
- API：http://192.168.1.214:11434

### Claude API
Anthropic 的雲端 LLM。用於高品質但低頻的任務。
- 主用：claude-sonnet-4-6
- 備用：claude-opus-4-7（更高品質）

### 提示工程 / Prompt Engineering
設計給 AI 的指令，讓回應更準確。
- 系統提示（System Prompt）
- 範例（Few-shot examples）
- 思路鏈（Chain of Thought）

### Edge-TTS
Microsoft Edge 瀏覽器內建的 TTS API（也有 CLI 版）。
- 免費、品質高、支援繁中
- 預生成後存 MinIO

### Whisper
OpenAI 開源的語音辨識模型。本地運行。
- 模型：whisper-large-v3
- 中文辨識率約 95%+

### MinIO
S3 相容的物件儲存。本專案用來存音檔、手寫圖、作業繳交。
- 內網部署
- API: 9000 / Console: 9001

### Redis + BullMQ
Redis 記憶體資料庫 + BullMQ 任務排程。
- 用於：快取、Session、SRS 排程

### PWA（Progressive Web App）
進階網頁應用，可加到主畫面、離線使用。
- 本專案不做 native App，只做 PWA

### NextAuth v5
Next.js 的認證套件。
- v5 是 beta 版（2024 年起逐步穩定）
- 用 JWT 策略

### Prisma
TypeScript 的 ORM。
- Multi-file schema 支援
- Auto-migration
- Prisma Studio 視覺化

### Multi-tenant（多租戶）
一個系統服務多個機構（愛愛院、湖水綠、其他養老院）。
- 用 Facility 模型隔離
- 預留架構，目前單機構

### Impersonation
管理員以學員身份登入，用於測試或客服。
- TTS 5 分鐘
- 一次性使用
- 完整 audit log

### AuditLog
稽核日誌，記錄所有重要操作。
- 90 天保留後歸檔

---

## 🎨 UI / UX 術語

### shadcn/ui
基於 Radix UI 的元件庫。
- 不是 npm 安裝，而是 copy code
- 完全自訂義

### Server Component (RSC)
Next.js App Router 的核心。在伺服器渲染、不送 JS 到瀏覽器。
- 預設都是 RSC
- 加 `"use client"` 才變 Client Component

### Client Component
在瀏覽器執行的元件。可用 hooks、event handler。

### Route Group
Next.js 用 `(name)` 的資料夾組織路由（不影響 URL）。
- (auth) / (learner) / (teacher) / (admin)

### Middleware
Next.js 的中介層，每次請求前執行。
- 用於：認證、i18n routing、Impersonation 守門

---

## 🔐 安全術語

### bcrypt
密碼雜湊演算法。
- 本專案用 cost 12

### JWT（JSON Web Token）
一種 token 格式。NextAuth 用此作 session。

### CSP（Content Security Policy）
內容安全政策，防 XSS。

### CSRF（Cross-Site Request Forgery）
跨站請求偽造。NextAuth 內建防護。

### Rate Limiting
速率限制，防 DDoS / 濫用 AI。
- 全域：60 / 分鐘
- AI：20 / 分鐘

### PII（Personally Identifiable Information）
個人識別資訊。如姓名、護照、電話。
- 護照號加密儲存
- AuditLog 90 天後歸檔

---

## 📊 數據與績效

### XP（Experience Points）
經驗值。學員完成練習獲得。
- 累計於 user.totalXp
- 週累計於 user.weeklyXp（每週一重置）

### Streak（連續學習天數）
連續每天學習的天數。
- 斷一天就歸零（除非用「冰凍卡」未來功能）

### KPI（Key Performance Indicator）
關鍵績效指標。例：月活躍率、A1 通關率。

### NPS（Net Promoter Score）
淨推薦值。問學員「會推薦給同事嗎」。
- 未來實作

### Dashboard
儀表板。給管理員看整體數據。

---

## 🌏 多語系縮寫

### Locale 代碼
- `zh-TW`：繁體中文（台灣）
- `zh-CN`：簡體中文（中國，本專案不支援）
- `th`：泰文
- `vi`：越南文
- `id`：印尼文
- `en`：英文（不主推）

### i18n（Internationalization）
國際化。本專案用 next-intl。

### l10n（Localization）
本地化。具體翻譯文字、調整貨幣格式等。

---

## 💰 商業模式術語

### B2B（Business to Business）
對企業銷售。未來可能賣給其他養老院。

### B2C（Business to Consumer）
對個人銷售。未來可能個人付費學中文。

### MRR（Monthly Recurring Revenue）
月經常性收入。訂閱制財務指標。

### LTV（Lifetime Value）
客戶終身價值。

### CAC（Customer Acquisition Cost）
客戶獲取成本。

### Churn Rate
流失率。例：每月離職員工比例。

---

## 📦 開發流程術語

### MVP（Minimum Viable Product）
最小可行產品。
- 本專案 MVP = Level 0 + Level 1 + 注音題型 + 基本登入

### Sprint
敏捷開發的衝刺週期（通常 1-2 週）。

### Backlog
待辦清單。
- 本專案的 backlog 在 `05_progress.md`

### Migration
資料庫結構變更腳本。
- Prisma 自動產生

### Seed
種子資料。初始化資料庫的測試數據。

### Hotfix
緊急修復。直接從 main 分支修。

### Feature Branch
功能分支。重大變更前先開分支。
- 命名：`feat/impersonation`、`fix/audio-fallback`

---

## 📞 聯絡 / 角色

### 順元（Shun-Yuan）
業主。SUPER_ADMIN。台灣國籍。
- GitHub: ah3-max

### 歐寶（Aobao）
順元的伴侶。泰國籍。
- 可能成為早期測試者

### Anthropic Claude
此 AI 助理。協助設計、寫程式碼、提供建議。

### Claude Code
Anthropic 出的 CLI 工具，整合 VS Code。
- 用於實際 coding

### LM Studio Host
順元內網的 LM Studio 主機（待提供 IP）。

---

## 🆔 角色階層

```
SUPER_ADMIN     最高（順元）
    ↓
ADMIN           系統管理員（順元委派）
    ↓
FACILITY_MGR    養老院主管（看自己院區）
    ↓
HR              人資（看績效獎金）
    ↓
TEACHER         中文老師（管班級、批作業）
    ↓
LEARNER         學員（員工）
```

---

## 📐 課程編碼規則

### Course code
- `ZHUYIN`：注音預備班
- `A1` / `A2` / `B1` / `B2` / `C1` / `C2`：對應 CEFR

### Level 對應 Course
| Level enum | Course code |
|---|---|
| ZHUYIN | ZHUYIN |
| A1_BEGINNER | A1 |
| A2_BASIC | A2 |
| B1_INTERMEDIATE | B1 |
| B2_UPPER_INTER | B2 |
| C1_ADVANCED | C1 |
| C2_PROFICIENT | C2 |

### Stage code (注音 8 階段)
- Z1 / Z2 / .../ Z8 / Z9（Z9 = Boss）

### Scenario code
- 格式：`L?-S??`
- 例：`L1-S02` = Level 1 第 2 個情境

### Lesson code
- 格式：`L?-LS??`
- 例：`L1-LS01` = Level 1 主軸語言課第 1 課
- 或：`L1-S02-Step1` = 情境關卡內的階段

### Competency code
- 格式：`COM-XXX` 或 `分類前綴-XXX`
- 例：`COM-001`、`GREET-005`、`CARE-012`

---

## 🔢 數字代號

### XP 表（建議）
| 動作 | XP |
|---|---|
| 答對一題 | +5 |
| 完美闖關（全對） | +25 |
| 連續 7 天 | +50 bonus |
| 完成情境關卡 | +100 |
| Boss 通關 | +500 |

### 績效獎金表
詳見 `01_business.md` 的「績效獎金規則」

---

## 📝 縮寫速查

| 縮寫 | 全名 | 用途 |
|---|---|---|
| TOCFL | Test of Chinese as a Foreign Language | 對標考試 |
| CEFR | Common European Framework of Reference | 國際分級 |
| SRS | Spaced Repetition System | 間隔重複 |
| TTS | Text-to-Speech | 語音合成 |
| STT | Speech-to-Text | 語音辨識 |
| L1-L6 | Level 1-6 | 等級 |
| ZHUYIN | 注音 | 預備級 |
| LMS | Learning Management System | 學習管理系統 |
| LXP | Learning Experience Platform | 學習體驗平台 |
| HR | Human Resources | 人力資源 |
| KPI | Key Performance Indicator | 關鍵績效 |
| RSC | React Server Component | 伺服器元件 |
| CSC | Client-Side Component | 用戶端元件 |
| RSC | React Server Component | 同上 |
| MVP | Minimum Viable Product | 最小可行產品 |
| ADR | Architecture Decision Record | 架構決策紀錄 |
| ORM | Object-Relational Mapper | Prisma 是 ORM |
| RLS | Row-Level Security | 行級安全（PostgreSQL）|
| SSO | Single Sign-On | 單一登入 |
| PII | Personally Identifiable Information | 個人資訊 |
| OCR | Optical Character Recognition | 光學字元辨識 |
| AED | Automated External Defibrillator | 自動體外去顫器 |
| CPR | Cardiopulmonary Resuscitation | 心肺復甦術 |

---

**See also**：
- `01_business.md` 業務術語的具體應用
- `03_curriculum.md` 課程術語的詳細解釋
- `06_decisions.md` 為何選用這些術語
