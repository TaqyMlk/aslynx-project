import { NextRequest, NextResponse } from 'next/server';
import { streamAIProvider, detectProvider } from '@/src/server/ai/providers';
import { getMessages, saveMessages, getFacts } from '@/src/server/agent/store';
import { executeTool } from '@/src/server/agent/tools';
import { checkRateLimit, recordUsage } from '@/src/server/agent/limits';
import { isValidSessionId } from '@/src/server/agent/validation';
import { AgentMessage } from '@/src/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_MESSAGE_LENGTH = 8_000;
const MAX_CONTEXT_CHARS_PER_MESSAGE = 4_000;

function normalizeProvider(value: unknown): 'auto' | 'gemini' | 'openrouter' | 'groq' {
  return value === 'gemini' || value === 'openrouter' || value === 'groq' ? value : 'auto';
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = new URL(req.url).searchParams.get('sessionId') || '';
    if (!isValidSessionId(sessionId)) {
      return NextResponse.json({ error: 'A valid sessionId is required.' }, { status: 400 });
    }
    const history = await getMessages(sessionId);
    return NextResponse.json({ history, sessionId });
  } catch (err: unknown) {
    console.error('[agent/chat GET]', err);
    return NextResponse.json({ error: 'Failed to load conversation history.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionId = new URL(req.url).searchParams.get('sessionId') || '';
    if (!isValidSessionId(sessionId)) {
      return NextResponse.json({ error: 'A valid sessionId is required.' }, { status: 400 });
    }
    await saveMessages(sessionId, []);
    return NextResponse.json({ success: true, sessionId });
  } catch (err: unknown) {
    console.error('[agent/chat DELETE]', err);
    return NextResponse.json({ error: 'Failed to clear this conversation.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      message,
      mode = 'general',
      provider = 'auto'
    } = body;

    if (!isValidSessionId(sessionId)) {
      return NextResponse.json({ error: 'A valid sessionId is required.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 413 }
      );
    }

    const preferredProvider = normalizeProvider(provider);

    // Enforce the rate budget BEFORE spending provider tokens.
    const estimatedTokens = Math.ceil(trimmedMessage.length / 4) + 800;
    const gate = await checkRateLimit(estimatedTokens);
    if (!gate.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit reached. Please wait a moment and try again.',
          limitType: gate.reason,
          status: gate.status
        },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const history = await getMessages(sessionId);
    const facts = await getFacts();
    const userMessage: AgentMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: trimmedMessage,
      timestamp: Date.now()
    };
    history.push(userMessage);

    const factsContext = facts
      .slice(0, 8)
      .map((f) => `- [${f.category} / ${f.key}]: ${f.value}`)
      .join('\n');

    const systemPrompt = `You are AsLynx Personal AI Agent, a capable personal developer assistant with persistent memory and tools.

Long-term Memory Context:
${factsContext || 'No stored facts yet.'}

Use the available context accurately. Never claim a tool was used unless it actually was. If the user asks for current information and no live-search result is provided, say that live search is unavailable rather than inventing current facts.`;

    const recentHistory = history
      .slice(-12)
      .map((m) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: m.content.slice(0, MAX_CONTEXT_CHARS_PER_MESSAGE)
      }));

    const toolCallsExecuted: { name: string; args: Record<string, unknown>; result?: unknown }[] = [];
    const lower = trimmedMessage.toLowerCase();

    if (
      lower.includes('jam berapa') ||
      lower.includes('tanggal berapa') ||
      lower.includes('hari apa') ||
      lower.includes('what time') ||
      lower.includes('what date')
    ) {
      const args = { timezone: 'Asia/Jakarta' };
      toolCallsExecuted.push({ name: 'current_datetime', args, result: await executeTool('current_datetime', args) });
    }

    if (lower.startsWith('ingat:') || lower.startsWith('remember:') || lower.startsWith('simpan fakta:')) {
      const factText = trimmedMessage.replace(/^(ingat:|remember:|simpan fakta:)/i, '').trim();
      if (factText) {
        const args = { key: `user_fact_${Date.now()}`, value: factText.slice(0, 2000), tags: ['user_note'] };
        toolCallsExecuted.push({ name: 'remember_fact', args, result: await executeTool('remember_fact', args) });
      }
    }

    const meta = detectProvider(
      { messages: recentHistory, mode: mode === 'coding' ? 'coding' : 'general', preferredProvider },
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
              messages: recentHistory,
              systemPrompt,
              mode: mode === 'coding' ? 'coding' : 'general',
              temperature: 0.7,
              preferredProvider
            })) {
              textChunks.push(chunk);
              send({ type: 'token', text: chunk });
            }

            const text = textChunks.join('');
            const isFallback = text.startsWith('[AsLynx AI System Response');

            if (isFallback) {
              send({ type: 'error', message: 'All AI providers are currently unavailable. Your message was not lost — please retry.' });
              return;
            }

            await recordUsage(estimatedTokens);

            const assistantMessage: AgentMessage = {
              id: `msg_${Date.now()}_assistant`,
              role: 'assistant',
              content: text,
              timestamp: Date.now(),
              provider: meta?.provider || 'Unknown',
              modelUsed: meta?.model || '',
              latencyMs: Date.now() - startTime,
              toolCalls: toolCallsExecuted.length ? toolCallsExecuted : undefined
            };

            history.push(assistantMessage);
            await saveMessages(sessionId, history);

            send({
              type: 'done',
              message: assistantMessage,
              history,
              sessionId,
              provider: meta?.provider || 'Unknown',
              model: meta?.model || '',
              latencyMs: Date.now() - startTime,
              toolsUsed: toolCallsExecuted.map((tool) => tool.name),
              toolCalls: toolCallsExecuted.length ? toolCallsExecuted : undefined
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
      cancel() {
        aborted = true;
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/json-lines',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    });
  } catch (err: unknown) {
    console.error('[agent/chat POST]', err);
    return NextResponse.json(
      { error: 'The agent could not process this request. Please retry in a moment.' },
      { status: 500 }
    );
  }
}
