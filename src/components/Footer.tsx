'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <Image
              src="/images/logo.png"
              alt="BitBasel"
              width={120}
              height={30}
              className="footer-logo-img"
            />
            <p>
              A global cultural technology platform connecting art, innovation, and community
              through live events, digital infrastructure, and real-world activations.
            </p>
            <div className="social-links">
              <a
                href="https://www.linkedin.com/company/bitbasel"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/bitbasel"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://x.com/bitbasel"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
              <a
                href="https://linktr.ee/bitbasel"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Linktree
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Events</h3>
            <div className="footer-links">
              <Link href="/events" className="footer-link">
                Annual December Event
              </Link>
              <Link href="/events#gatherings" className="footer-link">
                Private Gatherings
              </Link>
              <Link href="/events#roundtables" className="footer-link">
                Investor Roundtables
              </Link>
              <Link href="/membership" className="footer-link">
                Apply for Access
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h3>Platform</h3>
            <div className="footer-links">
              <Link href="/artists" className="footer-link">
                Artists
              </Link>
              <a
                href="https://bitbasel.com"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                About BitBasel
              </a>
              <a href="mailto:info@bitbasel.miami" className="footer-link">
                Contact
              </a>
              <a
                href="https://bitbasel.miami"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                bitbasel.miami
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Membership</h3>
            <div className="footer-links">
              <Link href="/membership?tier=creator" className="footer-link">
                Creator Membership
              </Link>
              <Link href="/membership?tier=collector" className="footer-link">
                Collector Membership
              </Link>
              <Link href="/membership?tier=enterprise" className="footer-link">
                Gallery & Enterprise
              </Link>
              <Link href="/membership" className="footer-link">
                Compare Tiers
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2026 BitBasel. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="mailto:info@bitbasel.miami" className="footer-link">
                info@bitbasel.miami
              </a>
              <a
                href="https://bitbasel.miami/legals/privacy-policy"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <a
                href="https://bitbasel.miami/legals/terms"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </a>
              <a
                href="https://bitbasel.miami/contact"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
