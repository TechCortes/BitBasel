'use client';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MarketplaceGrid from '@/components/MarketplaceGrid';
import { useMarketplaceStore } from '@/store/StoreProvider';

const HomePage: React.FC = observer(() => {
  const marketplaceStore = useMarketplaceStore();

  useEffect(() => {
    // Fetch initial data
    marketplaceStore.fetchStats();
    marketplaceStore.fetchPriceData();
  }, [marketplaceStore]);

  return (
    <>
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">
              <span className="hero-highlight">Your City's Crypto Art Community</span>
            </h1>
            <p className="hero-description">
              Phenomenal marketplace combining Bitcoin Ordinals with smart contracts & dynamic NFTs
            </p>
            <button className="btn-primary hero-btn">View Gallery</button>
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

        {/* Newsletter Signup */}
        <section className="newsletter-section">
          <div className="container">
            <div className="newsletter-content">
              <h2 className="text-heading-2">Community Hub</h2>
              <p>
                Join your city's crypto art movement - get updates on dynamic NFT drops, smart
                contract launches & Ordinals events.
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
