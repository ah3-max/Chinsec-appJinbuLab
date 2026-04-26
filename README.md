# 🎓 ChineseLearn — 愛愛院員工中文學習平台

> 為愛愛院東南亞籍照顧服務員打造的繁體中文學習平台。
> 整合 TOCFL 標準、養老院情境、商用辦公中文、零基礎日常用語。
> 對標 Duolingo 互動體驗，預留 HR-IMS / LTC-IMS 整合接口。

---

## 🎯 專案目標

1. **語言訓練**：從注音 ㄅㄆㄇ 到 TOCFL C1 的完整繁體中文學習路徑
2. **多籍員工**：支援泰國、越南、印尼、菲律賓籍員工(母語介面)
3. **情境結合**：養老院照護專業 + 辦公室商用 + 日常生活
4. **績效連動**：學習進度與績效獎金掛鉤
5. **手機優先**：員工主要在手機上使用，PWA 離線支援
6. **內網部署**：LM Studio / Ollama AI 推論在內網，外網可透過 Cloudflare Tunnel 存取
7. **未來整合**：預留與 HR、LTC-IMS 等外部系統統一帳號接口

---

## 🏗️ 技術架構

| 層級 | 技術 |
|---|---|
| 前端 | Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui |
| 動畫 | Framer Motion + Lottie |
| 狀態 | Zustand + TanStack Query |
| 後端 | Next.js Route Handlers + Prisma ORM |
| 資料庫 | PostgreSQL 16 + Redis 7 |
| 物件儲存 | MinIO (S3 相容) |
| AI 推論 | LM Studio (主) + Ollama (備) + Claude API (進階) |
| 語音 | edge-tts (TTS) + Whisper (STT) |
| 多語系 | next-intl (zh-TW / th / vi / id) |
| PWA | next-pwa + Workbox |
| 部署 | Docker Compose + Nginx |

---

## 🚀 快速啟動

### 前置需求
- Node.js 20+
- Docker Desktop
- pnpm 或 npm

### 開發環境

```bash
# 1. clone 專案
git clone git@github.com:ah3-max/chinese-learn.git
cd chinese-learn

# 2. 複製環境變數
cp .env.example .env.local
# 編輯 .env.local 填入 LM Studio API URL 等

# 3. 啟動 Docker 服務 (PostgreSQL + Redis + MinIO)
docker compose -f docker/docker-compose.yml up -d

# 4. 安裝依賴
npm install

# 5. 初始化資料庫
npx prisma migrate dev
npx prisma db seed

# 6. 啟動開發伺服器
npm run dev
# 開啟 http://localhost:3003
```

### 內網部署 (R770 伺服器)

```bash
docker compose -f docker/docker-compose.prod.yml up -d
```

### 外網部署 (Cloudflare Tunnel)

```bash
# 配置 cloudflared 將內網 :3003 暴露為 https://lingo.your-domain.com
cloudflared tunnel run chinese-learn
```

---

## 📂 專案結構

```
chinese-learn/
├── docker/              # Docker 配置
├── prisma/schema/       # 模組化 Prisma schema
├── src/
│   ├── app/[locale]/    # 多語系路由 (學員/老師/管理員)
│   ├── components/      # UI 元件
│   ├── lib/             # AI 路由、SRS、防抄襲、TTS、STT
│   ├── content/         # 課程內容 (注音/A1-C1/情境)
│   └── i18n/            # 翻譯 JSON
├── scripts/             # 教材匯入、HR 同步腳本
└── docs/                # 架構文件
```

詳見 [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 📚 課程分級

| 級別 | CEFR | TOCFL | 詞彙量 | 內容 |
|---|---|---|---|---|
| 0. 注音預備班 | Pre-A1 | — | 37 注音 | ㄅㄆㄇ、聲調 |
| 1. 入門級 | A1 | TOCFL 1 | 500 字 | 自我介紹、數字、日常 |
| 2. 基礎級 | A2 | TOCFL 2 | 1,000 字 | 購物、交通、簡單對話 |
| 3. 進階級 | B1 | TOCFL 3 | 2,500 字 | 工作場合、表達意見 |
| 4. 高階級 | B2 | TOCFL 4 | 5,000 字 | 專業領域、報告書寫 |
| 5. 流利級 | C1 | TOCFL 5 | 8,000 字 | 抽象議題 |
| 6. 精通級 | C2 | TOCFL 6 | 8,000+ | 母語等級 |

並行情境課程：**養老院照護中文 / 辦公室商用中文 / 在台生活中文**

---

## 🔐 角色權限

- **LEARNER**：學員（東南亞籍照服員）
- **TEACHER**：語言老師（管理進度、批改作業）
- **FACILITY_MGR**：養老院主管（看自己院區員工）
- **HR**：人資（看績效獎金）
- **ADMIN**：系統管理員

---

## 🔗 預留整合接口

- 外部 HR / ERP 系統 (`User.hrSyncId`)
- LTC-IMS 養老院系統 (`User.ltcImsSyncId`)
- OpenClaw Heartbeat 監控

---

## 📜 授權

Proprietary — 愛愛院內部使用
