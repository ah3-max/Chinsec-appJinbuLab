# 🚀 快速啟動指南

> 這份文件是給順元 + Claude Code 一起執行的完整指令清單。
> 跟著步驟做，第一天就能跑起來。

---

## 步驟 1：建立 GitHub Repository

### 在 GitHub 網站上：
1. 前往 https://github.com/ah3-max
2. 點 **New repository**
3. 名稱：`chinese-learn`
4. 描述：`愛愛院員工繁體中文學習平台 (TOCFL + 養老院情境)`
5. 私有 (Private)
6. **不要** 初始化 README, .gitignore, license（我們有自己的）
7. Create repository

### 在本機：
```bash
# 進入您要放專案的資料夾
cd ~/Projects   # 或您慣用的位置

# 建立空資料夾
mkdir chinese-learn && cd chinese-learn

# 把 Claude 給的所有檔案複製進來 (見下方完整檔案清單)

# 初始化 Git
git init
git branch -M main

# 連結遠端
git remote add origin git@github.com:ah3-max/chinese-learn.git
```

---

## 步驟 2：執行 Next.js 初始化

⚠️ 注意：因為我們已經有自己的 `package.json` 和 `tsconfig.json`，
**不要**直接跑 `npx create-next-app`，否則會覆蓋掉。

改用以下指令：

```bash
# 安裝依賴
npm install

# 安裝 shadcn/ui
npx shadcn@latest init -d

# 加入需要的 shadcn 元件
npx shadcn@latest add button card dialog form input label \
  select tabs toast tooltip avatar badge progress separator
```

---

## 步驟 3：啟動 Docker 服務

```bash
# 複製環境變數
cp .env.example .env.local

# 編輯 .env.local（先用預設值，之後再填 LM Studio 與 Claude API Key）
# nano .env.local 或用 VS Code 開

# 啟動 PostgreSQL + Redis + MinIO
npm run docker:dev

# 確認服務運行
docker ps

# 應該看到：
# chinese-learn-postgres   (5435)
# chinese-learn-redis      (6380)
# chinese-learn-minio      (9000, 9001)
```

---

## 步驟 4：初始化資料庫

```bash
# 產生 Prisma Client
npx prisma generate

# 建立資料庫 schema
npx prisma migrate dev --name init

# 視覺化確認
npx prisma studio
# 開啟 http://localhost:5555
```

---

## 步驟 5：建立基本頁面骨架

```bash
# 建立 Next.js 主檔案 (因為我們刪了預設的)
mkdir -p src/app
```

接下來請 Claude Code 協助建立：
1. `src/app/layout.tsx` - 根佈局
2. `src/app/[locale]/page.tsx` - 首頁
3. `src/app/[locale]/(auth)/login/page.tsx` - 登入頁
4. `src/middleware.ts` - 多語系 middleware

---

## 步驟 6：第一次推送到 GitHub

```bash
# 確認 .gitignore 包含 .env.local 和 node_modules

# 加入所有檔案
git add .
git status        # 確認沒有敏感檔案

# 提交
git commit -m "feat: initial scaffold with prisma schema and ai router"

# 推送
git push -u origin main
```

---

## 步驟 7：設定 LM Studio 連線（順元提供 IP 後）

```bash
# 編輯 .env.local，填入：
LM_STUDIO_BASE_URL=http://192.168.1.XXX:1234/v1
LM_STUDIO_API_KEY=順元提供的key
LM_STUDIO_MODEL=qwen2.5-72b-instruct

# 測試連線
curl http://192.168.1.XXX:1234/v1/models \
  -H "Authorization: Bearer your-key"
```

---

## 步驟 8：啟動開發伺服器

```bash
npm run dev

# 開啟瀏覽器
# http://localhost:3003
```

---

## 📝 完整檔案清單（Claude 已經為您建立）

```
chinese-learn/
├── README.md                           ✅
├── .env.example                        ✅
├── .gitignore                          ✅
├── package.json                        ✅
├── Dockerfile                          ✅
│
├── docker/
│   ├── docker-compose.yml              ✅ 開發環境
│   └── docker-compose.prod.yml         ✅ 生產環境
│
├── prisma/
│   ├── schema.prisma                   ✅ 主檔
│   └── schema/
│       ├── 01_auth.prisma              ✅ 帳號權限
│       ├── 02_curriculum.prisma        ✅ 課程內容
│       ├── 03_exercise.prisma          ✅ 練習題 + SRS
│       ├── 04_homework.prisma          ✅ 作業防抄襲
│       ├── 05_speaking_writing.prisma  ✅ 口說手寫
│       ├── 06_exam_kpi.prisma          ✅ 考試績效
│       └── 07_ai_system.prisma         ✅ AI 與系統
│
├── src/
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── router.ts               ✅ AI 路由器
│   │   │   └── lm-studio.ts            ✅ LM Studio client
│   │   ├── srs/
│   │   │   └── index.ts                ✅ SM-2 演算法
│   │   └── plagiarism/
│   │       └── index.ts                ✅ 4 層防抄襲
│   └── (其他資料夾結構已建立，等待開發)
│
└── docs/
    ├── ARCHITECTURE.md                 ✅ 完整架構
    ├── CLAUDE_CODE_GUIDE.md            ✅ 開發指引
    └── QUICKSTART.md                   ✅ 本檔案
```

---

## 🔧 後續待辦（按順序）

請依序與 Claude Code 共同完成：

### Week 1：基礎建設
- [ ] 完整 Prisma migration 跑通
- [ ] NextAuth 登入頁
- [ ] 多語系 middleware
- [ ] shadcn/ui 元件齊備
- [ ] 基本佈局 (學員/老師/管理員三種)

### Week 2：注音預備班
- [ ] 注音教學頁
- [ ] 互動鍵盤元件
- [ ] 五種題型
- [ ] 注音音檔批次生成

### Week 3-4：A1 入門級
- [ ] 500 詞匯入
- [ ] 闖關地圖
- [ ] 第一個情境課程（養老院問候）
- [ ] LM Studio 對話練習

### Week 5+：依架構文件 Phase 2-5

---

## 🆘 排除問題

### Docker 無法啟動
```bash
# 看 log
docker compose -f docker/docker-compose.yml logs

# 重置 volume
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

### Prisma migrate 失敗
```bash
# 確認 DATABASE_URL 正確
echo $DATABASE_URL

# 連線測試
docker exec -it chinese-learn-postgres \
  psql -U chinese_learn -d chinese_learn -c "SELECT 1"

# 重置
npx prisma migrate reset
```

### LM Studio 連不上
- 確認 LM Studio 在主機上有開啟 Local Server
- 確認 IP 是內網 IP（不是 127.0.0.1）
- 確認防火牆開 1234 port
- 從開發機 ping 一下：`ping 192.168.1.XXX`

---

## 📞 接下來

✅ **架構已完成**

現在順元可以：

1. **複製這些檔案到本機 VS Code**（或讓 Claude 整包打包成 ZIP）
2. **建立 GitHub repo `ah3-max/chinese-learn`**
3. **執行步驟 2-6**
4. **告訴 Claude Code 進行下一階段**：
   - 「請依照 ARCHITECTURE.md 的 Phase 1，先做注音預備班的頁面與題型」
   - 「請建立 NextAuth 登入頁，支援多語系」
   - 「請開始匯入 TOCFL A1 詞彙」

---

## 🎯 給 Claude Code 的標準開頭

進入 VS Code 後，第一句話可以這樣對 Claude Code 說：

> 「請先讀 docs/ARCHITECTURE.md 和 docs/CLAUDE_CODE_GUIDE.md，
> 確認專案規範。然後請依照 docs/QUICKSTART.md 的步驟 5 開始：
> 建立 Next.js 主檔案 (layout/page/middleware) 與多語系基礎設定。
> 我用泰文跟你討論。」
