import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#000000',
          padding: '72px 80px',
        }}
      >
        {/* Wordmark row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span
            style={{
              color: '#ffffff',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.14em',
              fontFamily: 'sans-serif',
            }}
          >
            BITBASEL
          </span>
          <span style={{ color: '#3d3d3d', fontSize: 14, fontFamily: 'sans-serif' }}>—</span>
          <span
            style={{
              color: '#6b6b6b',
              fontSize: 13,
              letterSpacing: '0.12em',
              fontFamily: 'sans-serif',
            }}
          >
            PRIVATE MEMBERSHIP
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          <span
            style={{
              color: '#ffffff',
              fontSize: 90,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              fontFamily: 'sans-serif',
            }}
          >
            The future of art
          </span>
          <span
            style={{
              color: '#ffffff',
              fontSize: 90,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              fontFamily: 'sans-serif',
            }}
          >
            and Web3.
          </span>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          {/* Tier pricing */}
          <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span
                style={{
                  color: '#6b6b6b',
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  fontFamily: 'sans-serif',
                }}
              >
                CREATOR
              </span>
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  fontFamily: 'sans-serif',
                }}
              >
                $49/mo
              </span>
            </div>
            <div
              style={{
                width: '1px',
                height: '44px',
                background: '#2a2a2a',
                display: 'flex',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span
                style={{
                  color: '#6b6b6b',
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  fontFamily: 'sans-serif',
                }}
              >
                COLLECTOR
              </span>
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  fontFamily: 'sans-serif',
                }}
              >
                $490/yr
              </span>
            </div>
          </div>

          {/* Domain */}
          <span
            style={{
              color: '#3d3d3d',
              fontSize: 13,
              letterSpacing: '0.04em',
              fontFamily: 'sans-serif',
            }}
          >
            app.bitbasel.miami
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
