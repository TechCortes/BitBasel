export const TIERS = {
  creator: {
    id: 'creator' as const,
    name: 'Creator',
    monthlyPrice: 49,
    annualPrice: 499,
    lumaTierId: process.env.LUMA_CREATOR_TIER_ID ?? '',
    lumaEventId: process.env.LUMA_CREATOR_EVENT_ID ?? '',
    benefits: [
      'Unlimited Digital Collectibles & Digital Art listings',
      'Physical artwork consignment & inventory',
      'On-chain royalty enforcement on every secondary sale',
      'Blockchain certificate of authenticity',
      'Creator analytics dashboard',
      'Smart contract exhibition tools',
      'Monthly curator review — featured placement program',
      '2% platform fee (vs. industry standard 10–15%)',
      'Split payout management for collaborators',
      'Priority creator support',
    ],
  },
  collector: {
    id: 'collector' as const,
    name: 'Collector',
    monthlyPrice: 490,
    annualPrice: 4900,
    lumaTierId: process.env.LUMA_COLLECTOR_TIER_ID ?? '',
    lumaEventId: process.env.LUMA_COLLECTOR_EVENT_ID ?? '',
    benefits: [
      '48-hour early access to every new drop',
      'Private sale access & make-offer capabilities',
      'Personalized acquisition advisory (quarterly session)',
      'Curated collection feed tailored to your holdings',
      'VIP invitations — gallery events, art fairs, studio visits',
      'Collection portfolio dashboard with provenance tracking',
      'Digital Collectibles membership card — inscribed on-chain',
      'Blockchain-verified ownership history for all acquisitions',
      'Off-market access to consigned physical artworks',
      'Priority buyer support & concierge',
    ],
  },
} as const;

export type TierId = keyof typeof TIERS;
export type Tier = (typeof TIERS)[TierId];

export function getTier(id: string): Tier | null {
  return TIERS[id as TierId] ?? null;
}

export function tierPrice(id: TierId, billing: 'monthly' | 'annual'): number {
  return billing === 'annual' ? TIERS[id].annualPrice : TIERS[id].monthlyPrice;
}

export function tierIncludes(userTier: TierId, requiredTier: TierId): boolean {
  // Collector access includes all Creator content
  if (userTier === 'collector') return true;
  return userTier === requiredTier;
}
