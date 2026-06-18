import type { TierId } from '@/lib/tiers';

// ── Membership status returned by /api/luma/status ──────────────────────────

export interface MembershipStatus {
  isMember: boolean;
  tier: TierId | null;
  billing: 'monthly' | 'annual' | null;
  status: 'pending' | 'active' | 'cancelled' | 'expired' | null;
  email: string | null;
  memberSince: string | null; // ISO date
}

// ── Join request body (/api/luma/join) ──────────────────────────────────────

export interface JoinRequest {
  walletAddress: string;
  chain: WalletChain;
  email: string;
  name: string;
  tierId: TierId;
  billing: 'monthly' | 'annual';
}

export interface JoinResponse {
  success: boolean;
  memberId: string;
  lumaCheckoutUrl: string; // Redirect user here to complete membership payment on Luma
}

// ── Event registration (/api/luma/register) ──────────────────────────────────

export interface RegisterRequest {
  walletAddress: string;
  lumaEventId: string;
}

export interface RegisterResponse {
  success: boolean;
  attendanceId: string;
  lumaEventUrl: string;
}

// ── Luma API shapes (public v1) ───────────────────────────────────────────────

export interface LumaEvent {
  api_id: string;
  name: string;
  description: string | null;
  start_at: string; // ISO
  end_at: string; // ISO
  cover_url: string | null;
  url: string;
  geo_address_info: {
    full_address: string | null;
    city: string | null;
  } | null;
  ticket_info: {
    is_free: boolean;
    spots_remaining: number | null;
  } | null;
}

export interface LumaGuest {
  api_id: string;
  event_api_id: string;
  email: string;
  name: string;
  approval_status: 'approved' | 'pending' | 'declined';
}

export interface LumaCalendarMembership {
  api_id: string;
  status: 'pending_payment' | 'active' | 'cancelled' | 'expired';
  checkout_url: string | null;
  tier_api_id: string;
  calendar_api_id: string;
}

export interface LumaEventsResponse {
  entries: { event: LumaEvent }[];
  has_more: boolean;
  next_cursor: string | null;
}

// ── Luma webhook payload ──────────────────────────────────────────────────────

export type LumaWebhookAction =
  | 'event.guest.created'
  | 'event.guest.updated'
  | 'event.guest.approved'
  | 'event.guest.declined'
  | 'event.guest.removed';

export interface LumaWebhookGuest {
  api_id: string;
  event_api_id: string;
  email: string;
  name: string;
  approval_status: 'approved' | 'pending' | 'declined';
}

export interface LumaWebhookPayload {
  hook_id: string;
  created_at: string;
  action: LumaWebhookAction;
  data: {
    guest?: LumaWebhookGuest;
    event?: { api_id: string };
  };
}

// ── Wallet chain identifiers ─────────────────────────────────────────────────

export type WalletChain = 'bitcoin' | 'ethereum' | 'polygon' | 'base' | 'arbitrum' | 'optimism';

// ── UI component props ────────────────────────────────────────────────────────

export interface GatedContentProps {
  /** Required tier(s) to view content */
  requiredTier: TierId | TierId[];
  children: React.ReactNode;
  /** Shown when access is denied; defaults to upgrade prompt */
  fallback?: React.ReactNode;
}
