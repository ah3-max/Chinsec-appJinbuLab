/**
 * AI 智慧分流路由器
 *
 * 策略:
 * - 內網優先: LM Studio (主) → Ollama (備) → Claude (最後)
 * - 任務分類: 即時對話用本地、複雜批改用 Claude
 * - Fallback: 內網失敗自動切到 Claude
 */

import { lmStudioClient } from "./lm-studio";
import { ollamaClient } from "./ollama";
import { claudeClient } from "./claude";

export type AiTask =
  | "conversation_practice"
  | "vocab_explanation"
  | "grammar_simple_check"
  | "homework_initial_grade"
  | "pronunciation_feedback"
  | "essay_deep_analysis"
  | "curriculum_design"
  | "plagiarism_semantic"
  | "translation_assist"
  | "scenario_role_play";

export type AiProvider = "lm-studio" | "ollama" | "claude";

interface AiRouteConfig {
  primary: AiProvider;
  fallback: AiProvider[];
  maxRetries: number;
  timeout: number;
}

/**
 * 任務 → 模型分流規則
 *
 * 原則:
 * 1. 高頻、即時、簡單 → LM Studio 內網
 * 2. 中等複雜度 → Ollama (R770 GPU)
 * 3. 高複雜度、低頻 → Claude API (付費)
 */
const ROUTE_MAP: Record<AiTask, AiRouteConfig> = {
  // === 內網主跑 (即時、高頻) ===
  conversation_practice: {
    primary: "lm-studio",
    fallback: ["ollama", "claude"],
    maxRetries: 2,
    timeout: 30000,
  },
  vocab_explanation: {
    primary: "lm-studio",
    fallback: ["ollama"],
    maxRetries: 1,
    timeout: 15000,
  },
  grammar_simple_check: {
    primary: "lm-studio",
    fallback: ["ollama"],
    maxRetries: 1,
    timeout: 15000,
  },
  scenario_role_play: {
    primary: "lm-studio",
    fallback: ["claude"],
    maxRetries: 2,
    timeout: 30000,
  },

  // === 中度任務 (Ollama) ===
  homework_initial_grade: {
    primary: "ollama",
    fallback: ["claude"],
    maxRetries: 2,
    timeout: 60000,
  },
  pronunciation_feedback: {
    primary: "ollama",
    fallback: ["lm-studio"],
    maxRetries: 1,
    timeout: 30000,
  },
  translation_assist: {
    primary: "lm-studio",
    fallback: ["ollama", "claude"],
    maxRetries: 1,
    timeout: 15000,
  },

  // === Claude 專屬 (高複雜度) ===
  essay_deep_analysis: {
    primary: "claude",
    fallback: [],
    maxRetries: 2,
    timeout: 90000,
  },
  curriculum_design: {
    primary: "claude",
    fallback: [],
    maxRetries: 1,
    timeout: 120000,
  },
  plagiarism_semantic: {
    primary: "claude",
    fallback: [],
    maxRetries: 1,
    timeout: 60000,
  },
};

export interface AiRequest {
  task: AiTask;
  systemPrompt?: string;
  userPrompt: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  temperature?: number;
  maxTokens?: number;
  forceProvider?: AiProvider;       // 強制指定模型 (測試用)
  language?: string;                // zh-TW/th/vi/id
}

export interface AiResponse {
  content: string;
  provider: AiProvider;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  costEstimate?: number;
  durationMs: number;
  fallbackUsed: boolean;
}

/**
 * 主要路由函式
 */
export async function routeAiRequest(req: AiRequest): Promise<AiResponse> {
  const config = ROUTE_MAP[req.task];
  const startTime = Date.now();

  // 取得嘗試順序
  const providers: AiProvider[] = req.forceProvider
    ? [req.forceProvider]
    : [config.primary, ...config.fallback];

  let lastError: Error | undefined;
  let fallbackUsed = false;

  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i]!;
    try {
      const response = await callProvider(provider, req, config.timeout);
      return {
        ...response,
        provider,
        durationMs: Date.now() - startTime,
        fallbackUsed: i > 0,
      };
    } catch (err) {
      lastError = err as Error;
      fallbackUsed = true;
      console.warn(
        `[AI Router] ${provider} failed for task ${req.task}: ${lastError.message}`
      );
      // 繼續嘗試下一個 provider
    }
  }

  throw new Error(
    `[AI Router] All providers failed for task ${req.task}. Last error: ${lastError?.message}`
  );
}

async function callProvider(
  provider: AiProvider,
  req: AiRequest,
  timeout: number
): Promise<Omit<AiResponse, "provider" | "durationMs" | "fallbackUsed">> {
  switch (provider) {
    case "lm-studio":
      return lmStudioClient.chat({
        systemPrompt: req.systemPrompt,
        userPrompt: req.userPrompt,
        history: req.history,
        temperature: req.temperature ?? 0.7,
        maxTokens: req.maxTokens ?? 1024,
        timeout,
      });
    case "ollama":
      return ollamaClient.chat({
        systemPrompt: req.systemPrompt,
        userPrompt: req.userPrompt,
        history: req.history,
        temperature: req.temperature ?? 0.7,
        maxTokens: req.maxTokens ?? 1024,
        timeout,
      });
    case "claude":
      return claudeClient.chat({
        systemPrompt: req.systemPrompt,
        userPrompt: req.userPrompt,
        history: req.history,
        temperature: req.temperature ?? 0.7,
        maxTokens: req.maxTokens ?? 2048,
        timeout,
      });
  }
}

/**
 * 健康檢查 - 用於 Heartbeat 整合
 */
export async function checkAiProvidersHealth(): Promise<{
  lmStudio: boolean;
  ollama: boolean;
  claude: boolean;
}> {
  const [lmStudio, ollama, claude] = await Promise.all([
    lmStudioClient.healthCheck().catch(() => false),
    ollamaClient.healthCheck().catch(() => false),
    claudeClient.healthCheck().catch(() => false),
  ]);
  return { lmStudio, ollama, claude };
}
