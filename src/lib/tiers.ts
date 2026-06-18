export const TIERS = {
  creator: {
    id: 'creator' as const,
    name: 'Creator',
    monthlyPrice: 49,
    annualPrice: 499,
    lumaTierId: process.env.LUMA_CREATOR_TIER_ID ?? '',
    lumaEventId: process.env.LUMA_CREATOR_EVENT_ID ?? '',
    benefits: [
      'Create up to 10 Digital Collectibles/month',
      'Private gallery submission',
      'Member Discord & chat',
      'Curated drop access',
      'Monthly artist brief',
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
      'All Creator benefits',
      'Unlimited Digital Collectibles',
      'Physical work acquisition access',
      'VIP event invitations',
      'Private collector briefings',
      'Early-access drops',
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
