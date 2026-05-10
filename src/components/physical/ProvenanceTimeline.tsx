import React from 'react';
import { ProvenanceEntry, ExhibitionEntry } from '@/types/physicalArt';

interface Props {
  provenance: ProvenanceEntry[];
  exhibitions: ExhibitionEntry[];
}

export const ProvenanceTimeline: React.FC<Props> = ({ provenance, exhibitions }) => {
  const all = [
    ...provenance.map((p) => ({ ...p, type: 'provenance' as const })),
    ...exhibitions.map((e) => ({
      year: e.year,
      description: `${e.title}, ${e.venue}, ${e.city}`,
      type: 'exhibition' as const,
    })),
  ].sort((a, b) => b.year - a.year);

  if (all.length === 0) {
    return (
      <p style={{ fontSize: '0.875rem', color: 'var(--phys-gray-400)' }}>No provenance recorded.</p>
    );
  }

  return (
    <ul className="phys-provenance-list">
      {all.map((entry, i) => (
        <li key={i} className="phys-provenance-item">
          <span className="phys-provenance-dot" />
          <span className="phys-provenance-year">{entry.year}</span>
          <span className="phys-provenance-text">
            {entry.description}
            {entry.type === 'provenance' && (entry as ProvenanceEntry).institution && (
              <span style={{ color: 'var(--phys-gray-400)' }}>
                {' '}
                — {(entry as ProvenanceEntry).institution}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ProvenanceTimeline;
