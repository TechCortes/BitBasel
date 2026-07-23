'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import { useWalletStore } from '@/store/StoreProvider';
import WalletConnect from './WalletConnect';

export const Navigation: React.FC = observer(() => {
  const walletStore = useWalletStore();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <Link href="/" className="nav-logo">
              <Image
                src="/images/logo.png"
                alt="BitBasel"
                width={140}
                height={36}
                priority
                className="nav-logo-img"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-links desktop-nav">
              <Link href="/membership" className="nav-link nav-link-membership">
                Membership
              </Link>
              <a
                href="https://www.bitbasel.miami"
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Events
              </a>
              <Link href="/artists" className="nav-link">
                Artists
              </Link>
              <a
                href="https://www.bitbasel.miami"
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                About
              </a>
              <a
                href="https://www.artcube.xyz/"
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                ArtCube OS
              </a>

              <div className="wallet-section">
                {walletStore.isConnected || walletStore.isEVMConnected ? (
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
              <a
                href="https://www.bitbasel.miami"
                className="nav-link mobile-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Events
              </a>
              <Link href="/artists" className="nav-link mobile-link">
                Artists
              </Link>
              <a
                href="https://www.bitbasel.miami"
                className="nav-link mobile-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                About
              </a>
              <a
                href="https://www.artcube.xyz/"
                className="nav-link mobile-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                ArtCube OS
              </a>

              <div className="mobile-wallet-section">
                {walletStore.isConnected || walletStore.isEVMConnected ? (
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
        </div>
      </nav>

      {/* Modal rendered outside <nav> to escape backdrop-filter stacking context */}
      {showWalletModal && (
        <WalletConnect showModal={true} onClose={() => setShowWalletModal(false)} />
      )}
    </>
  );
});

export default Navigation;
