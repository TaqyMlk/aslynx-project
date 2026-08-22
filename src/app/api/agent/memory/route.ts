import { NextRequest, NextResponse } from 'next/server';
import { getFacts, saveFact, deleteFact, searchMemory, getSessions, deleteSession, getMessages } from '@/src/server/agent/store';
import { MemoryFact } from '@/src/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'facts';
    const query = searchParams.get('q') || '';
    const sessionId = searchParams.get('sessionId');

    if (action === 'sessions') {
      const sessions = await getSessions();
      return NextResponse.json({ sessions });
    }

    if (action === 'messages' && sessionId) {
      const messages = await getMessages(sessionId);
      return NextResponse.json({ messages });
    }

    if (query) {
      const results = await searchMemory(query);
      return NextResponse.json({ query, results });
    }

    const facts = await getFacts();
    return NextResponse.json({ facts });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to retrieve agent memory', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value, category = 'custom', tags = [] } = body;

    if (!key || !value) {
      return NextResponse.json({ error: 'Key and Value are required.' }, { status: 400 });
    }

    const fact: MemoryFact = {
      id: `fact_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      key,
      value,
      category,
      tags: Array.isArray(tags) ? tags : [String(tags)],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await saveFact(fact);
    return NextResponse.json({ success: true, fact });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to save memory fact', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const factId = searchParams.get('id');
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      await deleteSession(sessionId);
      return NextResponse.json({ success: true, message: `Session ${sessionId} deleted.` });
    }

    if (!factId) {
      return NextResponse.json({ error: 'Fact ID or Session ID required for deletion.' }, { status: 400 });
    }

    await deleteFact(factId);
    return NextResponse.json({ success: true, message: `Fact ${factId} deleted.` });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to delete item', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
