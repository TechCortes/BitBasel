import type { Metadata, Viewport } from 'next';
import { Raleway, DM_Sans } from 'next/font/google';
import StoreProvider from '@/store/StoreProvider';
import '@/styles/globals.css';
import '@/styles/components.css';
import '@/styles/physical.css';

const raleway = Raleway({
  weight: ['200', '300', '400', '500', '600'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: {
    default: 'BitBasel — Built for the Future of Art Culture',
    template: '%s — BitBasel',
  },
  description:
    'BitBasel is a global cultural technology platform connecting art, innovation, and community through live events, digital infrastructure, and on-chain cultural assets. Creator $49/mo · Collector $490/yr.',
  keywords: [
    'Digital Collectibles',
    'Digital Art',
    'Digital Tools',
    'Creator Membership',
    'Collector Membership',
    'Web3 Art',
    'Bitcoin Art',
    'Private Art Membership',
    'Institutional Art Marketplace',
    'BitBasel',
    'Art and Web3',
    'Physical Fine Arts',
    'ETH',
    'BTC',
    'USDC',
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
    title: 'BitBasel — Built for the Future of Art Culture',
    description:
      'A global cultural technology platform for artists, collectors, founders, and cultural leaders. Creator $49/mo · Collector $490/yr. USDC · ETH · BTC.',
    siteName: 'BitBasel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BitBasel — Private Membership for Art and Web3',
    description:
      'BitBasel — Built for the Future of Art Culture. Global platform for artists, collectors, founders, and cultural leaders. Creator $49/mo · Collector $490/yr.',
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
      <body className={`${raleway.variable} ${dmSans.variable}`}>
        <StoreProvider>
          <div id="root">{children}</div>
        </StoreProvider>
      </body>
    </html>
  );
}
