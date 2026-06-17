// Wallet Connection Types
export interface WalletInfo {
  address: string;
  publicKey: string;
  balance: number;
  network: 'mainnet' | 'testnet';
  connected: boolean;
  provider: WalletProvider;
}

export type WalletProvider =
  | 'unisat'
  | 'xverse'
  | 'ordinals-wallet'
  | 'sparrow'
  | 'leather'
  | 'phantom';

export interface WalletConnection {
  connect: (provider: WalletProvider) => Promise<WalletInfo>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  signTransaction: (txHex: string) => Promise<string>;
  sendBitcoin: (address: string, amount: number) => Promise<string>;
  getBalance: () => Promise<number>;
}

export interface TransactionStatus {
  txid: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  timestamp: string;
}

// EIP-6963 Multi Injected Provider Discovery
export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string; // data: URI or URL
  rdns: string; // e.g. "io.metamask", "com.coinbase.wallet"
}

export interface EIP1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener: (event: string, listener: (...args: unknown[]) => void) => void;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

// EVM wallet state
export interface EVMWalletInfo {
  address: string;
  chainId: number;
  connected: boolean;
  providerType: 'eip6963' | 'walletconnect';
  providerName: string;
  providerRdns?: string;
  providerIcon?: string;
}
