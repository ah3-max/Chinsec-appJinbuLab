#!/usr/bin/env bash
# ============================================
# ChineseLearn Day 1 一鍵設定腳本 (macOS)
# 適用：MacBook Pro M3
# ============================================
# 使用方法：
#   chmod +x scripts/setup-day1.sh
#   ./scripts/setup-day1.sh
# ============================================

set -e  # 任何錯誤就停止

# 顏色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}▶ $1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_ok() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_warn() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_err() {
  echo -e "${RED}✗ $1${NC}"
  exit 1
}

# ============================================
# 0. 環境檢查
# ============================================
print_step "Step 0: 檢查環境"

# 檢查作業系統
if [[ "$OSTYPE" != "darwin"* ]]; then
  print_warn "此腳本為 macOS 設計，其他系統請手動執行"
fi

# 檢查 Node.js
if ! command -v node &> /dev/null; then
  print_err "未安裝 Node.js，請先安裝 Node.js 20+ (建議用 fnm 或 nvm)"
fi
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 20 ]; then
  print_err "Node.js 版本需 >= 20，目前為 $(node -v)"
fi
print_ok "Node.js: $(node -v)"

# 檢查 npm
print_ok "npm: $(npm -v)"

# 檢查 Docker
if ! command -v docker &> /dev/null; then
  print_err "未安裝 Docker，請從 https://www.docker.com/products/docker-desktop/ 安裝"
fi
if ! docker info &> /dev/null; then
  print_err "Docker 未啟動，請先打開 Docker Desktop"
fi
print_ok "Docker: $(docker -v | cut -d ',' -f 1)"

# 檢查 Git
if ! command -v git &> /dev/null; then
  print_err "未安裝 Git"
fi
print_ok "Git: $(git -v)"

# ============================================
# 1. 環境變數
# ============================================
print_step "Step 1: 設定環境變數"

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  print_ok "已建立 .env.local (從 .env.example)"
  print_warn "請稍後編輯 .env.local 填入 LM_STUDIO_API_KEY 和 ANTHROPIC_API_KEY"
else
  print_ok ".env.local 已存在"
fi

# 自動產生 AUTH_SECRET (如果還沒設)
if grep -q "AUTH_SECRET=CHANGE_ME" .env.local; then
  AUTH_SECRET=$(openssl rand -base64 32)
  # macOS 用 sed -i ''
  sed -i '' "s|AUTH_SECRET=CHANGE_ME_RUN_npx_auth_secret|AUTH_SECRET=$AUTH_SECRET|" .env.local
  print_ok "已自動產生 AUTH_SECRET"
fi

# ============================================
# 2. 安裝依賴
# ============================================
print_step "Step 2: 安裝 npm 依賴 (約 2-3 分鐘)"

if [ -d "node_modules" ]; then
  print_warn "node_modules 已存在，跳過安裝（如要重裝請先刪除）"
else
  npm install --legacy-peer-deps
  print_ok "依賴安裝完成"
fi

# ============================================
# 3. 啟動 Docker 服務
# ============================================
print_step "Step 3: 啟動 Docker (PostgreSQL + Redis + MinIO)"

docker compose -f docker/docker-compose.yml up -d

print_ok "Docker 服務啟動中，等待 15 秒讓資料庫就緒..."
sleep 15

# 檢查服務狀態
if ! docker ps | grep -q chinese-learn-postgres; then
  print_err "PostgreSQL 容器未啟動，請檢查 docker logs chinese-learn-postgres"
fi
print_ok "PostgreSQL 運行中 (port 5435)"

if ! docker ps | grep -q chinese-learn-redis; then
  print_err "Redis 容器未啟動"
fi
print_ok "Redis 運行中 (port 6380)"

if ! docker ps | grep -q chinese-learn-minio; then
  print_err "MinIO 容器未啟動"
fi
print_ok "MinIO 運行中 (port 9000, console 9001)"

# ============================================
# 4. 初始化資料庫
# ============================================
print_step "Step 4: 初始化 Prisma + 資料庫"

# 合併 schema 子檔案
print_ok "產生 Prisma Client..."
npx prisma generate

# 跑 migration
print_ok "建立資料庫 schema..."
if [ ! -d "prisma/migrations" ]; then
  npx prisma migrate dev --name init --skip-seed
else
  npx prisma migrate deploy
fi

# 跑 seed
if [ -f "prisma/seed/index.ts" ]; then
  print_ok "灌入種子資料..."
  npx tsx prisma/seed/index.ts || print_warn "Seed 失敗（不影響架構）"
fi

# ============================================
# 5. 確認可啟動
# ============================================
print_step "Step 5: 驗證安裝"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      🎉 Day 1 設定完成！                     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "下一步："
echo ""
echo -e "  ${YELLOW}1.${NC} 啟動開發伺服器："
echo -e "     ${BLUE}npm run dev${NC}"
echo -e "     開啟 http://localhost:3003"
echo ""
echo -e "  ${YELLOW}2.${NC} 視覺化資料庫："
echo -e "     ${BLUE}npm run db:studio${NC}"
echo -e "     開啟 http://localhost:5555"
echo ""
echo -e "  ${YELLOW}3.${NC} 看 MinIO 控制台："
echo -e "     ${BLUE}http://localhost:9001${NC}"
echo -e "     帳號：minioadmin / 密碼：見 .env.local"
echo ""
echo -e "  ${YELLOW}4.${NC} 推送到 GitHub："
echo -e "     ${BLUE}git remote add origin git@github.com:ah3-max/chinese-learn.git${NC}"
echo -e "     ${BLUE}git push -u origin main${NC}"
echo ""
echo -e "  ${YELLOW}5.${NC} 進入 Phase 1 開發："
echo -e "     對 Claude Code 說："
echo -e "     ${BLUE}「請依照 docs/ARCHITECTURE.md 的 Phase 1，先做注音預備班的頁面與題型」${NC}"
echo ""
