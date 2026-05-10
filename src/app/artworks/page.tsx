'use client';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ArtworkCard from '@/components/physical/ArtworkCard';
import ArtworkFilter from '@/components/physical/ArtworkFilter';
import { usePhysicalStore } from '@/store/StoreProvider';

const ArtworksPage: React.FC = observer(() => {
  const store = usePhysicalStore();

  useEffect(() => {
    store.loadData();
  }, [store]);

  const artworks = store.filteredArtworks;
  const availableCount = store.artworks.filter((a) => a.availability === 'available').length;

  return (
    <>
      <Navigation />
      <div className="phys-section">
        <div className="phys-container">
          <header className="phys-page-header">
            <p className="phys-page-subtitle">BitBasel Gallery · Miami</p>
            <h1 className="phys-page-title">Acquire</h1>
            {!store.loading && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--phys-gray-400)',
                  marginTop: '0.75rem',
                }}
              >
                {availableCount} work{availableCount !== 1 ? 's' : ''} available
              </p>
            )}
          </header>

          <div className="phys-grid-layout">
            <ArtworkFilter />

            <main>
              {store.loading ? (
                <div
                  style={{ padding: '4rem', textAlign: 'center', color: 'var(--phys-gray-400)' }}
                >
                  Loading…
                </div>
              ) : (
                <div className="phys-artwork-grid">
                  {artworks.length === 0 ? (
                    <p className="phys-no-results">No works match the current filters.</p>
                  ) : (
                    artworks.map((artwork) => (
                      <ArtworkCard
                        key={artwork.id}
                        artwork={artwork}
                        artist={store.getArtistById(artwork.artistId)}
                      />
                    ))
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
});

export default ArtworksPage;
