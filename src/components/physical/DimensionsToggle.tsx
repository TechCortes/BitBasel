'use client';

import React, { useState } from 'react';
import { Dimensions, DimensionUnit } from '@/types/physicalArt';

const CM_TO_IN = 0.393701;

function convert(value: number, to: DimensionUnit): number {
  return to === 'in' ? Math.round(value * CM_TO_IN * 10) / 10 : value;
}

interface Props {
  dimensions: Dimensions;
}

export const DimensionsToggle: React.FC<Props> = ({ dimensions }) => {
  const [unit, setUnit] = useState<DimensionUnit>('cm');

  const h = convert(dimensions.height, unit);
  const w = convert(dimensions.width, unit);
  const d = dimensions.depth ? convert(dimensions.depth, unit) : null;

  return (
    <span>
      {h} × {w}
      {d ? ` × ${d}` : ''} {unit}
      <span className="phys-dim-toggle" style={{ marginLeft: '0.75rem' }}>
        <button
          className={`phys-dim-btn${unit === 'cm' ? ' active' : ''}`}
          onClick={() => setUnit('cm')}
          type="button"
        >
          cm
        </button>
        <button
          className={`phys-dim-btn${unit === 'in' ? ' active' : ''}`}
          onClick={() => setUnit('in')}
          type="button"
        >
          in
        </button>
      </span>
    </span>
  );
};

export default DimensionsToggle;
