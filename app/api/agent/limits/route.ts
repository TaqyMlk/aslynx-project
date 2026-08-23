import { NextResponse } from 'next/server';
import { getLimitStatus } from '@/src/server/agent/limits';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET() {
  try {
    const limits = await getLimitStatus();
    return NextResponse.json({
      ...limits,
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to retrieve limits telemetry', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}