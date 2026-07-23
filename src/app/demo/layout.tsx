import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investor Demo',
  description: 'BitBasel guided walkthrough — private link, simulated payment.',
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
