'use client';

import React from 'react';
import Link from 'next/link';
import { PhysicalArtwork, PhysicalArtist } from '@/types/physicalArt';

interface Props {
  artwork: PhysicalArtwork;
  artist?: PhysicalArtist;
}

function formatPrice(artwork: PhysicalArtwork): string {
  if (artwork.availability === 'sold') return 'Sold';
  if (artwork.price === 'POA') return 'Price on Application';
  return `${artwork.currency} ${artwork.price.toLocaleString()}`;
}

export const ArtworkCard: React.FC<Props> = ({ artwork, artist }) => {
  return (
    <Link
      href={`/artworks/${artwork.id}`}
      className="phys-artwork-card"
      style={{ textDecoration: 'none' }}
    >
      <div className="phys-card-image">
        {artwork.images[0] ? (
          <img src={artwork.images[0]} alt={artwork.title} loading="lazy" />
        ) : (
          <div className="phys-card-image-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="1" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <span className={`phys-availability-dot ${artwork.availability}`} aria-hidden="true" />
      </div>

      <div className="phys-card-body">
        <p className="phys-card-title">{artwork.title}</p>
        {artist && <p className="phys-card-artist">{artist.name}</p>}
        <p className="phys-card-meta">
          {artwork.year}
          <br />
          {artwork.medium}
          <br />
          {artwork.dimensions.height} × {artwork.dimensions.width}
          {artwork.dimensions.depth ? ` × ${artwork.dimensions.depth}` : ''}{' '}
          {artwork.dimensions.unit}
        </p>
        <p className={`phys-card-price${artwork.availability === 'sold' ? ' sold' : ''}`}>
          {formatPrice(artwork)}
        </p>
      </div>
    </Link>
  );
};

export default ArtworkCard;
