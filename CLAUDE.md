# CLAUDE.md — Project Memory for Claude Code

> 此檔由 Claude Code 啟動時自動載入。包含專案核心 context。
> 細節請依需要 view `.claude-context/` 內的子檔。
> 最後更新：自動由 `npm run claude:update` 維護

---

## 🎯 專案身份識別

**專案名稱**：ChineseLearn（愛愛院員工繁體中文學習平台）
**業主**：順元（SUPER_ADMIN, 帳號 shunyuan）
**核心目標**：讓愛愛院東南亞籍照服員學會工作必要的中文，並透過內部認證接續績效獎金
**對標**：Duolingo 的學習體驗 + TOCFL 的詞彙標準 + 台灣養老院實務情境

**學員群體（4 種 Persona）**：
1. 住院照護的東南亞籍照服員（最大群、零基礎、績效掛鉤）
2. 辦公室行政的中間人力（已有 A2-B1 基礎）
3. 廚房 / 清潔 員工（可能識字弱）
4. 師大 / 台大語言中心學生（A2-B2、考試導向）

---

## 🧭 工作協定（給 Claude Code）

### 核心原則
1. **每次啟動先讀此檔**，再依需要 view 子檔
2. **不要重新發明**：先檢查既有實作再動手
3. **每完成 1 個 task 立即 git commit**，不要堆積
4. **遇到方向級決策才停下問順元**，瑣碎細節依規範自決
5. **泰文對話 OK**，但 code/comment 用繁體中文或英文
6. **不在 main 分支直接做大改**，重大變動開 feature branch

### Claude Code 與順元 (人類) 的責任邊界
| Claude Code 自行處理 | 須請示順元 |
|---|---|
| npm 套件版本錯誤 | 業務邏輯不確定 |
| Next.js / NextAuth / Prisma 細節 | 課程內容方向 |
| 遵循既有規範的命名 | 資料模型大改 |
| Bug 修復、refactor | 影響成本/性能/安全的選型 |
| Git commit 訊息 | 帳號、權限規則變更 |

---

## 📋 子檔索引（按需 view）

| 子檔 | 何時讀取 |
|---|---|
| `.claude-context/01_business.md` | 業務問題、學員、養老院、商業模式 |
| `.claude-context/02_architecture.md` | 技術選型、目錄結構、部署、AI 路由 |
| `.claude-context/03_curriculum.md` | 課程設計、7 Levels、84 情境關卡、教學法 |
| `.claude-context/04_data_model.md` | Prisma schema 摘要、主要 model 關聯 |
| `.claude-context/05_progress.md` | 已完成的 phase、todo 清單、現況 |
| `.claude-context/06_decisions.md` | 重要技術決策記錄與理由 |
| `.claude-context/07_known_issues.md` | 已知問題與 workaround |
| `.claude-context/08_glossary.md` | 術語：TOCFL/CEFR/SRS/Bopomofo/長照 |

---

## 🏗️ 技術棧速查

```
Frontend:  Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui
State:     Zustand + TanStack Query
Auth:      NextAuth v5 + bcryptjs
Database:  PostgreSQL 16 + Prisma 5
Cache:     Redis 7 (BullMQ)
Storage:   MinIO (S3 相容)
i18n:      next-intl (zh-TW / th / vi / id)
AI Router: LM Studio (主) + Ollama (備) + Claude API (進階)
TTS:       edge-tts (zh-TW-HsiaoChenNeural)
STT:       Whisper (via LM Studio)
Deploy:    Docker Compose + Nginx + Cloudflare Tunnel
```

### 服務 Port（重要）
- Next.js dev: **3003**
- PostgreSQL: **5435**（不是預設 5432）
- Redis: **6381**（曾因衝突從 6380 改）
- MinIO API: **9000**, Console: **9001**

### 環境變數讀取
- `.env.local`：應用敏感變數（給 Next.js）
- `.env`：Prisma 用（簡化版，只有 DATABASE_URL）
- 跑 prisma 命令前要 `export $(grep -E '^DATABASE_URL' .env.local | xargs)`

---

## 🎓 課程架構速查（v2 線性升級制）

### 7 個等級（必須照順序，前一級 Boss 通關才解鎖下一級）

| Level | 代號 | 名稱 | 詞彙 | 對標 | 介面語 |
|---|---|---|---|---|---|
| 0 | ZHUYIN | 注音預備班 | 37 注音 + 4 聲調 | — | 純母語 |
| 1 | A1_BEGINNER | 入門級 | 300 字 | TOCFL 1 | 母語為主 |
| 2 | A2_BASIC | 基礎級 | 600 字 | TOCFL 2 | 雙語對照 |
| 3 | B1_INTERMEDIATE | 進階級 | 1500 字 | TOCFL 3 | 雙語對照 |
| 4 | B2_UPPER_INTER | 高階級 | 3000 字 | TOCFL 4 | 中文沉浸 |
| 5 | C1_ADVANCED | 流利級 | 5000 字 | TOCFL 5 | 純中文 |
| 6 | C2_PROFICIENT | 精通級 | 8000+ 字 | TOCFL 6 | 純中文 |

### 每個 Level 內含
- **主軸語言課**（詞彙、語法、發音）
- **12 個養老院情境關卡**（從基本招呼到專業護理）
- **Boss 通關考試**（聽/說/讀/寫四項，達 80% 升級 + 發證書 + 觸發績效獎金事件）

### 84 個情境關卡的主題
全部 **養老院相關**，由順元選定主題。詳見 `.claude-context/03_curriculum.md`。

範圍從：
- L1: 招呼、自我介紹、認識阿公阿嬤、身體部位、簡單詢問...
- L2: 餵食、喝水、吃藥、洗澡、上廁所、翻身、量血壓...
- L3: 交班記錄、家屬溝通、簡易病況描述、跌倒處理...
- L4: 護理術語、緊急狀況通報、用藥安全、復健協助...
- L5: 領班職責、新人培訓、團隊會議、品質改善...
- L6: 政策說明、跨部門協調、長照法規、評鑑準備...

---

## 🔐 帳號與認證

### 角色階層
```
SUPER_ADMIN > ADMIN > FACILITY_MGR > TEACHER > HR > LEARNER
```

### 預設帳號（Seed）
| 帳號 | 角色 | 預設密碼 | 用途 |
|---|---|---|---|
| `shunyuan` | SUPER_ADMIN | ChangeMe@2026 | 業主測試帳號 |
| `testlearner_th` | LEARNER | Test@2026 | 泰籍學員測試 |
| `testlearner_vi` | LEARNER | Test@2026 | 越南籍測試 |
| `testlearner_id` | LEARNER | Test@2026 | 印尼籍測試 |

⚠️ 所有帳號 `mustChangePassword: true`，首次登入強制改密碼。

### 超級管理員一鍵模擬登入
- `POST /api/admin/impersonate/start` 產生 token
- `GET /api/admin/impersonate/consume?token=xxx` 切換身份
- `POST /api/admin/impersonate/stop` 結束模擬
- 詳見 `src/lib/auth-impersonate.ts`

---

## 🤖 AI 路由策略

**所有 AI 呼叫一律透過 `src/lib/ai/router.ts`，禁止直接呼叫各家 SDK**。

| 任務類型 | 主用 | 備援 |
|---|---|---|
| 即時對話練習 | LM Studio | Ollama → Claude |
| 詞彙解釋 | LM Studio | Ollama |
| 語法簡單檢查 | LM Studio | Ollama |
| 作業初評 | Ollama | Claude |
| 發音回饋 | Ollama | LM Studio |
| 作文深度分析 | Claude | (無備援) |
| 課程設計 | Claude | (無備援) |
| 抄襲語義檢測 | Claude | (無備援) |

---

## 📐 開發規範

### 命名
| 類型 | 風格 | 範例 |
|---|---|---|
| DB 表名 | snake_case 複數 | `user_attempts` |
| Prisma model | PascalCase 單數 | `UserAttempt` |
| TS 型別 | PascalCase | `LearnerProfile` |
| 變數函式 | camelCase | `calculateXp` |
| React 元件 | PascalCase | `LessonCard` |
| 檔案名 | kebab-case | `lesson-card.tsx` |
| 路由 | kebab-case | `/learn/lesson-detail` |
| i18n key | dot.notation | `learn.lesson.start_button` |

### Git Commit (Conventional Commits)
```
feat(scope):     新功能
fix(scope):      修 bug
docs(scope):     文件
refactor(scope): 重構
chore(scope):    雜項

scope 範例：admin / auth / learn / audio / ai / db / phase-N
```

### 禁止事項 ❌
- 直接呼叫 `@anthropic-ai/sdk`（要走 router）
- 用簡體中文寫教學內容
- 改 `prisma/migrations/` 已產生的檔案
- commit `.env.local` 或學員真實個資
- 在 Server Component 用 `useState` 等 hook
- 把 `localStorage` 用在 artifacts（已知不支援）

### 必做事項 ✅
- 改 schema 後跑 `npx prisma generate`
- 加 i18n key 時 4 個語系檔都要更新（其他 3 語可先標 [TH] 等前綴）
- 敏感欄位加密（護照號、住址）
- 大改前先讀 `.claude-context/02_architecture.md`
- commit 前 `npm run type-check && npm run lint`

---

## 🚦 目前進度狀態（自動更新）

<!-- AUTO-GENERATED-START: progress -->
- ✅ Phase 0: 基礎建設（Docker、Prisma、AI 路由）
- ✅ Phase 1: i18n、Auth、Login、學員首頁、注音題型
- ✅ P0: Impersonation、強制改密、UserAttempt、Level 過濾、Edge-TTS
- ✅ Path A: 注音班完整化 (stages Z1-Z9 + 29 lessons + 249 exercises + Boss + 證書)
- ⏳ P1 待辦: 看符號選讀音、拼字、聽寫填空、Lesson player、手寫板、闖關地圖
- ⏳ P2 待辦: 84 情境關卡內容、AI 對話、Whisper、多語翻譯
- ⏳ P3 待辦: 老師後台、HR 整合、TOCFL 模擬考、多租戶
<!-- AUTO-GENERATED-END: progress -->

---

## 🛠️ 常用指令速查

```bash
# 開發
npm run dev                  # 啟動 Next.js (3003)
npm run db:studio            # Prisma Studio (5555)
npm run docker:dev           # 啟動 Docker 服務

# 資料庫
npx prisma migrate dev --name 描述   # 改 schema 後
npx prisma generate                  # 產 client
npm run db:seed                      # 灌種子

# AI
npx tsx scripts/test-lm-studio.ts    # 測試 LM Studio
npx tsx scripts/generate-zhuyin-audio.ts  # 生成音檔

# 維護
npm run claude:update                # 更新此檔的進度區段
npm run type-check
npm run lint
```

---

## 📞 求救三步驟

當遇到不確定的情況：
1. **先 view 對應的子檔**（`.claude-context/0X_xxx.md`）
2. 仍不清楚 → **看 `.claude-context/06_decisions.md`** 是否有先例
3. 都沒有 → **問順元**（用繁體中文或泰文皆可）

---

## 🔗 重要連結

- GitHub: `https://github.com/ah3-max/chinese-learn`
- 本機開發: `http://localhost:3003`
- Prisma Studio: `http://localhost:5555`
- MinIO Console: `http://localhost:9001`
- 順元的台灣 GitHub 帳號: `ah3-max`

---

## ⚡ 此檔的維護規則

- **不要手動改自動產生的區段**（標 `<!-- AUTO-GENERATED -->` 的）
- **可以手動改其他區段**，但 commit 時加 `chore(memory): update CLAUDE.md`
- **大改架構前**先在 `.claude-context/06_decisions.md` 記錄理由
- **每月** Anthropic 員工會 audit 此檔是否與實況一致

---

**END OF CLAUDE.md** — 細節請 view `.claude-context/` 子檔
