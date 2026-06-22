import 'server-only';
import type { LumaEvent, LumaMember } from '@/types/membership';
import type { BitBaselTierKey } from '@/types/membership';

const BASE = 'https://api.lu.ma/public/v1';

function apiKey(): string {
  const key = process.env.LUMA_API_KEY;
  if (!key) throw new Error('LUMA_API_KEY is not set');
  return key;
}

async function lumaFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'x-luma-api-key': apiKey(),
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Luma ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

interface LumaEventEntry {
  event: LumaEvent;
}
interface LumaEventsResponse {
  entries: LumaEventEntry[];
  has_more: boolean;
  next_cursor: string | null;
}
interface LumaGuest {
  api_id: string;
  email: string;
  name: string | null;
}

/** List upcoming events from the BitBasel calendar. */
export async function listEvents(limit = 20): Promise<LumaEvent[]> {
  const calendarId = process.env.LUMA_CALENDAR_ID;
  if (!calendarId) throw new Error('LUMA_CALENDAR_ID is not set');

  const data = await lumaFetch<LumaEventsResponse>(
    `/calendar/list-events?calendar_api_id=${calendarId}&period=future&pagination_limit=${limit}`
  );

  return data.entries.map((e) => e.event);
}

/** Fetch a single event by its Luma API ID. */
export async function getEvent(eventApiId: string): Promise<LumaEvent> {
  const data = await lumaFetch<{ event: LumaEvent }>(`/event/get?api_id=${eventApiId}`);
  return data.event;
}

/** Add a guest to a Luma event (registers them). */
export async function registerGuest(
  eventApiId: string,
  email: string,
  name: string
): Promise<LumaGuest> {
  return lumaFetch<LumaGuest>('/guest/create', {
    method: 'POST',
    body: JSON.stringify({ event_api_id: eventApiId, email, name }),
  });
}

/** Build the public Luma event URL from an event object. */
export function lumaEventUrl(event: LumaEvent): string {
  return event.url;
}

/**
 * Resolve the Luma tier api_id for a given BitBasel tier key.
 * Reads LUMA_CREATOR_TIER_ID / LUMA_COLLECTOR_TIER_ID / LUMA_COMMUNITY_TIER_ID from env.
 */
export function resolveLumaTierId(tierKey: BitBaselTierKey): string {
  const envMap: Record<BitBaselTierKey, string | undefined> = {
    creator: process.env.LUMA_CREATOR_TIER_ID,
    collector: process.env.LUMA_COLLECTOR_TIER_ID,
    community: process.env.LUMA_COMMUNITY_TIER_ID,
  };
  const id = envMap[tierKey];
  if (!id) throw new Error(`LUMA_${tierKey.toUpperCase()}_TIER_ID is not set`);
  return id;
}

/**
 * Add a member to a Luma calendar membership tier.
 * community → active immediately
 * creator   → pending_approval (require_approval set in Luma dashboard)
 * collector → pending_payment (Luma sends Stripe link)
 */
export async function addMemberToTier({
  email,
  name,
  tier_id,
  metadata,
}: {
  email: string;
  name: string;
  tier_id: string;
  metadata?: Record<string, string | null | undefined>;
}): Promise<{ member: LumaMember }> {
  const calendarId = process.env.LUMA_CALENDAR_ID;
  if (!calendarId) throw new Error('LUMA_CALENDAR_ID is not set');

  return lumaFetch<{ member: LumaMember }>('/calendar/membership/create', {
    method: 'POST',
    body: JSON.stringify({
      calendar_api_id: calendarId,
      tier_api_id: tier_id,
      email,
      name,
      ...metadata,
    }),
  });
}
