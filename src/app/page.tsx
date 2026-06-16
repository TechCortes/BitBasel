'use client';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MarketplaceGrid from '@/components/MarketplaceGrid';
import MembershipTiers from '@/components/MembershipTiers';
import { useMarketplaceStore, usePhysicalStore } from '@/store/StoreProvider';

const HomePage: React.FC = observer(() => {
  const marketplaceStore = useMarketplaceStore();
  const physicalStore = usePhysicalStore();

  useEffect(() => {
    marketplaceStore.fetchStats();
    marketplaceStore.fetchPriceData();
    physicalStore.loadData();
  }, [marketplaceStore, physicalStore]);

  return (
    <>
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <p className="hero-eyebrow">BitBasel — Private Membership</p>
            <h1 className="hero-title">
              The future of art and
              <br />
              Web3 belongs to
              <br />
              those who own it.
            </h1>
            <p className="hero-description">
              Two private tiers. Built for creators and collectors at the intersection of Bitcoin
              Ordinals and institutional fine art.
            </p>
            <div className="hero-actions">
              <Link href="/membership?tier=creator" className="btn-primary hero-btn">
                Join as Creator&nbsp;&mdash;&nbsp;$49/mo
              </Link>
              <Link href="/membership?tier=collector" className="btn-outline hero-btn">
                Join as Collector&nbsp;&mdash;&nbsp;$99/mo
              </Link>
            </div>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="membership-home-section">
          <div className="container">
            <MembershipTiers />
          </div>
        </section>

        {/* Featured Collections */}
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="text-heading-2">Dynamic Collections</h2>
              <p className="section-subtitle">
                Smart contract-powered exhibitions featuring Bitcoin Ordinals and evolving NFT
                masterpieces
              </p>
            </div>
            <MarketplaceGrid type="collections" featured={true} />
            <div className="section-footer">
              <button className="btn-outline">Browse All Exhibitions</button>
            </div>
          </div>
        </section>

        {/* Latest Inscriptions */}
        <section className="latest-section">
          <div className="container">
            <div className="section-header">
              <h2 className="text-heading-2">Live Ordinals</h2>
              <p className="section-subtitle">
                Latest Bitcoin inscriptions with smart contract integration and community curation
              </p>
            </div>
            <MarketplaceGrid type="ordinals" featured={true} />
            <div className="section-footer">
              <button className="btn-outline">Browse Gallery</button>
            </div>
          </div>
        </section>

        {/* Physical Art — Acquire */}
        <section className="phys-home-section">
          <div className="phys-container">
            <div className="phys-home-header">
              <div>
                <p className="phys-home-label">BitBasel Gallery · Miami</p>
                <h2 className="phys-home-title">Physical Works</h2>
              </div>
              <Link href="/artworks" className="phys-home-link">
                View all works →
              </Link>
            </div>

            {physicalStore.loading ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--phys-gray-400)' }}>
                Loading…
              </div>
            ) : (
              <div className="phys-home-grid">
                {/* Featured — first available work */}
                {physicalStore.artworks
                  .filter((a) => a.availability === 'available')
                  .slice(0, 1)
                  .map((artwork) => {
                    const artist = physicalStore.getArtistById(artwork.artistId);
                    return (
                      <Link
                        key={artwork.id}
                        href={`/artworks/${artwork.id}`}
                        className="phys-home-featured"
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="phys-home-card-img">
                          {artwork.images[0] ? (
                            <img src={artwork.images[0]} alt={artwork.title} />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                background: 'var(--phys-gray-100)',
                              }}
                            />
                          )}
                        </div>
                        <div className="phys-home-card-info">
                          <p className="phys-home-card-title">{artwork.title}</p>
                          {artist && (
                            <p className="phys-home-card-artist">
                              {artist.name} · {artwork.year}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}

                {/* Secondary — next two works */}
                {physicalStore.artworks
                  .filter((a) => a.availability === 'available')
                  .slice(1, 3)
                  .map((artwork) => {
                    const artist = physicalStore.getArtistById(artwork.artistId);
                    return (
                      <Link
                        key={artwork.id}
                        href={`/artworks/${artwork.id}`}
                        className="phys-home-secondary"
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="phys-home-card-img">
                          {artwork.images[0] ? (
                            <img src={artwork.images[0]} alt={artwork.title} />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                background: 'var(--phys-gray-100)',
                              }}
                            />
                          )}
                        </div>
                        <div className="phys-home-card-info">
                          <p className="phys-home-card-title">{artwork.title}</p>
                          {artist && (
                            <p className="phys-home-card-artist">
                              {artist.name} · {artwork.year}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="newsletter-section">
          <div className="container">
            <div className="newsletter-content">
              <h2 className="text-heading-2">Stay Informed</h2>
              <p>
                Private drops, new acquisitions, and collector events — delivered to you before the
                public.
              </p>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="btn-primary">
                  Subscribe
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
