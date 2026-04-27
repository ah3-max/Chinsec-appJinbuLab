# 07_known_issues.md — 已知問題與 Workaround

> 此檔記錄踩過的坑、解法、待修但暫時可繞的問題。
> 遇到奇怪錯誤先看這裡。

---

## 🐛 已修復的問題（歷史紀錄）

### KI-001：simhash-js 版本不存在
**症狀**：`npm install` 失敗，`simhash-js@^0.0.4 not found`
**原因**：package.json 寫了不存在的版本
**修復**：改成 `^1.0.0`
**修復日期**：2026-04-27 (Phase 0 setup)

### KI-002：Prisma 多檔 schema 需要 preview feature
**症狀**：`prisma generate` 失敗，找不到 schema 檔
**原因**：multi-file schema 需要設定
**修復**：
1. `prisma/schema/00_config.prisma` 加 `previewFeatures = ["prismaSchemaFolder"]`
2. `package.json` 加 `"prisma": { "schema": "prisma/schema" }`
**修復日期**：2026-04-27

### KI-003：fullTextSearchPostgres 是錯名稱
**症狀**：`previewFeatures` 設定後仍報錯
**原因**：正確名稱是 `fullTextSearch` 不是 `fullTextSearchPostgres`
**修復**：改名稱
**修復日期**：2026-04-27

### KI-004：.env.example 占位符與 docker-compose 預設密碼不對齊
**症狀**：依範本建立 .env.local 後，連 DB 失敗（密碼錯誤）
**原因**：.env.example 寫 `CHANGE_ME_xxx`，但 docker-compose 預設用 `chinese_learn_dev_pwd`
**修復**：把 .env.example 的占位符改為實際預設密碼
**修復日期**：2026-04-27

### KI-005：Redis port 6380 衝突
**症狀**：`docker compose up` 失敗，port 6380 已被占用
**原因**：順元另一個專案 `duoduo-drama-redis` 已用 6380
**修復**：改用 6381
**修復日期**：2026-04-27
**影響**：所有 .env 與文件都改成 6381

### KI-006：npm cache 有 root 擁有的檔案
**症狀**：`npm install` 報 EACCES 錯
**原因**：之前某次用 sudo 跑 npm，留下 root 檔案
**Workaround**：`npm install --cache /tmp/npm-cache`
**永久修**：`sudo chown -R 501:20 ~/.npm`（順元 macOS UID）
**狀態**：暫時繞過，未根治

### KI-007：Prisma 不讀 .env.local
**症狀**：`prisma migrate dev` 找不到 DATABASE_URL
**原因**：Prisma 預設讀 `.env`，不讀 `.env.local`
**Workaround**：跑 prisma 命令前先 `export $(grep -E '^DATABASE_URL' .env.local | xargs)`
**永久修**：可建一個只含 DATABASE_URL 的 `.env`（gitignore 已排除）
**狀態**：已記錄在 README

### KI-008：Setup script 用 `tee` 隱藏失敗的 exit code
**症狀**：`./setup-day1.sh` 顯示成功但 npm install 其實失敗
**原因**：`set -e` 配合 `| tee` 時，最終 exit code 來自 tee
**Workaround**：用 `set -o pipefail`
**狀態**：未來腳本改用此 flag

---

## ⚠️ 已知但暫時可接受的問題

### KI-101：Web Speech API 音質不一
**症狀**：注音題型播音在不同瀏覽器音質差異大
**原因**：Web Speech API 由瀏覽器實作
**Workaround**：(P0-5) 改用 Edge-TTS 預生成 + MinIO 託管
**預計修復**：P0-5 完成時

### KI-102：i18n 翻譯只有 zh-TW 是真的
**症狀**：切換泰/越/印介面看到 [TH] / [VI] / [ID] 前綴
**原因**：尚未做完整翻譯
**Workaround**：先用前綴標記 TODO
**預計修復**：P2 多語系翻譯補完

### KI-103：UserAttempt.exerciseId 是 required，動態題目無法存
**症狀**：注音題型答題不能存 DB（因為沒對應 Exercise 紀錄）
**Workaround**：暫時不存
**預計修復**：P0-3（改 schema 為 optional + 加 exerciseSnapshot）

### KI-104：學員當前 level 不影響課程清單
**症狀**：ZHUYIN 級學員可以看到 A1 課程入口
**Workaround**：暫時靠提示文字
**預計修復**：P0-4（依 level 過濾）

### KI-105：seed 帳號預設密碼弱
**症狀**：`shunyuan / ChangeMe@2026`、`testlearner_th / Test@2026` 等
**Workaround**：開發環境暫時 OK
**預計修復**：P0-2（強制首次改密碼）

### KI-106：注音題型每次都隨機，無進度記錄
**症狀**：刷新就重來，無法接續
**預計修復**：P0-3 完成後

### KI-107：個人頁的 XP / streak 是假資料
**症狀**：寫死的測試數字
**預計修復**：P0-3

---

## 🔧 環境問題

### ENV-001：macOS 端 Docker Desktop 需要先啟動
**現象**：跑 `docker ps` 報「Cannot connect to the Docker daemon」
**解法**：開 Docker Desktop（選單列鯨魚圖示穩定後再執行）

### ENV-002：edge-tts CLI 找不到（macOS）
**現象**：`spawn edge-tts ENOENT`
**解法**：
```bash
brew install pipx
pipx install edge-tts
```
若還不行：`python3 -m pip install --user edge-tts`，並把 `~/Library/Python/3.x/bin` 加入 PATH

### ENV-003：Node.js 版本不夠新
**現象**：Next.js 15 啟動失敗
**最低要求**：Node 18.17+，建議 20+
**檢查**：`node -v`
**解法**：用 fnm 升級
```bash
fnm install 20
fnm use 20
```

### ENV-004：Port 占用衝突
**常見**：3003 / 5435 / 6381 / 9000 / 9001 / 5555
**檢查**：`lsof -nP -iTCP:3003 -sTCP:LISTEN`
**解法**：kill 占用 process 或改 port

### ENV-005：Prisma client 沒重新產生
**現象**：改了 schema 後執行報「unknown field」
**解法**：`npx prisma generate`

### ENV-006：Migration 衝突（多人協作未來會遇到）
**現象**：別人 commit 了 migration，你本地有不同 migration
**解法**：rebase 別人的、刪除本地未上傳的 migration、重新 `prisma migrate dev`

---

## 🌐 部署相關

### DEP-001：Cloudflare Tunnel token 沒設
**現象**：外網無法存取
**解法**：
1. cloudflared 安裝
2. 在 Cloudflare Zero Trust 後台建 tunnel
3. 取得 token
4. 設 `CLOUDFLARE_TUNNEL_TOKEN` 環境變數
5. `docker compose --profile external up -d`

### DEP-002：MinIO bucket 沒建好
**現象**：上傳音檔失敗
**解法**：跑 `minio-init` service（docker-compose 已內含）
```bash
docker compose -f docker/docker-compose.yml up minio-init
```

### DEP-003：LM Studio 內網無法連
**現象**：AI 對話 timeout
**解法**：
1. 確認 LM Studio 主機與 App 主機在同網段
2. 確認 LM Studio 的 Local Server 是「服務所有 IP」（不是 127.0.0.1）
3. 主機防火牆開 1234 port
4. 從 App 主機 ping LM Studio 主機

### DEP-004：Prisma 生產 client 找不到
**現象**：Docker 內 Next.js 啟動報「Cannot find @prisma/client」
**解法**：Dockerfile 已處理（Stage 2 prisma generate）。如還有問題：
```dockerfile
RUN npx prisma generate
```

---

## 🤖 AI 相關問題

### AI-001：LM Studio 回應品質差
**現象**：對話練習的回應像「機器人」
**原因**：模型太小或 system prompt 太簡單
**解法**：
- 用 qwen2.5-72b-instruct（最低）
- 系統 prompt 要詳細描述角色、情境、學員程度

### AI-002：Claude API 成本失控
**現象**：API 帳單暴增
**監控**：
```bash
# 查最近 1 週的 AI 呼叫成本
SELECT model_name, SUM(cost_estimate) FROM ai_grade_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY model_name;
```
**解法**：
- 確認 router 真的把 conversation_practice 路由到 LM Studio
- 加速率限制（`AI_RATE_LIMIT_PER_MINUTE`）
- 用更便宜的 Claude Haiku

### AI-003：Whisper 辨識中文不準
**現象**：學員口說錄音轉文字結果亂碼
**原因**：模型太小或音質差
**解法**：
- 用 whisper-large-v3
- 確認音檔格式（建議 16kHz mono WAV）
- 前端錄音時用 `sampleRate: 16000`

---

## 📱 前端問題

### FE-001：手機端 viewport 縮放
**現象**：iPhone 上字超小
**解法**：確認 layout.tsx 有
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
```

### FE-002：注音字型在某些 Android 顯示為框框
**現象**：ㄅㄆㄇ 顯示為 □ □ □
**原因**：舊 Android 沒內建注音字型
**解法**：用 web font 載入 Noto Sans CJK 或 Noto Sans Bopomofo

### FE-003：framer-motion 在 Server Component 報錯
**現象**：「Hooks can only be called inside Client Components」
**解法**：在元件最上方加 `"use client";`

### FE-004：next-intl 在 middleware 報錯
**現象**：「Module not found: i18n/routing」
**解法**：確認 `next.config.ts` 的 `createNextIntlPlugin` 路徑是 `'./src/i18n/request.ts'`

---

## 🧪 測試問題

### TEST-001：Vitest 找不到 Prisma client
**解法**：`vitest.config.ts` 加：
```typescript
test: {
  setupFiles: ['./tests/setup.ts'],
}
```
然後 `tests/setup.ts` 設定測試 DB

### TEST-002：Playwright 在 macOS 無法啟動
**解法**：`npx playwright install`

---

## 📝 文件相關

### DOC-001：CLAUDE.md 與實際不符
**現象**：自動產生區段過時
**解法**：跑 `npm run claude:update`

### DOC-002：Mermaid 圖在 GitHub 不顯示
**現象**：架構圖看不到
**解法**：用標準 markdown 圖片或 SVG 取代

---

## 🆘 緊急情況處理

### EMERG-001：資料庫資料遺失
**萬一發生**：
```bash
# 1. 立即停止寫入
docker stop chinese-learn-app

# 2. 恢復最近備份（每日自動備份）
docker exec chinese-learn-postgres-prod pg_restore \
  -U chinese_learn -d chinese_learn /backups/latest.dump

# 3. 通知學員資料可能回滾到 X 時間
```

**預防**：跑 `scripts/backup-db.sh` 定期備份

### EMERG-002：AI 服務全部不可用
**降級方案**：
- 注音題型：fallback 到 Web Speech API
- 對話練習：暫時關閉，顯示「維護中」
- 作業批改：暫存，老師人工批改
- 顯示 banner 通知學員

### EMERG-003：證書系統錯誤導致獎金錯發
**處理**：
1. 立即查 AuditLog 找出受影響筆數
2. 通知 HR 暫停薪資發放
3. 用 transaction 回滾
4. 記錄事件報告

---

## 📊 監控指標（建議）

未來啟用後注意：
- AI 路由成功率
- 各 Provider 回應時間
- DB 連線池使用率
- Redis 記憶體使用
- MinIO 儲存空間
- 每日活躍學員數

---

**See also**：
- `02_architecture.md` 部署細節
- `06_decisions.md` 為何踩這些坑（背景）
- GitHub Issues（公開問題追蹤）
