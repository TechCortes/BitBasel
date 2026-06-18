import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { registerGuest, getEvent } from '@/lib/luma-client';
import type { RegisterRequest, RegisterResponse } from '@/types/membership';

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: RegisterRequest;

  try {
    body = (await req.json()) as RegisterRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { walletAddress, lumaEventId } = body;

  if (!walletAddress || !lumaEventId) {
    return NextResponse.json({ error: 'Missing walletAddress or lumaEventId' }, { status: 400 });
  }

  const normalizedAddress = walletAddress.startsWith('bc1')
    ? walletAddress
    : walletAddress.toLowerCase();

  try {
    // Resolve wallet → member
    const link = await db.walletLumaLink.findUnique({
      where: { address: normalizedAddress },
      include: { member: true },
    });

    if (!link) {
      return NextResponse.json({ error: 'Wallet not linked to a membership' }, { status: 403 });
    }

    if (link.member.status !== 'active') {
      return NextResponse.json({ error: 'Membership is not active' }, { status: 403 });
    }

    // Check for existing attendance (idempotent)
    const existing = await db.eventAttendance.findUnique({
      where: { memberId_lumaEventId: { memberId: link.memberId, lumaEventId } },
    });

    if (existing && existing.status !== 'cancelled') {
      const event = await getEvent(lumaEventId);
      return NextResponse.json({
        success: true,
        attendanceId: existing.id,
        lumaEventUrl: event.url,
      } satisfies RegisterResponse);
    }

    // Register guest in Luma
    const [lumaGuest, lumaEvent] = await Promise.all([
      registerGuest(lumaEventId, link.member.email, link.member.name),
      getEvent(lumaEventId),
    ]);

    console.info('[luma/register] guest registered', { guestId: lumaGuest.api_id, lumaEventId });

    // Upsert attendance record
    const attendance = await db.eventAttendance.upsert({
      where: { memberId_lumaEventId: { memberId: link.memberId, lumaEventId } },
      update: { status: 'registered' },
      create: { memberId: link.memberId, lumaEventId, status: 'registered' },
    });

    return NextResponse.json({
      success: true,
      attendanceId: attendance.id,
      lumaEventUrl: lumaEvent.url,
    } satisfies RegisterResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[luma/register]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
