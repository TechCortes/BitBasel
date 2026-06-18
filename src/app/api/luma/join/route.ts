import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscribeCalendarMember } from '@/lib/luma-client';
import { getTier } from '@/lib/tiers';
import type { JoinRequest, JoinResponse } from '@/types/membership';

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: JoinRequest;

  try {
    body = (await req.json()) as JoinRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { walletAddress, chain, email, name, tierId, billing } = body;

  if (!walletAddress || !chain || !email || !name || !tierId || !billing) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const tier = getTier(tierId);
  if (!tier) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  if (!tier.lumaTierId) {
    return NextResponse.json({ error: 'Membership tier not configured' }, { status: 503 });
  }

  const normalizedAddress = chain === 'bitcoin' ? walletAddress : walletAddress.toLowerCase();

  console.info('[luma/join] request', { tierId, billing, chain, email });

  try {
    // Upsert member record
    const member = await db.member.upsert({
      where: { email },
      update: { name, tier: tierId, billing, status: 'pending' },
      create: { email, name, tier: tierId, billing, status: 'pending' },
    });

    // Link wallet address to member (idempotent)
    await db.walletLumaLink.upsert({
      where: { address: normalizedAddress },
      update: { memberId: member.id, chain },
      create: { memberId: member.id, address: normalizedAddress, chain },
    });

    // Subscribe guest to the correct Luma calendar membership tier
    const lumaMembership = await subscribeCalendarMember(tier.lumaTierId, email, name);

    console.info('[luma/join] luma membership created', {
      memberId: member.id,
      lumaMembershipId: lumaMembership.api_id,
      tierId,
      lumaStatus: lumaMembership.status,
      hasCheckoutUrl: !!lumaMembership.checkout_url,
    });

    await db.member.update({
      where: { id: member.id },
      data: { lumaGuestId: lumaMembership.api_id },
    });

    // Use Luma's checkout URL; fall back to calendar membership page
    const lumaCheckoutUrl =
      lumaMembership.checkout_url ?? `https://lu.ma/${process.env.LUMA_CALENDAR_ID}/membership`;

    const response: JoinResponse = {
      success: true,
      memberId: member.id,
      lumaCheckoutUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[luma/join] error', { tierId, email, error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
