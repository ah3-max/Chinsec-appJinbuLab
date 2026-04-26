# 🎯 Day 1 完整 SOP — 從零到跑起來

> 順元的 MacBook Pro M3 專用
> 全部 30 分鐘內完成

---

## 📋 前置確認 (5 分鐘)

### ✅ 確認您的 Mac 已安裝以下工具

開啟 **Terminal** 跑：

```bash
node -v       # 應該顯示 v20.x.x 或更高
npm -v        # 應該顯示 10.x.x 或更高
docker -v     # 應該顯示 24.x.x 或更高
git --version
```

如果有缺：
- **Node.js**：用 [fnm](https://github.com/Schniz/fnm) 安裝 → `brew install fnm && fnm install 20`
- **Docker**：[Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
- **Git**：通常 macOS 已內建

確認 **Docker Desktop 正在執行**（選單列要看到鯨魚圖示是穩定的）。

---

## 🚀 步驟 1：解壓專案 (1 分鐘)

```bash
# 進入您慣用的開發資料夾
cd ~/Projects        # 或 ~/Documents/Code 等

# 解壓 ZIP（請把 chinese-learn-scaffold.zip 放到這個資料夾）
unzip chinese-learn-scaffold.zip

# 進入專案
cd chinese-learn

# 確認檔案結構
ls -la
```

應該看到：`README.md`、`package.json`、`prisma/`、`src/`、`docs/`、`docker/`...

---

## 🔧 步驟 2：跑一鍵安裝腳本 (10 分鐘)

```bash
# 給腳本執行權限
chmod +x scripts/setup-day1.sh

# 執行
./scripts/setup-day1.sh
```

腳本會自動：
1. ✅ 檢查環境
2. ✅ 建立 `.env.local`
3. ✅ 自動產生 `AUTH_SECRET`
4. ✅ 安裝 npm 依賴（最久，約 2-3 分鐘）
5. ✅ 啟動 Docker (PostgreSQL + Redis + MinIO)
6. ✅ 跑 Prisma migration
7. ✅ 灌入種子資料

**完成後您會看到綠色的 🎉 提示。**

---

## 🌐 步驟 3：建立 GitHub Repo (5 分鐘)

### 3-1. 在 GitHub 網站
1. 前往 https://github.com/ah3-max
2. **New repository**
3. 名稱：`chinese-learn`
4. 描述：`愛愛院員工繁體中文學習平台`
5. **Private**
6. **不要**勾選 README / .gitignore / license
7. **Create repository**

### 3-2. 在終端機推送
```bash
# 初始化 Git (如果還沒)
git init
git branch -M main

# 連結遠端
git remote add origin git@github.com:ah3-max/chinese-learn.git

# 第一次提交
git add .
git status                  # 確認沒有 .env.local 被加進來

git commit -m "feat: initial scaffold with prisma schema and ai router

- Complete Prisma schema (7 modules, 30+ models)
- AI router with LM Studio + Ollama + Claude fallback
- SRS algorithm (SM-2)
- 4-layer plagiarism detection
- Docker compose for dev + prod
- Multi-language support scaffold (zh-TW/th/vi/id)
- Documentation (architecture, dev guide, quickstart)"

# 推送
git push -u origin main
```

如果 GitHub 用 HTTPS 而不是 SSH，URL 改用：
```bash
git remote add origin https://github.com/ah3-max/chinese-learn.git
```

---

## 🧪 步驟 4：驗證安裝 (3 分鐘)

### 4-1. 看資料庫
```bash
npm run db:studio
```
開啟 http://localhost:5555 — 應該看到 4 間養老院、1 個管理員、3 門課、10 個詞彙。

### 4-2. 看 MinIO
開啟 http://localhost:9001
- 帳號：`minioadmin`
- 密碼：見 `.env.local` 的 `MINIO_ROOT_PASSWORD`
- 應該看到 4 個 bucket：audio / handwriting / homework / textbook-pdf

### 4-3. 啟動開發伺服器（會在下一階段）
```bash
npm run dev
```
**注意**：因為我們還沒寫頁面，啟動會出現 404。這是正常的——我們在 Phase 1 才開始建頁面。

按 `Ctrl+C` 先停止。

---

## 🎓 步驟 5：開啟 VS Code 並請 Claude Code 接手 (1 分鐘)

```bash
# 用 VS Code 開啟專案
code .
```

VS Code 會跳推薦安裝擴充套件，**全部安裝**：
- Claude Code
- Prisma
- Tailwind CSS IntelliSense
- ESLint / Prettier
- Docker

### 給 Claude Code 的第一句話

開啟 Claude Code 對話框，直接複製貼上：

```
請先讀以下三個檔案，了解整個專案：
1. docs/ARCHITECTURE.md
2. docs/CLAUDE_CODE_GUIDE.md
3. docs/QUICKSTART.md

確認後告訴我下一步要做什麼。我們現在進入 Phase 1：
注音預備班 + A1 入門級。

請優先建立：
- src/app/layout.tsx 根佈局
- src/app/[locale]/page.tsx 首頁
- src/middleware.ts 多語系 middleware
- src/i18n/* 四個語系檔的初始 key
- src/app/[locale]/(auth)/login/page.tsx 登入頁

之後我會用泰文跟你討論。
```

---

## 🎁 完成後您會擁有

✅ 完整可用的開發環境（PostgreSQL + Redis + MinIO 全在 Docker）
✅ 30+ 個資料表的 Prisma schema 已 migrate 完成
✅ AI 路由器（LM Studio → Ollama → Claude）已就位
✅ 4 間養老院、1 個管理員帳號、3 門課程已在資料庫
✅ GitHub repo 已建立並推送
✅ VS Code + Claude Code 環境已配置
✅ 完整的開發文件

---

## 🆘 萬一卡住了

### 問題 1：Docker 啟動失敗
```bash
# 檢查 log
docker compose -f docker/docker-compose.yml logs

# 重置（會清空資料）
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

### 問題 2：npm install 卡住
```bash
# 清除快取重來
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### 問題 3：Prisma migrate 失敗
```bash
# 確認 PostgreSQL 跑起來
docker ps | grep postgres

# 測試連線
docker exec -it chinese-learn-postgres \
  psql -U chinese_learn -d chinese_learn -c "SELECT 1"

# 重置
npm run db:reset
```

### 問題 4：Port 衝突 (3003/5435/6380/9000 被占用)
```bash
# 找出占用的 process
lsof -i :3003

# Kill 它
kill -9 <PID>

# 或修改 docker-compose.yml 的 port mapping
```

---

## 📅 接下來這週的計畫

**Day 1 (今天)**：✅ 環境就緒 + GitHub repo

**Day 2-3**：
- 與 Claude Code 一起做：登入頁、多語系、學員首頁

**Day 4-5**：
- 注音 ㄅㄆㄇ 互動鍵盤
- 第一個練習題型 (注音聽音選字)

**Day 6-7**：
- 您把師大/台大課本 PDF 提供給我
- 我寫匯入腳本，灌入正式 A1 詞彙

---

## 📞 重要資訊

- **預設管理員**：`shunyuan` / `ChangeMe@2026` ⚠️ 首次登入請改密碼
- **資料庫**：`localhost:5435`，帳號 `chinese_learn`，密碼見 `.env.local`
- **MinIO Console**：`http://localhost:9001`
- **應用程式**：`http://localhost:3003`（Phase 1 後可訪問）
- **Prisma Studio**：`http://localhost:5555`（手動啟動）

---

🚀 **準備好了就開工！如果跑腳本中遇到任何問題，把錯誤訊息丟給 Claude，我會立即協助。**
