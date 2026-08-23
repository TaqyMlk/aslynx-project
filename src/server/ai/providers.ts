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
  /** True when every provider failed and the offline notice is returned. */
  fallback?: boolean;
}

const GEMINI_TIMEOUT_MS = 20_000;

function stripRoleMarkers(content: string): string {
  return content
    .replace(/^\s*(User|Assistant|System)\s*:\s*/gim, '')
    .replace(/\[System Directive\]/gi, '[directive]');
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms))
  ]);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function detectProvider(options: AIRequestOptions, hasKey: (k: string) => boolean): { provider: string; model: string } | null {
  const p = options.preferredProvider || 'auto';
  if (p === 'gemini' && hasKey('GEMINI')) return { provider: 'Gemini', model: 'gemini-2.5-flash' };
  if (p === 'openrouter' && hasKey('OPENROUTER')) return { provider: 'OpenRouter', model: options.mode === 'coding' ? 'qwen/qwen-2.5-coder-32b-instruct' : 'meta-llama/llama-3.3-70b-instruct' };
  if (p === 'groq' && hasKey('GROQ')) return { provider: 'Groq', model: 'llama-3.3-70b-versatile' };
  if (p === 'auto') {
    if (hasKey('OPENROUTER')) return { provider: 'OpenRouter', model: options.mode === 'coding' ? 'qwen/qwen-2.5-coder-32b-instruct' : 'meta-llama/llama-3.3-70b-instruct' };
    if (hasKey('GROQ')) return { provider: 'Groq', model: 'llama-3.3-70b-versatile' };
    if (hasKey('GEMINI')) return { provider: 'Gemini', model: 'gemini-2.5-flash' };
  }
  return null;
}

export async function* streamAIProvider(
  options: AIRequestOptions
): AsyncIterable<string> {
  const mode = options.mode || 'general';
  const temperature = options.temperature ?? 0.7;

  const hasKey = (name: string) => Boolean(process.env[`${name}_API_KEY`]);

  // Try OpenRouter
  if (process.env.OPENROUTER_API_KEY && (options.preferredProvider === 'openrouter' || options.preferredProvider === 'auto')) {
    try {
      const model = mode === 'coding' ? 'qwen/qwen-2.5-coder-32b-instruct' : 'meta-llama/llama-3.3-70b-instruct';
      const formattedMessages = [];
      if (options.systemPrompt) formattedMessages.push({ role: 'system', content: options.systemPrompt });
      formattedMessages.push(
        ...options.messages.map((m) => ({ role: m.role, content: stripRoleMarkers(m.content) }))
      );

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
          max_tokens: options.maxTokens || 2048,
          stream: true
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (res.ok) {
        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) yield delta;
            } catch { /* skip malformed chunk */ }
          }
        }
        return;
      }
      throw new Error(`OpenRouter status: ${res.status}`);
    } catch { /* fall through */ }
  }

  // Try Groq
  if (process.env.GROQ_API_KEY && (options.preferredProvider === 'groq' || options.preferredProvider === 'auto')) {
    try {
      const model = 'llama-3.3-70b-versatile';
      const formattedMessages = [];
      if (options.systemPrompt) formattedMessages.push({ role: 'system', content: options.systemPrompt });
      formattedMessages.push(
        ...options.messages.map((m) => ({ role: m.role, content: stripRoleMarkers(m.content) }))
      );

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
          max_tokens: options.maxTokens || 2048,
          stream: true
        }),
        signal: AbortSignal.timeout(12000)
      });

      if (res.ok) {
        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) yield delta;
            } catch { /* skip */ }
          }
        }
        return;
      }
      throw new Error(`Groq status: ${res.status}`);
    } catch { /* fall through */ }
  }

  // Gemini stream
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && (options.preferredProvider === 'gemini' || options.preferredProvider === 'auto')) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const modelName = 'gemini-2.5-flash';
      const contents = options.messages
        .map((m) => `${m.role === 'assistant' ? 'Assistant' : 'User'}: ${stripRoleMarkers(m.content)}`)
        .join('\n\n');

      const stream = await withTimeout(
        ai.models.generateContentStream({
          model: modelName,
          contents,
          config: {
            temperature,
            maxOutputTokens: options.maxTokens || 2048,
            ...(options.systemPrompt ? { systemInstruction: options.systemPrompt } : {})
          }
        }),
        GEMINI_TIMEOUT_MS
      );

      if (stream) {
        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) yield text;
        }
        return;
      }
    } catch { /* fall through */ }
  }

  // Fallback
  const lastUserMsg = options.messages.filter((m) => m.role === 'user').pop()?.content || '';
  yield `[AsLynx AI System Response - Offline Fallback]\n\nReceived your query: "${lastUserMsg.slice(0, 100)}${lastUserMsg.length > 100 ? '...' : ''}".\n\nTo enable live generation with Gemini, OpenRouter, or Groq, configure GEMINI_API_KEY, OPENROUTER_API_KEY, or GROQ_API_KEY in your environment.`;
}

export async function callAIProvider(options: AIRequestOptions): Promise<AIResponse> {
  const startTime = Date.now();
  const chunks: string[] = [];
  const hasKey = (name: string) => Boolean(process.env[`${name}_API_KEY`]);
  const meta = detectProvider(options, hasKey);

  try {
    for await (const chunk of streamAIProvider(options)) {
      chunks.push(chunk);
    }
  } catch {
    // streamAIProvider handles its own fallback yields.
  }

  const text = chunks.join('');
  const isFallback = text.startsWith('[AsLynx AI System Response');

  return {
    text,
    provider: meta?.provider || 'Local Fallback Engine',
    model: meta?.model || 'aslynx-rule-fallback',
    latencyMs: Date.now() - startTime,
    fallback: isFallback
  };
}