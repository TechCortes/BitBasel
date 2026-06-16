import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artists',
  description:
    'Represented artists on BitBasel — emerging and established creators working across Bitcoin Ordinals and institutional fine art.',
  alternates: { canonical: '/artists' },
  openGraph: {
    title: 'Artists — BitBasel',
    description: 'Represented artists working across Bitcoin Ordinals and institutional fine art.',
    url: '/artists',
  },
};

export default function ArtistsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
