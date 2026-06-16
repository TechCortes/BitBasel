# Changelog

All notable changes to BitBasel are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Blockstream API fallback for balance fetching on wallets without a native `getBalance` RPC (Leather, Phantom).

---

## [0.3.0] — 2026-05-10

### Added
- Physical fine art marketplace: acquisition flow for physical artworks alongside Bitcoin Ordinals.
- Four represented artists (Santos, Chen, Reyes, Costa) with full CVs and biographies.
- Eight artworks with provenance records, exhibition history, and pricing (including price-on-application).
- `PhysicalMarketplaceStore` (MobX) with filtering and inquiry submission.
- Routes: `/artworks` (grid + filter sidebar), `/artworks/[id]` (detail view), `/artists`, `/artists/[id]`.
- Components: `ArtworkCard`, `ArtworkDetail`, `ArtistCard`, `ArtistProfile`, `InquireModal`, `ArtworkFilter`, `ProvenanceTimeline`, `DimensionsToggle`.
- Institutional design system (`physical.css`): wall-label format, accordion details, centimetre/inch toggle.
- Homepage "Physical Works" section connected to live store data.
- Navigation updated: "Artists" links to `/artists`; "Acquire" links to `/artworks`.

### Changed
- Navigation item "Artists" now routes to `/artists` (previously `/galleries`).

---

## [0.2.0] — 2026-04-15

### Added
- Enhanced wallet security: connection attempt rate limiting, 24-hour session expiry, wallet state validation on interval.
- Account-change listeners for Unisat and Phantom that auto-disconnect on address change.
- Connection recovery mechanism with retry logic.
- `SECURITY.md` with responsible disclosure policy and bug bounty programme details.
- `docs/ARCHITECTURE.md` with system diagram and technical specifications.

### Changed
- Wallet session storage now includes a version field for forward compatibility.
- Balance update failures use exponential backoff with a maximum of three retries.

### Fixed
- `WalletStore.checkExistingConnection` no longer throws when `localStorage` contains malformed data.

---

## [0.1.0] — 2026-04-13

### Added
- Initial release of the BitBasel platform.
- Bitcoin Ordinals marketplace with collection browsing and search.
- Multi-wallet support: Unisat, Xverse, Leather, Ordinals Wallet, Phantom.
- `MarketplaceStore` with filtering, sorting, and search.
- `WalletStore` with connect, disconnect, sign message, and send Bitcoin.
- Responsive gallery UI with pink-accented design system.
- Next.js 14 App Router with TypeScript strict mode.
- MobX 6 reactive state management.
- ESLint + Prettier + Husky pre-commit quality gates.

[Unreleased]: https://github.com/TechCortes/BitBasel/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/TechCortes/BitBasel/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/TechCortes/BitBasel/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/TechCortes/BitBasel/releases/tag/v0.1.0
