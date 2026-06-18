'use client';

import React, { useState } from 'react';
import { TIERS, tierPrice } from '@/lib/tiers';
import type { TierId } from '@/lib/tiers';
import type { JoinResponse, WalletChain } from '@/types/membership';

type Step = 'tier' | 'details' | 'confirm' | 'success';
type Billing = 'monthly' | 'annual';

interface Props {
  walletAddress: string;
  chain: WalletChain;
  defaultTier?: TierId;
}

export function MembershipJoinFlow({ walletAddress, chain, defaultTier = 'creator' }: Props) {
  const [step, setStep] = useState<Step>('tier');
  const [tierId, setTierId] = useState<TierId>(defaultTier);
  const [billing, setBilling] = useState<Billing>('monthly');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JoinResponse | null>(null);

  const tier = TIERS[tierId];
  const price = tierPrice(tierId, billing);
  const annualSaving = TIERS[tierId].monthlyPrice * 12 - TIERS[tierId].annualPrice;

  async function handleJoin() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/luma/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, chain, email, name, tierId, billing }),
      });

      const data = (await res.json()) as JoinResponse & { error?: string };

      if (!res.ok) throw new Error(data.error ?? 'Join failed');

      setResult(data);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Step: choose tier ────────────────────────────────────────────────────

  if (step === 'tier') {
    return (
      <div className="join-flow">
        <h3 className="join-flow-heading">Choose your membership</h3>

        <div className="join-billing-toggle">
          {(['monthly', 'annual'] as Billing[]).map((b) => (
            <button
              key={b}
              className={`join-billing-btn${billing === b ? ' active' : ''}`}
              onClick={() => setBilling(b)}
            >
              {b === 'monthly' ? 'Monthly' : `Annual — save $${annualSaving}`}
            </button>
          ))}
        </div>

        <div className="join-tier-cards">
          {(Object.values(TIERS) as (typeof TIERS)[TierId][]).map((t) => (
            <button
              key={t.id}
              className={`join-tier-card${tierId === t.id ? ' selected' : ''}`}
              onClick={() => setTierId(t.id)}
            >
              <div className="join-tier-name">{t.name}</div>
              <div className="join-tier-price">
                ${billing === 'annual' ? t.annualPrice : t.monthlyPrice}
                <span>/{billing === 'annual' ? 'yr' : 'mo'}</span>
              </div>
              <ul className="join-tier-benefits">
                {t.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <button className="btn-primary join-flow-next" onClick={() => setStep('details')}>
          Continue as {tier.name} — ${price}/{billing === 'annual' ? 'yr' : 'mo'}
        </button>
      </div>
    );
  }

  // ── Step: contact details ────────────────────────────────────────────────

  if (step === 'details') {
    return (
      <div className="join-flow">
        <h3 className="join-flow-heading">Your details</h3>
        <p className="join-flow-sub">
          Your wallet{' '}
          <code className="join-wallet-code">
            {walletAddress.slice(0, 8)}…{walletAddress.slice(-6)}
          </code>{' '}
          will be linked to this email.
        </p>

        <div className="join-field">
          <label className="join-label" htmlFor="jf-name">
            Full name
          </label>
          <input
            id="jf-name"
            className="join-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

        <div className="join-field">
          <label className="join-label" htmlFor="jf-email">
            Email
          </label>
          <input
            id="jf-email"
            className="join-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="join-flow-actions">
          <button className="btn-outline" onClick={() => setStep('tier')}>
            Back
          </button>
          <button
            className="btn-primary"
            disabled={!name.trim() || !email.includes('@')}
            onClick={() => setStep('confirm')}
          >
            Review order
          </button>
        </div>
      </div>
    );
  }

  // ── Step: confirm ────────────────────────────────────────────────────────

  if (step === 'confirm') {
    return (
      <div className="join-flow">
        <h3 className="join-flow-heading">Confirm membership</h3>

        <dl className="join-summary">
          <div className="join-summary-row">
            <dt>Tier</dt>
            <dd>{tier.name}</dd>
          </div>
          <div className="join-summary-row">
            <dt>Billing</dt>
            <dd>
              ${price}/{billing === 'annual' ? 'yr' : 'mo'}
            </dd>
          </div>
          <div className="join-summary-row">
            <dt>Email</dt>
            <dd>{email}</dd>
          </div>
          <div className="join-summary-row">
            <dt>Wallet</dt>
            <dd>
              {walletAddress.slice(0, 8)}…{walletAddress.slice(-6)}
            </dd>
          </div>
        </dl>

        <p className="join-payment-note">
          After confirming, you&apos;ll be redirected to Luma to complete payment. Your wallet will
          be activated once payment clears.
        </p>

        {error && <p className="join-error">{error}</p>}

        <div className="join-flow-actions">
          <button className="btn-outline" onClick={() => setStep('details')} disabled={submitting}>
            Back
          </button>
          <button className="btn-primary" onClick={handleJoin} disabled={submitting}>
            {submitting ? 'Processing…' : 'Confirm & pay on Luma'}
          </button>
        </div>
      </div>
    );
  }

  // ── Step: success ────────────────────────────────────────────────────────

  return (
    <div className="join-flow join-flow-success">
      <p className="join-success-icon">✓</p>
      <h3 className="join-flow-heading">Almost there</h3>
      <p className="join-flow-sub">
        Complete your payment on Luma to activate your {tier.name} membership.
      </p>
      {result?.lumaCheckoutUrl && (
        <a
          href={result.lumaCheckoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary join-luma-link"
        >
          Complete payment on Luma →
        </a>
      )}
      <p className="join-payment-note">
        Your wallet will be verified automatically once payment is confirmed.
      </p>
    </div>
  );
}

export default MembershipJoinFlow;
