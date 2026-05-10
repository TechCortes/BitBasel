'use client';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ArtistCard from '@/components/physical/ArtistCard';
import { usePhysicalStore } from '@/store/StoreProvider';

const ArtistsPage: React.FC = observer(() => {
  const store = usePhysicalStore();

  useEffect(() => {
    store.loadData();
  }, [store]);

  return (
    <>
      <Navigation />
      <div className="phys-section">
        <div className="phys-container">
          <header className="phys-page-header">
            <p className="phys-page-subtitle">BitBasel Gallery · Represented Artists</p>
            <h1 className="phys-page-title">Artists</h1>
          </header>

          <main>
            {store.loading ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--phys-gray-400)' }}>
                Loading…
              </div>
            ) : (
              <div className="phys-artist-grid">
                {store.artists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    artworkCount={store.getArtworksByArtist(artist.id).length}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
});

export default ArtistsPage;
