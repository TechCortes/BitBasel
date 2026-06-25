'use client';

import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useWalletStore } from '@/store/StoreProvider';
import type { WalletProvider, EIP6963ProviderDetail } from '@/types/wallet';

type Tab = 'bitcoin' | 'evm';

// ── SVG wallet icons ───────────────────────────────────────────────────────────

const PhantomIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="10" fill="#9945FF" />
    <path
      d="M5 20.5C5 13.6 10.6 8 17.5 8H21C27.6 8 33 13.4 33 20v1c0 4.1-3.4 7.5-7.5 7.5H24c-.8 0-1.4.5-1.5 1.3l-.5 2.2H21c-.6 0-1-.4-1-1v-1h-2v1c0 .6-.4 1-1 1h-1l-.5-2.2c-.2-.8-.7-1.3-1.5-1.3H12.5C8.4 28.5 5 25.1 5 21v-.5z"
      fill="white"
    />
    <circle cx="15" cy="20" r="2.2" fill="#9945FF" />
    <circle cx="23" cy="20" r="2.2" fill="#9945FF" />
  </svg>
);

const LeatherIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="10" fill="#0C0C0C" />
    <rect x="1" y="1" width="36" height="36" rx="9" stroke="#2a2a2a" strokeWidth="1" />
    <path
      d="M12 10h5c5.5 0 9 3.8 9 9s-3.5 9-9 9h-5V10zm5 15c3.3 0 6-2.4 6-6s-2.7-6-6-6h-2v12h2z"
      fill="white"
    />
    <rect x="12" y="27" width="12" height="2.5" rx="1.25" fill="white" />
  </svg>
);

const UnisatIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="10" fill="#FF7828" />
    <path
      d="M14 10h3v13c0 1.1 1 2 2 2s2-.9 2-2V10h3v13c0 2.8-2.2 5-5 5s-5-2.2-5-5V10z"
      fill="white"
    />
    <rect x="10" y="26" width="18" height="2.5" rx="1.25" fill="white" />
  </svg>
);

const XverseIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="10" fill="#1A1A2E" />
    <path
      d="M10 10h4.5l4.5 6.5L23.5 10H28l-7 10 8 12h-4.5L19 25l-5 7h-4.5l8-12-7.5-10z"
      fill="white"
    />
  </svg>
);

const WalletConnectIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="10" fill="#3B99FC" />
    <path d="M8 18c6.1-6.1 16-6.1 22 0" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path
      d="M11.5 21.5c4.2-4.2 11-4.2 15.2 0"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path d="M15 25c2.2-2.2 6-2.2 8.2 0" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const FallbackEVMIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="10" fill="#627EEA" />
    <path d="M19 8v8.7l7.3 3.3L19 8z" fill="white" fillOpacity="0.6" />
    <path d="M19 8L11.7 20l7.3-3.3V8z" fill="white" />
    <path d="M19 25.1v4.9l7.3-10.1L19 25.1z" fill="white" fillOpacity="0.6" />
    <path d="M19 30v-4.9l-7.3-5.2L19 30z" fill="white" />
  </svg>
);

// ── Bitcoin wallet config ──────────────────────────────────────────────────────

interface BitcoinWallet {
  id: WalletProvider;
  name: string;
  tagline: string;
  installUrl: string;
  mobileUrl: string | null;
  Icon: React.FC;
  detect: () => boolean;
}

const BITCOIN_WALLETS: BitcoinWallet[] = [
  {
    id: 'phantom',
    name: 'Phantom',
    tagline: 'Bitcoin · Ordinals',
    installUrl: 'https://phantom.app/download',
    mobileUrl: null,
    Icon: PhantomIcon,
    detect: () => !!(window as any).phantom?.bitcoin,
  },
  {
    id: 'leather',
    name: 'Leather',
    tagline: 'Bitcoin · Ordinals · Stacks',
    installUrl: 'https://leather.io/install-extension',
    mobileUrl: null,
    Icon: LeatherIcon,
    detect: () => !!(window as any).LeatherProvider,
  },
  {
    id: 'unisat',
    name: 'Unisat',
    tagline: 'Bitcoin · BRC-20 · Ordinals',
    installUrl: 'https://unisat.io/download',
    mobileUrl: null,
    Icon: UnisatIcon,
    detect: () => !!(window as any).unisat,
  },
  {
    id: 'xverse',
    name: 'Xverse',
    tagline: 'Bitcoin · Ordinals · Runes',
    installUrl: 'https://www.xverse.app/download',
    mobileUrl: 'https://www.xverse.app/open',
    Icon: XverseIcon,
    detect: () => !!(window as any).BitcoinProvider && !!(window as any).StacksProvider,
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

interface WalletConnectProps {
  onClose?: () => void;
  showModal?: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = observer(({ onClose, showModal = false }) => {
  const walletStore = useWalletStore();
  const [activeTab, setActiveTab] = useState<Tab>('bitcoin');
  const [connecting, setConnecting] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Focus the modal when it opens
  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showModal]);

  // Close on Escape key
  useEffect(() => {
    if (!showModal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showModal, onClose]);

  const handleBitcoinConnect = async (id: WalletProvider) => {
    if (connecting) return;
    setConnecting(id);
    try {
      await walletStore.connectWallet(id);
      onClose?.();
    } catch {
      // error is set in walletStore.error (auto-clears in 5s)
    } finally {
      setConnecting(null);
    }
  };

  const handleEVMConnect = async (detail: EIP6963ProviderDetail) => {
    const key = `evm-${detail.info.uuid}`;
    if (connecting) return;
    setConnecting(key);
    try {
      await walletStore.connectEVMProvider(detail);
      onClose?.();
    } catch {
      // error is set in walletStore.evmError
    } finally {
      setConnecting(null);
    }
  };

  const handleWalletConnectConnect = async () => {
    if (connecting) return;
    setConnecting('walletconnect');
    try {
      await walletStore.connectWalletConnect();
      onClose?.();
    } catch {
      // error is set in walletStore.evmError
    } finally {
      setConnecting(null);
    }
  };

  const handleBitcoinDisconnect = async () => {
    await walletStore.disconnectWallet();
    onClose?.();
  };

  const handleEVMDisconnect = async () => {
    await walletStore.disconnectEVM();
    onClose?.();
  };

  // ── Nav bar: connected ─────────────────────────────────────────────────────
  if ((walletStore.isConnected || walletStore.isEVMConnected) && !showModal) {
    return (
      <div className="wallet-connected-group">
        {walletStore.isConnected && (
          <div className="wallet-connected">
            <span className="wallet-dot" />
            <span className="wallet-address">{walletStore.shortAddress}</span>
            <button className="btn-outline disconnect-btn" onClick={handleBitcoinDisconnect}>
              Disconnect
            </button>
          </div>
        )}
        {walletStore.isEVMConnected && (
          <div className="wallet-connected">
            {walletStore.evmWalletInfo?.providerIcon && (
              <img
                src={walletStore.evmWalletInfo.providerIcon}
                alt=""
                className="evm-provider-icon-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span className="wallet-dot" />
            <span className="wallet-address">{walletStore.shortEVMAddress}</span>
            <button className="btn-outline disconnect-btn" onClick={handleEVMDisconnect}>
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Nav bar: not connected ─────────────────────────────────────────────────
  if (!showModal) {
    return <button className="btn-primary connect-wallet-btn">Connect Wallet</button>;
  }

  // ── Modal ──────────────────────────────────────────────────────────────────
  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="wallet-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="wallet-modal-header">
          <span id="wallet-modal-title" className="wallet-modal-title">Connect Wallet</span>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="wallet-tab-bar">
          <button
            className={`wallet-tab-btn${activeTab === 'bitcoin' ? ' active' : ''}`}
            onClick={() => setActiveTab('bitcoin')}
          >
            Bitcoin
          </button>
          <button
            className={`wallet-tab-btn${activeTab === 'evm' ? ' active' : ''}`}
            onClick={() => setActiveTab('evm')}
          >
            EVM · Web3
          </button>
        </div>

        {/* Error banner */}
        {(activeTab === 'bitcoin' ? walletStore.error : walletStore.evmError) && (
          <div className="wallet-error-banner">
            <span>{activeTab === 'bitcoin' ? walletStore.error : walletStore.evmError}</span>
            <button
              className="wallet-error-dismiss"
              onClick={() =>
                activeTab === 'bitcoin' ? walletStore.clearError() : walletStore.clearEVMError()
              }
            >
              ×
            </button>
          </div>
        )}

        {/* ── Bitcoin tab ────────────────────────────────────────────── */}
        {activeTab === 'bitcoin' && (
          <div className="wallet-list">
            {walletStore.isConnected ? (
              <div className="wallet-connected-panel">
                <div className="wallet-connected-panel-row">
                  <span className="wallet-dot wallet-dot-lg" />
                  <div>
                    <p className="wallet-connected-addr">{walletStore.shortAddress}</p>
                    <p className="wallet-connected-sub">
                      {walletStore.balanceInBTC.toFixed(6)} BTC
                    </p>
                  </div>
                </div>
                <button
                  className="btn-outline wallet-disconnect-btn"
                  onClick={handleBitcoinDisconnect}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              BITCOIN_WALLETS.map((wallet) => {
                const isInstalled = isMounted ? wallet.detect() : false;
                const isConnecting = connecting === wallet.id;
                const { Icon } = wallet;

                const installTarget =
                  isMobile && wallet.mobileUrl ? wallet.mobileUrl : wallet.installUrl;

                return (
                  <div
                    key={wallet.id}
                    className={`wallet-row${isInstalled ? ' wallet-row--active' : ' wallet-row--install'}${isConnecting ? ' wallet-row--connecting' : ''}`}
                  >
                    <button
                      className="wallet-row-btn"
                      onClick={() => isInstalled && handleBitcoinConnect(wallet.id)}
                      disabled={!isInstalled || !!connecting}
                      aria-label={`Connect ${wallet.name}`}
                    >
                      <div className="wallet-row-icon">
                        <Icon />
                      </div>
                      <div className="wallet-row-info">
                        <span className="wallet-row-name">{wallet.name}</span>
                        <span className="wallet-row-sub">{wallet.tagline}</span>
                      </div>
                      {isConnecting ? (
                        <span className="wallet-spinner" aria-hidden="true" />
                      ) : isInstalled ? (
                        <span className="wallet-row-arrow">→</span>
                      ) : null}
                    </button>
                    {!isInstalled && (
                      <a
                        href={installTarget}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wallet-install-btn"
                      >
                        {isMobile && wallet.mobileUrl ? 'Open app →' : 'Install →'}
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── EVM tab ────────────────────────────────────────────────── */}
        {activeTab === 'evm' && (
          <div className="wallet-list">
            {walletStore.isEVMConnected ? (
              <div className="wallet-connected-panel">
                <div className="wallet-connected-panel-row">
                  {walletStore.evmWalletInfo?.providerIcon ? (
                    <img
                      src={walletStore.evmWalletInfo.providerIcon}
                      alt=""
                      className="wallet-connected-provider-icon"
                    />
                  ) : (
                    <span className="wallet-dot wallet-dot-lg" />
                  )}
                  <div>
                    <p className="wallet-connected-addr">{walletStore.shortEVMAddress}</p>
                    <p className="wallet-connected-sub">{walletStore.evmChainName}</p>
                  </div>
                </div>
                <button className="btn-outline wallet-disconnect-btn" onClick={handleEVMDisconnect}>
                  Disconnect
                </button>
              </div>
            ) : (
              <>
                {/* WalletConnect — always first, works on mobile + desktop */}
                <div
                  className={`wallet-row wallet-row--active wallet-row--featured${connecting === 'walletconnect' ? ' wallet-row--connecting' : ''}`}
                >
                  <button
                    className="wallet-row-btn"
                    onClick={handleWalletConnectConnect}
                    disabled={!!connecting || walletStore.evmConnecting}
                  >
                    <div className="wallet-row-icon">
                      <WalletConnectIcon />
                    </div>
                    <div className="wallet-row-info">
                      <span className="wallet-row-name">WalletConnect</span>
                      <span className="wallet-row-sub">
                        {isMobile ? 'Tap to open your wallet app' : 'Scan QR · 400+ wallets'}
                      </span>
                    </div>
                    {connecting === 'walletconnect' ? (
                      <span className="wallet-spinner" aria-hidden="true" />
                    ) : (
                      <span className="wallet-row-arrow">→</span>
                    )}
                  </button>
                </div>

                {/* WalletConnect in-progress hint */}
                {connecting === 'walletconnect' && (
                  <p className="wallet-wc-status">
                    {isMobile
                      ? 'Approve the connection in your wallet app.'
                      : 'Scan the QR code with your wallet app.'}
                  </p>
                )}

                {/* EIP-6963 auto-detected wallets */}
                {walletStore.detectedEVMProviders.length > 0 && (
                  <>
                    <p className="wallet-divider-label">Detected in browser</p>
                    {walletStore.detectedEVMProviders.map((detail) => {
                      const key = `evm-${detail.info.uuid}`;
                      const isConnecting = connecting === key;
                      return (
                        <div
                          key={detail.info.uuid}
                          className={`wallet-row wallet-row--active${isConnecting ? ' wallet-row--connecting' : ''}`}
                        >
                          <button
                            className="wallet-row-btn"
                            onClick={() => handleEVMConnect(detail)}
                            disabled={!!connecting || walletStore.evmConnecting}
                          >
                            <div className="wallet-row-icon">
                              {detail.info.icon ? (
                                <img
                                  src={detail.info.icon}
                                  alt={detail.info.name}
                                  width="38"
                                  height="38"
                                  style={{ borderRadius: 10, display: 'block' }}
                                />
                              ) : (
                                <FallbackEVMIcon />
                              )}
                            </div>
                            <div className="wallet-row-info">
                              <span className="wallet-row-name">{detail.info.name}</span>
                              <span className="wallet-row-sub">EVM · {detail.info.rdns}</span>
                            </div>
                            {isConnecting ? (
                              <span className="wallet-spinner" aria-hidden="true" />
                            ) : (
                              <span className="wallet-row-arrow">→</span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* No EVM wallet detected */}
                {walletStore.detectedEVMProviders.length === 0 && (
                  <p className="wallet-no-ext">
                    {isMobile ? (
                      'Use WalletConnect above to connect any mobile wallet.'
                    ) : (
                      <>
                        No browser wallet detected.{' '}
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Install MetaMask →
                        </a>
                      </>
                    )}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="wallet-modal-footer">
          <p>By connecting, you agree to BitBasel&apos;s Terms of Service</p>
        </div>
      </div>
    </div>
  );
});

export default WalletConnect;
