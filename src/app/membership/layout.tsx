import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private Membership',
  description:
    'Join BitBasel as a Creator ($49/mo) or Collector ($99/mo). Two private tiers at the intersection of Bitcoin Ordinals and institutional fine art.',
  alternates: { canonical: '/membership' },
  openGraph: {
    title: 'BitBasel — Creator & Collector Membership',
    description:
      'Join as Creator $49/mo or Collector $99/mo. Private access to Bitcoin Ordinals drops, physical fine art, and advisory services.',
    url: '/membership',
  },
  twitter: {
    title: 'BitBasel — Creator & Collector Membership',
    description: 'Two private tiers. Creator $49/mo · Collector $99/mo.',
  },
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
