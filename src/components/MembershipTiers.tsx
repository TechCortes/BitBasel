'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const CREATOR_BENEFITS = [
  'Unlimited Digital Collectibles & Digital Art listings',
  'Physical artwork consignment & inventory',
  'On-chain royalty enforcement on every secondary sale',
  'Blockchain certificate of authenticity',
  'Creator analytics dashboard',
  'Smart contract exhibition tools',
  'Monthly curator review — featured placement program',
  '2% platform fee (vs. industry standard 10–15%)',
  'Split payout management for collaborators',
  'Priority creator support',
];

const COLLECTOR_BENEFITS = [
  '48-hour early access to every new drop',
  'Private sale access & make-offer capabilities',
  'Personalized acquisition advisory (quarterly session)',
  'Curated collection feed tailored to your holdings',
  'VIP invitations — gallery events, art fairs, studio visits',
  'Collection portfolio dashboard with provenance tracking',
  'Digital Collectibles membership card — inscribed on-chain',
  'Blockchain-verified ownership history for all acquisitions',
  'Off-market access to consigned physical artworks',
  'Priority buyer support & concierge',
];

interface PricingProps {
  monthly: number;
  annual: number;
  isAnnual: boolean;
  paymentNote: string;
}

function Price({ monthly, annual, isAnnual, paymentNote }: PricingProps) {
  const displayed = isAnnual ? Math.round(annual / 12) : monthly;
  return (
    <div className="membership-price">
      <span className="membership-price-currency">$</span>
      <span className="membership-price-amount">{displayed}</span>
      <span className="membership-price-period">/mo</span>
      {isAnnual && (
        <p className="membership-price-billed">
          billed ${annual}/yr — save ${monthly * 12 - annual}
        </p>
      )}
      <p className="membership-price-payment">{paymentNote}</p>
    </div>
  );
}

interface MembershipTiersProps {
  showHeadline?: boolean;
}

export default function MembershipTiers({ showHeadline = true }: MembershipTiersProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="membership-section">
      {showHeadline && (
        <div className="membership-headline">
          <p className="membership-eyebrow">Private Membership</p>
          <h2 className="membership-title">Two tiers. One ecosystem.</h2>
          <p className="membership-subtitle">
            Built for the creators defining the future of Digital Art and the collectors who own it.
            Digital Collectibles and institutional Fine Arts — in a single platform.
          </p>
        </div>
      )}

      <div className="membership-toggle-row">
        <button
          className={`membership-toggle-btn${!isAnnual ? ' active' : ''}`}
          onClick={() => setIsAnnual(false)}
        >
          Monthly
        </button>
        <button
          className={`membership-toggle-btn${isAnnual ? ' active' : ''}`}
          onClick={() => setIsAnnual(true)}
        >
          Annual
          <span className="membership-toggle-save">Save up to $980</span>
        </button>
      </div>

      <div className="membership-grid">
        {/* Creator Tier */}
        <article className="membership-card">
          <div className="membership-card-header">
            <p className="membership-tier-label">For Artists & Galleries</p>
            <h3 className="membership-tier-name">Creator</h3>
            <Price monthly={49} annual={499} isAnnual={isAnnual} paymentNote="USDC · ETH · BTC" />
            <p className="membership-tier-pitch">
              List, sell, and earn royalties on Digital Collectibles and physical Fine Arts. Your
              work. Your rules. Enforced on-chain.
            </p>
          </div>

          <div className="membership-card-divider" />

          <ul className="membership-benefits">
            {CREATOR_BENEFITS.map((benefit) => (
              <li key={benefit} className="membership-benefit-item">
                <span className="membership-benefit-check">—</span>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="membership-card-footer">
            <Link href="/membership?tier=creator" className="membership-cta membership-cta-primary">
              Join as Creator — $49/mo
            </Link>
            <p className="membership-cta-note">No lock-in. Cancel any time.</p>
          </div>
        </article>

        {/* Collector Tier */}
        <article className="membership-card membership-card-featured">
          <div className="membership-featured-tag">Collectors</div>

          <div className="membership-card-header">
            <p className="membership-tier-label">For Patrons & Institutions</p>
            <h3 className="membership-tier-name">Collector</h3>
            <Price monthly={490} annual={4900} isAnnual={isAnnual} paymentNote="USDC · ETH · BTC" />
            <p className="membership-tier-pitch">
              First access, private sales, and advisory services for collectors who treat Digital
              Art and Fine Arts as legacy, not speculation.
            </p>
          </div>

          <div className="membership-card-divider" />

          <ul className="membership-benefits">
            {COLLECTOR_BENEFITS.map((benefit) => (
              <li key={benefit} className="membership-benefit-item">
                <span className="membership-benefit-check">—</span>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="membership-card-footer">
            <Link
              href="/membership?tier=collector"
              className="membership-cta membership-cta-inverse"
            >
              Join as Collector — $490/mo
            </Link>
            <p className="membership-cta-note">No lock-in. Cancel any time.</p>
          </div>
        </article>
      </div>

      <p className="membership-enterprise-note">
        Representing a gallery or institution?{' '}
        <Link href="/membership?tier=enterprise" className="membership-enterprise-link">
          Inquire about enterprise access →
        </Link>
      </p>
    </section>
  );
}
