import { GoogleGenAI } from '@google/genai';

export interface AIRequestOptions {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  mode?: 'general' | 'coding';
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  preferredProvider?: 'auto' | 'gemini' | 'openrouter' | 'groq';
}

export interface AIResponse {
  text: string;
  provider: string;
  model: string;
  latencyMs: number;
  tokensUsed?: { prompt: number; completion: number; total: number };
}

export async function callAIProvider(options: AIRequestOptions): Promise<AIResponse> {
  const startTime = Date.now();
  const mode = options.mode || 'general';
  const temperature = options.temperature ?? 0.7;

  const errors: string[] = [];

  // Try OpenRouter if key is present and requested/auto
  if (process.env.OPENROUTER_API_KEY && (options.preferredProvider === 'openrouter' || options.preferredProvider === 'auto')) {
    try {
      const model = mode === 'coding' ? 'qwen/qwen-2.5-coder-32b-instruct' : 'meta-llama/llama-3.3-70b-instruct';
      const formattedMessages = [];
      if (options.systemPrompt) {
        formattedMessages.push({ role: 'system', content: options.systemPrompt });
      }
      formattedMessages.push(...options.messages);

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://aslynx.dev',
          'X-Title': 'AsLynx Unified Platform'
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature,
          max_tokens: options.maxTokens || 2048
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content || '';
        if (text) {
          return {
            text,
            provider: 'OpenRouter',
            model,
            latencyMs: Date.now() - startTime,
            tokensUsed: {
              prompt: data?.usage?.prompt_tokens || 0,
              completion: data?.usage?.completion_tokens || 0,
              total: data?.usage?.total_tokens || 0
            }
          };
        }
      }
      errors.push(`OpenRouter status: ${res.status}`);
    } catch (err: unknown) {
      errors.push(`OpenRouter error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Try Groq if key is present
  if (process.env.GROQ_API_KEY && (options.preferredProvider === 'groq' || options.preferredProvider === 'auto')) {
    try {
      const model = 'llama-3.3-70b-versatile';
      const formattedMessages = [];
      if (options.systemPrompt) {
        formattedMessages.push({ role: 'system', content: options.systemPrompt });
      }
      formattedMessages.push(...options.messages);

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature,
          max_tokens: options.maxTokens || 2048
        }),
        signal: AbortSignal.timeout(12000)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content || '';
        if (text) {
          return {
            text,
            provider: 'Groq',
            model,
            latencyMs: Date.now() - startTime,
            tokensUsed: {
              prompt: data?.usage?.prompt_tokens || 0,
              completion: data?.usage?.completion_tokens || 0,
              total: data?.usage?.total_tokens || 0
            }
          };
        }
      }
      errors.push(`Groq status: ${res.status}`);
    } catch (err: unknown) {
      errors.push(`Groq error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Gemini API (via process.env.GEMINI_API_KEY)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const modelName = 'gemini-2.5-flash';

      const promptParts = [];
      if (options.systemPrompt) {
        promptParts.push(`[System Directive]: ${options.systemPrompt}\n\n`);
      }

      for (const m of options.messages) {
        if (m.role === 'system') {
          promptParts.push(`[System]: ${m.content}\n\n`);
        } else if (m.role === 'user') {
          promptParts.push(`User: ${m.content}\n`);
        } else {
          promptParts.push(`Assistant: ${m.content}\n`);
        }
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: promptParts.join('\n'),
        config: {
          temperature
        }
      });

      const text = response.text || '';
      if (text) {
        return {
          text,
          provider: 'Gemini',
          model: modelName,
          latencyMs: Date.now() - startTime
        };
      }
      errors.push('Gemini returned empty text');
    } catch (err: unknown) {
      errors.push(`Gemini error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // If all providers failed or no API keys are supplied, produce an informative response
  const lastUserMsg = options.messages.filter((m) => m.role === 'user').pop()?.content || '';
  return {
    text: `[AsLynx AI System Response - Offline Fallback]\n\nReceived your query: "${lastUserMsg.slice(0, 100)}${lastUserMsg.length > 100 ? '...' : ''}".\n\nTo enable live generation with OpenRouter, Groq, or Gemini, configure GEMINI_API_KEY, OPENROUTER_API_KEY, or GROQ_API_KEY in your environment.\n\nErrors encountered:\n${errors.join('\n') || 'No external provider keys active.'}`,
    provider: 'Local Fallback Engine',
    model: 'aslynx-rule-fallback',
    latencyMs: Date.now() - startTime
  };
}
