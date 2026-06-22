import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { LumaWebhookPayload } from '@/types/membership';

// Luma signs every webhook with HMAC-SHA256 of the raw body.
// We must verify against the raw bytes, not re-serialized JSON.
function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(signature);
  if (expectedBuf.length !== receivedBuf.length) return false;
  return timingSafeEqual(expectedBuf, receivedBuf);
}

const LOG_PREFIX = '[luma/webhook]';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.LUMA_WEBHOOK_SECRET;
  if (!secret) {
    console.error(`${LOG_PREFIX} LUMA_WEBHOOK_SECRET is not set`);
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const signature = req.headers.get('x-luma-signature') ?? '';
  const rawBody = await req.text();

  if (!verifySignature(rawBody, signature, secret)) {
    console.warn(`${LOG_PREFIX} signature mismatch — possible spoofed request`, {
      signaturePresent: !!signature,
      bodyLength: rawBody.length,
    });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: LumaWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as LumaWebhookPayload;
  } catch {
    console.error(`${LOG_PREFIX} failed to parse body`);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const event_type = payload.event_type as string;
  const { data } = payload;
  // data is Record<string,unknown> — narrowed to the guest shape we expect
  const rawData = data as Record<string, unknown>;
  const guest = (rawData.guest ?? null) as {
    api_id: string;
    approval_status?: string;
  } | null;

  console.info(`${LOG_PREFIX} received`, {
    event_type,
    hookId: payload.hook_id,
    guestId: guest?.api_id,
  });

  // Only process guest approval/decline events
  if (
    !guest?.api_id ||
    ![
      'event.guest.approved',
      'event.guest.declined',
      'event.guest.updated',
      'guest_updated',
    ].includes(event_type)
  ) {
    return NextResponse.json({ received: true });
  }

  try {
    const member = await db.member.findFirst({
      where: { lumaGuestId: guest.api_id },
    });

    if (!member) {
      console.info(`${LOG_PREFIX} guest not found in members`, { guestId: guest.api_id });
      return NextResponse.json({ received: true });
    }

    if (
      event_type === 'event.guest.approved' ||
      (event_type === 'event.guest.updated' && guest.approval_status === 'approved') ||
      (event_type === 'guest_updated' && guest.approval_status === 'approved')
    ) {
      await db.member.update({ where: { id: member.id }, data: { status: 'active' } });
      console.info(`${LOG_PREFIX} member activated`, { memberId: member.id, email: member.email });
    }

    if (
      event_type === 'event.guest.declined' ||
      (event_type === 'event.guest.updated' && guest.approval_status === 'declined') ||
      (event_type === 'guest_updated' && guest.approval_status === 'declined')
    ) {
      await db.member.update({ where: { id: member.id }, data: { status: 'cancelled' } });
      console.info(`${LOG_PREFIX} member cancelled`, { memberId: member.id, email: member.email });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error(`${LOG_PREFIX} db error`, { message, guestId: guest.api_id });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
