import { saveFact, searchMemory } from './store';
import { MemoryFact } from '@/src/types';
import { safeId } from './validation';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const AGENT_TOOLS: ToolDefinition[] = [
  {
    name: 'current_datetime',
    description: 'Get current accurate date, time, day of the week, and timezone.',
    parameters: {
      type: 'object',
      properties: {
        timezone: {
          type: 'string',
          description: 'Optional IANA timezone like Asia/Jakarta, UTC, etc.'
        }
      }
    }
  },
  {
    name: 'remember_fact',
    description: 'Save an important fact, user preference, or project milestone to long-term memory.',
    parameters: {
      type: 'object',
      properties: {
        key: { type: 'string', description: 'Unique identifier or key for this memory' },
        value: { type: 'string', description: 'The fact or details to remember' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Categorization tags' }
      },
      required: ['key', 'value']
    }
  },
  {
    name: 'recall_memory',
    description: 'Search long-term memory for previously remembered facts, decisions, and preferences.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term or keyword' }
      },
      required: ['query']
    }
  },
  {
    name: 'web_search',
    description: 'Perform a web search for fresh real-time information and documentation.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' }
      },
      required: ['query']
    }
  }
];

export async function executeTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'current_datetime': {
      const now = new Date();
      const tz = (typeof args?.timezone === 'string' && args.timezone) || 'Asia/Jakarta';
      return {
        iso: now.toISOString(),
        formattedDate: now.toLocaleDateString('id-ID', { timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        formattedTime: now.toLocaleTimeString('id-ID', { timeZone: tz, hour12: false }),
        timezone: tz,
        timestampMs: now.getTime()
      };
    }

    case 'remember_fact': {
      const key = String(args?.key || `fact_${Date.now()}`);
      const value = String(args?.value || '');
      const tags = Array.isArray(args?.tags) ? args.tags.map(String) : ['general'];

      const fact: MemoryFact = {
        id: safeId('fact'),
        key,
        value,
        category: 'custom',
        tags,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await saveFact(fact);
      return { success: true, message: `Successfully saved fact '${key}' to long-term memory.`, fact };
    }

    case 'recall_memory': {
      const query = String(args?.query || '');
      const results = await searchMemory(query);
      return {
        query,
        count: results.length,
        memories: results.map((r) => ({ key: r.key, value: r.value, tags: r.tags }))
      };
    }

    case 'web_search': {
      const query = String(args?.query || '');
      const serperKey = process.env.SERPER_API_KEY;

      if (serperKey) {
        try {
          const res = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
              'X-API-KEY': serperKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: query, num: 5 }),
            signal: AbortSignal.timeout(6000)
          });
          if (res.ok) {
            const data = await res.json();
            return {
              query,
              organic: data?.organic?.slice(0, 4)?.map((item: { title: string; link: string; snippet: string }) => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet
              }))
            };
          }
        } catch {
          // Fallback to internal search simulator
        }
      }

      return {
        query,
        error: 'Web search is unavailable. SERPER_API_KEY is not configured. Please contact the administrator to enable live search.',
        unavailable: true
      };
    }

    default:
      return { error: `Tool '${name}' is not recognized.` };
  }
}
