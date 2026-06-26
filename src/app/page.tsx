'use client';

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MembershipTiers from '@/components/MembershipTiers';

type InviteStatus = 'idle' | 'loading' | 'success' | 'error';

function GetInviteForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<InviteStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/luma/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: email, tier_key: 'community' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
      } else {
        setStatus('success');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  if (status === 'success') {
    return <p className="newsletter-success">You&apos;re on the list. Check your email.</p>;
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        className="newsletter-input"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
      />
      <button type="submit" className="btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? 'Requesting...' : 'Request Access'}
      </button>
      {status === 'error' && <p className="newsletter-error">{errorMessage}</p>}
    </form>
  );
}

const HomePage: React.FC = observer(() => {
  return (
    <>
      <Navigation />

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container" style={{ width: '100%' }}>
            <p className="hero-eyebrow">BitBasel — Private Membership</p>
            <h1 className="hero-title">
              Where Art &amp; Culture
              <br />
              Meet Web3 and Capital.
            </h1>
            <p className="hero-description">
              An invitation-only platform for artists, collectors, founders, and investors. Private
              gatherings, exclusive access, and one landmark event every December in Miami.
            </p>
            <div className="hero-actions">
              <Link href="/membership?tier=creator" className="btn-primary hero-btn">
                Join as Creator&nbsp;&mdash;&nbsp;$49/mo
              </Link>
              <Link href="/membership?tier=collector" className="btn-outline hero-btn">
                Join as Collector&nbsp;&mdash;&nbsp;$490/yr
              </Link>
            </div>
          </div>
          <div className="hero-scroll">
            <span className="hero-scroll-line" />
          </div>
        </section>

        {/* Open Wallet Standard */}
        <section className="standards-strip">
          <div className="container">
            <div className="standards-inner">
              <span className="standards-eyebrow">Open Wallet Standard</span>
              <a
                href="https://openwallet.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="standards-logo-link"
                aria-label="Open Wallet Standard"
              >
                <img
                  src="/logos/ows-icon.png"
                  alt="Open Wallet Standard"
                  className="standards-logo"
                />
                <span className="standards-wordmark">Open Wallet Standard</span>
              </a>
              <p className="standards-desc">
                BitBasel supports the Open Wallet Standard — an open-source protocol for secure,
                policy-gated, multi-chain wallet management across Bitcoin, EVM, Solana, and more.
              </p>
            </div>
          </div>
        </section>

        {/* Authority Strip */}
        <section className="authority-strip">
          <div className="container">
            <div className="authority-strip-grid">
              <div className="authority-item">
                <span className="authority-value">Est. 2020</span>
                <span className="authority-label">Founded in Miami</span>
              </div>
              <div className="authority-item">
                <span className="authority-value">6.5 Years</span>
                <span className="authority-label">Blockchain for the Arts</span>
              </div>
              <div className="authority-item">
                <span className="authority-value">Millions</span>
                <span className="authority-label">Artists Onboarded</span>
              </div>
              <div className="authority-item">
                <span className="authority-value">Art · Tech · Web3</span>
                <span className="authority-label">The Intersection</span>
              </div>
            </div>
          </div>
        </section>

        {/* Annual Event */}
        <section className="annual-section">
          <div className="container">
            <p className="annual-label">The BitBasel Annual · Miami</p>
            <h2 className="annual-title">Official BitBasel Day, December 4th.</h2>
            <p className="annual-description">
              The City of Miami Beach declared December 4th as the official BitBasel Day after our
              impact and annual event bringing together +5,000 artists, collectors, founders,
              investors, and cultural leaders for five days at the intersection of art, Web3, and
              capital. Our gathering is part of art week in Miami which is also the premier event in
              the Western Hemisphere for those shaping the future of culture.
            </p>
            <div className="annual-stats">
              <div className="annual-stat">
                <span className="annual-stat-number">5,000</span>
                <span className="annual-stat-label">Attendees</span>
              </div>
              <div className="annual-stat">
                <span className="annual-stat-number">5</span>
                <span className="annual-stat-label">Days</span>
              </div>
              <div className="annual-stat">
                <span className="annual-stat-number">1st Week</span>
                <span className="annual-stat-label">of December</span>
              </div>
              <div className="annual-stat">
                <span className="annual-stat-number">Miami</span>
                <span className="annual-stat-label">Florida</span>
              </div>
            </div>
            <Link href="/membership" className="btn-primary">
              Secure Member Access
            </Link>
          </div>
        </section>

        {/* IRL Gatherings */}
        <section className="irl-section">
          <div className="container">
            <p className="section-label">Year-Round</p>
            <h2 className="text-heading-2">Private Gatherings</h2>
            <p className="section-subtitle">
              Membership opens access to an ongoing calendar of exclusive events not available to
              the public.
            </p>
            <div className="irl-grid">
              <div className="irl-card">
                <span className="irl-card-icon" />
                <h3 className="irl-card-title">Private Dinners</h3>
                <p className="irl-card-body">
                  Intimate curator-led dinners connecting artists, collectors, and gallery
                  directors. Off the record. High signal.
                </p>
              </div>
              <div className="irl-card">
                <span className="irl-card-icon" />
                <h3 className="irl-card-title">Investor Roundtables</h3>
                <p className="irl-card-body">
                  Closed-door sessions with founders, family offices, and investors at the
                  intersection of art and capital.
                </p>
              </div>
              <div className="irl-card">
                <span className="irl-card-icon" />
                <h3 className="irl-card-title">Studio &amp; Preview Access</h3>
                <p className="irl-card-body">
                  Exclusive studio visits, early acquisition previews, and curator tours before
                  works reach the open market.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who Joins */}
        <section className="who-section">
          <div className="container">
            <p className="section-label">The Room</p>
            <h2 className="text-heading-2">Who Joins BitBasel</h2>
            <div className="who-grid">
              <div className="who-card">
                <h3 className="who-card-title">Artists &amp; Creators</h3>
                <p className="who-card-body">
                  Access to collectors, institutional buyers, and international exhibition
                  opportunities.
                </p>
              </div>
              <div className="who-card">
                <h3 className="who-card-title">Collectors</h3>
                <p className="who-card-body">
                  Early acquisition access, curated introductions, and a private network of peers.
                </p>
              </div>
              <div className="who-card">
                <h3 className="who-card-title">Founders &amp; Investors</h3>
                <p className="who-card-body">
                  Capital meets culture. Deal flow, co-investment, and strategic partnerships with
                  creative leaders.
                </p>
              </div>
              <div className="who-card">
                <h3 className="who-card-title">Cultural Leaders</h3>
                <p className="who-card-body">
                  Museum directors, curators, brand executives, and media shaping the future of art.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Authority & Credentials */}
        <section className="credentials-section">
          <div className="container">
            <div className="credentials-grid">
              <div>
                <p className="credentials-label">About BitBasel</p>
                <p className="credentials-statement">
                  The leading authority at the intersection of Art, Technology, and Web3 — for over
                  six years, trusted by millions of artists and creative industries worldwide.
                </p>
              </div>
              <div className="credentials-list">
                <div className="credential-item">
                  <p className="credential-title">Est. 2020 — Born in Miami</p>
                  <p className="credential-body">
                    Founded at the convergence of Art Basel and the emergence of Bitcoin culture.
                    BitBasel pioneered the integration of blockchain infrastructure into the
                    creative industries before it became a movement.
                  </p>
                </div>
                <div className="credential-item">
                  <p className="credential-title">6.5 Years of Blockchain Expertise</p>
                  <p className="credential-body">
                    A proven track record advising artists, galleries, institutions, and creative
                    enterprises on adopting Web3 — building the infrastructure of cultural ownership
                    long before it was mainstream.
                  </p>
                </div>
                <div className="credential-item">
                  <p className="credential-title">Millions of Artists Onboarded</p>
                  <p className="credential-body">
                    The most trusted platform for introducing the creative industries to digital
                    ownership, on-chain provenance, and the future of cultural capital. Artists,
                    studios, and institutions rely on BitBasel as their bridge to Web3.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="membership-home-section">
          <div className="container">
            <MembershipTiers />
          </div>
        </section>

        {/* Newsletter */}
        <section className="newsletter-section">
          <div className="container">
            <div className="newsletter-content">
              <h2 className="text-heading-2">Get the Invite</h2>
              <p>
                Private event notices, early access invitations, and member-only announcements —
                before the public.
              </p>
              <GetInviteForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
});

export default HomePage;
