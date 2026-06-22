import React from 'react';
import { listEvents } from '@/lib/luma-client';
import type { LumaEvent } from '@/types/membership';
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Exhibitions',
  description:
    'Private exhibitions and events for BitBasel Creator and Collector members. Digital Collectibles drops, physical art openings, and collector briefings.',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

function EventCard({ event }: { event: LumaEvent }) {
  const ticketTypes = event.ticket_types ?? [];
  const free = ticketTypes.some((t) => t.price_cents === 0);
  const totalCapacity = ticketTypes.reduce((s, t) => s + (t.capacity ?? 0), 0);
  const totalSold = ticketTypes.reduce((s, t) => s + t.sold_count, 0);
  const spotsLeft = totalCapacity > 0 ? totalCapacity - totalSold : null;

  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className="exhibition-card"
      aria-label={event.name}
    >
      {event.cover_url && (
        <div className="exhibition-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.cover_url} alt={event.name} className="exhibition-cover-img" />
        </div>
      )}

      <div className="exhibition-body">
        <p className="exhibition-date">
          {formatDate(event.start_at)} · {formatTime(event.start_at)}
        </p>

        <h2 className="exhibition-name">{event.name}</h2>

        {event.geo_address_json?.full_address && (
          <p className="exhibition-location">{event.geo_address_json.full_address}</p>
        )}

        {event.description && (
          <p className="exhibition-description">
            {event.description.length > 140
              ? event.description.slice(0, 140) + '…'
              : event.description}
          </p>
        )}

        <div className="exhibition-footer">
          <span className="exhibition-ticket">{free ? 'Members free' : 'Members only'}</span>
          {spotsLeft != null && spotsLeft <= 10 && (
            <span className="exhibition-spots">{spotsLeft} spots left</span>
          )}
        </div>
      </div>
    </a>
  );
}

export default async function CollectionsPage() {
  let events: LumaEvent[] = [];
  let fetchError: string | null = null;

  try {
    events = await listEvents(24);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Could not load events';
  }

  return (
    <main className="exhibitions-page">
      <div className="container">
        <header className="exhibitions-header">
          <p className="exhibitions-eyebrow">Private Programme</p>
          <h1 className="exhibitions-title">Exhibitions</h1>
          <p className="exhibitions-subtitle">
            Member events, Digital Collectibles drops, and collector briefings — visible only to
            Creator and Collector members.
          </p>
        </header>

        {fetchError ? (
          <div className="exhibitions-error">
            <p>Events unavailable. Please try again shortly.</p>
            <p className="exhibitions-error-detail">{fetchError}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="exhibitions-empty">
            <p>No upcoming events scheduled. Check back soon.</p>
            <Link href="/membership" className="btn-primary">
              Join to get notified
            </Link>
          </div>
        ) : (
          <div className="exhibitions-grid">
            {events.map((event) => (
              <EventCard key={event.api_id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
