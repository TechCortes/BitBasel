'use client';

import React from 'react';
import Image from 'next/image';
import { Ordinal } from '@/types/ordinals';
import { GatedContent } from '@/components/membership/GatedContent';

interface OrdinalCardProps {
  ordinal: Ordinal;
  onClick?: (ordinal: Ordinal) => void;
}

export const OrdinalCard: React.FC<OrdinalCardProps> = ({ ordinal, onClick }) => {
  const handleClick = () => {
    onClick?.(ordinal);
  };

  const formatPrice = (price?: number, unit?: string) => {
    if (!price) return 'Not Listed';

    switch (unit) {
      case 'btc':
        return `${price} BTC`;
      case 'ckbtc':
        return `${price} ckBTC`;
      case 'sats':
        return `${price.toLocaleString()} sats`;
      default:
        return `${price} ${unit || 'sats'}`;
    }
  };

  const getMediaContent = () => {
    // Use crypto-themed placeholders based on collection or content
    if (ordinal.collection) {
      if (
        ordinal.collection.toLowerCase().includes('ethereum') ||
        ordinal.metaTitle?.toLowerCase().includes('ethereum') ||
        ordinal.metaDescription?.toLowerCase().includes('ethereum')
      ) {
        return '/images/placeholder-ethereum-art.svg';
      }
      if (
        ordinal.collection.toLowerCase().includes('bitcoin') ||
        ordinal.metaTitle?.toLowerCase().includes('bitcoin') ||
        ordinal.metaDescription?.toLowerCase().includes('bitcoin')
      ) {
        return '/images/placeholder-bitcoin-art.svg';
      }
    }
    // Default to general crypto art
    return '/images/placeholder-crypto-art.svg';
  };

  return (
    <div className="ordinal-card" onClick={handleClick}>
      <div className="ordinal-image-container">
        <Image
          src={getMediaContent()}
          alt={ordinal.metaTitle || `Inscription #${ordinal.inscriptionNumber}`}
          width={300}
          height={300}
          className="ordinal-image"
          onError={(e) => {
            // Fallback to general crypto art placeholder on error
            (e.target as HTMLImageElement).src = '/images/placeholder-crypto-art.svg';
          }}
        />
        {ordinal.mediaType && (
          <div className="media-type-badge">{ordinal.mediaType.split('/')[0]}</div>
        )}
      </div>

      <div className="ordinal-info">
        <h3 className="ordinal-title">
          {ordinal.metaTitle || `Inscription #${ordinal.inscriptionNumber}`}
        </h3>

        <div className="ordinal-meta">
          <span className="ordinal-number">#{ordinal.inscriptionNumber}</span>
          <span className={`ordinal-status ${ordinal.listed ? 'listed' : 'unlisted'}`}>
            {ordinal.listed ? '🏷️ Listed' : '🔒 Unlisted'}
          </span>
        </div>

        {ordinal.listed && (
          <GatedContent
            requiredTier="creator"
            fallback={
              <div className="price-display price-display-gated">
                <span className="price-amount price-gated-label">Members only</span>
              </div>
            }
          >
            <div className="price-display">
              <span className="price-amount">{formatPrice(ordinal.price, ordinal.priceUnit)}</span>
            </div>
          </GatedContent>
        )}

        {ordinal.collection && (
          <a
            href={`/collection/${ordinal.collection}`}
            className="ordinal-collection"
            onClick={(e) => e.stopPropagation()}
          >
            📁 {ordinal.collection}
          </a>
        )}

        <div className="ordinal-details">
          <div className="detail-item">
            <span className="detail-label">Size:</span>
            <span className="detail-value">{(ordinal.mediaSize / 1024).toFixed(1)}kb</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">SAT:</span>
            <span className="detail-value">{ordinal.sat.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdinalCard;
