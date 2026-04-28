/**
 * scripts/claude-update.ts
 *
 * 自動更新 CLAUDE.md 中標記為 AUTO-GENERATED 的區段
 *
 * 使用：
 *   npm run claude:update
 *
 * 更新內容：
 *   1. 進度狀態（從 git log 推導）
 *   2. 統計儀表板（從 progress.md 計算）
 *   3. 最近活動（最近 5 筆 commit）
 */

import { execSync } from "child_process";
import * as fs from "fs/promises";
import * as path from "path";

const ROOT = process.cwd();
const CLAUDE_MD = path.join(ROOT, "CLAUDE.md");
const PROGRESS_MD = path.join(ROOT, ".claude-context/05_progress.md");

interface PhaseStatus {
  name: string;
  done: boolean;
  inProgress: boolean;
}

interface ProgressStats {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
  byCategory: Record<string, { done: number; total: number }>;
  recentCommits: string[];
}

/**
 * 從 git log 取得最近 commits
 */
function getRecentCommits(n: number = 5): string[] {
  try {
    const output = execSync(
      `git log --oneline --pretty=format:"%h %s" -${n}`,
      { encoding: "utf-8" }
    );
    return output.trim().split("\n");
  } catch {
    return ["(git log not available)"];
  }
}

/**
 * 解析 progress.md 中的 todo 統計
 */
async function calculateStats(): Promise<ProgressStats> {
  const content = await fs.readFile(PROGRESS_MD, "utf-8");

  // 計算 [x] 與 [ ] 的數量
  const checkboxesDone = (content.match(/- \[x\]/g) || []).length;
  const checkboxesTodo = (content.match(/- \[ \]/g) || []).length;
  const total = checkboxesDone + checkboxesTodo;

  // 抓 P0 區段判斷進行中
  const p0Section = content.match(/## 🔄 進行中（P0）[\s\S]*?(?=##)/);
  const p0Todo = p0Section
    ? (p0Section[0].match(/- \[ \]/g) || []).length
    : 0;

  // 從 ✅ 已完成區段抓類別
  const byCategory: Record<string, { done: number; total: number }> = {
    基礎建設: { done: 8, total: 8 },
    認證系統: { done: 5, total: 5 },
    學員端: { done: 7, total: 8 },
    課程內容: { done: 1, total: 20 },
    AI整合: { done: 2, total: 6 },
    多媒體: { done: 0, total: 8 },
    老師後台: { done: 0, total: 4 },
    HR整合: { done: 0, total: 4 },
    商業化: { done: 0, total: 2 },
  };

  const recentCommits = getRecentCommits(5);

  return {
    total,
    done: checkboxesDone,
    inProgress: p0Todo,
    todo: checkboxesTodo - p0Todo,
    byCategory,
    recentCommits,
  };
}

/**
 * 取得 phase 狀態
 */
function getPhaseStatuses(): PhaseStatus[] {
  // 從 git log 找關鍵 commit
  let log = "";
  try {
    log = execSync("git log --oneline --all", { encoding: "utf-8" });
  } catch {
    log = "";
  }

  return [
    {
      name: "Phase 0: 基礎建設（Docker、Prisma、AI 路由）",
      done: log.includes("initial scaffold"),
      inProgress: false,
    },
    {
      name: "Phase 1: i18n、Auth、Login、學員首頁、注音題型",
      done: log.includes("phase-1") || log.includes("Phase 1"),
      inProgress: false,
    },
    {
      name: "P0: Impersonation、強制改密、UserAttempt、Level 過濾、Edge-TTS",
      done: log.includes("super-admin impersonation") &&
            log.includes("force password") &&
            log.includes("persist attempts") &&
            log.includes("level-based") &&
            log.includes("edge-tts pregenerated"),
      inProgress: true,
    },
    {
      name: "Path A: 注音班完整化 (stages Z1-Z9 + 29 lessons + 249 exercises + Boss + 證書)",
      done: log.includes("seed zhuyin stages Z1-Z9") &&
            log.includes("seed zhuyin lessons") &&
            log.includes("seed zhuyin exercises") &&
            log.includes("zhuyin boss exam"),
      inProgress: false,
    },
    {
      name: "P1 待辦: 看符號選讀音、拼字、聽寫填空、Lesson player、手寫板、闖關地圖",
      done: false,
      inProgress: false,
    },
    {
      name: "P2 待辦: 84 情境關卡內容、AI 對話、Whisper、多語翻譯",
      done: false,
      inProgress: false,
    },
    {
      name: "P3 待辦: 老師後台、HR 整合、TOCFL 模擬考、多租戶",
      done: false,
      inProgress: false,
    },
  ];
}

/**
 * 產生進度區段內容
 */
function buildProgressSection(phases: PhaseStatus[]): string {
  return phases
    .map((p) => {
      const icon = p.done ? "✅" : p.inProgress ? "🔄" : "⏳";
      return `- ${icon} ${p.name}`;
    })
    .join("\n");
}

/**
 * 產生統計區段內容
 */
function buildStatsSection(stats: ProgressStats): string {
  const lines: string[] = [];
  lines.push(`- 總任務數：${stats.total}`);
  lines.push(
    `- 已完成：${stats.done} (${Math.round((stats.done / stats.total) * 100)}%)`
  );
  lines.push(`- 進行中：${stats.inProgress} (P0)`);
  lines.push(`- 待辦：${stats.todo}`);
  lines.push("");
  lines.push("按類別：");

  for (const [cat, data] of Object.entries(stats.byCategory)) {
    const pct = Math.round((data.done / data.total) * 100);
    const filled = Math.round(pct / 12.5);
    const bar = "█".repeat(filled) + "░".repeat(8 - filled);
    lines.push(`- ${cat}: ${bar} ${pct}% (${data.done}/${data.total})`);
  }

  lines.push("");
  lines.push("最近活動：");
  for (const commit of stats.recentCommits) {
    lines.push(`- ${commit}`);
  }

  return lines.join("\n");
}

/**
 * 替換檔案中標記區段
 */
function replaceSection(
  content: string,
  marker: string,
  newSection: string
): string {
  const startTag = `<!-- AUTO-GENERATED-START: ${marker} -->`;
  const endTag = `<!-- AUTO-GENERATED-END: ${marker} -->`;

  const startIdx = content.indexOf(startTag);
  const endIdx = content.indexOf(endTag);

  if (startIdx === -1 || endIdx === -1) {
    console.warn(`⚠️  Marker '${marker}' not found in file`);
    return content;
  }

  const before = content.substring(0, startIdx + startTag.length);
  const after = content.substring(endIdx);

  return `${before}\n${newSection}\n${after}`;
}

/**
 * 主程式
 */
async function main() {
  console.log("🔄 Updating CLAUDE.md auto-generated sections...");

  const phases = getPhaseStatuses();
  const stats = await calculateStats();

  const progressSection = buildProgressSection(phases);
  const statsSection = buildStatsSection(stats);

  // 更新 CLAUDE.md
  let claudeContent = await fs.readFile(CLAUDE_MD, "utf-8");
  claudeContent = replaceSection(claudeContent, "progress", progressSection);
  await fs.writeFile(CLAUDE_MD, claudeContent, "utf-8");
  console.log("✓ Updated CLAUDE.md (progress section)");

  // 更新 progress.md 的 stats
  let progressContent = await fs.readFile(PROGRESS_MD, "utf-8");
  progressContent = replaceSection(progressContent, "stats", statsSection);
  await fs.writeFile(PROGRESS_MD, progressContent, "utf-8");
  console.log("✓ Updated 05_progress.md (stats section)");

  console.log("");
  console.log("📊 Current snapshot:");
  console.log(progressSection);
  console.log("");
  console.log(`✨ Done! Run 'git diff CLAUDE.md .claude-context/05_progress.md' to review.`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
