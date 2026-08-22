import { NextResponse } from 'next/server';
import { fetchCurseForgeStats } from '@/src/server/curseforge/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await fetchCurseForgeStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to retrieve CurseForge statistics',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
