'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>BitBasel</h3>
            <p>
              Your city's institutional-grade marketplace for Bitcoin Ordinals and physical fine
              art. Discover, collect, and acquire works on the Bitcoin blockchain.
            </p>
            <div className="social-links">
              <a
                href={process.env.TWITTER_URL || '#'}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                🐦 Twitter
              </a>
              <a
                href={process.env.DISCORD_URL || '#'}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Discord
              </a>
              <a
                href={process.env.TELEGRAM_URL || '#'}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                📱 Telegram
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Marketplace</h3>
            <div className="footer-links">
              <Link href="/collections" className="footer-link">
                Featured Collections
              </Link>
              <Link href="/galleries" className="footer-link">
                Listed Galleries
              </Link>
              <Link href="/marketplace" className="footer-link">
                Browse Ordinals
              </Link>
              <Link href="/stats" className="footer-link">
                Market Stats
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h3>Resources</h3>
            <div className="footer-links">
              <Link href="/about" className="footer-link">
                About Bitcoin Ordinals
              </Link>
              <Link href="/guide" className="footer-link">
                How to Buy
              </Link>
              <Link href="/faq" className="footer-link">
                FAQ
              </Link>
              <Link href="/api" className="footer-link">
                API Documentation
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h3>Community</h3>
            <div className="footer-links">
              <Link href="/creators" className="footer-link">
                For Creators
              </Link>
              <Link href="/collectors" className="footer-link">
                For Collectors
              </Link>
              <Link href="/galleries" className="footer-link">
                Gallery Partnerships
              </Link>
              <Link href="/newsletter" className="footer-link">
                Newsletter
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2026 BitBasel. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link href="/privacy" className="footer-link">
                Privacy Policy
              </Link>
              <Link href="/terms" className="footer-link">
                Terms of Service
              </Link>
              <Link href="/contact" className="footer-link">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
