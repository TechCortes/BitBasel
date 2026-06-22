// ─────────────────────────────────────────────────────────────
// BitBasel × Luma  —  Membership Type Definitions
// Updated to reflect finalised tier structure
// ─────────────────────────────────────────────────────────────
import type { ReactNode } from 'react';

// ── Luma API shapes ──────────────────────────────────────────

export type LumaTierPaymentType = 'free' | 'one_time' | 'subscription';
export type LumaMemberStatus =
  | 'active'
  | 'pending_approval'
  | 'pending_payment'
  | 'inactive'
  | 'cancelled';
export type LumaEventVisibility = 'public' | 'members' | 'hidden';
export type LumaTicketAudience = 'everyone' | 'members_only';
export type BillingInterval = 'monthly' | 'yearly';
export type BadgeStyle = 'neutral' | 'purple' | 'teal';

export interface LumaTier {
  api_id: string;
  name: string;
  description: string | null;
  payment_type: LumaTierPaymentType;
  price_cents: number | null;
  currency: string | null;
  interval: BillingInterval | null;
  require_approval: boolean;
  is_hidden: boolean;
  created_at: string;
}

export interface LumaMember {
  api_id: string;
  email: string;
  name: string | null;
  tier_id: string;
  status: LumaMemberStatus;
  joined_at: string;
  approved_at: string | null;
}

export interface LumaEvent {
  api_id: string;
  name: string;
  description: string | null;
  start_at: string;
  end_at: string;
  cover_url: string | null;
  url: string;
  visibility: LumaEventVisibility;
  geo_address_json: { full_address: string } | null;
  ticket_types: LumaTicketType[];
}

export interface LumaTicketType {
  api_id: string;
  name: string;
  price_cents: number;
  currency: string;
  capacity: number | null;
  sold_count: number;
  audience: LumaTicketAudience;
  tier_id: string | null;
}

// ── BitBasel tier keys ───────────────────────────────────────

// 'community' is the hidden free tier (newsletter bridge)
// 'creator'   is Artist — $49/mo, requires approval
// 'collector' is Collector — $490/yr, instant
export type BitBaselTierKey = 'community' | 'creator' | 'collector';

export interface BitBaselTierConfig {
  key: BitBaselTierKey;
  lumaName: string; // exact match required in Luma dashboard
  label: string; // public-facing display name
  tagline: string;
  benefits: string[];
  badge: string; // price badge text e.g. "$49"
  badgeStyle: BadgeStyle;
  pricingDisplay: string | null; // null = hidden from /membership page
  priceLabel: string; // e.g. "$49 / month"
  billingInterval: BillingInterval | null;
  priceCents: number; // 0 for free
  currency: string;
  requiresApproval: boolean;
  isHiddenOnPricing: boolean;
  grantedAccess: AccessScope[];
}

// ── Access scopes ────────────────────────────────────────────

export type AccessScope =
  | 'member_events' // member-only Luma events
  | 'early_drops' // 48-hr early access to Ordinal drops
  | 'vip_tickets' // VIP ticket type on events
  | 'tier_newsletter' // tier-specific Luma newsletters
  | 'gallery_submissions' // Creators: submit Ordinals to gallery
  | 'collector_analytics' // Collectors: market price + data
  | 'founding_badge'; // on-chain founding member badge

// ── Local member record (DB, synced via Luma webhooks) ───────

export interface BitBaselMember {
  id: string;
  email: string;
  wallet_address: string | null;
  luma_member_id: string;
  tier_key: BitBaselTierKey;
  status: LumaMemberStatus;
  access_scopes: AccessScope[];
  joined_at: Date;
  approved_at: Date | null;
  metadata: {
    // Creator fields
    artist_name?: string;
    portfolio_url?: string;
    instagram?: string;
    twitter?: string;
    // Collector fields
    collecting_focus?: string;
  };
}

// ── Wallet ↔ Luma bridge ─────────────────────────────────────

export interface WalletLumaLink {
  wallet_address: string;
  email: string;
  verified: boolean;
  linked_at: Date;
}

// ── API response wrappers ────────────────────────────────────

export interface LumaListResponse<T> {
  entries: T[];
  has_more: boolean;
  next_cursor: string | null;
}

export interface MemberCheckResponse {
  is_member: boolean;
  tier_key: BitBaselTierKey | null;
  status: LumaMemberStatus | null;
  access_scopes: AccessScope[];
  member: BitBaselMember | null;
}

// ── Webhook payloads ─────────────────────────────────────────

export type LumaWebhookEventType =
  | 'calendar_person_subscribed'
  | 'guest_registered'
  | 'ticket_registered'
  | 'guest_updated'
  | 'event_created'
  | 'event_updated'
  | 'event_canceled';

export interface LumaWebhookPayload {
  hook_id: string;
  event_type: LumaWebhookEventType;
  created_at: string;
  data: Record<string, unknown>;
}

// ── Join flow ────────────────────────────────────────────────

export interface JoinRequest {
  email: string;
  name: string;
  tier_key: BitBaselTierKey;
  wallet?: string;
  // Creator-only
  artist_name?: string;
  portfolio_url?: string;
  instagram?: string;
  twitter?: string;
  // Collector-only
  collecting_focus?: string;
}

export interface JoinResponse {
  success: boolean;
  status: LumaMemberStatus;
  member_id: string;
  message: string;
}

// ── App-level status & gated-content types ───────────────────

export interface MembershipStatus {
  isMember: boolean;
  tier: BitBaselTierKey | null;
  billing: 'monthly' | 'annual' | null;
  status: LumaMemberStatus | null;
  email: string | null;
  memberSince: string | null;
}

export interface GatedContentProps {
  requiredTier: BitBaselTierKey | BitBaselTierKey[];
  children: ReactNode;
  fallback?: ReactNode;
}

// ── Event registration ───────────────────────────────────────

export interface RegisterRequest {
  walletAddress: string;
  lumaEventId: string;
}

export interface RegisterResponse {
  success: boolean;
  attendanceId: string;
  lumaEventUrl: string;
}
