'use client';

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useMarketplaceStore } from '@/store/StoreProvider';
import OrdinalCard from './OrdinalCard';
import CollectionCard from './CollectionCard';
import { Ordinal, Collection } from '@/types/ordinals';

interface MarketplaceGridProps {
  type: 'ordinals' | 'collections';
  featured?: boolean;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = observer(
  ({ type, featured = false }) => {
    const marketplaceStore = useMarketplaceStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
      if (type === 'ordinals') {
        marketplaceStore.fetchOrdinals();
      } else {
        marketplaceStore.fetchCollections();
      }
    }, [type, marketplaceStore]);

    const handleOrdinalClick = (ordinal: Ordinal) => {
      marketplaceStore.selectOrdinal(ordinal);
    };

    const handleCollectionClick = (_collection: Collection) => {
      // navigation to collection detail page is handled at the route level
    };

    const getDisplayItems = () => {
      if (type === 'ordinals') {
        const items = featured
          ? marketplaceStore.listedOrdinals.slice(0, 8)
          : marketplaceStore.filteredOrdinals;
        return items;
      } else {
        const items = featured
          ? marketplaceStore.featuredCollections.slice(0, 6)
          : marketplaceStore.collections;
        return items;
      }
    };

    const renderFilters = () => {
      if (featured) return null;

      return (
        <div className="marketplace-filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={marketplaceStore.searchQuery}
              onChange={(e) => marketplaceStore.setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={marketplaceStore.sortBy}
              onChange={(e) => marketplaceStore.setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price">Price: High to Low</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰ List
            </button>
          </div>
        </div>
      );
    };

    const renderContent = () => {
      const items = getDisplayItems();

      if (marketplaceStore.loading) {
        return (
          <div className="loading-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="loading-card">
                <div className="loading-image"></div>
                <div className="loading-info">
                  <div className="loading-line"></div>
                  <div className="loading-line short"></div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (marketplaceStore.error) {
        return (
          <div className="error-state">
            <h3>Error loading {type}</h3>
            <p>{marketplaceStore.error}</p>
            <button
              className="btn-primary"
              onClick={() => {
                marketplaceStore.clearError();
                if (type === 'ordinals') {
                  marketplaceStore.fetchOrdinals();
                } else {
                  marketplaceStore.fetchCollections();
                }
              }}
            >
              Try Again
            </button>
          </div>
        );
      }

      if (items.length === 0) {
        return (
          <div className="empty-state">
            <h3>No {type} found</h3>
            <p>
              {marketplaceStore.searchQuery
                ? `No results for "${marketplaceStore.searchQuery}"`
                : `No ${type} available at the moment`}
            </p>
          </div>
        );
      }

      return (
        <div className={`marketplace-grid ${viewMode}`}>
          {type === 'ordinals'
            ? (items as Ordinal[]).map((ordinal) => (
                <OrdinalCard key={ordinal.id} ordinal={ordinal} onClick={handleOrdinalClick} />
              ))
            : (items as Collection[]).map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onClick={handleCollectionClick}
                />
              ))}
        </div>
      );
    };

    return (
      <div className="marketplace-section">
        {!featured && (
          <div className="section-header">
            <h2 className="text-heading-2">
              {type === 'ordinals' ? 'Bitcoin Ordinals' : 'Collections'}
            </h2>
            <div className="section-stats">
              <span className="stat">
                {getDisplayItems().length} {type === 'ordinals' ? 'inscriptions' : 'collections'}
              </span>
              {marketplaceStore.stats && (
                <span className="stat">
                  Total Value: {marketplaceStore.stats.totalVolume.toFixed(3)} BTC
                </span>
              )}
            </div>
          </div>
        )}

        {renderFilters()}
        {renderContent()}

        {!featured && getDisplayItems().length > 0 && (
          <div className="pagination">
            <button className="btn-outline">Load More</button>
          </div>
        )}
      </div>
    );
  }
);

export default MarketplaceGrid;
