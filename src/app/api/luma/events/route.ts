import { NextRequest, NextResponse } from 'next/server';
import { listEvents } from '@/lib/luma-client';

export const revalidate = 60; // ISR — refresh event list every 60 seconds

export async function GET(req: NextRequest): Promise<NextResponse> {
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '20'), 50);

  try {
    const events = await listEvents(limit);
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch events';
    console.error('[luma/events]', message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
