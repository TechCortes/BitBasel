import type { EIP6963ProviderDetail } from '@/types/wallet';

export function watchEIP6963Providers(
  onProvider: (detail: EIP6963ProviderDetail) => void
): () => void {
  const handler = (event: Event) => {
    const e = event as CustomEvent;
    if (e.detail?.info && e.detail?.provider) {
      onProvider(e.detail as EIP6963ProviderDetail);
    }
  };

  window.addEventListener('eip6963:announceProvider', handler);
  window.dispatchEvent(new Event('eip6963:requestProvider'));

  return () => window.removeEventListener('eip6963:announceProvider', handler);
}
