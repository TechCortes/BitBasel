'use client';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ArtworkDetail from '@/components/physical/ArtworkDetail';
import ArtworkCard from '@/components/physical/ArtworkCard';
import { usePhysicalStore } from '@/store/StoreProvider';

interface Props {
  params: { id: string };
}

const ArtworkPage: React.FC<Props> = observer(({ params }) => {
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

  const artwork = store.getArtworkById(params.id);
  if (!artwork) {
    notFound();
  }

  const artist = store.getArtistById(artwork.artistId);
  if (!artist) {
    notFound();
  }

  const related = (artwork.relatedArtworkIds ?? [])
    .map((rid) => store.getArtworkById(rid))
    .filter(Boolean) as (typeof artwork)[];

  return (
    <>
      <Navigation />
      <div className="phys-section">
        <div className="phys-container">
          {/* Breadcrumb */}
          <nav
            style={{ padding: '1.25rem 0', fontSize: '0.8125rem', color: 'var(--phys-gray-400)' }}
          >
            <a href="/artworks" style={{ color: 'inherit', textDecoration: 'none' }}>
              Acquire
            </a>
            {' / '}
            <a href={`/artists/${artist.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {artist.name}
            </a>
            {' / '}
            <span style={{ color: 'var(--phys-black)' }}>{artwork.title}</span>
          </nav>

          <ArtworkDetail artwork={artwork} artist={artist} />

          {related.length > 0 && (
            <section
              style={{ padding: '4rem 0 2rem', borderTop: '1px solid var(--phys-gray-200)' }}
            >
              <p
                style={{
                  fontSize: '0.6875rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: 'var(--phys-gray-500)',
                  marginBottom: '1.5rem',
                }}
              >
                Related Works
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1px',
                  background: 'var(--phys-gray-200)',
                }}
              >
                {related.map((r) => (
                  <ArtworkCard key={r.id} artwork={r} artist={store.getArtistById(r.artistId)} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
});

export default ArtworkPage;
