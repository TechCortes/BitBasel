'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { usePhysicalStore } from '@/store/StoreProvider';
import { AvailabilityStatus } from '@/types/physicalArt';

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Works' },
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'sold', label: 'Sold' },
];

const MEDIUM_OPTIONS = [
  'Oil',
  'Acrylic',
  'Photography',
  'Sculpture',
  'Mixed media',
  'Works on paper',
];

export const ArtworkFilter: React.FC = observer(() => {
  const store = usePhysicalStore();
  const hasActiveFilters =
    store.filters.availability !== 'all' ||
    store.filters.artistId !== 'all' ||
    store.filters.medium.length > 0;

  return (
    <aside className="phys-filter-sidebar">
      <div className="phys-filter-group">
        <span className="phys-filter-label">Availability</span>
        <div className="phys-filter-radio">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <label key={opt.value} className="phys-filter-radio-item">
              <input
                type="radio"
                name="availability"
                value={opt.value}
                checked={store.filters.availability === opt.value}
                onChange={() => store.setFilter('availability', opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <hr className="phys-filter-divider" />

      <div className="phys-filter-group">
        <span className="phys-filter-label">Medium</span>
        <div className="phys-filter-options">
          {MEDIUM_OPTIONS.map((m) => (
            <label key={m} className="phys-filter-option">
              <input
                type="checkbox"
                checked={store.filters.medium.some(
                  (f) =>
                    m.toLowerCase().includes(f.toLowerCase()) ||
                    f.toLowerCase().includes(m.toLowerCase())
                )}
                onChange={() => store.toggleMediumFilter(m)}
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      <hr className="phys-filter-divider" />

      <div className="phys-filter-group">
        <span className="phys-filter-label">Artist</span>
        <div className="phys-filter-radio">
          <label className="phys-filter-radio-item">
            <input
              type="radio"
              name="artist"
              value="all"
              checked={store.filters.artistId === 'all'}
              onChange={() => store.setFilter('artistId', 'all')}
            />
            All Artists
          </label>
          {store.artists.map((a) => (
            <label key={a.id} className="phys-filter-radio-item">
              <input
                type="radio"
                name="artist"
                value={a.id}
                checked={store.filters.artistId === a.id}
                onChange={() => store.setFilter('artistId', a.id)}
              />
              {a.name}
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <>
          <hr className="phys-filter-divider" />
          <button className="phys-filter-clear" onClick={() => store.clearFilters()}>
            Clear all filters
          </button>
        </>
      )}
    </aside>
  );
});

export default ArtworkFilter;
