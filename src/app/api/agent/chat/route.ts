import { NextRequest, NextResponse } from 'next/server';
import { callAIProvider } from '@/src/server/ai/providers';
import { getMessages, saveMessages, getFacts } from '@/src/server/agent/store';
import { executeTool } from '@/src/server/agent/tools';
import { recordUsage } from '@/src/server/agent/limits';
import { AgentMessage } from '@/src/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId = 'default-session', message, mode = 'general' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    // Load past conversation
    const history = await getMessages(sessionId);
    const facts = await getFacts();

    const userMessage: AgentMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: message,
      timestamp: Date.now()
    };

    history.push(userMessage);

    // Build context with facts
    const factsContext = facts
      .slice(0, 8)
      .map((f) => `- [${f.category} / ${f.key}]: ${f.value}`)
      .join('\n');

    const systemPrompt = `You are AsLynx Personal AI Agent, an autonomous, highly capable personal developer assistant with persistent memory, tools, and deep technical mastery over Minecraft Bedrock Scripting, Next.js, and Prompt Engineering.

Long-term Memory Context:
${factsContext || 'No stored facts yet.'}

Available Special Directives:
- If asked for the current date or time, call or refer to datetime.
- If asked to remember a fact, remember it.
- If asked to execute JS code, use clean execution.
- Maintain a proactive, composed, highly knowledgeable tone.`;

    const recentHistory = history.slice(-10).map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content
    }));

    // Check if user request mentions date/time or specific tool keywords
    const toolCallsExecuted: { name: string; args: Record<string, unknown>; result?: unknown }[] = [];
    const lower = message.toLowerCase();

    if (lower.includes('jam berapa') || lower.includes('tanggal berapa') || lower.includes('hari apa') || lower.includes('what time') || lower.includes('what date') || lower.includes('sekarang')) {
      const dtResult = await executeTool('current_datetime', { timezone: 'Asia/Jakarta' });
      toolCallsExecuted.push({ name: 'current_datetime', args: { timezone: 'Asia/Jakarta' }, result: dtResult });
    }

    if (lower.startsWith('ingat:') || lower.startsWith('remember:') || lower.includes('simpan fakta:')) {
      const factText = message.replace(/^(ingat:|remember:|simpan fakta:)/i, '').trim();
      const saveResult = await executeTool('remember_fact', { key: `user_fact_${Date.now()}`, value: factText, tags: ['user_note'] });
      toolCallsExecuted.push({ name: 'remember_fact', args: { key: 'user_note', value: factText }, result: saveResult });
    }

    const aiRes = await callAIProvider({
      messages: recentHistory,
      systemPrompt,
      mode: mode === 'coding' ? 'coding' : 'general',
      temperature: 0.7
    });

    recordUsage(500);

    const assistantMessage: AgentMessage = {
      id: `msg_${Date.now()}_assistant`,
      role: 'assistant',
      content: aiRes.text,
      timestamp: Date.now(),
      provider: aiRes.provider,
      modelUsed: aiRes.model,
      latencyMs: aiRes.latencyMs,
      toolCalls: toolCallsExecuted.length > 0 ? toolCallsExecuted : undefined
    };

    history.push(assistantMessage);
    await saveMessages(sessionId, history);

    return NextResponse.json({
      message: assistantMessage,
      history,
      sessionId
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Agent chat error', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
