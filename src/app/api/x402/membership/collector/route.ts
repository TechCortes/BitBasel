import 'server-only';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { x402CollectorServer, ensureX402Initialized } from '@/lib/x402-server';
import { addMemberToTier, resolveLumaTierId } from '@/lib/luma-client';
import { TIERS } from '@/lib/tiers';
import type { JoinRequest } from '@/types/membership';

export async function POST(req: NextRequest): Promise<Response> {
  if (!process.env.BITBASEL_PAYMENT_ADDRESS) {
    return NextResponse.json({ error: 'On-chain payments not yet configured' }, { status: 503 });
  }

  try {
    await ensureX402Initialized();
  } catch (err) {
    console.error('[x402/collector] Init error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 });
  }

  const result = await x402CollectorServer.processHTTPRequest({
    adapter: {
      getHeader: (name: string) => req.headers.get(name) ?? undefined,
      getMethod: () => 'POST',
      getPath: () => '/api/x402/membership/collector',
      getUrl: () => req.url,
      getAcceptHeader: () => req.headers.get('accept') ?? 'application/json',
      getUserAgent: () => req.headers.get('user-agent') ?? '',
    },
    path: '/api/x402/membership/collector',
    method: 'POST',
    paymentHeader: req.headers.get('PAYMENT-SIGNATURE') ?? undefined,
    routePattern: 'POST /api/x402/membership/collector',
  });

  if (result.type === 'payment-error') {
    const { status, headers, body } = result.response;
    return new Response(body !== undefined ? JSON.stringify(body) : null, {
      status,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }

  if (result.type !== 'payment-verified') {
    return NextResponse.json({ error: 'Payment required' }, { status: 402 });
  }

  // Payment verified — parse body and register in Luma
  let body: JoinRequest;
  try {
    body = await req.json();
  } catch {
    await result.cancellationDispatcher.cancel({ reason: 'handler_threw' });
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, name, collecting_focus, wallet } = body;

  if (!email?.trim() || !name?.trim()) {
    await result.cancellationDispatcher.cancel({ reason: 'handler_threw' });
    return NextResponse.json({ error: 'email and name are required' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    await result.cancellationDispatcher.cancel({ reason: 'handler_threw' });
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  try {
    const lumaTierId = resolveLumaTierId('collector');
    const tierConfig = TIERS.collector;

    const { member } = await addMemberToTier({
      email: email.trim(),
      name: name.trim(),
      tier_id: lumaTierId,
      metadata: {
        ...(collecting_focus && { collecting_focus }),
        ...(wallet && { wallet_address: wallet }),
        billing_interval: tierConfig.billingInterval ?? 'yearly',
        price_label: tierConfig.priceLabel,
        payment_method: 'x402_usdc_base',
      },
    });

    // Settle the payment — transfers USDC from member's wallet to BITBASEL_PAYMENT_ADDRESS
    const settleResult = await x402CollectorServer.processSettlement(
      result.paymentPayload,
      result.paymentRequirements,
      result.declaredExtensions ?? {}
    );

    const settleHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...settleResult.headers,
    };

    if (!settleResult.success) {
      console.error(
        '[x402/collector] Settlement failed:',
        settleResult.errorReason,
        settleResult.errorMessage
      );
      return new Response(
        JSON.stringify({
          error: 'Payment settlement failed. Contact support at jorge@bitbasel.miami.',
        }),
        { status: 402, headers: settleHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: member.status,
        member_id: member.api_id,
        message: "You're in. Your Collector membership is active — welcome to BitBasel.",
        tx: settleResult.transaction,
      }),
      { status: 200, headers: settleHeaders }
    );
  } catch (err: unknown) {
    await result.cancellationDispatcher.cancel({ reason: 'handler_threw', error: err });
    const message = err instanceof Error ? err.message : String(err);
    console.error('[x402/collector] Error:', message);

    if (message.toLowerCase().includes('already a member')) {
      return NextResponse.json(
        { error: 'This email is already registered. Try signing in or use a different email.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to activate your membership. Please try again.' },
      { status: 500 }
    );
  }
}
