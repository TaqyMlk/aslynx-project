import { PROJECTS, getTotalCurseForgeDownloads } from '@/src/data/projects';
import { CurseForgeStatsResponse } from '@/src/types';

interface CacheEntry {
  data: CurseForgeStatsResponse;
  timestamp: number;
}

let cachedStats: CacheEntry | null = null;
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes cache

export async function fetchCurseForgeStats(): Promise<CurseForgeStatsResponse> {
  const now = Date.now();
  if (cachedStats && now - cachedStats.timestamp < CACHE_TTL_MS) {
    return cachedStats.data;
  }

  const apiKey = process.env.CURSEFORGE_API_KEY;

  const projectsSummary = PROJECTS.filter((p) => p.category === 'minecraft' || p.curseForgeId).map((p) => ({
    id: p.curseForgeId || 0,
    slug: p.slug,
    name: p.name,
    downloads: p.downloads || 0,
    updatedAt: new Date().toISOString()
  }));

  let liveTotal = getTotalCurseForgeDownloads();

  if (apiKey) {
    try {
      const projectIds = projectsSummary.filter((p) => p.id > 0).map((p) => p.id);
      if (projectIds.length > 0) {
        const res = await fetch('https://api.curseforge.com/v1/mods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            Accept: 'application/json'
          },
          body: JSON.stringify({ modIds: projectIds }),
          signal: AbortSignal.timeout(5000)
        });

        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json?.data)) {
            let fetchedTotal = 0;
            for (const item of json.data) {
              const match = projectsSummary.find((p) => p.id === item.id);
              if (match && typeof item.downloadCount === 'number') {
                match.downloads = Math.max(match.downloads, item.downloadCount);
                match.updatedAt = item.dateModified || item.dateReleased || match.updatedAt;
              }
            }
            fetchedTotal = projectsSummary.reduce((acc, curr) => acc + curr.downloads, 0);
            if (fetchedTotal > 0) {
              liveTotal = fetchedTotal;
            }
          }
        }
      }
    } catch {
      // Fallback silently to curated fallback data
    }
  }

  const result: CurseForgeStatsResponse = {
    totalDownloads: liveTotal,
    lastUpdated: new Date().toISOString(),
    projects: projectsSummary
  };

  cachedStats = {
    data: result,
    timestamp: now
  };

  return result;
}
