import { PROJECTS } from '@/src/data/projects';
import { CurseForgeStatsResponse } from '@/src/types';

interface CacheEntry {
  data: CurseForgeStatsResponse;
  timestamp: number;
}

let cachedStats: CacheEntry | null = null;
const CACHE_TTL_MS = 1000 * 60 * 15;

const CURSEFORGE_IDS: Record<string, number> = {
  'lynx-quality-tools': 1644058,
  'lynx-simple-treecapitator': 1642665,
  'lynx-simple-vein-miner': 1645405,
  'lynx-ultimate-essential-plus': 1646550,
  'lynx-auto-oresmelter-veinminer': 1645927,
  'lynx-simple-autoreplant': 1642642,
  'chunky-pregenerator': 1641222
};

export async function fetchCurseForgeStats(): Promise<CurseForgeStatsResponse> {
  const now = Date.now();
  if (cachedStats && now - cachedStats.timestamp < CACHE_TTL_MS) {
    return cachedStats.data;
  }

  const apiKey = process.env.CURSEFORGE_API_KEY;
  const trackedProjects = PROJECTS.filter((p) => CURSEFORGE_IDS[p.slug]);

  const projectsSummary = trackedProjects.map((p) => ({
    id: CURSEFORGE_IDS[p.slug],
    slug: p.slug,
    name: p.name,
    downloads: 0,
    updatedAt: new Date(now).toISOString()
  }));

  if (!apiKey) {
    const result: CurseForgeStatsResponse = {
      totalDownloads: 0,
      lastUpdated: new Date().toISOString(),
      projects: projectsSummary
    };
    cachedStats = { data: result, timestamp: now };
    return result;
  }

  try {
    const projectIds = projectsSummary.map((p) => p.id);
    const res = await fetch('https://api.curseforge.com/v1/mods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        Accept: 'application/json'
      },
      body: JSON.stringify({ modIds: projectIds }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      console.error(`[CurseForge] API request failed: ${res.status}`);
      throw new Error(`CurseForge API returned ${res.status}`);
    }

    const json = await res.json();
    if (!Array.isArray(json?.data)) {
      throw new Error('CurseForge API returned an invalid response');
    }

    for (const item of json.data) {
      const match = projectsSummary.find((p) => p.id === item.id);
      if (match && typeof item.downloadCount === 'number') {
        match.downloads = item.downloadCount;
        match.updatedAt = item.dateModified || item.dateReleased || match.updatedAt;
      }
    }

    const liveTotal = projectsSummary.reduce((sum, project) => sum + project.downloads, 0);
    console.info(`[CurseForge] Live sync OK: ${projectsSummary.length} projects, ${liveTotal} total downloads`);

    const result: CurseForgeStatsResponse = {
      totalDownloads: liveTotal,
      lastUpdated: new Date().toISOString(),
      projects: projectsSummary
    };

    cachedStats = { data: result, timestamp: now };
    return result;
  } catch (error) {
    console.error('[CurseForge] Live sync failed:', error instanceof Error ? error.message : String(error));

    const result: CurseForgeStatsResponse = {
      totalDownloads: 0,
      lastUpdated: new Date().toISOString(),
      projects: projectsSummary
    };

    cachedStats = { data: result, timestamp: now };
    return result;
  }
}
