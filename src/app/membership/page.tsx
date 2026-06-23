'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MembershipTiers from '@/components/MembershipTiers';
import MembershipJoinFlow from '@/components/membership/MembershipJoinFlow';
import { useWalletStore } from '@/store/StoreProvider';
import type { BitBaselTierKey } from '@/types/membership';

const FEATURE_ROWS = [
  {
    category: 'Listings & Portfolio',
    features: [
      { name: 'Digital Collectibles listings', creator: 'Unlimited', collector: '—' },
      { name: 'Physical artwork consignment', creator: '✓', collector: 'View only' },
      { name: 'Platform fee', creator: '2%', collector: '0% on acquisitions' },
      { name: 'Blockchain certificate of authenticity', creator: '✓', collector: '✓' },
    ],
  },
  {
    category: 'Access & Discovery',
    features: [
      { name: 'Early access to new drops', creator: '—', collector: '48 hrs before public' },
      { name: 'Private sale access', creator: '—', collector: '✓' },
      { name: 'Make-offer capabilities', creator: '—', collector: '✓' },
      { name: 'Off-market physical artwork access', creator: '—', collector: '✓' },
      { name: 'Personalized curation feed', creator: '—', collector: '✓' },
    ],
  },
  {
    category: 'Economics & Royalties',
    features: [
      { name: 'On-chain royalty enforcement', creator: '✓ every secondary sale', collector: '—' },
      { name: 'Split payout management', creator: '✓ for collaborators', collector: '—' },
      {
        name: 'Secondary sale royalty transparency',
        creator: '✓ quarterly reports',
        collector: '✓',
      },
    ],
  },
  {
    category: 'Advisory & Events',
    features: [
      { name: 'Acquisition advisory sessions', creator: '—', collector: 'Quarterly 1-on-1' },
      { name: 'VIP event invitations', creator: '—', collector: '✓ gallery & art fairs' },
      { name: 'Studio visit access', creator: '—', collector: '✓' },
      {
        name: 'Curator review program',
        creator: '✓ monthly featured placement',
        collector: '—',
      },
    ],
  },
  {
    category: 'Digital Tools & Analytics',
    features: [
      { name: 'Creator analytics dashboard', creator: '✓', collector: '—' },
      { name: 'Collection portfolio dashboard', creator: '—', collector: '✓' },
      { name: 'Provenance tracking', creator: '✓', collector: '✓' },
      { name: 'Smart contract exhibition tools', creator: '✓', collector: '—' },
      {
        name: 'Digital Collectibles membership card',
        creator: '—',
        collector: '✓ inscribed on-chain',
      },
    ],
  },
  {
    category: 'Support',
    features: [
      { name: 'Priority support', creator: '✓', collector: '✓' },
      { name: 'Dedicated concierge', creator: '—', collector: '✓ Institutional tier' },
      { name: 'Onboarding call', creator: '✓', collector: '✓' },
    ],
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose your role',
    body: 'Select the Creator or Collector tier that matches how you participate in the art world. Each tier is purpose-built for its audience.',
  },
  {
    step: '02',
    title: 'Connect your wallet',
    body: 'Link your Bitcoin or Ethereum wallet. Your membership is verified on-chain — no passwords, no intermediaries. Your wallet is your identity.',
  },
  {
    step: '03',
    title: 'Access the ecosystem',
    body: 'Creators gain Digital Tools, royalty management, and curator visibility. Collectors unlock early access to Digital Art, advisory services, and VIP events.',
  },
];

const FAQS = [
  {
    q: 'What wallets are supported?',
    a: 'BitBasel supports Bitcoin wallets (Unisat, Xverse, Leather, Ordinals Wallet, Phantom) and all EVM wallets via MetaMask, WalletConnect, and any EIP-6963 compatible wallet.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Memberships are payable in USDC, ETH, BTC, or SOL. You can also pay by card — payment is processed through Luma. Your wallet is automatically verified once payment clears.',
  },
  {
    q: 'Can I switch between Creator and Collector?',
    a: 'Yes. You can hold both memberships simultaneously if you both create and collect. Each tier is linked independently to your wallet.',
  },
  {
    q: 'How is my membership stored on-chain?',
    a: 'Collector membership cards are inscribed as Digital Collectibles — permanently on the blockchain. Creator memberships are verified via signed wallet authentication.',
  },
  {
    q: 'Is there a free tier?',
    a: 'The public gallery is accessible to anyone without a membership. Private sales, early access to Digital Art drops, and advisory services require a paid tier.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Monthly members can cancel any time and retain access until the end of their billing period. Annual members can cancel renewal at any time but are not eligible for mid-period refunds.',
  },
  {
    q: 'Are there institutional or gallery-level tiers?',
    a: 'Yes. Gallery and institutional partners can apply for a custom enterprise tier that includes white-label options, API access, and dedicated support. Email jorge@bitbasel.miami to inquire.',
  },
];

const JoinFlowSection = observer(function JoinFlowSection() {
  const walletStore = useWalletStore();
  const searchParams = useSearchParams();
  const defaultTier = (searchParams.get('tier') as BitBaselTierKey | null) ?? 'creator';

  const btcAddress = walletStore.walletInfo?.address ?? null;
  const evmAddress = walletStore.evmWalletInfo?.address ?? null;
  const walletAddress = btcAddress ?? evmAddress;
  const evmProvider = walletStore.evmProvider;

  if (!walletAddress) {
    return (
      <div className="membership-join-prompt">
        <p className="membership-join-prompt-text">
          Connect your wallet above to join. Accepted: USDC · ETH · BTC · SOL
        </p>
      </div>
    );
  }

  return (
    <div className="membership-join-flow-wrapper">
      <MembershipJoinFlow
        walletAddress={walletAddress}
        evmProvider={evmProvider}
        defaultTier={defaultTier}
      />
    </div>
  );
});

export default function MembershipPage() {
  return (
    <>
      <Navigation />

      <main>
        {/* Page Header */}
        <section className="membership-page-hero">
          <div className="container">
            <p className="membership-eyebrow">BitBasel Private Membership</p>
            <h1 className="membership-page-title">
              The future of Digital Art
              <br />
              and Fine Arts belongs
              <br />
              to those who own it.
            </h1>
            <p className="membership-page-lead">
              Two tiers. One ecosystem. Built for creators defining the next generation of Digital
              Art and the collectors who acquire it — across Digital Collectibles and institutional
              physical works.
            </p>
          </div>
        </section>

        {/* Tier Cards */}
        <div className="container">
          <MembershipTiers showHeadline={false} />
        </div>

        {/* Join Flow */}
        <section className="membership-join-section">
          <div className="container">
            <h2 className="membership-matrix-title">Join now</h2>
            <Suspense fallback={<div className="gated-loading" aria-busy="true" />}>
              <JoinFlowSection />
            </Suspense>
          </div>
        </section>

        {/* Feature Matrix */}
        <section className="membership-matrix-section">
          <div className="container">
            <h2 className="membership-matrix-title">Full comparison</h2>
            <div className="membership-matrix">
              <div className="membership-matrix-header">
                <div className="membership-matrix-label-col" />
                <div className="membership-matrix-tier-col">
                  <span>Creator</span>
                  <span className="membership-matrix-price-tag">$49/mo</span>
                </div>
                <div className="membership-matrix-tier-col membership-matrix-tier-col-featured">
                  <span>Collector</span>
                  <span className="membership-matrix-price-tag">$490/yr</span>
                </div>
              </div>

              {FEATURE_ROWS.map((section) => (
                <div key={section.category} className="membership-matrix-category">
                  <div className="membership-matrix-category-label">{section.category}</div>
                  {section.features.map((row) => (
                    <div key={row.name} className="membership-matrix-row">
                      <div className="membership-matrix-feature-name">{row.name}</div>
                      <div className="membership-matrix-cell">{row.creator}</div>
                      <div className="membership-matrix-cell membership-matrix-cell-featured">
                        {row.collector}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="membership-how-section">
          <div className="container">
            <h2 className="membership-how-title">How it works</h2>
            <div className="membership-how-grid">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="membership-how-step">
                  <span className="membership-how-step-number">{step.step}</span>
                  <h3 className="membership-how-step-title">{step.title}</h3>
                  <p className="membership-how-step-body">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="membership-faq-section">
          <div className="container">
            <h2 className="membership-faq-title">Frequently asked</h2>
            <div className="membership-faq-grid">
              {FAQS.map((faq) => (
                <div key={faq.q} className="membership-faq-item">
                  <h3 className="membership-faq-q">{faq.q}</h3>
                  <p className="membership-faq-a">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="membership-final-cta">
          <div className="container">
            <h2 className="membership-final-title">Ready to join?</h2>
            <p className="membership-final-body">
              Connect your wallet and choose your membership. The intersection of Digital Art and
              Fine Arts is open — for those who are serious about ownership.
            </p>
            <div className="membership-final-actions">
              <Link href="/membership?tier=creator" className="btn-primary">
                Join as Creator — $49/mo
              </Link>
              <Link href="/membership?tier=collector" className="btn-outline">
                Join as Collector — $490/yr
              </Link>
            </div>
            <p className="membership-final-note">
              Creator billed monthly · Collector billed annually · USDC · ETH · BTC · SOL
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
