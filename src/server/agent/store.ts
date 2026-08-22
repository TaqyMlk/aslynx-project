import { AgentMessage, AgentSession, MemoryFact } from '@/src/types';

// In-Memory store fallback
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

// Helper to call Upstash Redis REST API if configured
async function callUpstash(command: string[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    });
    if (res.ok) {
      const data = await res.json();
      return data.result;
    }
  } catch {
    // Fall back to memory
  }
  return null;
}

export async function getSessions(): Promise<AgentSession[]> {
  const redisResult = await callUpstash(['HGETALL', 'agent:memory:sessions']);
  if (redisResult && typeof redisResult === 'object') {
    try {
      const sessions: AgentSession[] = [];
      const entries = Object.values(redisResult as Record<string, string>);
      for (const val of entries) {
        sessions.push(JSON.parse(val));
      }
      return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch {
      // Fallback
    }
  }

  return Array.from(memory.sessions.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveSession(session: AgentSession): Promise<void> {
  memory.sessions.set(session.id, session);
  await callUpstash(['HSET', 'agent:memory:sessions', session.id, JSON.stringify(session)]);
}

export async function deleteSession(sessionId: string): Promise<void> {
  memory.sessions.delete(sessionId);
  memory.messages.delete(sessionId);
  await callUpstash(['HDEL', 'agent:memory:sessions', sessionId]);
  await callUpstash(['DEL', `agent:memory:messages:${sessionId}`]);
}

export async function getMessages(sessionId: string): Promise<AgentMessage[]> {
  const redisResult = await callUpstash(['GET', `agent:memory:messages:${sessionId}`]);
  if (redisResult && typeof redisResult === 'string') {
    try {
      return JSON.parse(redisResult);
    } catch {
      // Fallback
    }
  }

  return memory.messages.get(sessionId) || [];
}

export async function saveMessages(sessionId: string, messages: AgentMessage[]): Promise<void> {
  memory.messages.set(sessionId, messages);
  await callUpstash(['SET', `agent:memory:messages:${sessionId}`, JSON.stringify(messages)]);

  // Update session
  const session = memory.sessions.get(sessionId) || {
    id: sessionId,
    title: messages[0]?.content.slice(0, 40) || 'New Session',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messageCount: messages.length
  };
  session.updatedAt = Date.now();
  session.messageCount = messages.length;
  await saveSession(session);
}

export async function getFacts(): Promise<MemoryFact[]> {
  const redisResult = await callUpstash(['HGETALL', 'agent:memory:facts']);
  if (redisResult && typeof redisResult === 'object') {
    try {
      const facts: MemoryFact[] = [];
      const entries = Object.values(redisResult as Record<string, string>);
      for (const val of entries) {
        facts.push(JSON.parse(val));
      }
      return facts.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch {
      // Fallback
    }
  }

  return Array.from(memory.facts.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveFact(fact: MemoryFact): Promise<void> {
  memory.facts.set(fact.id, fact);
  await callUpstash(['HSET', 'agent:memory:facts', fact.id, JSON.stringify(fact)]);
}

export async function deleteFact(factId: string): Promise<void> {
  memory.facts.delete(factId);
  await callUpstash(['HDEL', 'agent:memory:facts', factId]);
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
