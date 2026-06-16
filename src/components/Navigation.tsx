'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { useWalletStore } from '@/store/StoreProvider';
import WalletConnect from './WalletConnect';

export const Navigation: React.FC = observer(() => {
  const walletStore = useWalletStore();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link href="/" className="nav-logo">
            BitBasel
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            <Link href="/membership" className="nav-link nav-link-membership">
              Membership
            </Link>
            <Link href="/collections" className="nav-link">
              Exhibitions
            </Link>
            <Link href="/artists" className="nav-link">
              Artists
            </Link>
            <Link href="/marketplace" className="nav-link">
              Gallery
            </Link>
            <Link href="/artworks" className="nav-link">
              Acquire
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>

            <div className="wallet-section">
              {walletStore.isConnected ? (
                <WalletConnect />
              ) : (
                <button
                  className="btn-primary connect-wallet-btn"
                  onClick={() => setShowWalletModal(true)}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mobile-nav">
            <Link href="/membership" className="nav-link mobile-link nav-link-membership">
              Membership
            </Link>
            <Link href="/collections" className="nav-link mobile-link">
              Exhibitions
            </Link>
            <Link href="/artists" className="nav-link mobile-link">
              Artists
            </Link>
            <Link href="/marketplace" className="nav-link mobile-link">
              Gallery
            </Link>
            <Link href="/artworks" className="nav-link mobile-link">
              Acquire
            </Link>
            <Link href="/about" className="nav-link mobile-link">
              About
            </Link>

            <div className="mobile-wallet-section">
              {walletStore.isConnected ? (
                <WalletConnect />
              ) : (
                <button
                  className="btn-primary connect-wallet-btn mobile-wallet-btn"
                  onClick={() => {
                    setShowWalletModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}

        {/* Wallet Modal */}
        {showWalletModal && (
          <WalletConnect showModal={true} onClose={() => setShowWalletModal(false)} />
        )}
      </div>
    </nav>
  );
});

export default Navigation;
