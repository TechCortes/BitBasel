'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useWalletStore } from '@/store/StoreProvider';
import { useMembership } from './useMembership';
import { tierIncludes } from '@/lib/tiers';
import type { GatedContentProps } from '@/types/membership';
import type { TierId } from '@/lib/tiers';
import Link from 'next/link';

export const GatedContent: React.FC<GatedContentProps> = observer(
  ({ requiredTier, children, fallback }) => {
    const walletStore = useWalletStore();

    // Use whichever wallet is connected — Bitcoin preferred
    const address = walletStore.walletInfo?.address ?? walletStore.evmWalletInfo?.address ?? null;

    const { status, loading } = useMembership(address);

    if (loading) {
      return <div className="gated-loading" aria-busy="true" />;
    }

    const requiredTiers = Array.isArray(requiredTier) ? requiredTier : [requiredTier];

    const hasAccess =
      status?.isMember &&
      status.tier != null &&
      requiredTiers.some((t) => tierIncludes(status.tier as TierId, t));

    if (hasAccess) return <>{children}</>;

    if (fallback) return <>{fallback}</>;

    return (
      <div className="gated-upgrade">
        <p className="gated-upgrade-label">Members only</p>
        <p className="gated-upgrade-tier">
          Requires {requiredTiers.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(' or ')}{' '}
          membership
        </p>
        {!address ? (
          <p className="gated-upgrade-hint">Connect your wallet to verify membership.</p>
        ) : (
          <Link href="/membership" className="btn-primary gated-upgrade-btn">
            {status?.isMember ? 'Upgrade Membership' : 'Join BitBasel'}
          </Link>
        )}
      </div>
    );
  }
);

export default GatedContent;
