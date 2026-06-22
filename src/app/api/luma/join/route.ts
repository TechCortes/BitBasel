// ─────────────────────────────────────────────────────────────
// BitBasel  —  Join Membership Route
// POST /api/luma/join
//
// Tier behaviour:
//   community → free, instant active, hidden from UI
//   creator   → $49/mo, pending_approval until admin approves in Luma
//   collector → $490/yr, pending_payment — Luma sends Stripe link
//
// Luma manages all billing. This route just calls addMemberToTier
// and persists a local record so the webhook has something to merge into.
// ─────────────────────────────────────────────────────────────

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { addMemberToTier, resolveLumaTierId } from '@/lib/luma-client';
import { TIERS } from '@/lib/tiers';
import type { BitBaselTierKey, JoinRequest, JoinResponse } from '@/types/membership';

export async function POST(
  req: NextRequest
): Promise<NextResponse<JoinResponse | { error: string }>> {
  let body: JoinRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, name, tier_key } = body;

  // ── Validate base fields ──────────────────────────────────
  if (!email || !name || !tier_key) {
    return NextResponse.json({ error: 'email, name, and tier_key are required' }, { status: 400 });
  }

  const tierConfig = TIERS[tier_key];
  if (!tierConfig) {
    return NextResponse.json({ error: `Unknown tier: ${tier_key}` }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  // ── Tier-specific validation ──────────────────────────────
  if (tier_key === 'creator' && !body.artist_name?.trim()) {
    return NextResponse.json(
      { error: 'Artist or studio name is required for the Creator tier' },
      { status: 400 }
    );
  }

  if (tier_key === 'creator' && body.portfolio_url) {
    try {
      new URL(body.portfolio_url);
    } catch {
      return NextResponse.json(
        { error: 'Portfolio URL must be a valid URL (https://...)' },
        { status: 400 }
      );
    }
  }

  try {
    // ── Resolve Luma tier api_id ──────────────────────────
    const lumaTierId = await resolveLumaTierId(tier_key as BitBaselTierKey);

    // ── Call Luma ─────────────────────────────────────────
    // Luma handles:
    //   - community → active immediately (free)
    //   - creator   → pending_approval (require_approval = true in dashboard)
    //   - collector → pending_payment (Luma sends Stripe annual billing link)
    const { member } = await addMemberToTier({
      email,
      name,
      tier_id: lumaTierId,
      metadata: {
        ...(body.artist_name && { artist_name: body.artist_name }),
        ...(body.portfolio_url && { portfolio_url: body.portfolio_url }),
        ...(body.instagram && { instagram: body.instagram }),
        ...(body.twitter && { twitter: body.twitter }),
        ...(body.collecting_focus && { collecting_focus: body.collecting_focus }),
        ...(body.wallet && { wallet_address: body.wallet }),
        billing_interval: tierConfig.billingInterval ?? 'none',
        price_label: tierConfig.priceLabel,
      },
    });

    // ── Persist locally (webhook will also upsert, this is optimistic) ─
    // REPLACE with your DB write:
    //
    // await prisma.member.create({
    //   data: {
    //     luma_member_id: member.api_id,
    //     email:          member.email,
    //     name,
    //     tier_key,
    //     status:         member.status,
    //     access_scopes:  member.status === 'active' ? tierConfig.grantedAccess : [],
    //     wallet_address: body.wallet ?? null,
    //     joined_at:      new Date(),
    //     metadata: {
    //       artist_name:      body.artist_name,
    //       portfolio_url:    body.portfolio_url,
    //       instagram:        body.instagram,
    //       twitter:          body.twitter,
    //       collecting_focus: body.collecting_focus,
    //     },
    //   },
    // })

    // ── Status-specific messages ──────────────────────────
    const messages: Record<string, string> = {
      active: "You're in. Welcome to BitBasel.",
      pending_approval:
        "Application received. Our team reviews every Creator within 2–3 business days — you'll hear from us by email.",
      pending_payment:
        'Almost there — check your email for a payment link to activate your Collector membership ($490/year).',
    };

    return NextResponse.json({
      success: true,
      status: member.status,
      member_id: member.api_id,
      message: messages[member.status] ?? 'Application submitted.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[join] Error:', message);

    if (message.toLowerCase().includes('already a member')) {
      return NextResponse.json(
        { error: 'This email is already registered. Try signing in or use a different email.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process your application. Please try again.' },
      { status: 500 }
    );
  }
}
