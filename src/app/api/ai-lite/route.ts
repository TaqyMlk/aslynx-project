import { NextRequest, NextResponse } from 'next/server';
import { callAIProvider } from '@/src/server/ai/providers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, messages, mode = 'general', preferredProvider = 'auto' } = body;

    const formattedMessages: { role: 'user' | 'assistant' | 'system'; content: string }[] = [];

    if (Array.isArray(messages) && messages.length > 0) {
      formattedMessages.push(...messages);
    } else if (typeof prompt === 'string' && prompt.trim()) {
      formattedMessages.push({ role: 'user', content: prompt.trim() });
    } else {
      return NextResponse.json({ error: 'Prompt or messages array is required.' }, { status: 400 });
    }

    const systemPrompt =
      mode === 'coding'
        ? 'You are AsLynx AI Lite (Coding Specialist). You produce clean, optimized, bug-free, modern code solutions in TypeScript, JavaScript, Minecraft Bedrock Script API, Python, and web frameworks. Keep responses crisp, directly usable, and well-explained without fluff.'
        : 'You are AsLynx AI Lite, a helpful, precise, and polite AI assistant. Provide concise, accurate, and insightful responses.';

    const response = await callAIProvider({
      messages: formattedMessages,
      mode: mode === 'coding' ? 'coding' : 'general',
      systemPrompt,
      preferredProvider
    });

    return NextResponse.json({
      text: response.text,
      provider: response.provider,
      model: response.model,
      latencyMs: response.latencyMs,
      tokensUsed: response.tokensUsed,
      stateless: true
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'AI Lite request failed', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
