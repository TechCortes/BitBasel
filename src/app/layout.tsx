import type { Metadata } from 'next';
import StoreProvider from '@/store/StoreProvider';
import '@/styles/globals.css';
import '@/styles/components.css';
import '@/styles/physical.css';

export const metadata: Metadata = {
  title: "BitBasel — Your City's Crypto Art Community",
  description:
    'Institutional-grade marketplace uniting Bitcoin Ordinals, physical fine art, and dynamic NFTs. Discover curated exhibitions, connect with artists, and acquire works on the Bitcoin blockchain.',
  keywords:
    'Bitcoin Ordinals, Physical Art, Dynamic NFTs, Crypto Art Community, Digital Gallery, Blockchain Art, Fine Art Marketplace, Institutional Art',
  authors: [{ name: 'BitBasel' }],
  creator: 'BitBasel',
  publisher: 'BitBasel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: "BitBasel — Your City's Crypto Art Community",
    description:
      'Institutional-grade marketplace uniting Bitcoin Ordinals, physical fine art, and dynamic NFTs. Discover curated exhibitions, connect with artists, and acquire works on the Bitcoin blockchain.',
    siteName: 'BitBasel',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BitBasel — Bitcoin Ordinals & Fine Art Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "BitBasel — Your City's Crypto Art Community",
    description:
      'Institutional-grade marketplace uniting Bitcoin Ordinals, physical fine art, and dynamic NFTs. Discover curated exhibitions, connect with artists, and acquire works on the Bitcoin blockchain.',
    creator: '@bitbasel',
    images: ['/images/twitter-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <StoreProvider>
          <div id="root">{children}</div>
        </StoreProvider>
      </body>
    </html>
  );
}
