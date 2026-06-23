import { makeAutoObservable, runInAction } from 'mobx';
import {
  WalletInfo,
  WalletProvider,
  TransactionStatus,
  EVMWalletInfo,
  EIP6963ProviderDetail,
  EIP1193Provider,
} from '@/types/wallet';
import { watchEIP6963Providers } from '@/lib/eip6963';

export class WalletStore {
  // Bitcoin state
  walletInfo: WalletInfo | null = null;
  connecting = false;
  error: string | null = null;
  transactions: TransactionStatus[] = [];

  // EVM state
  evmWalletInfo: EVMWalletInfo | null = null;
  evmConnecting = false;
  evmError: string | null = null;
  detectedEVMProviders: EIP6963ProviderDetail[] = [];

  // Available Bitcoin wallet providers
  availableProviders: WalletProvider[] = [
    'unisat',
    'xverse',
    'ordinals-wallet',
    'leather',
    'phantom',
  ];

  // Non-observable implementation details
  private _evmProvider: EIP1193Provider | null = null;
  private _stopEIP6963Watch: (() => void) | null = null;
  private _pendingEVMReconnectRdns: string | null = null;
  private _pendingEVMReconnectAddress: string | null = null;

  constructor() {
    makeAutoObservable(this, {
      _evmProvider: false,
      _stopEIP6963Watch: false,
      _pendingEVMReconnectRdns: false,
      _pendingEVMReconnectAddress: false,
    } as any);
    this.checkExistingConnection();
    this.checkExistingEVMConnection();
    this.setupSecurityMonitoring();
    this.initEVMDiscovery();
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

        const { provider, timestamp } = parsed;

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

  // EVM: start EIP-6963 provider discovery
  initEVMDiscovery() {
    if (typeof window === 'undefined') return;

    const seen = new Set<string>();
    const pendingRdns = this._pendingEVMReconnectRdns;
    const pendingAddress = this._pendingEVMReconnectAddress;

    this._stopEIP6963Watch = watchEIP6963Providers((detail) => {
      if (seen.has(detail.info.uuid)) return;
      seen.add(detail.info.uuid);

      runInAction(() => {
        this.detectedEVMProviders.push(detail);
      });

      // Silent reconnect if this matches the last session
      if (pendingRdns && detail.info.rdns === pendingRdns && pendingAddress) {
        this._pendingEVMReconnectRdns = null;
        this._pendingEVMReconnectAddress = null;

        detail.provider
          .request({ method: 'eth_accounts' })
          .then((result) => {
            const accounts = result as string[];
            if (
              accounts &&
              accounts.length > 0 &&
              accounts[0].toLowerCase() === pendingAddress.toLowerCase()
            ) {
              return detail.provider.request({ method: 'eth_chainId' }).then((chainResult) => {
                runInAction(() => {
                  this.evmWalletInfo = {
                    address: accounts[0],
                    chainId: parseInt(chainResult as string, 16),
                    connected: true,
                    providerType: 'eip6963',
                    providerName: detail.info.name,
                    providerRdns: detail.info.rdns,
                    providerIcon: detail.info.icon,
                  };
                });
                this._evmProvider = detail.provider;
                this.setupEVMProviderListeners(detail.provider);
              });
            } else {
              localStorage.removeItem('bitbasel_evm_wallet');
            }
          })
          .catch(() => localStorage.removeItem('bitbasel_evm_wallet'));
      }
    });
  }

  // EVM: check for an existing EVM session in localStorage (synchronous)
  private checkExistingEVMConnection() {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('bitbasel_evm_wallet');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      const age = Date.now() - (parsed.timestamp || 0);
      const MAX_AGE = 24 * 60 * 60 * 1000;

      if (age > MAX_AGE || !parsed.address || !parsed.providerType) {
        localStorage.removeItem('bitbasel_evm_wallet');
        return;
      }

      if (parsed.providerType === 'eip6963' && parsed.providerRdns) {
        // Set pending reconnect — handled inside initEVMDiscovery when provider announces
        this._pendingEVMReconnectRdns = parsed.providerRdns;
        this._pendingEVMReconnectAddress = parsed.address;
      }
    } catch {
      localStorage.removeItem('bitbasel_evm_wallet');
    }
  }

  // EVM: connect via an EIP-6963 discovered provider
  async connectEVMProvider(detail: EIP6963ProviderDetail) {
    runInAction(() => {
      this.evmConnecting = true;
      this.evmError = null;
    });

    try {
      const accounts = (await detail.provider.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned');
      }

      const chainResult = await detail.provider.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainResult as string, 16);

      this._evmProvider = detail.provider;
      this.setupEVMProviderListeners(detail.provider);

      runInAction(() => {
        this.evmWalletInfo = {
          address: accounts[0],
          chainId,
          connected: true,
          providerType: 'eip6963',
          providerName: detail.info.name,
          providerRdns: detail.info.rdns,
          providerIcon: detail.info.icon,
        };
        this.evmConnecting = false;
      });

      localStorage.setItem(
        'bitbasel_evm_wallet',
        JSON.stringify({
          providerType: 'eip6963',
          providerName: detail.info.name,
          providerRdns: detail.info.rdns,
          address: accounts[0],
          chainId,
          timestamp: Date.now(),
          version: '1.0',
        })
      );
    } catch (error) {
      runInAction(() => {
        this.evmError = this.parseEVMError(error);
        this.evmConnecting = false;
      });
      throw error;
    }
  }

  // EVM: connect via WalletConnect (lazy-loads the provider)
  async connectWalletConnect() {
    runInAction(() => {
      this.evmConnecting = true;
      this.evmError = null;
    });

    try {
      const { getWalletConnectProvider } = await import('@/lib/walletconnect');
      const provider = await getWalletConnectProvider();

      await provider.connect();

      const accounts = (await provider.request({ method: 'eth_accounts' })) as string[];
      const chainResult = await provider.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainResult as string, 16);

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from WalletConnect');
      }

      this._evmProvider = provider as unknown as EIP1193Provider;
      provider.on('accountsChanged', (accs: unknown) => {
        if ((accs as string[]).length === 0) this.disconnectEVM();
      });
      provider.on('disconnect', () => this.disconnectEVM());

      runInAction(() => {
        this.evmWalletInfo = {
          address: accounts[0],
          chainId,
          connected: true,
          providerType: 'walletconnect',
          providerName: 'WalletConnect',
        };
        this.evmConnecting = false;
      });

      localStorage.setItem(
        'bitbasel_evm_wallet',
        JSON.stringify({
          providerType: 'walletconnect',
          providerName: 'WalletConnect',
          address: accounts[0],
          chainId,
          timestamp: Date.now(),
          version: '1.0',
        })
      );
    } catch (error) {
      runInAction(() => {
        this.evmError = this.parseEVMError(error);
        this.evmConnecting = false;
      });
      throw error;
    }
  }

  // EVM: disconnect
  async disconnectEVM() {
    try {
      if (this.evmWalletInfo?.providerType === 'walletconnect') {
        try {
          const { getWalletConnectProvider, resetWalletConnectProvider } = await import(
            '@/lib/walletconnect'
          );
          const provider = await getWalletConnectProvider();
          await provider.disconnect();
          resetWalletConnectProvider();
        } catch {
          // Already disconnected
        }
      }
    } finally {
      runInAction(() => {
        this.evmWalletInfo = null;
        this.evmError = null;
      });
      this._evmProvider = null;
      localStorage.removeItem('bitbasel_evm_wallet');
    }
  }

  // EVM: clear error
  clearEVMError() {
    this.evmError = null;
  }

  // EVM: attach account/chain listeners to an EIP-1193 provider
  private setupEVMProviderListeners(provider: EIP1193Provider) {
    provider.on('accountsChanged', (accounts: unknown) => {
      const accs = accounts as string[];
      if (accs.length === 0 || (this.evmWalletInfo && accs[0] !== this.evmWalletInfo.address)) {
        this.disconnectEVM();
      }
    });

    provider.on('chainChanged', (chainId: unknown) => {
      runInAction(() => {
        if (this.evmWalletInfo) {
          this.evmWalletInfo.chainId = parseInt(chainId as string, 16);
        }
      });
    });
  }

  private parseEVMError(error: unknown): string {
    if (error instanceof Error) {
      if (error.message.includes('User rejected') || error.message.includes('user rejected')) {
        return 'Connection was cancelled';
      }
      if (error.message.includes('project ID')) {
        return 'WalletConnect not configured. Contact support.';
      }
      return error.message;
    }
    return 'Connection failed';
  }

  // Computed values — Bitcoin
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

  // Computed values — EVM
  get isEVMConnected() {
    return !!this.evmWalletInfo?.connected;
  }

  get shortEVMAddress() {
    if (!this.evmWalletInfo?.address) return '';
    const addr = this.evmWalletInfo.address;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  get evmProvider(): EIP1193Provider | null {
    return this._evmProvider;
  }

  get evmChainName() {
    const chainId = this.evmWalletInfo?.chainId;
    if (!chainId) return '';
    const names: Record<number, string> = {
      1: 'Ethereum',
      137: 'Polygon',
      8453: 'Base',
      42161: 'Arbitrum',
      10: 'Optimism',
      56: 'BNB Chain',
    };
    return names[chainId] || `Chain ${chainId}`;
  }
}
