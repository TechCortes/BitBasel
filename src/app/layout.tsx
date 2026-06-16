import type { Metadata, Viewport } from 'next';
import StoreProvider from '@/store/StoreProvider';
import '@/styles/globals.css';
import '@/styles/components.css';
import '@/styles/physical.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: {
    default: 'BitBasel — Private Membership for Art and Web3',
    template: '%s — BitBasel',
  },
  description:
    'Two private membership tiers for creators and collectors at the intersection of Bitcoin Ordinals and institutional fine art. Creator $49/mo · Collector $99/mo.',
  keywords: [
    'Bitcoin Ordinals',
    'Fine Art NFT',
    'Creator Membership',
    'Collector Membership',
    'Web3 Art',
    'Bitcoin Art',
    'Private Art Membership',
    'Institutional Art Marketplace',
    'BitBasel',
    'Art and Web3',
    'Ordinals Marketplace',
    'Physical Fine Art',
  ],
  authors: [{ name: 'BitBasel' }],
  creator: 'BitBasel',
  publisher: 'BitBasel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.BASE_URL || 'https://bitbasel.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'BitBasel — Private Membership for Art and Web3',
    description:
      'Two private membership tiers. Creator $49/mo or Collector $99/mo — at the intersection of Bitcoin Ordinals and institutional fine art.',
    siteName: 'BitBasel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BitBasel — Private Membership for Art and Web3',
    description:
      'Two tiers for the future of art and Web3. Creator $49/mo · Collector $99/mo. Bitcoin Ordinals meets institutional fine art.',
    creator: '@bitbasel',
    site: '@bitbasel',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
