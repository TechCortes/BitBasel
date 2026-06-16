'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useWalletStore } from '@/store/StoreProvider';
import { WalletProvider } from '@/types/wallet';

const WALLET_PROVIDERS = [
  {
    id: 'unisat',
    name: 'Unisat',
    icon: '🔶',
    installed: () => !!(window as any).unisat,
  },
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
] as const;

interface WalletConnectProps {
  onClose?: () => void;
  showModal?: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = observer(({ onClose, showModal = false }) => {
  const walletStore = useWalletStore();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [securityChecked, setSecurityChecked] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState<Record<string, number>>({});

  const validateConnection = useCallback(
    (provider: WalletProvider): boolean => {
      if (typeof window === 'undefined') return false;

      const attempts = connectionAttempts[provider] || 0;
      if (attempts >= 3) {
        walletStore.error = `Too many connection attempts for ${provider}. Please refresh and try again.`;
        return false;
      }

      return true;
    },
    [connectionAttempts, walletStore]
  );

  const handleConnect = async (provider: WalletProvider) => {
    if (!validateConnection(provider)) return;

    setConnecting(provider);
    setConnectionAttempts((prev) => ({
      ...prev,
      [provider]: (prev[provider] || 0) + 1,
    }));

    try {
      await walletStore.connectWallet(provider);
      setConnectionAttempts((prev) => ({ ...prev, [provider]: 0 }));
      onClose?.();
    } catch (error) {
      console.error('Failed to connect:', error);
      setTimeout(() => setConnecting(null), 1000);
    } finally {
      setTimeout(() => setConnecting(null), 500);
    }
  };

  const handleDisconnect = async () => {
    try {
      await walletStore.disconnectWallet();
      onClose?.();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  if (walletStore.isConnected && !showModal) {
    const provider = WALLET_PROVIDERS.find((p) => p.id === walletStore.walletInfo?.provider);
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <span className="wallet-provider">{provider?.icon || '🔗'}</span>
          <span className="wallet-address">{walletStore.shortAddress}</span>
          <span className="wallet-balance">{walletStore.balanceInBTC.toFixed(6)} BTC</span>
        </div>
        <button className="btn-outline disconnect-btn" onClick={handleDisconnect}>
          Disconnect
        </button>
      </div>
    );
  }

  if (!showModal) {
    return <button className="btn-primary connect-wallet-btn">Connect Wallet</button>;
  }

  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal-header">
          <h2 className="text-heading-2">Connect Wallet</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {walletStore.error && (
          <div className="error-message">
            {walletStore.error}
            <button className="clear-error-btn" onClick={() => walletStore.clearError()}>
              ×
            </button>
          </div>
        )}

        <div className="wallet-providers">
          {WALLET_PROVIDERS.map((provider) => {
            const isInstalled = provider.installed ? provider.installed() : true;
            const isConnecting = connecting === provider.id;
            const attempts = connectionAttempts[provider.id] || 0;
            const isBlocked = attempts >= 3;

            return (
              <button
                key={provider.id}
                className={`wallet-provider ${!isInstalled ? 'not-installed' : ''} ${isBlocked ? 'blocked' : ''}`}
                onClick={() => isInstalled && !isBlocked && handleConnect(provider.id)}
                disabled={!isInstalled || !!connecting || isBlocked}
              >
                <div className="provider-icon">{provider.icon}</div>
                <div className="provider-info">
                  <div className="provider-name">{provider.name}</div>
                  <div className="provider-description">
                    {isBlocked
                      ? 'Connection blocked - refresh to retry'
                      : !isInstalled
                        ? 'Not installed'
                        : `${provider.name} wallet ${attempts > 0 ? `(${attempts}/3 attempts)` : ''}`}
                  </div>
                </div>
                {isConnecting && <div className="connecting-spinner">⟳</div>}
              </button>
            );
          })}
        </div>

        <div className="wallet-modal-footer">
          <p className="text-small">By connecting, you agree to BitBasel's Terms of Service</p>
        </div>
      </div>
    </div>
  );
});

export default WalletConnect;
