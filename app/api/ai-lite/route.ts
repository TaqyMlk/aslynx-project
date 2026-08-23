import { NextRequest, NextResponse } from 'next/server';
import { streamAIProvider, detectProvider } from '@/src/server/ai/providers';
import { checkRateLimit, recordUsage } from '@/src/server/agent/limits';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 8_000;

function sanitizeMessages(raw: unknown): { role: 'user' | 'assistant'; content: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is { role: 'user' | 'assistant'; content: string } =>
        m && typeof m === 'object' && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
    )
    .slice(0, MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, messages, mode = 'general', preferredProvider = 'auto' } = body;

    let formattedMessages: { role: 'user' | 'assistant'; content: string }[] =
      sanitizeMessages(messages);

    if (formattedMessages.length === 0) {
      if (typeof prompt !== 'string' || !prompt.trim()) {
        return NextResponse.json({ error: 'Prompt or messages array is required.' }, { status: 400 });
      }
      formattedMessages = [{ role: 'user', content: prompt.trim().slice(0, MAX_MESSAGE_CHARS) }];
    }

    const totalChars = formattedMessages.reduce((sum, m) => sum + m.content.length, 0);
    const estimatedTokens = Math.ceil(totalChars / 4) + 400;
    const gate = await checkRateLimit(estimatedTokens);
    if (!gate.allowed) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait a moment and try again.', limitType: gate.reason },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const normalizedMode = mode === 'coding' ? 'coding' : 'general';
    const systemPrompt = normalizedMode === 'coding'
      ? 'You are AsLynx AI Lite (Coding Specialist). Produce clean, optimized, modern, directly usable solutions for TypeScript, JavaScript, Minecraft Bedrock Script API, Python, and web frameworks.'
      : 'You are AsLynx AI Lite, a helpful, precise, and accurate AI assistant. Keep responses concise and useful.';

    const meta = detectProvider(
      { messages: formattedMessages, mode: normalizedMode, preferredProvider },
      (k) => Boolean(process.env[`${k}_API_KEY`])
    );

    const startTime = Date.now();
    const textChunks: string[] = [];
    const encoder = new TextEncoder();
    let aborted = false;

    const stream = new ReadableStream({
      start(controller) {
        const send = (obj: unknown) => {
          if (!aborted) {
            try { controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n')); } catch {}
          }
        };

        (async () => {
          try {
            for await (const chunk of streamAIProvider({
              messages: formattedMessages,
              systemPrompt,
              mode: normalizedMode,
              preferredProvider: preferredProvider === 'gemini' || preferredProvider === 'openrouter' || preferredProvider === 'groq' ? preferredProvider : 'auto'
            })) {
              textChunks.push(chunk);
              send({ type: 'token', text: chunk });
            }

            const text = textChunks.join('');
            const isFallback = text.startsWith('[AsLynx AI System Response');

            if (isFallback) {
              send({ type: 'error', message: 'All AI providers are currently unavailable. Please retry in a moment.' });
              return;
            }

            await recordUsage(estimatedTokens);

            send({
              type: 'done',
              text,
              provider: meta?.provider || 'Unknown',
              model: meta?.model || '',
              latencyMs: Date.now() - startTime,
              stateless: true
            });
          } catch (err) {
            if (!aborted) {
              send({ type: 'error', message: err instanceof Error ? err.message : 'Stream interrupted.' });
            }
          } finally {
            try { controller.close(); } catch {}
          }
        })();
      },
      cancel() { aborted = true; }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/json-lines',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    });
  } catch (err: unknown) {
    console.error('[ai-lite POST]', err);
    return NextResponse.json({ error: 'AI Lite request failed. Please retry.' }, { status: 500 });
  }
}