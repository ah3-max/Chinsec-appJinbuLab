# 02_architecture.md — 技術架構

> 此檔記錄技術選型、目錄結構、AI 路由、部署拓撲、整合接口。
> 大改架構前必讀。

---

## 🏗️ 技術棧（Stack）

### 為何選擇這個 Stack？
此 Stack 與順元另一個專案 ComfortPlus ERP 一致，未來可合併到統一的養老院作業平台。

### 完整堆疊
| 層級 | 技術 | 版本 | 替代方案 | 為何不選替代 |
|---|---|---|---|---|
| Framework | Next.js | 15 (App Router) | Nuxt / SvelteKit | 與 ComfortPlus 同 |
| 語言 | TypeScript | 5.6+ | JavaScript | 大型專案必要 |
| UI Lib | Tailwind + shadcn/ui | 3.4+ | MUI / Chakra | 客製化空間大 |
| Animation | Framer Motion + Lottie | 11+ | GSAP | 與 React 整合好 |
| State (client) | Zustand + TanStack Query | 5+ / 5+ | Redux / Recoil | 輕量、PWA 友善 |
| Form | react-hook-form + zod | 7+ / 3+ | Formik | 效能好、TS 友善 |
| ORM | Prisma | 5.22+ | Drizzle / TypeORM | Multi-file schema 支援 |
| DB | PostgreSQL | 16-alpine | MySQL | JSON、enum、全文搜尋 |
| Cache | Redis | 7-alpine | Memcached | 支援 BullMQ 排程 |
| 物件儲存 | MinIO | latest | AWS S3 | 內網部署 |
| Auth | NextAuth | v5 (beta) | Clerk / Supabase Auth | 自架、預留 SSO |
| i18n | next-intl | 3+ | react-i18next | App Router 原生支援 |
| PWA | next-pwa + Workbox | 5+ | 自寫 SW | 標準方案 |
| AI Router | 自寫 | — | LangChain | 簡單路由不需要框架 |
| TTS | edge-tts (CLI) | latest | Azure / Google | 免費、繁中品質好 |
| STT | Whisper | large-v3 | OpenAI API | 內網運行 |

---

## 📂 目錄結構

```
chinese-learn/
├── CLAUDE.md                       ⭐ Claude Code 自動載入
├── .claude-context/                Claude Code 細節記憶
│   ├── 01_business.md
│   ├── 02_architecture.md           (本檔)
│   ├── 03_curriculum.md
│   ├── 04_data_model.md
│   ├── 05_progress.md
│   ├── 06_decisions.md
│   ├── 07_known_issues.md
│   └── 08_glossary.md
│
├── README.md                        對外說明（給 Cursor、人類讀）
├── package.json
├── Dockerfile
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── .env.example
├── .env.local                       (gitignore)
├── .env                             (gitignore，給 Prisma)
│
├── docker/
│   ├── docker-compose.yml          開發環境
│   └── docker-compose.prod.yml     生產環境
│
├── prisma/
│   ├── schema/                     多檔 Prisma schema
│   │   ├── 00_config.prisma        generator + datasource
│   │   ├── 01_auth.prisma          User/Facility/Class
│   │   ├── 02_curriculum.prisma    Course/Stage/Lesson
│   │   ├── 03_exercise.prisma      Exercise/UserAttempt/SrsSchedule
│   │   ├── 04_homework.prisma      Homework/Submission
│   │   ├── 05_speaking_writing.prisma
│   │   ├── 06_exam_kpi.prisma
│   │   └── 07_ai_system.prisma
│   ├── migrations/                 (auto-managed)
│   └── seed/index.ts
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              Root layout
│   │   ├── globals.css
│   │   ├── [locale]/
│   │   │   ├── layout.tsx          Locale layout (NextIntlProvider)
│   │   │   ├── page.tsx            首頁
│   │   │   ├── (auth)/             路由群組：登入/改密
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── change-password/page.tsx
│   │   │   ├── (learner)/          路由群組：學員端
│   │   │   │   ├── layout.tsx      含 BottomNav + ImpersonationBanner
│   │   │   │   ├── learn/
│   │   │   │   │   ├── page.tsx    課程地圖
│   │   │   │   │   └── [courseCode]/[stageCode]/[lessonCode]/page.tsx
│   │   │   │   ├── practice/
│   │   │   │   ├── homework/
│   │   │   │   └── profile/
│   │   │   ├── (teacher)/          老師端 (Phase 3)
│   │   │   └── (admin)/            管理員端
│   │   │       ├── layout.tsx
│   │   │       ├── users/
│   │   │       ├── facilities/
│   │   │       ├── kpi/
│   │   │       └── integrations/
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── auth/change-password/route.ts
│   │       ├── admin/impersonate/{start,consume,stop}/route.ts
│   │       ├── learn/{attempt,session/complete}/route.ts
│   │       ├── audio/zhuyin/[symbol]/route.ts
│   │       ├── ai/chat/route.ts        統一 AI 對話入口
│   │       ├── speech/{tts,stt}/route.ts
│   │       └── health/route.ts
│   │
│   ├── components/
│   │   ├── ui/                     shadcn/ui 元件
│   │   ├── auth/
│   │   ├── learner/
│   │   │   ├── bottom-nav.tsx
│   │   │   ├── level-up-modal.tsx
│   │   │   └── course-map.tsx
│   │   ├── admin/
│   │   ├── zhuyin/
│   │   │   ├── keyboard.tsx
│   │   │   └── zhuyin-tap-exercise.tsx
│   │   ├── exercises/              各種題型
│   │   └── impersonation-banner.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts                 NextAuth config
│   │   ├── auth-impersonate.ts
│   │   ├── db.ts                   Prisma client singleton
│   │   ├── redis.ts                Redis client singleton
│   │   ├── minio.ts                MinIO client
│   │   ├── ai/
│   │   │   ├── router.ts           智慧分流
│   │   │   ├── lm-studio.ts
│   │   │   ├── ollama.ts
│   │   │   └── claude.ts
│   │   ├── srs/index.ts            SM-2 演算法
│   │   ├── plagiarism/index.ts     防抄襲 4 層
│   │   ├── anti-cheat.ts           行為分析
│   │   ├── level.ts                等級判斷
│   │   ├── tts/index.ts            edge-tts wrapper
│   │   ├── stt/index.ts            Whisper wrapper
│   │   └── zhuyin/data.ts          注音資料
│   │
│   ├── content/                    課程內容（v2 新增）
│   │   ├── zhuyin-master.ts        37 注音完整資料
│   │   ├── scenarios/              84 個情境關卡的內容
│   │   │   ├── L1-S01-greeting.ts
│   │   │   ├── L1-S02-self-intro.ts
│   │   │   └── ...
│   │   └── glossary/               術語對照（中-母語）
│   │
│   ├── i18n/
│   │   ├── routing.ts
│   │   ├── request.ts
│   │   ├── navigation.ts
│   │   └── messages/
│   │       ├── zh-TW.json
│   │       ├── th.json
│   │       ├── vi.json
│   │       └── id.json
│   │
│   ├── hooks/
│   ├── stores/                     Zustand stores
│   ├── types/
│   │   └── next-auth.d.ts
│   └── middleware.ts
│
├── scripts/
│   ├── setup-day1.sh
│   ├── claude-update.ts            ⭐ 自動更新 CLAUDE.md
│   ├── generate-zhuyin-audio.ts
│   ├── upload-audio-to-minio.ts
│   ├── ingest-pdf.ts               匯入師大/台大課本
│   ├── seed-tocfl.ts
│   └── test-lm-studio.ts
│
├── public/
│   ├── audio/                      靜態音檔（生成後上傳 MinIO）
│   ├── icons/
│   └── locales/
│
├── tests/
└── docs/
    ├── ARCHITECTURE.md             (對外用，可省略)
    └── DEPLOYMENT.md
```

---

## 🤖 AI 路由架構（重要）

### 設計原則
1. **內網優先**：減少 API 成本、保護學員資料
2. **任務分類**：簡單即時 → 本地，複雜深度 → Claude
3. **智慧 fallback**：本地失敗自動切雲端

### 三層 AI 服務

```
┌─────────────────────────────────────┐
│       src/lib/ai/router.ts          │
│       routeAiRequest({ task, ... }) │
└──────┬──────────────┬───────────────┘
       │              │
       ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│LM Studio │   │ Ollama   │   │ Claude   │
│(順元主機)│   │ (R770)   │   │ API      │
│即時對話  │   │ 中等任務 │   │ 深度任務 │
│低成本    │   │ 中成本   │   │ 高成本   │
└──────────┘   └──────────┘   └──────────┘
```

### 任務 → 路由對照表

| 任務代碼 | 主用 | 備援 1 | 備援 2 | Timeout |
|---|---|---|---|---|
| `conversation_practice` | LM Studio | Ollama | Claude | 30s |
| `vocab_explanation` | LM Studio | Ollama | — | 15s |
| `grammar_simple_check` | LM Studio | Ollama | — | 15s |
| `scenario_role_play` | LM Studio | Claude | — | 30s |
| `homework_initial_grade` | Ollama | Claude | — | 60s |
| `pronunciation_feedback` | Ollama | LM Studio | — | 30s |
| `translation_assist` | LM Studio | Ollama | Claude | 15s |
| `essay_deep_analysis` | Claude | — | — | 90s |
| `curriculum_design` | Claude | — | — | 120s |
| `plagiarism_semantic` | Claude | — | — | 60s |

### 環境變數
```env
LM_STUDIO_BASE_URL=http://192.168.1.XXX:1234/v1
LM_STUDIO_API_KEY=lm-studio-xxx
LM_STUDIO_MODEL=qwen2.5-72b-instruct

OLLAMA_BASE_URL=http://192.168.1.214:11434
OLLAMA_MODEL=qwen2.5:latest

ANTHROPIC_API_KEY=sk-ant-xxx
ANTHROPIC_MODEL=claude-sonnet-4-6
```

---

## 🚀 部署拓撲

### 開發環境（順元的 MacBook Pro M3）
```
┌──────────────────────────────────────┐
│  MacBook Pro M3                      │
│                                      │
│  Next.js dev    : 3003 (npm run dev) │
│  PostgreSQL     : 5435 (Docker)      │
│  Redis          : 6381 (Docker)      │
│  MinIO API      : 9000 (Docker)      │
│  MinIO Console  : 9001 (Docker)      │
│  Prisma Studio  : 5555 (按需)        │
└──────────────────────────────────────┘
```

### 生產環境（內網）
```
                        ┌──────────────────┐
                        │ Cloudflare Tunnel│
                        │ lingo.{domain}   │
                        └────────┬─────────┘
                                 │ HTTPS
                                 ▼
              ┌──────────────────────────────────────┐
              │        愛愛院內網 (192.168.1.0/24)   │
              │                                      │
   ┌──────────┴────────┐  ┌──────────────┐  ┌───────┴─────────┐
   │  App Server       │  │  Dell R770   │  │ LM Studio Host  │
   │  (Mac Mini M4 或  │  │ (.214)       │  │ (順元提供 IP)   │
   │   Linux VM)       │  │              │  │                 │
   │                   │  │ Ollama:11434 │  │ qwen2.5-72b     │
   │  Next.js + DB +   │  │              │  │ :1234           │
   │  Redis + MinIO    │  │              │  │                 │
   └───────────────────┘  └──────────────┘  └─────────────────┘
```

### 部署選項
1. **單機 Docker Compose**（推薦初期）
   - 所有服務跑一台 Linux/macOS
   - `docker compose -f docker-compose.prod.yml up -d`
2. **分散部署**（規模化後）
   - DB 獨立、Next.js 獨立、AI 獨立
3. **K8s**（百人規模時）
   - 暫不考慮

---

## 🔌 整合接口（預留）

### 與外部系統整合（暫不啟用）

| 系統 | 接口設計 | 啟用條件 |
|---|---|---|
| HR-IMS | `User.hrSyncId` + `IntegrationSync` 表 | HR 系統上線 |
| LTC-IMS | `User.ltcImsSyncId` | 養老院 ERP 上線 |
| 績效獎金系統 | `PerformanceMetric` + Webhook | HR 整合後 |
| OpenClaw 監控 | `HEARTBEAT_WEBHOOK_URL` | 順元啟用 |

### Webhook 端點（已預留）
```
POST /webhook/hr-ims/sync-employee
GET  /webhook/hr-ims/employee-status
POST /webhook/ltc-ims/sync-employee
GET  /webhook/ltc-ims/facility-staff
POST /webhook/heartbeat/report   (給 OpenClaw)
```

---

## 🔐 安全設計

### 密碼
- bcryptjs cost 12
- 預設密碼必須首次登入改
- 密碼規則：≥ 8 字 + 大小寫 + 數字

### Session
- NextAuth v5 + JWT
- TTL：30 天滑動視窗
- 多裝置：每裝置獨立 Session 記錄

### 敏感資料
| 欄位 | 處理 |
|---|---|
| `passwordHash` | bcrypt (不可逆) |
| `passportNo` | AES-256 加密儲存 |
| 學員語音 | MinIO + 同意條款 |
| 手寫筆跡 | MinIO + 同意條款 |
| AuditLog | 90 天留存後歸檔 |

### Impersonation 安全
- Token TTL 5 分鐘
- 一次性使用（Redis 標記）
- 不能模擬其他 SUPER_ADMIN
- 不能模擬自己
- 模擬期間禁止：改密、刪帳、HR 同步、巢狀模擬

---

## 📡 API 設計風格

### REST 命名
```
GET    /api/learn/courses                列出課程
GET    /api/learn/courses/:id            單一課程
POST   /api/learn/attempt                提交答題
POST   /api/learn/session/complete       結束學習 session
PATCH  /api/admin/users/:id              更新使用者
DELETE /api/admin/users/:id              停用使用者（軟刪除）
```

### 回應格式
```typescript
// 成功
{ ok: true, data: ... }

// 失敗
{ ok: false, error: { code: 'INVALID_CREDENTIALS', message: '...' } }
```

### 錯誤代碼
- `UNAUTHORIZED`：未登入
- `FORBIDDEN`：無權限
- `NOT_FOUND`：資源不存在
- `VALIDATION_ERROR`：輸入驗證失敗
- `RATE_LIMITED`：超過速率限制
- `AI_UNAVAILABLE`：AI 服務無法使用
- `INTERNAL_ERROR`：未預期錯誤

---

## ⚙️ 開發環境設定

### 必裝工具（macOS）
```bash
# Node.js (用 fnm 管理版本)
brew install fnm
fnm install 20
fnm use 20

# Docker Desktop
# 從 https://www.docker.com/products/docker-desktop/ 下載

# Python (給 edge-tts)
brew install pipx
pipx install edge-tts
```

### VS Code 擴充（必裝）
- Claude Code (Anthropic 官方)
- Prisma
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Docker

### 啟動流程
1. `cd chinese-learn`
2. `cp .env.example .env.local`（首次）
3. `npm install --legacy-peer-deps`（首次）
4. `docker compose -f docker/docker-compose.yml up -d`
5. `export $(grep -E '^DATABASE_URL' .env.local | xargs)`
6. `npx prisma generate`（首次或改 schema 後）
7. `npx prisma migrate dev`（首次或改 schema 後）
8. `npm run db:seed`（首次或重置）
9. `npm run dev`

---

## 🧪 測試策略

### 單元測試
- 工具：Vitest
- 範圍：`src/lib/**`、`src/i18n/**`
- 重點：純函式、SRS 算法、防抄襲、AI router

### 整合測試
- 工具：Vitest + Prisma Test DB
- 範圍：API routes、資料庫查詢

### E2E
- 工具：Playwright
- 範圍：登入流程、注音題型、Impersonation
- 跑頻：CI 上每次 PR

### 手動測試
- 順元用 4 個測試帳號驗收
- 各語系切換驗證
- 手機端優先測試

---

**See also**：
- `04_data_model.md` 資料模型細節
- `06_decisions.md` 為何選這些技術
- `07_known_issues.md` 已知環境問題
