import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private Membership',
  description:
    'Join BitBasel as a Creator ($49/mo) or Collector ($490/mo). Two private tiers at the intersection of Digital Art and institutional Fine Arts. Pay with USDC, ETH, or BTC.',
  alternates: { canonical: '/membership' },
  openGraph: {
    title: 'BitBasel — Creator & Collector Membership',
    description:
      'Join as Creator $49/mo or Collector $490/mo. Private access to Digital Collectibles, Digital Tools, physical Fine Arts, and advisory services. USDC · ETH · BTC.',
    url: '/membership',
  },
  twitter: {
    title: 'BitBasel — Creator & Collector Membership',
    description: 'Two private tiers. Creator $49/mo · Collector $490/mo. USDC · ETH · BTC.',
  },
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
