import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artists',
  description:
    'Represented artists on BitBasel — emerging and established creators working across Digital Art, Digital Collectibles, and institutional Fine Arts.',
  alternates: { canonical: '/artists' },
  openGraph: {
    title: 'Artists — BitBasel',
    description:
      'Represented artists working across Digital Art, Digital Collectibles, and institutional Fine Arts.',
    url: '/artists',
  },
};

export default function ArtistsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
