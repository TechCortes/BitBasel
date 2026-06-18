import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { MembershipStatus } from '@/types/membership';
import type { TierId } from '@/lib/tiers';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const address = req.nextUrl.searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Missing address query param' }, { status: 400 });
  }

  const normalizedAddress = address.startsWith('bc1') ? address : address.toLowerCase();

  try {
    const link = await db.walletLumaLink.findUnique({
      where: { address: normalizedAddress },
      include: { member: true },
    });

    if (!link) {
      return NextResponse.json({
        isMember: false,
        tier: null,
        billing: null,
        status: null,
        email: null,
        memberSince: null,
      } satisfies MembershipStatus);
    }

    const { member } = link;

    return NextResponse.json({
      isMember: member.status === 'active',
      tier: member.tier as TierId,
      billing: member.billing as 'monthly' | 'annual',
      status: member.status as MembershipStatus['status'],
      email: member.email,
      memberSince: member.createdAt.toISOString(),
    } satisfies MembershipStatus);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[luma/status]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
