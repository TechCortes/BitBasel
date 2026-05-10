import React from 'react';
import Link from 'next/link';
import { PhysicalArtist } from '@/types/physicalArt';

interface Props {
  artist: PhysicalArtist;
  artworkCount?: number;
}

export const ArtistCard: React.FC<Props> = ({ artist, artworkCount }) => {
  return (
    <Link href={`/artists/${artist.id}`} className="phys-artist-card">
      <div className="phys-artist-portrait">
        {artist.avatar ? (
          <img src={artist.avatar} alt={artist.name} loading="lazy" />
        ) : (
          <div className="phys-artist-portrait-placeholder">{artist.name.charAt(0)}</div>
        )}
      </div>

      <div>
        <h3 className="phys-artist-name">{artist.name}</h3>
        <p className="phys-artist-meta">
          b. {artist.birthYear}, {artist.nationality}
          {artworkCount !== undefined && ` · ${artworkCount} work${artworkCount !== 1 ? 's' : ''}`}
        </p>
      </div>

      <p className="phys-artist-short-bio">{artist.shortBio}</p>

      <div className="phys-medium-tags">
        {artist.medium.slice(0, 3).map((m) => (
          <span key={m} className="phys-medium-tag">
            {m}
          </span>
        ))}
      </div>
    </Link>
  );
};

export default ArtistCard;
