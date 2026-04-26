/**
 * Claude API Client (進階任務專用)
 *
 * 用於:
 * - 作文深度批改
 * - 課程設計
 * - 抄襲語義檢測
 *
 * 注意: 有 API 成本，路由器會優先用內網模型
 */

import Anthropic from "@anthropic-ai/sdk";

interface ClaudeChatParams {
  systemPrompt?: string;
  userPrompt: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

interface ClaudeResponse {
  content: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  costEstimate?: number;
}

class ClaudeClient {
  private client: Anthropic | null = null;
  private defaultModel: string;

  constructor() {
    this.defaultModel = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && apiKey !== "sk-ant-CHANGE_ME") {
      this.client = new Anthropic({ apiKey });
    }
  }

  async chat(params: ClaudeChatParams): Promise<ClaudeResponse> {
    if (!this.client) {
      throw new Error("Claude API key not configured. Set ANTHROPIC_API_KEY in .env.local");
    }

    const messages = this.buildMessages(params);

    const response = await this.client.messages.create({
      model: this.defaultModel,
      max_tokens: params.maxTokens ?? 2048,
      temperature: params.temperature ?? 0.7,
      system: params.systemPrompt,
      messages,
    });

    // 提取文字內容
    const textBlock = response.content.find((b) => b.type === "text");
    const content = textBlock && textBlock.type === "text" ? textBlock.text : "";

    // 估算成本 (Sonnet: $3/$15 per million tokens, Opus: $15/$75)
    const isOpus = this.defaultModel.includes("opus");
    const inputCost = isOpus ? 15 / 1_000_000 : 3 / 1_000_000;
    const outputCost = isOpus ? 75 / 1_000_000 : 15 / 1_000_000;
    const costEstimate =
      response.usage.input_tokens * inputCost +
      response.usage.output_tokens * outputCost;

    return {
      content,
      model: response.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      costEstimate,
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;
    try {
      // 用最小成本的請求做健康檢查
      await this.client.messages.create({
        model: this.defaultModel,
        max_tokens: 5,
        messages: [{ role: "user", content: "hi" }],
      });
      return true;
    } catch {
      return false;
    }
  }

  private buildMessages(params: ClaudeChatParams) {
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];
    if (params.history) {
      messages.push(...params.history);
    }
    messages.push({ role: "user", content: params.userPrompt });
    return messages;
  }
}

export const claudeClient = new ClaudeClient();
