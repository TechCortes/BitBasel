import 'server-only';
import type {
  LumaEvent,
  LumaEventsResponse,
  LumaGuest,
  LumaCalendarMembership,
} from '@/types/membership';

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
    next: { revalidate: 60 }, // cache event list for 60s
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Luma ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
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

/**
 * Add a guest to a Luma event (registers them).
 * On paid events Luma sends the guest a payment email.
 */
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
 * Subscribe a guest to a BitBasel calendar membership tier.
 * Luma returns a checkout_url the user visits to complete payment.
 */
export async function subscribeCalendarMember(
  tierApiId: string,
  email: string,
  name: string
): Promise<LumaCalendarMembership> {
  const calendarId = process.env.LUMA_CALENDAR_ID;
  if (!calendarId) throw new Error('LUMA_CALENDAR_ID is not set');
  if (!tierApiId) throw new Error('lumaTierId is not configured for this tier');

  return lumaFetch<LumaCalendarMembership>('/calendar/membership/create', {
    method: 'POST',
    body: JSON.stringify({
      calendar_api_id: calendarId,
      tier_api_id: tierApiId,
      email,
      name,
    }),
  });
}
