/**
 * LM Studio API Client
 *
 * LM Studio 提供 OpenAI 相容的 API
 * Base URL: http://192.168.1.XXX:1234/v1
 * Endpoint: /chat/completions
 *
 * 順元會在內網提供 IP 與 API Key
 */

interface LmStudioChatParams {
  systemPrompt?: string;
  userPrompt: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

interface LmStudioResponse {
  content: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
}

class LmStudioClient {
  private baseUrl: string;
  private apiKey: string;
  private defaultModel: string;

  constructor() {
    this.baseUrl = process.env.LM_STUDIO_BASE_URL ?? "http://localhost:1234/v1";
    this.apiKey = process.env.LM_STUDIO_API_KEY ?? "lm-studio";
    this.defaultModel = process.env.LM_STUDIO_MODEL ?? "qwen2.5-72b-instruct";
  }

  async chat(params: LmStudioChatParams): Promise<LmStudioResponse> {
    const messages = this.buildMessages(params);

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      params.timeout ?? 30000
    );

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages,
          temperature: params.temperature ?? 0.7,
          max_tokens: params.maxTokens ?? 1024,
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LM Studio API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content ?? "",
        model: data.model ?? this.defaultModel,
        inputTokens: data.usage?.prompt_tokens,
        outputTokens: data.usage?.completion_tokens,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: "GET",
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 串流回應 (用於對話練習)
   */
  async *streamChat(
    params: LmStudioChatParams
  ): AsyncGenerator<string, void, unknown> {
    const messages = this.buildMessages(params);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.defaultModel,
        messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1024,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`LM Studio stream error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // 忽略解析錯誤
        }
      }
    }
  }

  private buildMessages(params: LmStudioChatParams) {
    const messages: Array<{ role: string; content: string }> = [];
    if (params.systemPrompt) {
      messages.push({ role: "system", content: params.systemPrompt });
    }
    if (params.history) {
      messages.push(...params.history);
    }
    messages.push({ role: "user", content: params.userPrompt });
    return messages;
  }
}

export const lmStudioClient = new LmStudioClient();
