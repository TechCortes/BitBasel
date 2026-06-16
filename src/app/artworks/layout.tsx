import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Physical Works',
  description:
    'Acquire institutional-grade physical fine art through BitBasel. Provenance-verified works available for private acquisition.',
  alternates: { canonical: '/artworks' },
  openGraph: {
    title: 'Physical Works — BitBasel',
    description: 'Provenance-verified physical fine art available for private acquisition.',
    url: '/artworks',
  },
};

export default function ArtworksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
