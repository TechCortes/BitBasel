'use client';

import React from 'react';
import { PhysicalArtist, ArtistCV } from '@/types/physicalArt';
import { PhysicalArtwork } from '@/types/physicalArt';
import ArtworkCard from './ArtworkCard';

const CV_CATEGORY_LABELS: Record<ArtistCV['category'], string> = {
  education: 'Education',
  solo: 'Solo Exhibitions',
  group: 'Group Exhibitions',
  award: 'Awards & Honours',
  residency: 'Residencies',
  publication: 'Publications',
};

const CV_ORDER: ArtistCV['category'][] = [
  'solo',
  'group',
  'award',
  'residency',
  'education',
  'publication',
];

interface Props {
  artist: PhysicalArtist;
  artworks: PhysicalArtwork[];
}

export const ArtistProfile: React.FC<Props> = ({ artist, artworks }) => {
  const cvByCategory = CV_ORDER.reduce<Record<string, ArtistCV[]>>((acc, cat) => {
    const items = artist.cv.filter((e) => e.category === cat);
    if (items.length > 0) acc[cat] = items.sort((a, b) => b.year - a.year);
    return acc;
  }, {});

  return (
    <div className="phys-profile-layout">
      {/* Sidebar */}
      <aside className="phys-profile-sidebar">
        <div className="phys-profile-portrait">
          {artist.avatar ? (
            <img src={artist.avatar} alt={artist.name} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--phys-gray-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5rem',
                color: 'var(--phys-gray-300)',
              }}
            >
              {artist.name.charAt(0)}
            </div>
          )}
        </div>

        <h1 className="phys-profile-name">{artist.name}</h1>
        <p className="phys-profile-nationality">
          b. {artist.birthYear}
          {artist.deathYear ? `–${artist.deathYear}` : ''}, {artist.nationality}
        </p>

        <div className="phys-medium-tags" style={{ marginBottom: '1.5rem' }}>
          {artist.medium.map((m) => (
            <span key={m} className="phys-medium-tag">
              {m}
            </span>
          ))}
        </div>

        {artist.website && (
          <a
            href={artist.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--phys-gray-500)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--phys-gray-300)',
            }}
          >
            {artist.website.replace('https://', '')}
          </a>
        )}
      </aside>

      {/* Main */}
      <div>
        <p className="phys-profile-bio">{artist.bio}</p>

        {/* CV */}
        <div className="phys-cv-section">
          {Object.entries(cvByCategory).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: '2rem' }}>
              <p className="phys-cv-section-title">
                {CV_CATEGORY_LABELS[cat as ArtistCV['category']]}
              </p>
              <ul className="phys-cv-list">
                {items.map((item, i) => (
                  <li key={i} className="phys-cv-item">
                    <span className="phys-cv-year">{item.year}</span>
                    <span className="phys-cv-desc">{item.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Works */}
        {artworks.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <p
              className="phys-cv-section-title"
              style={{
                borderBottom: '2px solid var(--phys-black)',
                paddingBottom: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              Works in the Gallery
            </p>
            <div
              className="phys-artwork-grid"
              style={{
                background: 'var(--phys-gray-200)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1px',
              }}
            >
              {artworks.map((a) => (
                <ArtworkCard key={a.id} artwork={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistProfile;
