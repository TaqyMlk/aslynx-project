import { AgentMessage, AgentSession, MemoryFact } from '@/src/types';

// Hard caps to keep payloads bounded.
const MAX_MESSAGES_PER_SESSION = 200;
const MAX_SESSIONS_IN_MEMORY = 500;

// In-Memory store fallback (single-instance cache / local dev without Redis).
interface MemoryStorage {
  sessions: Map<string, AgentSession>;
  messages: Map<string, AgentMessage[]>;
  facts: Map<string, MemoryFact>;
  summaries: Map<string, string>;
}

declare global {
  var __aslynx_agent_memory__: MemoryStorage | undefined;
}

if (!globalThis.__aslynx_agent_memory__) {
  globalThis.__aslynx_agent_memory__ = {
    sessions: new Map<string, AgentSession>(),
    messages: new Map<string, AgentMessage[]>(),
    facts: new Map<string, MemoryFact>(),
    summaries: new Map<string, string>()
  };

  // Seed with default developer persona and knowledge facts
  const defaultFacts: MemoryFact[] = [
    {
      id: 'fact-1',
      key: 'identity_name',
      value: 'Muhammad Abdulhadi Taqy (AsLynx), AI Prompt Engineer, Minecraft Bedrock Modder, Web Developer',
      category: 'knowledge',
      tags: ['identity', 'profile', 'aslynx'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: 'fact-2',
      key: 'core_minecraft_addons',
      value: 'Lynx Quality Tools, Lynx Simple Treecapitator, Lynx Simple Vein Miner (350K+ total CurseForge downloads)',
      category: 'project',
      tags: ['minecraft', 'addons', 'curseforge'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: 'fact-3',
      key: 'preferred_tech_stack',
      value: 'Next.js App Router, React 19, TypeScript, Tailwind CSS, Minecraft Bedrock Script API @minecraft/server',
      category: 'preference',
      tags: ['tech', 'stack', 'preferences'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ];

  for (const fact of defaultFacts) {
    globalThis.__aslynx_agent_memory__.facts.set(fact.id, fact);
  }
}

const memory = globalThis.__aslynx_agent_memory__;

export function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Calls the Upstash REST API. Semantics:
 * - Redis not configured -> returns null (caller falls back to in-memory store).
 * - Redis configured but unreachable/HTTP error -> THROWS (fail loud) so callers
 *   never mistake a failed read for empty data and overwrite good data with less.
 * - Genuine key miss -> returns null.
 */
async function callUpstash(command: string[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(5000)
    });
  } catch (err: unknown) {
    throw new Error(`Redis unavailable: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!res.ok) {
    throw new Error(`Redis request failed with status ${res.status}`);
  }

  const data = await res.json();
  return data.result ?? null;
}

function parseJsonArray<T>(raw: unknown, what: string): T[] {
  if (typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error(`${what} payload is not an array`);
    return parsed as T[];
  } catch (err: unknown) {
    throw new Error(
      `Corrupted ${what} in Redis (${err instanceof Error ? err.message : String(err)})`
    );
  }
}

function evictOldestSessions(): void {
  if (memory.sessions.size <= MAX_SESSIONS_IN_MEMORY) return;
  const sorted = Array.from(memory.sessions.values()).sort((a, b) => a.updatedAt - b.updatedAt);
  for (let i = 0; i < sorted.length - MAX_SESSIONS_IN_MEMORY; i++) {
    memory.sessions.delete(sorted[i].id);
  }
}

export async function getSessions(): Promise<AgentSession[]> {
  if (!isRedisConfigured()) {
    return Array.from(memory.sessions.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  const redisResult = await callUpstash(['HGETALL', 'agent:memory:sessions']);
  if (redisResult && typeof redisResult === 'object') {
    const sessions: AgentSession[] = [];
    for (const val of Object.values(redisResult as Record<string, string>)) {
      try {
        sessions.push(JSON.parse(val));
      } catch {
        throw new Error('Corrupted session metadata in Redis');
      }
    }
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  return [];
}

export async function saveSession(session: AgentSession): Promise<void> {
  memory.sessions.set(session.id, session);
  evictOldestSessions();
  if (isRedisConfigured()) {
    await callUpstash(['HSET', 'agent:memory:sessions', session.id, JSON.stringify(session)]);
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  memory.sessions.delete(sessionId);
  memory.messages.delete(sessionId);
  if (isRedisConfigured()) {
    await callUpstash(['HDEL', 'agent:memory:sessions', sessionId]);
    await callUpstash(['DEL', `agent:memory:messages:${sessionId}`]);
  }
}

export async function getMessages(sessionId: string): Promise<AgentMessage[]> {
  if (!isRedisConfigured()) {
    return memory.messages.get(sessionId) || [];
  }

  const redisResult = await callUpstash(['GET', `agent:memory:messages:${sessionId}`]);
  if (redisResult === null) return []; // Genuine miss — session has no messages yet.

  return parseJsonArray<AgentMessage>(redisResult, `messages for session "${sessionId}"`);
}

export async function saveMessages(sessionId: string, messages: AgentMessage[]): Promise<void> {
  const bounded =
    messages.length > MAX_MESSAGES_PER_SESSION
      ? messages.slice(messages.length - MAX_MESSAGES_PER_SESSION)
      : messages;

  memory.messages.set(sessionId, bounded);

  if (isRedisConfigured()) {
    await callUpstash([
      'SET',
      `agent:memory:messages:${sessionId}`,
      JSON.stringify(bounded)
    ]);
  }

  // Update session metadata
  const session = memory.sessions.get(sessionId) || {
    id: sessionId,
    title: bounded[0]?.content.slice(0, 40) || 'New Session',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messageCount: bounded.length
  };
  session.updatedAt = Date.now();
  session.messageCount = bounded.length;
  await saveSession(session);
}

export async function getFacts(): Promise<MemoryFact[]> {
  if (!isRedisConfigured()) {
    return Array.from(memory.facts.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  try {
    const redisResult = await callUpstash(['HGETALL', 'agent:memory:facts']);
    if (redisResult && typeof redisResult === 'object') {
      const facts: MemoryFact[] = [];
      for (const val of Object.values(redisResult as Record<string, string>)) {
        try {
          facts.push(JSON.parse(val));
        } catch {
          throw new Error('Corrupted fact payload in Redis');
        }
      }
      if (facts.length > 0) {
        return facts.sort((a, b) => b.updatedAt - a.updatedAt);
      }
    }
  } catch {
    // Facts are advisory context for prompts; degrade to static seeds instead of
    // failing chat when the facts hash cannot be read. Message/session reads stay strict.
  }

  // Empty hash or unreadable: fall back to deterministic per-instance seed defaults.
  return Array.from(memory.facts.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveFact(fact: MemoryFact): Promise<void> {
  memory.facts.set(fact.id, fact);
  if (isRedisConfigured()) {
    await callUpstash(['HSET', 'agent:memory:facts', fact.id, JSON.stringify(fact)]);
  }
}

export async function deleteFact(factId: string): Promise<void> {
  memory.facts.delete(factId);
  if (isRedisConfigured()) {
    await callUpstash(['HDEL', 'agent:memory:facts', factId]);
  }
}

export async function searchMemory(query: string): Promise<MemoryFact[]> {
  const q = query.toLowerCase();
  const allFacts = await getFacts();
  return allFacts.filter(
    (f) =>
      f.key.toLowerCase().includes(q) ||
      f.value.toLowerCase().includes(q) ||
      f.tags.some((t) => t.toLowerCase().includes(q))
  );
}
