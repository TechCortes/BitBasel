'use client';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ArtistProfile from '@/components/physical/ArtistProfile';
import { usePhysicalStore } from '@/store/StoreProvider';

interface Props {
  params: { id: string };
}

const ArtistPage: React.FC<Props> = observer(({ params }) => {
  const store = usePhysicalStore();

  useEffect(() => {
    store.loadData();
  }, [store]);

  if (store.loading) {
    return (
      <>
        <Navigation />
        <div
          className="phys-section"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ color: 'var(--phys-gray-400)' }}>Loading…</p>
        </div>
        <Footer />
      </>
    );
  }

  const artist = store.getArtistById(params.id);
  if (!artist) {
    notFound();
  }

  const artworks = store.getArtworksByArtist(artist.id);

  return (
    <>
      <Navigation />
      <div className="phys-section">
        <div className="phys-container">
          <nav
            style={{ padding: '1.25rem 0', fontSize: '0.8125rem', color: 'var(--phys-gray-400)' }}
          >
            <a href="/artists" style={{ color: 'inherit', textDecoration: 'none' }}>
              Artists
            </a>
            {' / '}
            <span style={{ color: 'var(--phys-black)' }}>{artist.name}</span>
          </nav>
          <ArtistProfile artist={artist} artworks={artworks} />
        </div>
      </div>
      <Footer />
    </>
  );
});

export default ArtistPage;
