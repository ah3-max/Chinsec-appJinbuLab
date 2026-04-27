# 05_progress.md — 進度追蹤

> 此檔由 `npm run claude:update` 半自動維護。
> 部分區段是手動編輯的策略目標。

---

## 🟢 已完成

### Phase 0：基礎建設 (2026-04-26)
- ✅ 專案骨架（Next.js 15 + Prisma + Docker）
- ✅ Prisma schema v1（43 張表）
- ✅ Docker Compose（postgres:5435 / redis:6381 / minio:9000）
- ✅ AI Router（LM Studio / Ollama / Claude）
- ✅ SRS SM-2 演算法
- ✅ 防抄襲 4 層核心
- ✅ Seed 資料（2 facility + 1 admin + 3 課 + 10 詞彙）
- ✅ Git repo + 推 GitHub

### Phase 1：i18n + Auth + 學員端 (2026-04-27)
- ✅ NextAuth v5 登入系統
- ✅ next-intl 多語系（zh-TW + 三語 stub）
- ✅ Locale routing + middleware
- ✅ 登入頁 + 改密頁
- ✅ 學員首頁（顯示等級、XP、streak）
- ✅ 個人頁
- ✅ 注音題型（ZHUYIN_TAP，10 題、5 顆心）
- ✅ Web Speech API 播音（之後升級 Edge-TTS）
- ✅ 4 個 Tab Bar（學/練/作業/我的）
- ✅ 4 commits 累積

### Phase 1.5：v2 記憶系統建立 (2026-04-27)
- ✅ CLAUDE.md 主檔
- ✅ .claude-context/ 8 個子檔
- ✅ scripts/claude-update.ts 自動更新腳本
- ✅ 課程架構 v2 設計（線性升級 + 84 情境）

---

## 🔄 進行中（P0）

### P0-1：超級管理員一鍵登入（Impersonation）
- [ ] `src/lib/auth-impersonate.ts`
- [ ] `POST /api/admin/impersonate/start`
- [ ] `GET /api/admin/impersonate/consume`
- [ ] `POST /api/admin/impersonate/stop`
- [ ] `src/app/[locale]/(admin)/users/page.tsx`
- [ ] `src/components/impersonation-banner.tsx`
- [ ] 安全限制 + AuditLog
- [ ] commit `feat(admin): super-admin impersonation`

### P0-2：強制首次改密碼
- [ ] User schema 加 `mustChangePassword`, `passwordChangedAt`
- [ ] Seed 帳號預設 mustChangePassword=true
- [ ] middleware 偵測並 redirect
- [ ] 改密頁 + API
- [ ] i18n keys
- [ ] commit `feat(auth): force password change on first login`

### P0-3：UserAttempt 寫入 DB + XP/Streak
- [ ] UserAttempt schema 改 exerciseId optional + exerciseSnapshot
- [ ] `POST /api/learn/attempt`
- [ ] `POST /api/learn/session/complete`
- [ ] 前端整合（zhuyin-tap-exercise）
- [ ] 個人頁即時數據
- [ ] anti-cheat.ts
- [ ] commit `feat(learn): persist attempts with xp streak`

### P0-4：依使用者 level 過濾課程
- [ ] `src/lib/level.ts`
- [ ] 學員首頁顯示鎖定狀態
- [ ] Server-side 守門
- [ ] 升級慶祝 modal
- [ ] commit `feat(learn): level-based course gating`

### P0-5：Edge-TTS + MinIO 預載音檔
- [ ] 安裝 edge-tts (pipx)
- [ ] `scripts/generate-zhuyin-audio.ts`
- [ ] `scripts/upload-audio-to-minio.ts`
- [ ] `GET /api/audio/zhuyin/[symbol]`
- [ ] zhuyin-tap-exercise 改用 MinIO 音檔
- [ ] Fallback 到 Web Speech
- [ ] commit `feat(audio): edge-tts pregenerated bopomofo audio`

---

## ⏳ 待辦（P1：豐富課程體驗）

### 注音擴充
- [ ] zhuyin-master.ts 完整 37 符號 + 22 結合韻 + 4 聲調
- [ ] Z1-Z8 完整 8 階段資料灌入
- [ ] Z9 Boss 通關設計

### 題型擴充
- [ ] 看符號選讀音（ZHUYIN_PRODUCTION）
- [ ] 拼字組合（VOCAB_MATCH）
- [ ] 聽寫填空（LISTEN_FILL）
- [ ] 聲調辨識（TONE_DISCRIMINATION）

### 互動體驗
- [ ] 注音手寫板（Canvas + 筆畫記錄）
- [ ] 闖關地圖視覺化（Duolingo 風）
- [ ] 每日任務系統
- [ ] 成就徽章基礎版

### 學習行為
- [ ] streak 連勝邏輯完善
- [ ] SRS 整合（已答對的詞彙進入間隔複習）
- [ ] Daily Mission 自動產生

---

## ⏳ 待辦（P2：A1 級正式上線）

### 內容生產
- [ ] L1-S01 ~ L1-S12 全 12 情境內容（每個約 500 行）
- [ ] L1 詞彙表 300 字完整版
- [ ] L1 語法點 20 個
- [ ] L1 對話腳本 12 篇
- [ ] L1 例句庫 200+ 句
- [ ] L1 Boss 通關題（聽 30 + 說 5 + 讀 30 + 寫 10）
- [ ] L1 證書模板（PDF）

### v2 資料模型
- [ ] Competency model + 灌 L1 能力指標
- [ ] Scenario model + 灌 12 個 L1 情境
- [ ] Certificate model
- [ ] PlacementTest model + 入學測驗題

### AI 整合
- [ ] LM Studio 連線測試（順元提供 IP/Key）
- [ ] 對話練習 API
- [ ] AI 角色扮演 prompt 設計
- [ ] AI 自動批改作業

### 多媒體
- [ ] L1 詞彙音檔（300 字）
- [ ] L1 例句音檔（200 句）
- [ ] L1 對話音檔（12 篇）
- [ ] 漢字筆順 SVG（300 字）

### 入學測驗
- [ ] 15 題快速分級測驗
- [ ] 自動分級邏輯
- [ ] 註冊流程整合

### 多語系翻譯
- [ ] th.json 完整翻譯（取代 [TH] 前綴）
- [ ] vi.json 完整翻譯
- [ ] id.json 完整翻譯

### 教材匯入
- [ ] 順元提供師大/台大課本 PDF
- [ ] `scripts/ingest-pdf.ts`
- [ ] 自動詞彙抽取 + TOCFL 對照
- [ ] 詞彙與情境的交集驗證

---

## ⏳ 待辦（P3：Phase 4+ 整合）

### 老師端後台
- [ ] 班級管理
- [ ] 學員列表 + 進度檢視
- [ ] 作業批改介面
- [ ] AI 初評 + 老師複核

### HR 整合
- [ ] PerformanceMetric 自動產生
- [ ] HR-IMS Webhook 接口
- [ ] 績效獎金計算引擎
- [ ] 月報自動產出

### 進階功能
- [ ] TOCFL 1-4 模擬考題庫
- [ ] PWA 離線支援
- [ ] OpenClaw Heartbeat 整合
- [ ] 多養老院多租戶
- [ ] 防抄襲 4 層完整啟用
- [ ] Whisper 口說錄音評分
- [ ] 真人老師上架平台（未來）

### 商業化（Phase 5）
- [ ] B2B 模式（賣給其他養老院）
- [ ] 個人付費註冊
- [ ] Stripe / 綠界 金流整合
- [ ] 訂閱制 + 一次性購買

---

## 📊 統計儀表板（自動更新）

<!-- AUTO-GENERATED-START: stats -->
- 總任務數：95
- 已完成：0 (0%)
- 進行中：0 (P0)
- 待辦：95

按類別：
- 基礎建設: ████████ 100% (8/8)
- 認證系統: ████████ 100% (5/5)
- 學員端: ███████░ 88% (7/8)
- 課程內容: ░░░░░░░░ 5% (1/20)
- AI整合: ███░░░░░ 33% (2/6)
- 多媒體: ░░░░░░░░ 0% (0/8)
- 老師後台: ░░░░░░░░ 0% (0/4)
- HR整合: ░░░░░░░░ 0% (0/4)
- 商業化: ░░░░░░░░ 0% (0/2)

最近活動：
- 97128f3 feat(admin): super-admin impersonation with audit trail
- 09dae38 feat(dev): quick admin login button gated by NEXT_PUBLIC_ENABLE_QUICK_LOGIN
- 9ae2425 feat(phase-1): tab placeholders + Bopomofo keyboard + ZHUYIN_TAP exercise
- e77ac59 feat(docker): production app container + ops runbook
- f823559 feat(phase-1): i18n, auth, login, learner home
<!-- AUTO-GENERATED-END: stats -->

---

## 📅 預估時程

| 階段 | 預計完成 | 狀態 |
|---|---|---|
| Phase 0 基礎 | 2026-04-26 | ✅ |
| Phase 1 i18n+Auth | 2026-04-27 | ✅ |
| Phase 1.5 記憶系統 | 2026-04-27 | ✅ |
| P0（5 項） | 2026-04-30 | 🔄 |
| P1（題型+地圖） | 2026-05-15 | ⏳ |
| P2（A1 上線） | 2026-06-30 | ⏳ |
| 第一批員工試用 | 2026-07 | ⏳ |
| L2 上線 | 2026-09 | ⏳ |
| HR 整合 | 2026-Q4 | ⏳ |
| L3-L4 | 2027-Q1 | ⏳ |
| 多機構支援 | 2027-Q2 | ⏳ |

---

## 🚧 阻礙與風險

### 已知阻礙
| # | 描述 | 影響 | 解法 |
|---|---|---|---|
| B-001 | 順元的師大/台大課本 PDF 未到 | L1 詞彙不全 | 等順元，先用 TOCFL 標準 |
| B-002 | LM Studio IP/Key 未提供 | AI 對話無法測試 | 先用 Claude API，內網部署時再切 |

### 潛在風險
| # | 描述 | 影響 | 緩解 |
|---|---|---|---|
| R-001 | 學員裝置太舊，PWA 跑不動 | 採用率低 | 提供基本 HTML 降級版 |
| R-002 | AI 對話成本超預算 | 財務壓力 | 內網優先 + 速率限制 |
| R-003 | 績效獎金規則複雜，HR 反彈 | 整合延後 | 先做試營運，調規則 |
| R-004 | 真人老師招募困難 | 內容品質 | AI 寫初稿 + 順元抽核 |

---

## 📝 給未來的自己

### 重要里程碑記錄
- 2026-04-26 16:00 — 第一個 commit，專案誕生
- 2026-04-27 ?? — Phase 1 全部完成
- 2026-04-27 ?? — v2 記憶系統 + 課程架構重設計
- 待補：第一個員工註冊
- 待補：第一個 Boss 通關
- 待補：第一張證書發出
- 待補：第一筆績效獎金入薪

---

**See also**：
- 對話歷史：跟 Anthropic Claude 的對話包含完整歷史脈絡
- GitHub commits：`git log --oneline`
- `06_decisions.md` 重要轉折點的決策理由
