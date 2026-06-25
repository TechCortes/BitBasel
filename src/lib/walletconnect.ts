import type { EIP1193Provider } from '@/types/wallet';

export interface WCProvider extends EIP1193Provider {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  accounts: string[];
  chainId: number;
}

let cachedProvider: WCProvider | null = null;

export async function getWalletConnectProvider(): Promise<WCProvider> {
  if (cachedProvider) return cachedProvider;

  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  if (!projectId) {
    throw new Error(
      'WalletConnect project ID not configured. Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your environment.'
    );
  }

  const { EthereumProvider } = await import('@walletconnect/ethereum-provider');

  const provider = await EthereumProvider.init({
    projectId,
    chains: [1],
    optionalChains: [8453, 137, 42161, 10],
    showQrModal: true,
    metadata: {
      name: 'BitBasel',
      description: 'Private membership for art and Web3',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://bitbasel.vercel.app',
      icons: ['https://bitbasel.vercel.app/icon.svg'],
    },
  });

  cachedProvider = provider as unknown as WCProvider;
  return cachedProvider;
}

export function resetWalletConnectProvider(): void {
  cachedProvider = null;
}
