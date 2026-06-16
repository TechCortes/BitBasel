import { makeAutoObservable, runInAction } from 'mobx';
import { WalletInfo, WalletProvider, TransactionStatus } from '@/types/wallet';

export class WalletStore {
  // State
  walletInfo: WalletInfo | null = null;
  connecting = false;
  error: string | null = null;
  transactions: TransactionStatus[] = [];

  // Available wallet providers
  availableProviders: WalletProvider[] = [
    'unisat',
    'xverse',
    'ordinals-wallet',
    'leather',
    'phantom',
  ];

  constructor() {
    makeAutoObservable(this);
    this.checkExistingConnection();
    this.setupSecurityMonitoring();
  }

  // Production security monitoring
  private setupSecurityMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor wallet extension changes
    let walletCheckInterval: NodeJS.Timeout;

    const checkWalletSecurity = () => {
      if (this.walletInfo && this.isConnected) {
        this.validateWalletState()
          .then((isValid) => {
            if (!isValid) {
              console.warn('Security: Wallet state validation failed');
            }
          })
          .catch((error) => {
            console.error('Security monitoring error:', error);
          });
      }
    };

    // Check wallet state every 30 seconds
    walletCheckInterval = setInterval(checkWalletSecurity, 30000);

    // Clear interval on page unload
    window.addEventListener('beforeunload', () => {
      if (walletCheckInterval) {
        clearInterval(walletCheckInterval);
      }
    });

    // Listen for account changes in supported wallets
    if ((window as any).unisat) {
      (window as any).unisat.on('accountsChanged', (accounts: string[]) => {
        if (this.walletInfo && this.walletInfo.provider === 'unisat') {
          if (accounts.length === 0 || accounts[0] !== this.walletInfo.address) {
            console.warn('Security: Account changed detected');
            this.disconnectWallet();
          }
        }
      });
    }

    if ((window as any).phantom?.bitcoin) {
      (window as any).phantom.bitcoin.on('accountsChanged', (accounts: { address: string }[]) => {
        if (this.walletInfo && this.walletInfo.provider === 'phantom') {
          if (accounts.length === 0 || accounts[0]?.address !== this.walletInfo.address) {
            console.warn('Security: Phantom account changed detected');
            this.disconnectWallet();
          }
        }
      });
    }
  }

  // Check for existing wallet connection on app start - SECURITY ENHANCED
  private async checkExistingConnection() {
    try {
      // Only run in browser environment
      if (typeof window === 'undefined') return;

      const savedWallet = localStorage.getItem('bitbasel_wallet');
      if (savedWallet) {
        // Validate stored data structure
        const parsed = JSON.parse(savedWallet);
        if (!this.isValidStoredWallet(parsed)) {
          localStorage.removeItem('bitbasel_wallet');
          return;
        }

        const { provider, address, timestamp } = parsed;

        // Check if connection is expired (24 hours)
        const now = Date.now();
        const connectionAge = now - (timestamp || 0);
        const MAX_CONNECTION_AGE = 24 * 60 * 60 * 1000; // 24 hours

        if (connectionAge > MAX_CONNECTION_AGE) {
          localStorage.removeItem('bitbasel_wallet');
          return;
        }

        await this.connectWallet(provider, false);
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('bitbasel_wallet');
    }
  }

  // Validate stored wallet data structure - SECURITY
  private isValidStoredWallet(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.provider === 'string' &&
      this.availableProviders.includes(data.provider as WalletProvider) &&
      typeof data.address === 'string' &&
      data.address.length > 0 &&
      (!data.timestamp || typeof data.timestamp === 'number')
    );
  }

  // Validate wallet info response - SECURITY
  private isValidWalletInfo(walletInfo: any): boolean {
    return (
      walletInfo &&
      typeof walletInfo === 'object' &&
      typeof walletInfo.address === 'string' &&
      walletInfo.address.length > 0 &&
      typeof walletInfo.publicKey === 'string' &&
      typeof walletInfo.balance === 'number' &&
      walletInfo.balance >= 0 &&
      ['mainnet', 'testnet'].includes(walletInfo.network) &&
      typeof walletInfo.connected === 'boolean' &&
      this.availableProviders.includes(walletInfo.provider)
    );
  }

  // Connect to wallet - SECURITY ENHANCED
  async connectWallet(provider: WalletProvider, saveConnection = true) {
    // Validate provider input
    if (!this.availableProviders.includes(provider)) {
      throw new Error(`Invalid wallet provider: ${provider}`);
    }

    this.connecting = true;
    this.error = null;

    try {
      let walletInfo: WalletInfo;

      switch (provider) {
        case 'unisat':
          walletInfo = await this.connectUnisat();
          break;
        case 'xverse':
          walletInfo = await this.connectXverse();
          break;
        case 'ordinals-wallet':
          walletInfo = await this.connectOrdinalsWallet();
          break;
        case 'leather':
          walletInfo = await this.connectLeather();
          break;
        case 'phantom':
          walletInfo = await this.connectPhantom();
          break;
        default:
          throw new Error(`Unsupported wallet provider: ${provider}`);
      }

      // Validate wallet response
      if (!this.isValidWalletInfo(walletInfo)) {
        throw new Error('Invalid wallet response received');
      }

      runInAction(() => {
        this.walletInfo = walletInfo;
        this.connecting = false;
      });

      if (saveConnection) {
        // Enhanced secure storage with timestamp
        const secureWalletData = {
          provider,
          address: walletInfo.address,
          timestamp: Date.now(),
          version: '1.0', // For future compatibility
        };

        localStorage.setItem('bitbasel_wallet', JSON.stringify(secureWalletData));
      }

      // Fetch balance after connection with retry mechanism
      setTimeout(() => this.updateBalance(), 1000);

      return walletInfo;
    } catch (error) {
      await this.handleConnectionError(error, provider);
      throw error;
    }
  }

  // Disconnect wallet
  async disconnectWallet() {
    try {
      const provider = this.walletInfo?.provider;

      if (provider === 'unisat' && (window as any).unisat) {
        await (window as any).unisat.disconnect();
      } else if (provider === 'phantom' && (window as any).phantom?.bitcoin) {
        await (window as any).phantom.bitcoin.disconnect();
      }
      // Xverse, Leather, and Ordinals Wallet do not expose a disconnect method;
      // clearing local state is sufficient.

      runInAction(() => {
        this.walletInfo = null;
        this.error = null;
      });

      localStorage.removeItem('bitbasel_wallet');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }

  // Wallet-specific connection methods
  private async connectUnisat(): Promise<WalletInfo> {
    if (!(window as any).unisat) {
      throw new Error('Unisat wallet not found. Please install the Unisat extension.');
    }

    const unisat = (window as any).unisat;
    const accounts = await unisat.requestAccounts();
    const publicKey = await unisat.getPublicKey();
    const balance = await unisat.getBalance();
    const network = await unisat.getNetwork();

    return {
      address: accounts[0],
      publicKey,
      balance: balance.confirmed,
      network: network === 'livenet' ? 'mainnet' : 'testnet',
      connected: true,
      provider: 'unisat',
    };
  }

  private async connectXverse(): Promise<WalletInfo> {
    if (!(window as any).BitcoinProvider || !(window as any).StacksProvider) {
      throw new Error('Xverse wallet not found. Please install the Xverse extension.');
    }

    const xverse = (window as any).BitcoinProvider;
    const response = await xverse.connect();

    if (response.status === 'success') {
      const addressResponse = await xverse.getAddresses();
      const address = addressResponse.result.addresses[0];

      return {
        address: address.address,
        publicKey: address.publicKey || '',
        balance: 0, // Will be fetched separately
        network: 'mainnet',
        connected: true,
        provider: 'xverse',
      };
    }

    throw new Error('Failed to connect to Xverse wallet');
  }

  private async connectOrdinalsWallet(): Promise<WalletInfo> {
    if (!(window as any).ordinalsWallet) {
      throw new Error('Ordinals Wallet not found. Please install the Ordinals Wallet extension.');
    }

    const ordinalsWallet = (window as any).ordinalsWallet;
    const accounts = await ordinalsWallet.requestAccounts();
    const publicKey = await ordinalsWallet.getPublicKey();
    const network = await ordinalsWallet.getNetwork();

    return {
      address: accounts[0],
      publicKey,
      balance: 0, // Will be fetched separately
      network: network === 'livenet' ? 'mainnet' : 'testnet',
      connected: true,
      provider: 'ordinals-wallet',
    };
  }

  private async connectLeather(): Promise<WalletInfo> {
    if (!(window as any).LeatherProvider) {
      throw new Error('Leather wallet not found. Please install the Leather extension.');
    }

    const leather = (window as any).LeatherProvider;
    const response = await leather.request('getAddresses');

    if (response.result && response.result.addresses.length > 0) {
      const address = response.result.addresses[0];

      return {
        address: address.address,
        publicKey: address.publicKey || '',
        balance: 0, // Will be fetched separately
        network: 'mainnet',
        connected: true,
        provider: 'leather',
      };
    }

    throw new Error('Failed to connect to Leather wallet');
  }

  private async connectPhantom(): Promise<WalletInfo> {
    if (!(window as any).phantom?.bitcoin) {
      throw new Error('Phantom Bitcoin not found. Please install Phantom with Bitcoin support.');
    }

    const phantom = (window as any).phantom.bitcoin;
    const response = await phantom.connect();

    if (response.address) {
      return {
        address: response.address,
        publicKey: response.publicKey || '',
        balance: 0, // Will be fetched separately
        network: 'mainnet',
        connected: true,
        provider: 'phantom',
      };
    }

    throw new Error('Failed to connect to Phantom wallet');
  }

  // Transaction methods
  async signMessage(message: string): Promise<string> {
    if (!this.walletInfo) throw new Error('No wallet connected');

    switch (this.walletInfo.provider) {
      case 'unisat':
        if (!(window as any).unisat) throw new Error('Unisat wallet not available');
        return await (window as any).unisat.signMessage(message);

      case 'ordinals-wallet':
        if (!(window as any).ordinalsWallet) throw new Error('Ordinals Wallet not available');
        return await (window as any).ordinalsWallet.signMessage(message);

      case 'xverse': {
        if (!(window as any).BitcoinProvider) throw new Error('Xverse not available');
        const res = await (window as any).BitcoinProvider.signMessage({
          address: this.walletInfo.address,
          message,
        });
        return res.result?.signature ?? res.signature;
      }

      case 'leather': {
        if (!(window as any).LeatherProvider) throw new Error('Leather not available');
        const res = await (window as any).LeatherProvider.request('signMessage', {
          message,
          paymentType: 'p2wpkh',
        });
        return res.result.signature;
      }

      case 'phantom': {
        if (!(window as any).phantom?.bitcoin) throw new Error('Phantom Bitcoin not available');
        const encoded = new TextEncoder().encode(message);
        const { signature } = await (window as any).phantom.bitcoin.signMessage(
          this.walletInfo.address,
          encoded
        );
        return Buffer.from(signature).toString('hex');
      }

      default:
        throw new Error(`Signing not supported for ${this.walletInfo.provider}`);
    }
  }

  private trackTransaction(txid: string) {
    runInAction(() => {
      this.transactions.push({
        txid,
        status: 'pending',
        confirmations: 0,
        timestamp: new Date().toISOString(),
      });
    });
  }

  async sendBitcoin(toAddress: string, amount: number): Promise<string> {
    if (!this.walletInfo) throw new Error('No wallet connected');

    let txid: string;

    switch (this.walletInfo.provider) {
      case 'unisat':
        if (!(window as any).unisat) throw new Error('Unisat wallet not available');
        txid = await (window as any).unisat.sendBitcoin(toAddress, amount);
        break;

      case 'ordinals-wallet':
        if (!(window as any).ordinalsWallet) throw new Error('Ordinals Wallet not available');
        txid = await (window as any).ordinalsWallet.sendBitcoin(toAddress, amount);
        break;

      case 'xverse': {
        if (!(window as any).BitcoinProvider) throw new Error('Xverse not available');
        const res = await (window as any).BitcoinProvider.sendBtcTransaction({
          recipients: [{ address: toAddress, amountSats: amount }],
          senderAddress: this.walletInfo.address,
        });
        txid = res.result?.txid ?? res.txid;
        break;
      }

      case 'leather': {
        if (!(window as any).LeatherProvider) throw new Error('Leather not available');
        const res = await (window as any).LeatherProvider.request('sendTransfer', {
          recipients: [{ address: toAddress, amount: String(amount) }],
        });
        txid = res.result.txid;
        break;
      }

      case 'phantom': {
        if (!(window as any).phantom?.bitcoin) throw new Error('Phantom Bitcoin not available');
        const res = await (window as any).phantom.bitcoin.sendBitcoin(toAddress, amount);
        txid = res.txid ?? res;
        break;
      }

      default:
        throw new Error(`Transactions not supported for ${this.walletInfo.provider}`);
    }

    this.trackTransaction(txid);
    return txid;
  }

  // Advanced wallet state validation with retry mechanism
  private async validateWalletState(): Promise<boolean> {
    if (!this.walletInfo) return false;

    try {
      const { provider } = this.walletInfo;
      let isValid = false;

      switch (provider) {
        case 'unisat':
          if ((window as any).unisat) {
            const accounts = await (window as any).unisat.getAccounts();
            isValid = accounts.length > 0 && accounts[0] === this.walletInfo.address;
          }
          break;
        case 'xverse':
          if ((window as any).BitcoinProvider) {
            const response = await (window as any).BitcoinProvider.getAddresses();
            isValid = response.result?.addresses?.[0]?.address === this.walletInfo.address;
          }
          break;
        case 'ordinals-wallet':
          if ((window as any).ordinalsWallet) {
            const accounts = await (window as any).ordinalsWallet.getAccounts();
            isValid = accounts.length > 0 && accounts[0] === this.walletInfo.address;
          }
          break;
        case 'leather':
          if ((window as any).LeatherProvider) {
            const response = await (window as any).LeatherProvider.request('getAddresses');
            isValid = response.result?.addresses?.[0]?.address === this.walletInfo.address;
          }
          break;
        case 'phantom':
          if ((window as any).phantom?.bitcoin) {
            const accounts = await (window as any).phantom.bitcoin.getAccounts();
            isValid = accounts.length > 0 && accounts[0]?.address === this.walletInfo.address;
          }
          break;
        default:
          isValid = true;
      }

      if (!isValid) {
        console.warn('Wallet state validation failed, disconnecting...');
        await this.disconnectWallet();
      }

      return isValid;
    } catch (error) {
      console.error('Wallet state validation error:', error);
      return false;
    }
  }

  // Update wallet balance with enhanced error handling
  async updateBalance() {
    if (!this.walletInfo) return;

    const isValidState = await this.validateWalletState();
    if (!isValidState) return;

    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        let newBalance = 0;

        switch (this.walletInfo.provider) {
          case 'unisat':
            if ((window as any).unisat) {
              const balance = await (window as any).unisat.getBalance();
              newBalance = balance.confirmed;
            }
            break;
          case 'xverse':
            if ((window as any).BitcoinProvider) {
              const response = await (window as any).BitcoinProvider.getBalance();
              newBalance = response.confirmed || 0;
            }
            break;
          case 'ordinals-wallet':
            if ((window as any).ordinalsWallet) {
              const balance = await (window as any).ordinalsWallet.getBalance();
              newBalance = balance.confirmed || balance.total || 0;
            }
            break;
          case 'leather':
          case 'phantom':
            // Neither wallet exposes a direct getBalance RPC — query Blockstream
            newBalance = await this.fetchAddressBalance(this.walletInfo.address);
            break;
          default:
            break;
        }

        runInAction(() => {
          if (this.walletInfo && newBalance >= 0) {
            this.walletInfo.balance = newBalance;
          }
        });

        return; // Success, exit retry loop
      } catch (error) {
        attempt++;
        console.error(`Balance update attempt ${attempt} failed:`, error);

        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        } else {
          console.error('Failed to update balance after', MAX_RETRIES, 'attempts');
        }
      }
    }
  }

  // Connection recovery mechanism
  async recoverConnection(): Promise<boolean> {
    if (!this.walletInfo) return false;

    try {
      const { provider } = this.walletInfo;
      const isValid = await this.validateWalletState();

      if (!isValid) {
        // Attempt to reconnect with same provider
        try {
          await this.connectWallet(provider, false);
          return true;
        } catch (error) {
          console.error('Connection recovery failed:', error);
          await this.disconnectWallet();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Connection recovery error:', error);
      return false;
    }
  }

  // Enhanced error handling with auto-recovery
  async handleConnectionError(error: any, provider: WalletProvider): Promise<void> {
    let errorMessage = 'Connection failed';

    if (error?.message?.includes('User rejected')) {
      errorMessage = 'Connection was cancelled by user';
    } else if (error?.message?.includes('not found')) {
      errorMessage = `${provider} wallet not found. Please install the extension.`;
    } else if (error?.message?.includes('network')) {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    runInAction(() => {
      this.error = errorMessage;
      this.connecting = false;
    });

    // Auto-clear error after 5 seconds
    setTimeout(() => {
      if (this.error === errorMessage) {
        this.clearError();
      }
    }, 5000);
  }

  // Fetch confirmed BTC balance (sats) via Blockstream for wallets without a native getBalance
  private async fetchAddressBalance(address: string): Promise<number> {
    const res = await fetch(`https://blockstream.info/api/address/${address}`);
    if (!res.ok) throw new Error('Failed to fetch balance from Blockstream');
    const data = await res.json();
    const { funded_txo_sum, spent_txo_sum } = data.chain_stats;
    return funded_txo_sum - spent_txo_sum;
  }

  // Clear error
  clearError() {
    this.error = null;
  }

  // Computed values
  get isConnected() {
    return !!this.walletInfo?.connected;
  }

  get shortAddress() {
    if (!this.walletInfo?.address) return '';
    const addr = this.walletInfo.address;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  get balanceInBTC() {
    return (this.walletInfo?.balance || 0) / 100000000;
  }
}
