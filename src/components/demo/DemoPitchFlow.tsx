'use client';

// ─────────────────────────────────────────────────────────────
// BitBasel — Investor Demo Flow
//
// A scripted, self-contained walkthrough of the BitBasel story for
// live investor pitches. Every wallet connection and payment on this
// page is simulated — no wallet extension, network call, or on-chain
// transaction is ever triggered. See CLAUDE.md for the real flow
// (`src/components/membership/MembershipJoinFlow.tsx`).
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import { PRICING_TIERS } from '@/lib/tiers';
import { mockArtworks, mockArtists } from '@/data/physicalMockData';
import { mockOrdinals } from '@/data/mockData';

type Step = 'welcome' | 'discover' | 'membership' | 'wallet' | 'payment' | 'success';
type WalletStage = 'idle' | 'connecting' | 'connected';
type PaymentStage = 'idle' | 'signing' | 'verifying' | 'settling' | 'done';

const STEP_ORDER: Step[] = ['welcome', 'discover', 'membership', 'wallet', 'payment', 'success'];

const STEPPER_LABELS: { step: Step; label: string }[] = [
  { step: 'discover', label: 'Discover' },
  { step: 'membership', label: 'Membership' },
  { step: 'wallet', label: 'Wallet' },
  { step: 'payment', label: 'Payment' },
  { step: 'success', label: 'Done' },
];

const SIMULATED_WALLET_ADDRESS = '0x7a3fb82c4e91d5a6f203b9c1e4a8d2f739bc9c21';

const PAYMENT_STAGE_COPY: Record<Exclude<PaymentStage, 'idle'>, string> = {
  signing: 'Signing authorization in wallet…',
  verifying: 'Verifying with facilitator…',
  settling: 'Settling USDC on Base…',
  done: 'Settled on-chain.',
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DemoPitchFlow() {
  const [step, setStep] = useState<Step>('welcome');
  const [walletStage, setWalletStage] = useState<WalletStage>('idle');
  const [paymentStage, setPaymentStage] = useState<PaymentStage>('idle');

  const collectorTier = PRICING_TIERS.find((t) => t.key === 'collector') ?? null;

  function restart() {
    setStep('welcome');
    setWalletStage('idle');
    setPaymentStage('idle');
  }

  async function connectWallet() {
    setWalletStage('connecting');
    await wait(900);
    setWalletStage('connected');
  }

  async function runPayment() {
    setPaymentStage('signing');
    await wait(1100);
    setPaymentStage('verifying');
    await wait(1000);
    setPaymentStage('settling');
    await wait(1200);
    setPaymentStage('done');
    await wait(600);
    setStep('success');
  }

  return (
    <div className="demo-flow">
      <div className="demo-badge">Investor Demo — simulated payment, no funds move</div>

      <div className="container">
        {step !== 'welcome' && (
          <ol className="demo-stepper" aria-label="Demo progress">
            {STEPPER_LABELS.map(({ step: s, label }) => {
              const currentIndex = STEP_ORDER.indexOf(step);
              const itemIndex = STEP_ORDER.indexOf(s);
              const status =
                itemIndex < currentIndex
                  ? 'done'
                  : itemIndex === currentIndex
                    ? 'active'
                    : 'upcoming';
              return (
                <li key={s} className={`demo-stepper__item demo-stepper__item--${status}`}>
                  {label}
                </li>
              );
            })}
          </ol>
        )}

        {step === 'welcome' && (
          <section className="demo-step demo-hero">
            <p className="hero-eyebrow">BitBasel — Investor Walkthrough</p>
            <h1 className="text-heading-1">
              Where Art &amp; Culture
              <br />
              Meet Web3 and Capital.
            </h1>
            <p className="demo-hero-lead">
              A guided tour of BitBasel: discover the marketplace, choose a membership, and see the
              on-chain payment flow — start to finish, in a few clicks.
            </p>
            <button type="button" className="btn-primary" onClick={() => setStep('discover')}>
              Start demo
            </button>
          </section>
        )}

        {step === 'discover' && (
          <section className="demo-step">
            <h2 className="text-heading-3">Two product surfaces, one ecosystem</h2>
            <p className="demo-step-sub">
              Bitcoin Ordinals for digital collectors, and represented artists for institutional
              acquisition.
            </p>

            <div className="demo-discover-grid">
              {mockOrdinals.slice(0, 2).map((ordinal) => (
                <div key={ordinal.id} className="demo-discover-card">
                  <img
                    src={ordinal.mediaContent}
                    alt={ordinal.metaTitle}
                    className="demo-discover-card__image"
                  />
                  <div className="demo-discover-card__meta">
                    <p className="demo-discover-card__title">{ordinal.metaTitle}</p>
                    <p className="demo-discover-card__sub">{ordinal.collection}</p>
                    <p className="demo-discover-card__price">
                      {ordinal.price && ordinal.priceUnit
                        ? `${ordinal.price} ${ordinal.priceUnit.toUpperCase()}`
                        : 'Not listed'}
                    </p>
                  </div>
                </div>
              ))}

              {mockArtworks.slice(0, 2).map((artwork) => {
                const artist = mockArtists.find((a) => a.id === artwork.artistId);
                return (
                  <div key={artwork.id} className="demo-discover-card">
                    <img
                      src={artwork.images[0]}
                      alt={artwork.title}
                      className="demo-discover-card__image"
                    />
                    <div className="demo-discover-card__meta">
                      <p className="demo-discover-card__title">{artwork.title}</p>
                      <p className="demo-discover-card__sub">{artist?.name ?? 'BitBasel Artist'}</p>
                      <p className="demo-discover-card__price">
                        {artwork.price === 'POA'
                          ? 'Price on application'
                          : `$${artwork.price.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button type="button" className="btn-primary" onClick={() => setStep('membership')}>
              Continue to membership
            </button>
          </section>
        )}

        {step === 'membership' && collectorTier && (
          <section className="demo-step">
            <h2 className="text-heading-3">Choose a membership</h2>
            <p className="demo-step-sub">
              Creator applications are reviewed by hand. Collector membership activates instantly —
              that's the tier this demo pays for.
            </p>

            <div className="bb-tier-grid">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.key}
                  className={`bb-tier-card ${tier.key === 'collector' ? 'bb-tier-card--selected' : ''}`}
                >
                  <div className="bb-tier-card__header">
                    <span className="bb-tier-card__label">{tier.label}</span>
                    <span className={`bb-tier-card__badge bb-tier-card__badge--${tier.badgeStyle}`}>
                      {tier.priceLabel}
                    </span>
                  </div>
                  <p className="bb-tier-card__tagline">{tier.tagline}</p>
                  <ul className="bb-tier-card__benefits">
                    {tier.benefits.slice(0, 3).map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  {tier.requiresApproval && (
                    <p className="bb-tier-card__approval">
                      ✦ Application required — reviewed within 2–3 business days
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button type="button" className="btn-primary" onClick={() => setStep('wallet')}>
              Continue as {collectorTier.label} — {collectorTier.priceLabel}
            </button>
          </section>
        )}

        {step === 'wallet' && (
          <section className="demo-step">
            <h2 className="text-heading-3">Connect your wallet</h2>
            <p className="demo-step-sub">
              BitBasel supports any EIP-6963 EVM wallet. This step is simulated — no browser
              extension is required for the demo.
            </p>

            <div className="demo-wallet-box">
              {walletStage === 'connected' ? (
                <div className="bb-wallet-pill">
                  <span className="bb-wallet-pill__dot" />
                  {SIMULATED_WALLET_ADDRESS.slice(0, 6)}…{SIMULATED_WALLET_ADDRESS.slice(-4)}{' '}
                  connected
                </div>
              ) : (
                <button
                  type="button"
                  className="bb-btn bb-btn--primary"
                  disabled={walletStage === 'connecting'}
                  onClick={connectWallet}
                >
                  {walletStage === 'connecting' ? 'Connecting…' : 'Connect wallet'}
                </button>
              )}
            </div>

            <button
              type="button"
              className="btn-primary"
              disabled={walletStage !== 'connected'}
              onClick={() => setStep('payment')}
            >
              Continue to payment
            </button>
          </section>
        )}

        {step === 'payment' && collectorTier && (
          <section className="demo-step">
            <h2 className="text-heading-3">Pay with USDC on Base</h2>

            <div className="bb-billing-pill">
              <span className="bb-billing-pill__price">{collectorTier.priceLabel}</span>
              <span className="bb-billing-pill__interval">billed annually · USDC on Base</span>
            </div>

            {paymentStage === 'idle' ? (
              <button type="button" className="bb-btn bb-btn--primary" onClick={runPayment}>
                Pay $490 with USDC on Base
              </button>
            ) : (
              <div className="demo-payment-box" role="status" aria-live="polite">
                {(['signing', 'verifying', 'settling', 'done'] as const).map((stage) => {
                  const stageIndex = ['signing', 'verifying', 'settling', 'done'].indexOf(stage);
                  const currentIndex = ['signing', 'verifying', 'settling', 'done'].indexOf(
                    paymentStage
                  );
                  const status =
                    stageIndex < currentIndex
                      ? 'done'
                      : stageIndex === currentIndex
                        ? 'active'
                        : 'upcoming';
                  return (
                    <div key={stage} className={`demo-payment-stage demo-payment-stage--${status}`}>
                      {PAYMENT_STAGE_COPY[stage]}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {step === 'success' && (
          <section className="demo-step bb-status" role="status" aria-live="polite">
            <div className="bb-status__icon" style={{ color: 'var(--bb-teal)' }} aria-hidden="true">
              ✓
            </div>
            <h2 className="bb-join-heading">You&apos;re in.</h2>
            <p className="bb-join-sub">
              Collector membership activated — instantly, on-chain, no email link required.
            </p>
            <div className="bb-info-box bb-info-box--success">
              <p>USDC settled on Base to the BitBasel treasury address.</p>
              <p>
                In production, this member is registered in Luma the moment settlement confirms.
              </p>
            </div>
            <button type="button" className="btn-outline" onClick={restart}>
              Restart demo
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
