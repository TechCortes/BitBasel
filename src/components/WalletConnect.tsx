'use client';

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useWalletStore } from '@/store/StoreProvider';
import { WalletProvider, EIP6963ProviderDetail } from '@/types/wallet';

type WalletTab = 'bitcoin' | 'evm';

const BITCOIN_PROVIDERS: {
  id: WalletProvider;
  name: string;
  icon: string;
  installed: () => boolean;
}[] = [
  { id: 'unisat', name: 'Unisat', icon: '🔶', installed: () => !!(window as any).unisat },
  {
    id: 'xverse',
    name: 'Xverse',
    icon: '⚡',
    installed: () => !!(window as any).BitcoinProvider && !!(window as any).StacksProvider,
  },
  {
    id: 'ordinals-wallet',
    name: 'Ordinals',
    icon: '🎨',
    installed: () => !!(window as any).ordinalsWallet,
  },
  {
    id: 'leather',
    name: 'Leather',
    icon: '🐂',
    installed: () => !!(window as any).LeatherProvider,
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '👻',
    installed: () => !!(window as any).phantom?.bitcoin,
  },
];

interface WalletConnectProps {
  onClose?: () => void;
  showModal?: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = observer(({ onClose, showModal = false }) => {
  const walletStore = useWalletStore();
  const [activeTab, setActiveTab] = useState<WalletTab>('bitcoin');
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState<Record<string, number>>({});

  const validateBitcoinConnect = (provider: WalletProvider): boolean => {
    if (typeof window === 'undefined') return false;
    if ((connectionAttempts[provider] || 0) >= 3) {
      walletStore.error = `Too many connection attempts for ${provider}. Please refresh and try again.`;
      return false;
    }
    return true;
  };

  const handleBitcoinConnect = async (provider: WalletProvider) => {
    if (!validateBitcoinConnect(provider)) return;
    setConnecting(provider);
    setConnectionAttempts((prev) => ({ ...prev, [provider]: (prev[provider] || 0) + 1 }));
    try {
      await walletStore.connectWallet(provider);
      setConnectionAttempts((prev) => ({ ...prev, [provider]: 0 }));
      onClose?.();
    } catch {
      setTimeout(() => setConnecting(null), 1000);
    } finally {
      setTimeout(() => setConnecting(null), 500);
    }
  };

  const handleEVMProviderConnect = async (detail: EIP6963ProviderDetail) => {
    const key = `evm-${detail.info.uuid}`;
    setConnecting(key);
    try {
      await walletStore.connectEVMProvider(detail);
      onClose?.();
    } catch {
      setTimeout(() => setConnecting(null), 1000);
    } finally {
      setTimeout(() => setConnecting(null), 500);
    }
  };

  const handleWalletConnectConnect = async () => {
    setConnecting('walletconnect');
    try {
      await walletStore.connectWalletConnect();
      onClose?.();
    } catch {
      setTimeout(() => setConnecting(null), 1000);
    } finally {
      setTimeout(() => setConnecting(null), 500);
    }
  };

  const handleBitcoinDisconnect = async () => {
    try {
      await walletStore.disconnectWallet();
      onClose?.();
    } catch {
      // swallow
    }
  };

  const handleEVMDisconnect = async () => {
    try {
      await walletStore.disconnectEVM();
      onClose?.();
    } catch {
      // swallow
    }
  };

  // Non-modal: connected state shown in nav bar
  if ((walletStore.isConnected || walletStore.isEVMConnected) && !showModal) {
    const btcProvider = BITCOIN_PROVIDERS.find((p) => p.id === walletStore.walletInfo?.provider);
    return (
      <div className="wallet-connected-group">
        {walletStore.isConnected && (
          <div className="wallet-connected">
            <div className="wallet-info">
              <span className="wallet-provider">{btcProvider?.icon || '🔗'}</span>
              <span className="wallet-address">{walletStore.shortAddress}</span>
              <span className="wallet-balance">{walletStore.balanceInBTC.toFixed(6)} BTC</span>
            </div>
            <button className="btn-outline disconnect-btn" onClick={handleBitcoinDisconnect}>
              Disconnect
            </button>
          </div>
        )}
        {walletStore.isEVMConnected && (
          <div className="wallet-connected evm-connected">
            <div className="wallet-info">
              {walletStore.evmWalletInfo?.providerIcon ? (
                <img
                  src={walletStore.evmWalletInfo.providerIcon}
                  alt={walletStore.evmWalletInfo.providerName}
                  className="evm-provider-icon-sm"
                />
              ) : (
                <span className="wallet-provider">🔷</span>
              )}
              <span className="wallet-address">{walletStore.shortEVMAddress}</span>
              <span className="wallet-balance">{walletStore.evmChainName}</span>
            </div>
            <button className="btn-outline disconnect-btn" onClick={handleEVMDisconnect}>
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  // Non-modal: not connected
  if (!showModal) {
    return <button className="btn-primary connect-wallet-btn">Connect Wallet</button>;
  }

  // Modal
  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal-header">
          <h2 className="text-heading-2">Connect Wallet</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Tab bar */}
        <div className="wallet-tab-bar">
          <button
            className={`wallet-tab-btn${activeTab === 'bitcoin' ? ' active' : ''}`}
            onClick={() => setActiveTab('bitcoin')}
          >
            Bitcoin Ordinals
          </button>
          <button
            className={`wallet-tab-btn${activeTab === 'evm' ? ' active' : ''}`}
            onClick={() => setActiveTab('evm')}
          >
            EVM · Web3
          </button>
        </div>

        {/* Error banners */}
        {activeTab === 'bitcoin' && walletStore.error && (
          <div className="error-message">
            {walletStore.error}
            <button className="clear-error-btn" onClick={() => walletStore.clearError()}>
              ×
            </button>
          </div>
        )}
        {activeTab === 'evm' && walletStore.evmError && (
          <div className="error-message">
            {walletStore.evmError}
            <button className="clear-error-btn" onClick={() => walletStore.clearEVMError()}>
              ×
            </button>
          </div>
        )}

        {/* ── Bitcoin tab ── */}
        {activeTab === 'bitcoin' && (
          <>
            {walletStore.isConnected ? (
              <div className="wallet-already-connected">
                <p className="wallet-connected-label">Bitcoin Ordinals — Connected</p>
                <div className="wallet-connected-info">
                  <span>{walletStore.shortAddress}</span>
                  <span>{walletStore.balanceInBTC.toFixed(6)} BTC</span>
                </div>
                <button className="btn-outline" onClick={handleBitcoinDisconnect}>
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="wallet-providers">
                {BITCOIN_PROVIDERS.map((provider) => {
                  const isInstalled = typeof window !== 'undefined' ? provider.installed() : false;
                  const isConnecting = connecting === provider.id;
                  const attempts = connectionAttempts[provider.id] || 0;
                  const isBlocked = attempts >= 3;

                  return (
                    <button
                      key={provider.id}
                      className={`wallet-provider${!isInstalled ? ' not-installed' : ''}${isBlocked ? ' blocked' : ''}`}
                      onClick={() => isInstalled && !isBlocked && handleBitcoinConnect(provider.id)}
                      disabled={!isInstalled || !!connecting || isBlocked}
                    >
                      <div className="provider-icon">{provider.icon}</div>
                      <div className="provider-info">
                        <div className="provider-name">{provider.name}</div>
                        <div className="provider-description">
                          {isBlocked
                            ? 'Connection blocked — refresh to retry'
                            : !isInstalled
                              ? 'Not installed'
                              : attempts > 0
                                ? `${attempts}/3 attempts`
                                : 'Bitcoin Ordinals wallet'}
                        </div>
                      </div>
                      {isConnecting && <div className="connecting-spinner">⟳</div>}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── EVM tab ── */}
        {activeTab === 'evm' && (
          <>
            {walletStore.isEVMConnected ? (
              <div className="wallet-already-connected">
                <p className="wallet-connected-label">EVM Wallet — Connected</p>
                <div className="wallet-connected-info">
                  {walletStore.evmWalletInfo?.providerIcon && (
                    <img
                      src={walletStore.evmWalletInfo.providerIcon}
                      alt={walletStore.evmWalletInfo.providerName}
                      className="evm-wallet-icon-sm"
                    />
                  )}
                  <span>{walletStore.shortEVMAddress}</span>
                  <span>{walletStore.evmChainName}</span>
                </div>
                <button className="btn-outline" onClick={handleEVMDisconnect}>
                  Disconnect
                </button>
              </div>
            ) : (
              <>
                {walletStore.detectedEVMProviders.length > 0 ? (
                  <>
                    <p className="wallet-section-label">Detected in your browser</p>
                    <div className="wallet-providers">
                      {walletStore.detectedEVMProviders.map((detail) => {
                        const isConnecting = connecting === `evm-${detail.info.uuid}`;
                        return (
                          <button
                            key={detail.info.uuid}
                            className="wallet-provider"
                            onClick={() => !connecting && handleEVMProviderConnect(detail)}
                            disabled={!!connecting || walletStore.evmConnecting}
                          >
                            <div className="provider-icon-evm">
                              {detail.info.icon ? (
                                <img
                                  src={detail.info.icon}
                                  alt={detail.info.name}
                                  className="evm-wallet-icon"
                                />
                              ) : (
                                <span>🔷</span>
                              )}
                            </div>
                            <div className="provider-info">
                              <div className="provider-name">{detail.info.name}</div>
                              <div className="provider-description">EVM · {detail.info.rdns}</div>
                            </div>
                            {isConnecting && <div className="connecting-spinner">⟳</div>}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="wallet-no-providers">
                    <p>No EVM wallet detected in your browser.</p>
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wallet-install-link"
                    >
                      Install MetaMask →
                    </a>
                  </div>
                )}

                <p className="wallet-section-label">
                  {walletStore.detectedEVMProviders.length > 0
                    ? 'Or scan with mobile wallet'
                    : 'Connect via mobile wallet'}
                </p>
                <div className="wallet-providers">
                  <button
                    className="wallet-provider wallet-connect-cta"
                    onClick={() => !connecting && handleWalletConnectConnect()}
                    disabled={!!connecting || walletStore.evmConnecting}
                  >
                    <div className="provider-icon">⬡</div>
                    <div className="provider-info">
                      <div className="provider-name">WalletConnect</div>
                      <div className="provider-description">
                        Scan QR code · 400+ wallets supported
                      </div>
                    </div>
                    {connecting === 'walletconnect' && <div className="connecting-spinner">⟳</div>}
                  </button>
                </div>

                <p className="wallet-eip6963-badge">
                  EIP-6963 · Open Wallet Standard · Auto-discovery
                </p>
              </>
            )}
          </>
        )}

        <div className="wallet-modal-footer">
          <p className="text-small">By connecting, you agree to BitBasel&apos;s Terms of Service</p>
        </div>
      </div>
    </div>
  );
});

export default WalletConnect;
