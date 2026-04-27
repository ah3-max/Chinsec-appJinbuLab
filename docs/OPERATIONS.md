# 🛠️ ChineseLearn 本機 Docker 部署運行手冊

> 對象：愛愛院員工繁體中文學習平台
> 部署位置：本機 macOS（Docker Desktop）
> 最後更新：2026-04-27

---

## 🔗 固定連結（本機）

| 用途 | URL | 備註 |
|------|-----|------|
| **應用程式** | http://localhost:3003 | 主入口，會自動導向 `/zh-TW/login` |
| 登入頁 | http://localhost:3003/zh-TW/login | 直接進登入頁 |
| 健康檢查 | http://localhost:3003/api/health | 回傳 JSON，含 DB 延遲 |
| MinIO Console | http://localhost:9001 | 物件儲存管理介面 |
| Prisma Studio | http://localhost:5555 | 需手動 `npm run db:studio` |

---

## 🔑 登入帳號

| 角色 | 帳號 | 預設密碼 | 備註 |
|------|------|---------|------|
| 超級管理員 | `shunyuan` | `ChangeMe@2026` | ⚠️ 首次登入請立即改密碼 |

---

## 🐳 Docker 容器一覽

| 容器名稱 | Image | 對外 Port | 健康狀態 |
|---------|-------|----------|----------|
| `chinese-learn-app` | `chinese-learn-app:latest` | `3003 → 3003` | wget /api/health |
| `chinese-learn-postgres` | `postgres:16-alpine` | `5435 → 5432` | pg_isready |
| `chinese-learn-redis` | `redis:7-alpine` | `6381 → 6379` | redis-cli ping |
| `chinese-learn-minio` | `minio/minio:latest` | `9000-9001 → 9000-9001` | mc ready |
| `chinese-learn-minio-init`* | `minio/mc:latest` | — | 一次性 bucket 初始化 |

\*`minio-init` 啟動完成後會自動結束（建好 4 個 bucket：audio / handwriting / homework / textbook-pdf）。

---

## ▶️ 操作指令（在專案根目錄執行）

### 啟動全部服務（DB + 應用）
```bash
export $(grep AUTH_SECRET .env.local | xargs)
docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml up -d
```

### 只啟動應用（DB 已在跑）
```bash
export $(grep AUTH_SECRET .env.local | xargs)
docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml up -d app
```

### 停止應用（保留資料）
```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml stop
```

### 完全停止並移除容器（資料保留在 volume）
```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml down
```

### 重新建置 image（程式碼有改動時）
```bash
export $(grep AUTH_SECRET .env.local | xargs)
docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml build app
docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml up -d app
```

### 看 log
```bash
# 應用 log（即時）
docker logs -f chinese-learn-app

# 資料庫 log
docker logs -f chinese-learn-postgres

# 全部服務（compose 視角）
docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml logs -f
```

### 健康檢查
```bash
curl -s http://localhost:3003/api/health | python3 -m json.tool
```

回傳示意：
```json
{
  "status": "ok",
  "timestamp": "2026-04-27T10:48:41.064Z",
  "uptimeMs": 12311,
  "checks": { "db": { "ok": true, "latencyMs": 52 } },
  "tookMs": 53
}
```

---

## 💾 資料備份

### PostgreSQL 備份
```bash
docker exec chinese-learn-postgres pg_dump -U chinese_learn chinese_learn > backups/chinese_learn_$(date +%Y%m%d_%H%M).sql
```

### 還原
```bash
cat backups/chinese_learn_20260427_1200.sql | docker exec -i chinese-learn-postgres psql -U chinese_learn -d chinese_learn
```

### MinIO 備份
```bash
docker exec chinese-learn-minio mc mirror local/chinese-learn-audio /backups/audio
```

### 完整重置（⚠️ 會清空所有資料）
```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml down -v
```

---

## 🏗️ 架構樹

### Docker 服務拓撲
```
                          ┌─────────────────────────┐
                          │  瀏覽器 (Mac)           │
                          │  http://localhost:3003  │
                          └────────────┬────────────┘
                                       │
                                       ▼
   ┌───────────────── docker network: chinese-learn-network ──────────────────┐
   │                                                                          │
   │   ┌──────────────────────────────┐                                       │
   │   │  chinese-learn-app           │                                       │
   │   │  Next.js 15 (standalone)     │                                       │
   │   │  - middleware.ts (i18n+auth) │                                       │
   │   │  - NextAuth v5 (JWT)         │                                       │
   │   │  - Prisma client             │                                       │
   │   │  Port: 3003                  │                                       │
   │   └──────┬─────────┬─────────┬───┘                                       │
   │          │         │         │                                           │
   │          ▼         ▼         ▼                                           │
   │   ┌──────────┐ ┌──────────┐ ┌──────────┐  ┌──────────────────────────┐   │
   │   │ postgres │ │  redis   │ │  minio   │  │  外網（未啟用）          │   │
   │   │   :5432  │ │   :6379  │ │   :9000  │  │  - LM Studio (順元提供)  │   │
   │   │  16-alp. │ │  7-alp.  │ │ S3 相容  │  │  - Ollama (R770)         │   │
   │   └──────────┘ └──────────┘ └──────────┘  │  - Claude API            │   │
   │                                           │  - Cloudflare Tunnel     │   │
   │                                           └──────────────────────────┘   │
   └──────────────────────────────────────────────────────────────────────────┘
                ▲              ▲              ▲
                │ 5435         │ 6381         │ 9000-9001
                │              │              │
            host:5435      host:6381      host:9000/9001
            （DB 工具用）  （Redis 工具用）（MinIO Console）
```

### 專案目錄樹
```
chinese-learn/
├── Dockerfile                       # 4-stage prod build (deps→prisma→builder→runner)
├── .dockerignore
├── .env.example                     # 環境變數範本
├── .env.local                       # 本機實際值（gitignored）
├── package.json                     # prisma.schema = "prisma/schema"
├── next.config.ts                   # output: "standalone" + next-intl plugin
├── tsconfig.json                    # 排除 prisma/seed、scripts
├── tailwind.config.ts               # shadcn vars + 學習色彩 + Bopomofo 字型
│
├── docker/
│   ├── docker-compose.yml           # dev: postgres/redis/minio
│   ├── docker-compose.app.yml       # 本機 overlay：加 Next.js app 容器
│   └── docker-compose.prod.yml      # R770 內網部署用（含 nginx + cloudflared）
│
├── docs/
│   ├── ARCHITECTURE.md              # 系統架構
│   ├── CLAUDE_CODE_GUIDE.md         # 開發規範
│   ├── DAY1_SOP.md                  # Day 1 環境建置
│   ├── QUICKSTART.md                # 快速啟動
│   └── OPERATIONS.md                # ← 本文件
│
├── scripts/
│   └── setup-day1.sh                # 一鍵 npm install + docker + migrate + seed
│
├── prisma/
│   ├── schema/                      # 多檔 schema（prismaSchemaFolder preview）
│   │   ├── 00_config.prisma         # generator + datasource
│   │   ├── 01_auth.prisma           # User / Facility / Class / Session
│   │   ├── 02_curriculum.prisma     # Course / Stage / Lesson / Vocabulary
│   │   ├── 03_exercise.prisma       # Exercise / UserAttempt / DailyMission
│   │   ├── 04_homework.prisma       # Homework / Submission / Plagiarism
│   │   ├── 05_speaking_writing.prisma  # Voice/Handwriting print + records
│   │   ├── 06_exam_kpi.prisma       # MockExam / Performance / Leaderboard
│   │   └── 07_ai_system.prisma      # AiConversation / Heartbeat / Integration
│   ├── migrations/
│   │   └── 20260426173207_init/     # 初始 migration（43 張表）
│   └── seed/index.ts                # 種子資料（facilities / admin / 課程 / 詞彙）
│
└── src/
    ├── middleware.ts                # next-intl + auth gate
    ├── i18n/
    │   ├── routing.ts               # locales: zh-TW/th/vi/id (default zh-TW)
    │   ├── request.ts               # 動態載入語系 JSON
    │   ├── zh-TW.json               # 主翻譯（master）
    │   ├── th.json                  # 泰文（_todo: 母語員工複審）
    │   ├── vi.json                  # 越文（_todo: 母語員工複審）
    │   └── id.json                  # 印尼文（_todo: 母語員工複審）
    │
    ├── app/
    │   ├── layout.tsx               # Root（Noto Sans TC + viewport）
    │   ├── globals.css              # Tailwind + shadcn vars + 手機優化
    │   ├── api/
    │   │   ├── auth/[...nextauth]/route.ts   # NextAuth handlers
    │   │   └── health/route.ts               # GET /api/health (DB ping)
    │   └── [locale]/
    │       ├── layout.tsx           # NextIntlClientProvider + Providers
    │       ├── page.tsx             # 已登入→/learn / 未登入→/login
    │       ├── (auth)/login/page.tsx
    │       └── (learner)/
    │           ├── layout.tsx       # 手機 max-w-md + bottom nav
    │           └── learn/page.tsx   # XP/streak + 課程卡片
    │
    ├── components/
    │   ├── providers.tsx            # SessionProvider + ReactQuery + Toaster
    │   ├── ui/                      # button / input / label / card / sonner
    │   ├── auth/login-form.tsx      # RHF + zod + signIn
    │   └── learner/bottom-nav.tsx   # 4 tab：學/練/作業/我的
    │
    ├── lib/
    │   ├── db.ts                    # Prisma singleton（避免 hot reload 連線爆炸）
    │   ├── auth.ts                  # NextAuth v5：Credentials + bcrypt + role
    │   ├── utils.ts                 # cn() 工具
    │   ├── ai/
    │   │   ├── router.ts            # 雙引擎路由：本地優先 → Claude fallback
    │   │   ├── lm-studio.ts         # LM Studio client
    │   │   ├── ollama.ts            # Ollama client
    │   │   └── claude.ts            # Anthropic client
    │   ├── srs/index.ts             # SM-2 間隔重複演算法
    │   └── plagiarism/index.ts      # 4 層抄襲檢測
    │
    ├── stores/                      # Zustand（待用）
    ├── hooks/                       # React hooks（待用）
    ├── types/                       # TypeScript 型別（待用）
    └── content/                     # 課程內容靜態檔（待用）
```

---

## 🌱 種子資料現況

| 資料表 | 筆數 | 內容 |
|--------|------|------|
| `facilities` | 2 | 愛愛院（萬華）/ 湖水綠 A20 養護中心 |
| `users` | 1 | `shunyuan`（SUPER_ADMIN） |
| `courses` | 3 | 注音預備班 ㄅㄆㄇ / 入門級 A1 / 養老院照護中文 |
| `stages` | 4 | 注音預備班的 4 個階段 |
| `vocabularies` | 10 | 示範詞彙（你好、謝謝、再見等） |

要灌新資料：`npm run db:seed`（會 upsert，不會清空）。

---

## ⚠️ 已知注意事項

1. **`AUTH_SECRET` 來源**：每次啟動 app 容器前要 `export $(grep AUTH_SECRET .env.local | xargs)`，否則 docker compose 找不到變數。可考慮做成 shell alias。

2. **Port 衝突**：
   - `5435` (postgres)、`6381` (redis)、`9000-9001` (minio)、`3003` (app) 都需閒置。
   - 已知 `duoduo-drama-redis-1` 之前佔 6380，所以本專案 redis 改用 6381。
   - 改 port 須同步修改 `docker-compose.yml`（host port）與 `.env.local`（如 `REDIS_URL`）。

3. **i18n 翻譯**：th/vi/id 為 Claude 機翻（檔頭有 `_todo` 標記），上線前需母語員工複審。

4. **AI 整合未啟用**：`LM_STUDIO_BASE_URL`、`OLLAMA_BASE_URL`、`ANTHROPIC_API_KEY` 均為 placeholder。實際串接需順元提供 IP / API Key。

5. **NextAuth 在 Docker 內**：`NEXTAUTH_URL=http://localhost:3003`、`AUTH_TRUST_HOST=true` 已設好。若日後改 domain（例如 Cloudflare Tunnel），記得同步調整。

6. **npm cache 權限問題**：本機 `~/.npm` 有 root 擁有的檔案（之前用 sudo 跑壞）。Docker build 內部不受影響。本機跑 `npm install` 要加 `--cache /tmp/npm-cache` 或先 `sudo chown -R 501:20 ~/.npm`。

7. **Next.js build 排除**：`tsconfig.json` 把 `prisma/seed`、`scripts` 排除，避免 seed 的型別錯誤擋住 build。要改 seed 仍可用 `npx tsx prisma/seed/index.ts` 跑。

---

## 🚀 下一步建議（依優先序）

1. **改預設密碼**：登入後立即改 `shunyuan` 密碼。
2. **補 tab placeholder**：`/practice`、`/homework`、`/profile` 目前點了會 404。
3. **注音 ㄅㄆㄇ 互動鍵盤** + 第一個 ZHUYIN_TAP 題型（Phase 1 主要學習功能）。
4. **TTS 串接**：先用 Edge-TTS（免外部 API key）產注音音檔，存 MinIO。
5. **GitHub remote**：先在 GitHub 建好 `ah3-max/chinese-learn` repo，然後 `git remote add` + push。
6. **th/vi/id 翻譯複審**：找母語員工協助。

---

## 🆘 常見問題

### Q: 登入後一直跳回登入頁
- 檢查 `AUTH_SECRET` 是否在容器內生效：`docker exec chinese-learn-app env | grep AUTH_SECRET`
- 應該不為空。若為空，重啟時 export 漏了。

### Q: Build 卡在 `npm ci`
- 網路問題或 npm registry 慢。Dockerfile 內無快取對應，重 build 整個 deps stage 會重抓。可考慮加 `--registry=https://registry.npmmirror.com/` 或本機 verdaccio proxy。

### Q: `/api/health` 回 503
- 多半是 DB 連不上。`docker logs chinese-learn-app | tail -20` 看 Prisma 報錯。
- 確認 postgres 容器在跑且 healthy：`docker ps | grep postgres`。

### Q: 改了程式碼，要重啟容器
```bash
export $(grep AUTH_SECRET .env.local | xargs)
docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml build app
docker compose -f docker/docker-compose.yml -f docker/docker-compose.app.yml up -d app
```

### Q: 資料庫想直接連
- 從 Mac：`psql -h localhost -p 5435 -U chinese_learn -d chinese_learn`（密碼 `chinese_learn_dev_pwd`）
- 或開 Prisma Studio：`npm run db:studio` → http://localhost:5555

---

🐳 **本機固定連結（牢記）：http://localhost:3003**
