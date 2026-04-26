# 🤖 Claude Code 開發指引

> 給 VS Code + Claude Code 整合開發時參考的指令文件
> 順元用泰文討論時，Claude Code 會根據此文件保持架構一致性

---

## 📋 此專案的開發規則

### 規則 1：與既有 ERP 一致性
本專案技術棧刻意與既有 ERP 保持一致：
- ✅ Next.js 15 App Router
- ✅ Prisma ORM
- ✅ PostgreSQL
- ✅ TypeScript
- ✅ Tailwind + shadcn/ui

未來合併到 HR/LTC-IMS 統一系統時，這個一致性是關鍵。

### 規則 2：所有教學內容用繁體中文
- 介面 UI 字串可以多語系
- 教學詞彙、例句、語法解釋一律繁體中文
- 注音優先使用 ㄅㄆㄇ 系統，拼音為輔

### 規則 3：手機優先 (Mobile-First)
- Tailwind 預設斷點從 mobile 開始
- 所有元件先在 375px 寬度測試
- 觸控目標最小 44x44px
- 避免 hover-only 互動

### 規則 4：內網優先 AI 呼叫
所有 AI 呼叫透過 `src/lib/ai/router.ts`，不要直接呼叫 Claude API：
```typescript
// ❌ 錯誤
import Anthropic from "@anthropic-ai/sdk";

// ✅ 正確
import { routeAiRequest } from "@/lib/ai/router";
const result = await routeAiRequest({
  task: "conversation_practice",
  systemPrompt: "...",
  userPrompt: "...",
});
```

### 規則 5：預留整合接口
新增與員工相關的資料模型時，務必：
- 加上 `hrSyncId` (HR-IMS 對應)
- 加上 `ltcImsSyncId` (LTC-IMS 對應)
- 加上 `externalIds` JSON 欄位 (其他系統)

### 規則 6：所有敏感操作要稽核
任何修改、刪除、登入等動作要寫入 `AuditLog`：
```typescript
await auditLog({
  userId,
  action: "UPDATE",
  resource: "user",
  resourceId: targetId,
  before: oldData,
  after: newData,
});
```

---

## 🎯 標準開發流程

### 新增功能的 SOP

1. **先讀 Schema**：確認資料模型支援，不夠就先擴充 Prisma schema
2. **寫 API Route Handler**：放在 `src/app/api/`
3. **寫 Server Component**：能用 RSC 就不用 Client Component
4. **寫 Client Component**：互動需要時才用 `"use client"`
5. **加 i18n key**：四個語系檔案都要加
6. **寫測試**：vitest 單元測試、playwright E2E
7. **更新文件**：API.md、CURRICULUM.md

### 命名規範

```
資料庫表        snake_case          users / lesson_vocabularies
Prisma model    PascalCase          User / LessonVocabulary
TypeScript 型別  PascalCase          UserProfile / AiResponse
變數/函式       camelCase           userName / calculateScore
React 元件      PascalCase          LessonCard / ZhuyinKeyboard
檔案名 (元件)    kebab-case          lesson-card.tsx
檔案名 (utility) kebab-case          calculate-score.ts
路由            kebab-case          /learn/lesson-detail
i18n key        snake_case dotted   learn.lesson.start_button
```

### Git Commit 規範

採用 Conventional Commits：
```
feat:     新功能
fix:      修 bug
docs:     文件
style:    格式
refactor: 重構
perf:     效能
test:     測試
chore:    雜項

範例：
feat(learn): add zhuyin keyboard component
fix(ai): handle lm-studio timeout fallback to ollama
docs(api): update homework submission endpoints
```

---

## 🛠️ 常用指令速查

### 資料庫操作
```bash
# 修改 schema 後
npx prisma format
npx prisma generate

# 開發中改 schema
npx prisma migrate dev --name describe_change

# 重置資料庫 (清空並重跑 migration + seed)
npm run db:reset

# 視覺化檢視
npm run db:studio
```

### Docker 操作
```bash
# 啟動開發環境 (postgres + redis + minio)
npm run docker:dev

# 停止
npm run docker:dev:down

# 看 log
docker compose -f docker/docker-compose.yml logs -f postgres

# 進入容器
docker exec -it chinese-learn-postgres psql -U chinese_learn
```

### 開發伺服器
```bash
# 啟動
npm run dev               # http://localhost:3003

# 型別檢查
npm run type-check

# 格式化
npm run format

# 測試
npm test                  # 單元
npm run test:e2e          # E2E
```

### 內容匯入
```bash
# 匯入 TOCFL 八千詞
npm run ingest:tocfl

# 匯入 PDF 教材 (順元提供的師大/台大課本)
npm run ingest:pdf -- --file path/to/textbook.pdf --level A1

# 批次生成詞彙音檔 (edge-tts)
npm run ingest:audio -- --level A1
```

---

## 📁 重要檔案地圖

| 檔案 | 用途 |
|---|---|
| `prisma/schema/*` | 資料模型 (改了要 `prisma migrate dev`) |
| `src/lib/ai/router.ts` | AI 統一入口 |
| `src/lib/ai/lm-studio.ts` | LM Studio client |
| `src/lib/srs/index.ts` | 間隔重複算法 |
| `src/lib/plagiarism/index.ts` | 防抄襲核心 |
| `src/i18n/*.json` | 多語系翻譯 |
| `src/content/` | 課程內容 (Markdown) |
| `docker/docker-compose.yml` | 開發環境 |
| `Dockerfile` | 生產映像檔 |
| `.env.example` | 環境變數範本 |

---

## 🔌 LM Studio 整合說明

### 順元提供 IP 與 Key 後的設定步驟

1. 編輯 `.env.local`：
```env
LM_STUDIO_BASE_URL=http://192.168.1.XXX:1234/v1
LM_STUDIO_API_KEY=lm-studio-actual-key
LM_STUDIO_MODEL=qwen2.5-72b-instruct
```

2. 測試連線：
```bash
curl http://192.168.1.XXX:1234/v1/models \
  -H "Authorization: Bearer lm-studio-actual-key"
```

3. 在 Next.js 中測試：
```typescript
// scripts/test-lm-studio.ts
import { lmStudioClient } from "@/lib/ai/lm-studio";

const response = await lmStudioClient.chat({
  systemPrompt: "你是一位繁體中文老師。",
  userPrompt: "請用簡單的中文介紹『你好』。",
});
console.log(response.content);
```

```bash
npx tsx scripts/test-lm-studio.ts
```

---

## 🚧 注意事項

### ❌ 不要做的事
- ❌ 直接修改 `prisma/migrations/` 已產生的檔案
- ❌ 在 git push 前忘記 `npm run type-check`
- ❌ 把 `.env.local` commit 到 repo
- ❌ 把學員的真實照片、個資 commit 到 repo
- ❌ 用簡體中文寫教學內容
- ❌ 直接呼叫 `@anthropic-ai/sdk`，要透過 router

### ✅ 一定要做的事
- ✅ 修 schema 後跑 `npx prisma generate`
- ✅ 加 i18n key 時四個語系檔都要更新
- ✅ 新建敏感欄位時做加密（護照號、住址）
- ✅ 大改動前先讀 `docs/ARCHITECTURE.md`
- ✅ 提交前跑 `npm run type-check && npm run lint`

---

## 📞 順元的偏好設定

- **語言**：與 Claude Code 用泰文討論，但 Code/Comment 寫繁體中文或英文
- **回應風格**：模組化、可執行、附上業務邏輯（成本、效益、可行性）
- **不要用韓國品牌**：UI 元件、套件選型避開三星/LG 的衍生產品
- **預留整合**：所有員工相關資料一律預留 HR/LTC-IMS 接口

---

## 🌐 預留的整合 webhook

```
HR-IMS:
POST /webhook/hr-ims/sync-employee
GET  /webhook/hr-ims/employee-status

LTC-IMS:
POST /webhook/ltc-ims/sync-employee
GET  /webhook/ltc-ims/facility-staff

OpenClaw Heartbeat:
POST /webhook/heartbeat/report  (每 5 分鐘)
```
