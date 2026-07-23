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
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { PRICING_TIERS } from '@/lib/tiers';

type Step = 'welcome' | 'membership' | 'wallet' | 'payment' | 'success';
type WalletStage = 'idle' | 'connecting' | 'connected';
type PaymentStageKey = 'signing' | 'verifying' | 'settling' | 'done';
type PaymentStage = 'idle' | PaymentStageKey;

const STEP_ORDER: Step[] = ['welcome', 'membership', 'wallet', 'payment', 'success'];

const STEPPER_LABELS: { step: Step; label: string }[] = [
  { step: 'membership', label: 'Membership' },
  { step: 'wallet', label: 'Wallet' },
  { step: 'payment', label: 'Payment' },
  { step: 'success', label: 'Done' },
];

const PAYMENT_STAGES: { key: PaymentStageKey; label: string }[] = [
  { key: 'signing', label: 'Signing authorization in wallet' },
  { key: 'verifying', label: 'Verifying with facilitator' },
  { key: 'settling', label: 'Settling USDC on Base' },
  { key: 'done', label: 'Settled on-chain' },
];

const SIMULATED_WALLET_ADDRESS = '0x7a3fb82c4e91d5a6f203b9c1e4a8d2f739bc9c21';

const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

const stepVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE_PREMIUM } },
  exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.3, ease: EASE_PREMIUM } },
};

const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const staggerItem: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_PREMIUM } },
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
    await wait(700);
    setStep('success');
  }

  return (
    <div className="demo-flow">
      <div className="demo-badge">Investor Demo — simulated payment, no funds move</div>

      <div className="container">
        {step !== 'welcome' && <DemoStepper current={step} />}

        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.section
              key="welcome"
              className="demo-step demo-hero"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="demo-hero-aurora" aria-hidden="true" />
              <motion.p
                className="hero-eyebrow"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, ease: EASE_PREMIUM }}
              >
                BitBasel — Investor Walkthrough
              </motion.p>
              <motion.h1
                className="text-heading-1"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.span className="demo-hero-line" variants={staggerItem}>
                  Where Art &amp; Culture
                </motion.span>
                <br />
                <motion.span className="demo-hero-line" variants={staggerItem}>
                  Meet Web3 and Capital.
                </motion.span>
              </motion.h1>
              <motion.p
                className="demo-hero-lead"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                A guided tour of BitBasel: choose a membership and see the on-chain payment flow —
                start to finish, in a few clicks.
              </motion.p>
              <motion.button
                type="button"
                className="btn-primary"
                onClick={() => setStep('membership')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Start demo
              </motion.button>
            </motion.section>
          )}

          {step === 'membership' && collectorTier && (
            <motion.section
              key="membership"
              className="demo-step"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2 className="text-heading-3">Choose a membership</h2>
              <p className="demo-step-sub">
                Creator applications are reviewed by hand. Collector membership activates instantly
                — that&apos;s the tier this demo pays for.
              </p>

              <motion.div
                className="bb-tier-grid"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {PRICING_TIERS.map((tier) => (
                  <motion.div
                    key={tier.key}
                    variants={staggerItem}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                    className={`bb-tier-card ${
                      tier.key === 'collector' ? 'bb-tier-card--selected demo-tier-card--glow' : ''
                    }`}
                  >
                    <div className="bb-tier-card__header">
                      <span className="bb-tier-card__label">{tier.label}</span>
                      <span
                        className={`bb-tier-card__badge bb-tier-card__badge--${tier.badgeStyle}`}
                      >
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
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                type="button"
                className="btn-primary"
                onClick={() => setStep('wallet')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Continue as {collectorTier.label} — {collectorTier.priceLabel}
              </motion.button>
            </motion.section>
          )}

          {step === 'wallet' && (
            <motion.section
              key="wallet"
              className="demo-step"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2 className="text-heading-3">Connect your wallet</h2>
              <p className="demo-step-sub">
                BitBasel supports any EIP-6963 EVM wallet. This step is simulated — no browser
                extension is required for the demo.
              </p>

              <div className="demo-wallet-box">
                <AnimatePresence mode="wait">
                  {walletStage === 'connected' ? (
                    <motion.div
                      key="connected"
                      className="bb-wallet-pill demo-wallet-pill"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                    >
                      <span className="bb-wallet-pill__dot demo-wallet-dot" />
                      {SIMULATED_WALLET_ADDRESS.slice(0, 6)}…{SIMULATED_WALLET_ADDRESS.slice(-4)}{' '}
                      connected
                      <DemoCheckmark size={14} />
                    </motion.div>
                  ) : (
                    <motion.button
                      key="connect"
                      type="button"
                      className="bb-btn bb-btn--primary demo-connect-btn"
                      disabled={walletStage === 'connecting'}
                      onClick={connectWallet}
                      whileHover={walletStage === 'idle' ? { scale: 1.02 } : undefined}
                      whileTap={walletStage === 'idle' ? { scale: 0.98 } : undefined}
                    >
                      {walletStage === 'connecting' && <span className="demo-spinner" />}
                      {walletStage === 'connecting' ? 'Connecting…' : 'Connect wallet'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="button"
                className="btn-primary"
                disabled={walletStage !== 'connected'}
                onClick={() => setStep('payment')}
                whileHover={walletStage === 'connected' ? { scale: 1.03 } : undefined}
                whileTap={walletStage === 'connected' ? { scale: 0.97 } : undefined}
              >
                Continue to payment
              </motion.button>
            </motion.section>
          )}

          {step === 'payment' && collectorTier && (
            <motion.section
              key="payment"
              className="demo-step"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2 className="text-heading-3">Pay with USDC on Base</h2>

              <div className="bb-billing-pill">
                <span className="bb-billing-pill__price">{collectorTier.priceLabel}</span>
                <span className="bb-billing-pill__interval">billed annually · USDC on Base</span>
              </div>

              {paymentStage === 'idle' ? (
                <motion.button
                  type="button"
                  className="bb-btn bb-btn--primary"
                  onClick={runPayment}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Pay $490 with USDC on Base
                </motion.button>
              ) : (
                <DemoPaymentTracker currentStage={paymentStage} />
              )}
            </motion.section>
          )}

          {step === 'success' && (
            <motion.section
              key="success"
              className="demo-step bb-status"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              role="status"
              aria-live="polite"
            >
              <DemoSuccessBurst />
              <div className="demo-success-icon">
                <DemoCheckmark size={40} strokeWidth={3} />
              </div>
              <motion.div variants={staggerContainer} initial="initial" animate="animate">
                <motion.h2 className="bb-join-heading" variants={staggerItem}>
                  You&apos;re in.
                </motion.h2>
                <motion.p className="bb-join-sub" variants={staggerItem}>
                  Collector membership activated — instantly, on-chain, no email link required.
                </motion.p>
                <motion.div className="bb-info-box bb-info-box--success" variants={staggerItem}>
                  <p>USDC settled on Base to the BitBasel treasury address.</p>
                  <p>
                    In production, this member is registered in Luma the moment settlement confirms.
                  </p>
                </motion.div>
                <motion.button
                  type="button"
                  className="btn-outline"
                  onClick={restart}
                  variants={staggerItem}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Restart demo
                </motion.button>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Progress rail ───────────────────────────────────────────────

function DemoStepper({ current }: { current: Step }) {
  const currentIndex = STEP_ORDER.indexOf(current);
  const stepperIndex = Math.max(
    STEPPER_LABELS.findIndex((s) => s.step === current),
    0
  );
  const fillPercent =
    STEPPER_LABELS.length > 1 ? (stepperIndex / (STEPPER_LABELS.length - 1)) * 100 : 0;

  return (
    <div className="demo-rail">
      <div className="demo-rail__track">
        <motion.div
          className="demo-rail__fill"
          animate={{ width: `${fillPercent}%` }}
          transition={{ duration: 0.5, ease: EASE_PREMIUM }}
        />
      </div>
      <ol className="demo-rail__items" aria-label="Demo progress">
        {STEPPER_LABELS.map(({ step: s, label }) => {
          const itemIndex = STEP_ORDER.indexOf(s);
          const status =
            itemIndex < currentIndex ? 'done' : itemIndex === currentIndex ? 'active' : 'upcoming';
          return (
            <li key={s} className={`demo-rail__item demo-rail__item--${status}`}>
              <span className="demo-rail__dot">
                {status === 'done' ? <DemoCheckmark size={9} strokeWidth={3} /> : null}
              </span>
              <span className="demo-rail__label">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ── Payment tracker ─────────────────────────────────────────────

function DemoPaymentTracker({ currentStage }: { currentStage: PaymentStage }) {
  const currentIdx = PAYMENT_STAGES.findIndex((s) => s.key === currentStage);

  return (
    <div className="demo-tracker" role="status" aria-live="polite">
      {PAYMENT_STAGES.map((stage, i) => {
        const status = i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'upcoming';
        const isLast = i === PAYMENT_STAGES.length - 1;
        return (
          <div key={stage.key} className={`demo-tracker__row demo-tracker__row--${status}`}>
            <div className="demo-tracker__rail">
              <span className="demo-tracker__node">
                {status === 'done' && <DemoCheckmark size={11} strokeWidth={3} />}
                {status === 'active' && <span className="demo-spinner demo-spinner--small" />}
              </span>
              {!isLast && (
                <span className="demo-tracker__connector">
                  <motion.span
                    className="demo-tracker__connector-fill"
                    animate={{ scaleY: status === 'done' ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                  />
                </span>
              )}
            </div>
            <span className="demo-tracker__label">{stage.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Success burst ────────────────────────────────────────────────

function DemoSuccessBurst() {
  const particles = Array.from({ length: 8 });
  return (
    <div className="demo-burst" aria-hidden="true">
      {particles.map((_, i) => {
        const angle = (360 / particles.length) * i;
        const distance = 46 + (i % 3) * 10;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        return (
          <motion.span
            key={i}
            className={`demo-burst__particle ${i % 2 === 0 ? 'demo-burst__particle--teal' : 'demo-burst__particle--amber'}`}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x, y, scale: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

// ── Animated checkmark ───────────────────────────────────────────

function DemoCheckmark({ size = 16, strokeWidth = 2.5 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <motion.path
        d="M4 12.5L9.5 18L20 6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE_PREMIUM }}
      />
    </svg>
  );
}
