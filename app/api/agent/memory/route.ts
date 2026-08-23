import { NextRequest, NextResponse } from 'next/server';
import { getFacts, saveFact, deleteFact, searchMemory, getSessions, deleteSession, getMessages } from '@/src/server/agent/store';
import { isValidSessionId, clampString, sanitizeTags } from '@/src/server/agent/validation';
import { MemoryFact } from '@/src/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const FACT_CATEGORIES = new Set(['knowledge', 'project', 'preference', 'custom']);
const MAX_KEY_LENGTH = 128;
const MAX_VALUE_LENGTH = 4_000;

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'facts';
    const query = (searchParams.get('q') || '').slice(0, 200);
    const sessionId = searchParams.get('sessionId');

    if (action === 'sessions') {
      const sessions = await getSessions();
      return NextResponse.json({ sessions });
    }

    if (action === 'messages' && sessionId) {
      if (!isValidSessionId(sessionId)) {
        return badRequest('A valid sessionId is required.');
      }
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
    console.error('[agent/memory GET]', err);
    return NextResponse.json({ error: 'Failed to load agent memory. Please retry.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value, category = 'custom', tags = [] } = body;

    if (typeof key !== 'string' || !key.trim()) {
      return badRequest('Key is required and must be a string.');
    }
    if (typeof value !== 'string' || !value.trim()) {
      return badRequest('Value is required and must be a string.');
    }
    if (key.length > MAX_KEY_LENGTH) {
      return badRequest(`Key exceeds the maximum of ${MAX_KEY_LENGTH} characters.`);
    }
    if (value.length > MAX_VALUE_LENGTH) {
      return badRequest(`Value exceeds the maximum of ${MAX_VALUE_LENGTH} characters.`);
    }
    if (typeof category !== 'string' || !FACT_CATEGORIES.has(category)) {
      return badRequest(`Category must be one of: ${Array.from(FACT_CATEGORIES).join(', ')}.`);
    }

    const fact: MemoryFact = {
      id: `fact_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
      key: key.trim(),
      value: value.trim(),
      category: category as MemoryFact['category'],
      tags: sanitizeTags(tags),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await saveFact(fact);
    return NextResponse.json({ success: true, fact });
  } catch (err: unknown) {
    console.error('[agent/memory POST]', err);
    return NextResponse.json({ error: 'Failed to save this memory. Please retry.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const factId = searchParams.get('id');
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      if (!isValidSessionId(sessionId)) {
        return badRequest('A valid sessionId is required.');
      }
      await deleteSession(clampString(sessionId, 64));
      return NextResponse.json({ success: true, message: 'Session deleted.' });
    }

    if (!factId || typeof factId !== 'string' || factId.length > 128) {
      return badRequest('A valid fact ID or sessionId is required for deletion.');
    }

    await deleteFact(factId);
    return NextResponse.json({ success: true, message: 'Fact deleted.' });
  } catch (err: unknown) {
    console.error('[agent/memory DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete this item. Please retry.' }, { status: 500 });
  }
}
