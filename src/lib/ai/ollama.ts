/**
 * Ollama Client (R770 GPU 推論備援)
 *
 * Base URL: http://192.168.1.214:11434
 * 與 OpenClaw 使用相同 Ollama 實例
 */

interface OllamaChatParams {
  systemPrompt?: string;
  userPrompt: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

interface OllamaResponse {
  content: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
}

class OllamaClient {
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL ?? "http://192.168.1.214:11434";
    this.defaultModel = process.env.OLLAMA_MODEL ?? "qwen2.5:latest";
  }

  async chat(params: OllamaChatParams): Promise<OllamaResponse> {
    const messages = this.buildMessages(params);

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      params.timeout ?? 60000
    );

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.defaultModel,
          messages,
          stream: false,
          options: {
            temperature: params.temperature ?? 0.7,
            num_predict: params.maxTokens ?? 1024,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return {
        content: data.message?.content ?? "",
        model: data.model ?? this.defaultModel,
        inputTokens: data.prompt_eval_count,
        outputTokens: data.eval_count,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private buildMessages(params: OllamaChatParams) {
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

export const ollamaClient = new OllamaClient();
