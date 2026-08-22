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
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to retrieve CurseForge download count',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
