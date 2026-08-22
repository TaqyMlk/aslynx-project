import { NextResponse } from 'next/server';
import { fetchCurseForgeStats } from '@/src/server/curseforge/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await fetchCurseForgeStats();
    return NextResponse.json({
      total: stats.totalDownloads,
      lastUpdated: stats.lastUpdated,
      breakdown: stats.projects
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to retrieve CurseForge download count', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
