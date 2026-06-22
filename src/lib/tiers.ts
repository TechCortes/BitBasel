// ─────────────────────────────────────────────────────────────
// BitBasel  —  Tier Configuration (single source of truth)
// Updated: Creator $49/mo (approval required) · Collector $490/yr
//          Community free (hidden, newsletter bridge only)
//
// These names must match EXACTLY what you create in Luma dashboard.
// Prices are display-only here — Luma manages actual billing.
// ─────────────────────────────────────────────────────────────

import type { BitBaselTierConfig, BitBaselTierKey } from '../types/membership';

// Backwards-compatible alias used by GatedContent and status route
export type TierId = BitBaselTierKey;

// Check whether a member's tier grants access to a required tier
export function tierIncludes(memberTier: TierId | null | undefined, requiredTier: TierId): boolean {
  if (!memberTier) return false;
  if (memberTier === requiredTier) return true;
  // Creator tier bundles all Collector benefits
  if (memberTier === 'creator' && requiredTier === 'collector') return true;
  return false;
}

export const TIERS: Record<string, BitBaselTierConfig> = {
  // ── Free tier — never shown on /membership pricing page ───
  // Used internally as the email capture bridge.
  // "Get the Invite" form → adds to this tier → Luma newsletter.
  community: {
    key: 'community',
    lumaName: 'BitBasel Community', // must match Luma dashboard exactly
    label: 'Community',
    tagline: 'Stay in the loop',
    badge: 'Free',
    badgeStyle: 'neutral',
    pricingDisplay: null, // null = hidden from pricing page
    priceLabel: 'Free',
    billingInterval: null,
    priceCents: 0,
    currency: 'USD',
    requiresApproval: false,
    isHiddenOnPricing: true, // never rendered on /membership
    benefits: [
      'BitBasel community newsletter',
      'Public exhibition announcements',
      'Early notice on upcoming drops',
    ],
    grantedAccess: ['tier_newsletter'],
  },

  // ── Creator — $49/mo, admin approval required ─────────────
  creator: {
    key: 'creator',
    lumaName: 'BitBasel Creator',
    label: 'Artist', // public-facing label (matches site copy)
    tagline: 'List your work. Build your audience.',
    badge: '$49',
    badgeStyle: 'purple',
    pricingDisplay: '$49',
    priceLabel: '$49 / month',
    billingInterval: 'monthly',
    priceCents: 4900,
    currency: 'USD',
    requiresApproval: true, // every application reviewed by admin
    isHiddenOnPricing: false,
    benefits: [
      'Curated artist profile page on BitBasel',
      'List Bitcoin Ordinals in gallery drops',
      'Featured in member-only collector events',
      'Creator newsletter sent to all Collectors',
      'Private roundtables and artist dinners',
      'All Collector benefits included',
      'Founding Artist badge (on-chain)',
    ],
    grantedAccess: [
      'member_events',
      'early_drops',
      'vip_tickets',
      'tier_newsletter',
      'gallery_submissions',
      'collector_analytics',
      'founding_badge',
    ],
  },

  // ── Collector — $490/yr, instant activation ───────────────
  collector: {
    key: 'collector',
    lumaName: 'BitBasel Collector',
    label: 'Collector',
    tagline: 'Acquire, track, and grow your collection.',
    badge: '$490',
    badgeStyle: 'teal',
    pricingDisplay: '$490',
    priceLabel: '$490 / year',
    billingInterval: 'yearly',
    priceCents: 49000,
    currency: 'USD',
    requiresApproval: false,
    isHiddenOnPricing: false,
    benefits: [
      '48-hour early access to all Ordinal drops',
      'Member-only exhibition events and previews',
      'VIP tickets to BitBasel events',
      'Collector market analytics dashboard',
      'Private collector roundtables',
      'Priority acquisition support',
      'Member-only newsletter',
    ],
    grantedAccess: [
      'member_events',
      'early_drops',
      'vip_tickets',
      'tier_newsletter',
      'collector_analytics',
    ],
  },
};

export const TIER_KEYS = Object.keys(TIERS) as (keyof typeof TIERS)[];

// Tiers shown on the /membership pricing page (Community is excluded)
export const PRICING_TIERS = Object.values(TIERS).filter((t) => !t.isHiddenOnPricing);

// Map from Luma tier name → BitBasel tier key
export function lumaNameToTierKey(lumaName: string): keyof typeof TIERS | null {
  const entry = Object.values(TIERS).find((t) => t.lumaName === lumaName);
  return entry ? entry.key : null;
}

// Resolve access scopes for a given tier key
export function getScopesForTier(tierKey: keyof typeof TIERS): string[] {
  return TIERS[tierKey]?.grantedAccess ?? [];
}

// Helper: display-safe billing label for UI (no toggle needed)
export function getBillingLabel(tierKey: keyof typeof TIERS): string {
  const tier = TIERS[tierKey];
  if (!tier || tier.priceCents === 0) return 'Free';
  if (tier.billingInterval === 'monthly') return 'billed monthly';
  if (tier.billingInterval === 'yearly') return 'billed annually';
  return '';
}
