import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private Membership',
  description:
    'Join BitBasel as a Creator ($49/mo) or Collector ($490/yr). Two private tiers at the intersection of Digital Art and institutional Fine Arts. Pay with USDC, ETH, BTC, SOL, or card.',
  alternates: { canonical: '/membership' },
  openGraph: {
    title: 'BitBasel — Creator & Collector Membership',
    description:
      'Join as Creator $49/mo or Collector $490/yr. Private access to Digital Collectibles, Digital Tools, physical Fine Arts, and advisory services. USDC · ETH · BTC · SOL.',
    url: '/membership',
  },
  twitter: {
    title: 'BitBasel — Creator & Collector Membership',
    description: 'Two private tiers. Creator $49/mo · Collector $490/yr. USDC · ETH · BTC · SOL.',
  },
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
