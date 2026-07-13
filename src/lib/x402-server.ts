import 'server-only';
import { x402HTTPResourceServer, HTTPFacilitatorClient } from '@x402/core/http';
import type { RoutesConfig } from '@x402/core/http';
import { x402ResourceServer } from '@x402/core/server';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { facilitator as coinbaseFacilitatorConfig } from '@coinbase/x402';

// Base mainnet (eip155:8453) settlement requires Coinbase's CDP-hosted facilitator —
// the public x402.org/facilitator reference facilitator only supports Base Sepolia.
// Requires CDP_API_KEY_ID / CDP_API_KEY_SECRET env vars (portal.cdp.coinbase.com).
const facilitator = new HTTPFacilitatorClient(coinbaseFacilitatorConfig);
const coreServer = new x402ResourceServer(facilitator).register('eip155:*', new ExactEvmScheme());

export const collectorRoutes: RoutesConfig = {
  'POST /api/x402/membership/collector': {
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453',
      price: '$490.00',
      payTo: process.env.BITBASEL_PAYMENT_ADDRESS ?? '',
    },
    description: 'BitBasel Collector Membership — $490/year',
    mimeType: 'application/json',
  },
};

export const x402CollectorServer = new x402HTTPResourceServer(coreServer, collectorRoutes);

let _initPromise: Promise<void> | null = null;

export function ensureX402Initialized(): Promise<void> {
  if (!_initPromise) {
    _initPromise = x402CollectorServer.initialize().catch((err) => {
      _initPromise = null;
      throw err;
    });
  }
  return _initPromise;
}
