'use client';

import { useState, useEffect } from 'react';
import type { MembershipStatus } from '@/types/membership';

interface UseMembershipResult {
  status: MembershipStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMembership(walletAddress: string | null): UseMembershipResult {
  const [status, setStatus] = useState<MembershipStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!walletAddress) {
      setStatus(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/luma/status?address=${encodeURIComponent(walletAddress)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
        return res.json() as Promise<MembershipStatus>;
      })
      .then((data) => {
        if (!cancelled) setStatus(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [walletAddress, tick]);

  return {
    status,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}
