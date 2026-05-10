'use client';

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { PhysicalArtwork, PhysicalArtist } from '@/types/physicalArt';
import DimensionsToggle from './DimensionsToggle';
import ProvenanceTimeline from './ProvenanceTimeline';
import InquireModal from './InquireModal';

interface Props {
  artwork: PhysicalArtwork;
  artist: PhysicalArtist;
}

function formatPrice(artwork: PhysicalArtwork): string {
  if (artwork.availability === 'sold') return 'Sold';
  if (artwork.availability === 'reserved') return 'Reserved';
  if (artwork.price === 'POA') return 'Price on Application';
  return `${artwork.currency} ${artwork.price.toLocaleString()}`;
}

function priceClass(artwork: PhysicalArtwork): string {
  if (artwork.availability === 'sold') return 'phys-wall-label-price sold';
  if (artwork.availability === 'reserved') return 'phys-wall-label-price reserved';
  return 'phys-wall-label-price';
}

export const ArtworkDetail: React.FC<Props> = observer(({ artwork, artist }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [showInquire, setShowInquire] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('details');

  function toggleSection(key: string) {
    setOpenSection((prev) => (prev === key ? null : key));
  }

  const canInquire = artwork.availability === 'available';

  return (
    <>
      <div className="phys-detail-layout">
        {/* Image column */}
        <div className="phys-detail-image-area">
          <div className="phys-detail-main-image">
            {artwork.images[activeImage] ? (
              <img src={artwork.images[activeImage]} alt={artwork.title} />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--phys-gray-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--phys-gray-300)"
                  strokeWidth="1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="1" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}
          </div>
          {artwork.images.length > 1 && (
            <div className="phys-detail-thumbnails">
              {artwork.images.map((img, i) => (
                <button
                  key={i}
                  className={`phys-detail-thumb${i === activeImage ? ' active' : ''}`}
                  onClick={() => setActiveImage(i)}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Wall label column */}
        <div className="phys-wall-label">
          <Link href={`/artists/${artist.id}`} style={{ textDecoration: 'none' }}>
            <h1 className="phys-wall-label-artist">{artist.name}</h1>
          </Link>
          <p className="phys-wall-label-title">{artwork.title}</p>

          <div className="phys-wall-label-meta">
            <span>{artwork.year}</span>
            <span>{artwork.medium}</span>
            <span>
              <DimensionsToggle dimensions={artwork.dimensions} />
            </span>
            {artwork.edition && <span className="phys-wall-label-edition">{artwork.edition}</span>}
          </div>

          <div className={priceClass(artwork)}>{formatPrice(artwork)}</div>

          <div className="phys-badge" style={{ marginBottom: '1rem' }}>
            <span className={`phys-badge-dot ${artwork.availability}`} />
            {artwork.availability === 'available'
              ? 'Available'
              : artwork.availability === 'reserved'
                ? 'Reserved'
                : 'Sold'}
          </div>

          {canInquire && (
            <>
              <button className="phys-inquire-btn" onClick={() => setShowInquire(true)}>
                Inquire
              </button>
              <p className="phys-shipping-note">
                Worldwide shipping · Condition report available on request
              </p>
            </>
          )}

          {/* Accordion */}
          <div className="phys-accordion">
            {artwork.curatorNote && (
              <div className="phys-accordion-item">
                <button className="phys-accordion-trigger" onClick={() => toggleSection('curator')}>
                  Curator's Note
                  <span className="phys-accordion-icon">
                    {openSection === 'curator' ? '−' : '+'}
                  </span>
                </button>
                {openSection === 'curator' && (
                  <div className="phys-accordion-content">{artwork.curatorNote}</div>
                )}
              </div>
            )}

            <div className="phys-accordion-item">
              <button className="phys-accordion-trigger" onClick={() => toggleSection('details')}>
                Work Details
                <span className="phys-accordion-icon">{openSection === 'details' ? '−' : '+'}</span>
              </button>
              {openSection === 'details' && (
                <div className="phys-accordion-content">
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem 1.5rem',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '0.6875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--phys-gray-400)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Condition
                      </p>
                      <p>{artwork.condition}</p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '0.6875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--phys-gray-400)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Framed
                      </p>
                      <p>{artwork.framed ? 'Yes' : 'Unframed'}</p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '0.6875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--phys-gray-400)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Certificate
                      </p>
                      <p>{artwork.certificateOfAuthenticity ? 'Included' : 'Not provided'}</p>
                    </div>
                    {artwork.edition && (
                      <div>
                        <p
                          style={{
                            fontSize: '0.6875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--phys-gray-400)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          Edition
                        </p>
                        <p>{artwork.edition}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="phys-accordion-item">
              <button
                className="phys-accordion-trigger"
                onClick={() => toggleSection('provenance')}
              >
                Provenance & Exhibition History
                <span className="phys-accordion-icon">
                  {openSection === 'provenance' ? '−' : '+'}
                </span>
              </button>
              {openSection === 'provenance' && (
                <div className="phys-accordion-content">
                  <ProvenanceTimeline
                    provenance={artwork.provenance}
                    exhibitions={artwork.exhibitionHistory}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showInquire && (
        <InquireModal
          artworkId={artwork.id}
          artworkTitle={artwork.title}
          onClose={() => setShowInquire(false)}
        />
      )}
    </>
  );
});

export default ArtworkDetail;
