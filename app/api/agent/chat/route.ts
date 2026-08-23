import { NextRequest, NextResponse } from 'next/server';
import { callAIProvider } from '@/src/server/ai/providers';
import { getMessages, saveMessages, getFacts } from '@/src/server/agent/store';
import { executeTool } from '@/src/server/agent/tools';
import { recordUsage } from '@/src/server/agent/limits';
import { AgentMessage } from '@/src/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sessionId = new URL(req.url).searchParams.get('sessionId') || 'default-session';
    const history = await getMessages(sessionId);
    return NextResponse.json({ history, sessionId });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Agent history error', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionId = new URL(req.url).searchParams.get('sessionId') || 'default-session';
    await saveMessages(sessionId, []);
    return NextResponse.json({ success: true, sessionId });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Agent memory clear failed', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId = 'default-session', message, mode = 'general' } = body;
    if (!message || typeof message !== 'string') return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });

    const history = await getMessages(sessionId);
    const facts = await getFacts();
    const userMessage: AgentMessage = { id: `msg_${Date.now()}_user`, role: 'user', content: message, timestamp: Date.now() };
    history.push(userMessage);

    const factsContext = facts.slice(0, 8).map((f) => `- [${f.category} / ${f.key}]: ${f.value}`).join('\n');
    const systemPrompt = `You are AsLynx Personal AI Agent, a capable personal developer assistant with persistent memory and tools.\n\nLong-term Memory Context:\n${factsContext || 'No stored facts yet.'}\n\nUse the available context accurately. Never claim a tool was used unless it actually was.`;
    const recentHistory = history.slice(-10).map((m) => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content }));

    const toolCallsExecuted: { name: string; args: Record<string, unknown>; result?: unknown }[] = [];
    const lower = message.toLowerCase();
    if (lower.includes('jam berapa') || lower.includes('tanggal berapa') || lower.includes('hari apa') || lower.includes('what time') || lower.includes('what date') || lower.includes('sekarang')) {
      const args = { timezone: 'Asia/Jakarta' };
      toolCallsExecuted.push({ name: 'current_datetime', args, result: await executeTool('current_datetime', args) });
    }
    if (lower.startsWith('ingat:') || lower.startsWith('remember:') || lower.includes('simpan fakta:')) {
      const factText = message.replace(/^(ingat:|remember:|simpan fakta:)/i, '').trim();
      const args = { key: `user_fact_${Date.now()}`, value: factText, tags: ['user_note'] };
      toolCallsExecuted.push({ name: 'remember_fact', args, result: await executeTool('remember_fact', args) });
    }

    const aiRes = await callAIProvider({ messages: recentHistory, systemPrompt, mode: mode === 'coding' ? 'coding' : 'general', temperature: 0.7 });
    await recordUsage(500);
    const assistantMessage: AgentMessage = {
      id: `msg_${Date.now()}_assistant`, role: 'assistant', content: aiRes.text, timestamp: Date.now(),
      provider: aiRes.provider, modelUsed: aiRes.model, latencyMs: aiRes.latencyMs,
      toolCalls: toolCallsExecuted.length ? toolCallsExecuted : undefined
    };
    history.push(assistantMessage);
    await saveMessages(sessionId, history);
    return NextResponse.json({ message: assistantMessage, history, sessionId });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Agent chat error', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
