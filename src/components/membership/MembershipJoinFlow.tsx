'use client';

// ─────────────────────────────────────────────────────────────
// BitBasel  —  Membership Join Flow
//
// Tier pricing (no toggle — each tier has one billing interval):
//   Community  free        hidden from this component
//   Creator    $49/mo      requires admin approval
//   Collector  $490/yr     instant on payment
//
// Steps:
//   1. select  — tier cards (Creator + Collector only)
//   2. apply   — form fields (vary by tier)
//   3. status  — outcome screen
// ─────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { PRICING_TIERS, getBillingLabel } from '../../lib/tiers';
import type { BitBaselTierKey, JoinRequest, JoinResponse } from '../../types/membership';
import type { EIP1193Provider } from '../../types/wallet';

type Step = 'select' | 'apply' | 'status';
type JoinStatus = 'active' | 'pending_approval' | 'pending_payment' | 'error';

interface FormState {
  email: string;
  name: string;
  // Creator
  artist_name: string;
  portfolio_url: string;
  instagram: string;
  twitter: string;
  // Collector
  collecting_focus: string;
}

interface MembershipJoinFlowProps {
  /** Pre-select a tier (e.g. from ?tier=collector in the URL) */
  defaultTier?: BitBaselTierKey;
  walletAddress?: string;
  evmProvider?: EIP1193Provider | null;
  onSuccess?: (tier: BitBaselTierKey) => void;
}

const INITIAL_FORM: FormState = {
  email: '',
  name: '',
  artist_name: '',
  portfolio_url: '',
  instagram: '',
  twitter: '',
  collecting_focus: '',
};

export default function MembershipJoinFlow({
  defaultTier,
  walletAddress,
  evmProvider,
  onSuccess,
}: MembershipJoinFlowProps) {
  const [step, setStep] = useState<Step>(defaultTier ? 'apply' : 'select');
  const [tierKey, setTierKey] = useState<BitBaselTierKey | null>(defaultTier ?? null);
  const [joinStatus, setJoinStatus] = useState<JoinStatus | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [onChainLoading, setOnChainLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const selectedTier = tierKey ? (PRICING_TIERS.find((t) => t.key === tierKey) ?? null) : null;

  const setField = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      },
    []
  );

  // ── Validation ──────────────────────────────────────────────
  function validate(): boolean {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address';

    if (tierKey === 'creator') {
      if (!form.artist_name.trim()) errs.artist_name = 'Artist or studio name is required';
      if (form.portfolio_url.trim()) {
        try {
          new URL(form.portfolio_url);
        } catch {
          errs.portfolio_url = 'Enter a valid URL (https://...)';
        }
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tierKey || !validate()) return;

    setLoading(true);
    try {
      const payload: JoinRequest = {
        email: form.email.trim(),
        name: form.name.trim(),
        tier_key: tierKey,
        wallet: walletAddress,
        ...(tierKey === 'creator' && {
          artist_name: form.artist_name.trim(),
          portfolio_url: form.portfolio_url.trim() || undefined,
          instagram: form.instagram.trim() || undefined,
          twitter: form.twitter.trim() || undefined,
        }),
        ...(tierKey === 'collector' && {
          collecting_focus: form.collecting_focus || undefined,
        }),
      };

      const res = await fetch('/api/luma/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: JoinResponse | { error: string } = await res.json();

      if (!res.ok || !('status' in data)) {
        setJoinStatus('error');
        setStatusMsg('error' in data ? data.error : 'Something went wrong.');
        setStep('status');
        return;
      }

      setJoinStatus(data.status as JoinStatus);
      setStatusMsg(data.message);
      setStep('status');
      if (data.status === 'active') onSuccess?.(tierKey);
    } catch {
      setJoinStatus('error');
      setStatusMsg('Network error — check your connection and try again.');
      setStep('status');
    } finally {
      setLoading(false);
    }
  }

  // ── On-chain payment (x402 / USDC on Base) ──────────────
  async function handleOnChainPayment(e: React.FormEvent) {
    e.preventDefault();
    if (tierKey !== 'collector' || !validate() || !evmProvider || !walletAddress) return;

    setOnChainLoading(true);
    try {
      const [{ wrapFetchWithPayment, x402Client }, { ExactEvmScheme }] = await Promise.all([
        import('@x402/fetch'),
        import('@x402/evm'),
      ]);

      const signer = {
        address: walletAddress as `0x${string}`,
        signTypedData: async (message: {
          domain: Record<string, unknown>;
          types: Record<string, unknown>;
          primaryType: string;
          message: Record<string, unknown>;
        }) => {
          return (await evmProvider.request({
            method: 'eth_signTypedData_v4',
            params: [walletAddress, JSON.stringify(message)],
          })) as `0x${string}`;
        },
      };

      const scheme = new ExactEvmScheme(signer);
      const client = new x402Client().register('eip155:8453', scheme);
      const payFetch = wrapFetchWithPayment(fetch, client);

      const payload: JoinRequest = {
        email: form.email.trim(),
        name: form.name.trim(),
        tier_key: 'collector',
        wallet: walletAddress,
        ...(form.collecting_focus && { collecting_focus: form.collecting_focus }),
      };

      const res = await payFetch('/api/x402/membership/collector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !('status' in data)) {
        setJoinStatus('error');
        setStatusMsg('error' in data ? data.error : 'Payment failed.');
        setStep('status');
        return;
      }

      setJoinStatus(data.status as JoinStatus);
      setStatusMsg(data.message);
      setStep('status');
      if (data.status === 'active') onSuccess?.('collector');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.toLowerCase().includes('user rejected') ||
        msg.toLowerCase().includes('user denied')
      ) {
        setJoinStatus('error');
        setStatusMsg('Payment was cancelled.');
      } else {
        setJoinStatus('error');
        setStatusMsg('On-chain payment failed — check your wallet and try again.');
      }
      setStep('status');
    } finally {
      setOnChainLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="bb-join-flow">
      {/* ── Tier selection ───────────────────────────── */}
      {step === 'select' && (
        <div>
          <h2 className="bb-join-heading">Join BitBasel</h2>
          <p className="bb-join-sub">Choose how you want to participate.</p>

          <div className="bb-tier-grid">
            {PRICING_TIERS.map((tier) => (
              <button
                key={tier.key}
                type="button"
                aria-pressed={tierKey === tier.key}
                className={`bb-tier-card ${tierKey === tier.key ? 'bb-tier-card--selected' : ''}`}
                onClick={() => setTierKey(tier.key as BitBaselTierKey)}
              >
                <div className="bb-tier-card__header">
                  <span className="bb-tier-card__label">{tier.label}</span>
                  <span className={`bb-tier-card__badge bb-tier-card__badge--${tier.badgeStyle}`}>
                    {tier.priceLabel}
                  </span>
                </div>
                <p className="bb-tier-card__tagline">{tier.tagline}</p>
                <ul className="bb-tier-card__benefits">
                  {tier.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                {tier.requiresApproval && (
                  <p className="bb-tier-card__approval">
                    ✦ Application required — reviewed within 2–3 business days
                  </p>
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="bb-btn bb-btn--primary"
            disabled={!tierKey}
            onClick={() => setStep('apply')}
          >
            Continue {selectedTier ? `as ${selectedTier.label}` : ''}
          </button>
        </div>
      )}

      {/* ── Application form ─────────────────────────── */}
      {step === 'apply' && tierKey && selectedTier && (
        <form onSubmit={handleSubmit} noValidate>
          <button type="button" className="bb-back-btn" onClick={() => setStep('select')}>
            ← Back
          </button>

          <h2 className="bb-join-heading">
            {selectedTier.requiresApproval
              ? `Apply as a ${selectedTier.label}`
              : `Join as a ${selectedTier.label}`}
          </h2>

          {/* Billing summary — no toggle, just a clear statement */}
          <div className="bb-billing-pill">
            <span className="bb-billing-pill__price">{selectedTier.priceLabel}</span>
            <span className="bb-billing-pill__interval">
              {getBillingLabel(tierKey)}
              {tierKey === 'collector' && evmProvider
                ? ' · USDC on Base or via Luma'
                : ' · billed via Luma'}
            </span>
          </div>

          {/* Wallet connected indicator */}
          {walletAddress && (
            <div className="bb-wallet-pill">
              <span className="bb-wallet-pill__dot" />
              {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)} connected
            </div>
          )}

          {/* Base fields — all tiers */}
          <div className="bb-field">
            <label htmlFor="bb-name">Full name</label>
            <input
              id="bb-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={setField('name')}
              placeholder="Satoshi Nakamoto"
              aria-describedby={errors.name ? 'bb-name-err' : undefined}
            />
            {errors.name && (
              <p id="bb-name-err" className="bb-field__error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="bb-field">
            <label htmlFor="bb-email">Email address</label>
            <input
              id="bb-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={setField('email')}
              placeholder="you@example.com"
              aria-describedby={errors.email ? 'bb-email-err' : undefined}
            />
            {errors.email && (
              <p id="bb-email-err" className="bb-field__error">
                {errors.email}
              </p>
            )}
            <p className="bb-field__hint">
              {walletAddress
                ? 'Links your wallet to your BitBasel membership.'
                : "You'll receive a confirmation and payment link here."}
            </p>
          </div>

          {/* Creator-only fields */}
          {tierKey === 'creator' && (
            <>
              <hr className="bb-divider" />
              <p className="bb-section-label">About your practice</p>

              <div className="bb-field">
                <label htmlFor="bb-artist">Artist or studio name</label>
                <input
                  id="bb-artist"
                  type="text"
                  value={form.artist_name}
                  onChange={setField('artist_name')}
                  placeholder="e.g. Rare Pixels Studio"
                  aria-describedby={errors.artist_name ? 'bb-artist-err' : undefined}
                />
                {errors.artist_name && (
                  <p id="bb-artist-err" className="bb-field__error">
                    {errors.artist_name}
                  </p>
                )}
              </div>

              <div className="bb-field">
                <label htmlFor="bb-portfolio">
                  Portfolio URL <span className="bb-optional">(optional)</span>
                </label>
                <input
                  id="bb-portfolio"
                  type="url"
                  value={form.portfolio_url}
                  onChange={setField('portfolio_url')}
                  placeholder="https://yoursite.com"
                  aria-describedby={errors.portfolio_url ? 'bb-portfolio-err' : undefined}
                />
                {errors.portfolio_url && (
                  <p id="bb-portfolio-err" className="bb-field__error">
                    {errors.portfolio_url}
                  </p>
                )}
              </div>

              <div className="bb-field-row">
                <div className="bb-field">
                  <label htmlFor="bb-ig">
                    Instagram <span className="bb-optional">(optional)</span>
                  </label>
                  <input
                    id="bb-ig"
                    type="text"
                    value={form.instagram}
                    onChange={setField('instagram')}
                    placeholder="@handle"
                  />
                </div>
                <div className="bb-field">
                  <label htmlFor="bb-tw">
                    Twitter / X <span className="bb-optional">(optional)</span>
                  </label>
                  <input
                    id="bb-tw"
                    type="text"
                    value={form.twitter}
                    onChange={setField('twitter')}
                    placeholder="@handle"
                  />
                </div>
              </div>
            </>
          )}

          {/* Collector-only fields */}
          {tierKey === 'collector' && (
            <>
              <hr className="bb-divider" />
              <div className="bb-field">
                <label htmlFor="bb-focus">
                  Collecting focus <span className="bb-optional">(optional)</span>
                </label>
                <select
                  id="bb-focus"
                  value={form.collecting_focus}
                  onChange={setField('collecting_focus')}
                >
                  <option value="">Select an area</option>
                  <option value="bitcoin_ordinals">Bitcoin Ordinals</option>
                  <option value="physical_fine_art">Physical fine art</option>
                  <option value="dynamic_nfts">Dynamic NFTs</option>
                  <option value="all">All categories</option>
                </select>
              </div>
            </>
          )}

          {tierKey === 'collector' && evmProvider ? (
            <>
              <button
                type="button"
                className="bb-btn bb-btn--primary"
                disabled={onChainLoading || loading}
                onClick={handleOnChainPayment}
              >
                {onChainLoading ? 'Confirm in wallet…' : 'Pay $490 with USDC on Base'}
              </button>
              <p className="bb-field__hint" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                Signs a one-time authorization in your wallet. Instant activation on-chain.
              </p>
              <div className="bb-divider-label">or</div>
              <button
                type="submit"
                className="bb-btn bb-btn--secondary"
                disabled={loading || onChainLoading}
              >
                {loading ? 'Submitting…' : 'Request payment link by email'}
              </button>
              <p className="bb-field__hint" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                Luma sends a Stripe payment link to your email.
              </p>
            </>
          ) : (
            <>
              <button type="submit" className="bb-btn bb-btn--primary" disabled={loading}>
                {loading
                  ? 'Submitting…'
                  : selectedTier.requiresApproval
                    ? 'Submit application'
                    : `Join for ${selectedTier.priceLabel}`}
              </button>
              {tierKey === 'collector' && (
                <p className="bb-field__hint" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                  You'll receive a secure payment link from Luma to complete your $490/year
                  subscription.
                </p>
              )}
            </>
          )}
        </form>
      )}

      {/* ── Status screen ────────────────────────────── */}
      {step === 'status' && joinStatus && (
        <StatusScreen
          status={joinStatus}
          message={statusMsg}
          tierKey={tierKey}
          tierLabel={selectedTier?.label ?? null}
          onRetry={() => {
            setJoinStatus(null);
            setStep('apply');
          }}
        />
      )}
    </div>
  );
}

// ── Status screen ─────────────────────────────────────────────

function StatusScreen({
  status,
  message,
  tierKey,
  tierLabel,
  onRetry,
}: {
  status: 'active' | 'pending_approval' | 'pending_payment' | 'error';
  message: string;
  tierKey: BitBaselTierKey | null;
  tierLabel: string | null;
  onRetry: () => void;
}) {
  const config = {
    active: { icon: '✓', heading: "You're in.", color: 'var(--bb-teal)' },
    pending_approval: { icon: '◎', heading: 'Application received.', color: 'var(--bb-purple)' },
    pending_payment: { icon: '◈', heading: 'Check your email.', color: 'var(--bb-amber)' },
    error: { icon: '✕', heading: 'Something went wrong.', color: 'var(--bb-coral)' },
  }[status];

  return (
    <div className="bb-status" role="status" aria-live="polite">
      <div className="bb-status__icon" style={{ color: config.color }} aria-hidden="true">
        {config.icon}
      </div>
      <h2 className="bb-join-heading">{config.heading}</h2>
      <p className="bb-join-sub">{message}</p>

      {status === 'pending_approval' && (
        <div className="bb-info-box">
          <p>We review every Creator application within 2–3 business days.</p>
          <p>You'll receive an email once approved — or if we need more information.</p>
        </div>
      )}

      {status === 'pending_payment' && (
        <div className="bb-info-box">
          <p>Luma will send a payment link to activate your $490/year Collector membership.</p>
          <p>If it doesn't arrive in a few minutes, check your spam folder.</p>
        </div>
      )}

      {status === 'active' && tierLabel && (
        <div className="bb-info-box bb-info-box--success">
          <p>Your {tierLabel} membership is active.</p>
          <p>Refresh the page to access member content.</p>
        </div>
      )}

      {status === 'error' && (
        <button className="bb-btn bb-btn--secondary" onClick={onRetry} type="button">
          Try again
        </button>
      )}
    </div>
  );
}
