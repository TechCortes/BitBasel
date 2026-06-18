'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MembershipTiers from '@/components/MembershipTiers';

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
              Meet Capital.
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
                Join as Collector&nbsp;&mdash;&nbsp;$490/mo
              </Link>
            </div>
          </div>
          <div className="hero-scroll">
            <span className="hero-scroll-line" />
          </div>
        </section>

        {/* Annual Event */}
        <section className="annual-section">
          <div className="container">
            <p className="annual-label">The BitBasel Annual · Miami</p>
            <h2 className="annual-title">December, Every Year.</h2>
            <p className="annual-description">
              5,000 artists, collectors, founders, investors, and cultural leaders — five days at
              the intersection of art, innovation, and capital. The premier gathering in the Western
              Hemisphere for those shaping the future of culture.
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
                <span className="annual-stat-number">Week&nbsp;1</span>
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
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="btn-primary">
                  Request Access
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
});

export default HomePage;
