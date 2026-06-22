# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Project Overview

BitBasel is an institutional-grade marketplace for Bitcoin Ordinals and physical fine art. It is a Next.js 14 App Router application with client-side Bitcoin wallet integration, a physical artwork acquisition flow, and MobX reactive state management.

The platform has two primary product surfaces:

1. **Digital marketplace** — Bitcoin Ordinals browsing, collections, and trading.
2. **Physical art gallery** — Represented artists, provenance records, inquiry-based acquisition.

## Technology Stack

- **Framework**: Next.js 14.2.32 with App Router
- **Language**: TypeScript (strict mode)
- **State management**: MobX 6
- **HTTP client**: Axios
- **Code quality**: ESLint + Prettier + Husky pre-commit hooks
- **Wallet integration**: Unisat, Xverse, Leather, Ordinals Wallet, Phantom

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Production build
npm start            # Start production server
npm run type-check   # TypeScript check (no emit)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run prettier     # Prettier format all files
npm run prettier:check  # Prettier check without writing
```

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, metadata, global CSS imports
│   ├── page.tsx                # Homepage — hero, featured collections, physical works
│   ├── artists/                # Artist listing and profile routes
│   └── artworks/               # Physical artwork grid and detail routes
├── components/
│   ├── Navigation.tsx          # Site navigation with wallet connect trigger
│   ├── WalletConnect.tsx       # Multi-wallet connection modal
│   ├── MarketplaceGrid.tsx     # Ordinals / collections grid
│   ├── OrdinalCard.tsx         # Individual ordinal card
│   ├── CollectionCard.tsx      # Collection card
│   ├── Footer.tsx              # Site footer
│   └── physical/               # Physical art sub-system
│       ├── ArtworkCard.tsx
│       ├── ArtworkDetail.tsx
│       ├── ArtworkFilter.tsx
│       ├── ArtistCard.tsx
│       ├── ArtistProfile.tsx
│       ├── InquireModal.tsx
│       ├── ProvenanceTimeline.tsx
│       └── DimensionsToggle.tsx
├── store/
│   ├── MarketplaceStore.ts         # Ordinals, collections, filtering, search
│   ├── WalletStore.ts              # Wallet connection, transactions, session
│   ├── PhysicalMarketplaceStore.ts # Physical artworks, artists, inquiries
│   └── StoreProvider.tsx           # Root store context
├── types/
│   ├── ordinals.ts             # Ordinal, Collection, Gallery, MarketplaceStats
│   ├── wallet.ts               # WalletInfo, WalletProvider, TransactionStatus
│   └── physicalArt.ts          # PhysicalArtwork, PhysicalArtist, ArtworkInquiry
├── styles/
│   ├── globals.css             # Root CSS variables and base styles
│   ├── components.css          # Digital marketplace component styles
│   └── physical.css            # Physical art design system (institutional B&W)
└── data/
    ├── mockData.ts             # Development mock data for ordinals/collections
    └── physicalMockData.ts     # Development mock data for physical artworks/artists
```

### State Management

Each store domain is independent:

- `MarketplaceStore` — ordinals, collections, search/filter state, price data.
- `WalletStore` — connection lifecycle, security monitoring, transaction signing, balance.
- `PhysicalMarketplaceStore` — physical artworks, artist bios, inquiry submission.

Access stores via hooks exported from `StoreProvider.tsx`:

```ts
const marketplaceStore = useMarketplaceStore();
const walletStore = useWalletStore();
const physicalStore = usePhysicalMarketplaceStore();
```

### Design System

Two visual systems coexist:

- **Digital / Ordinals**: Dark background, pink accent (`#ff1493`), Machina typeface, neon glow. Styles in `globals.css` + `components.css`.
- **Physical / Fine Art**: Black-and-white institutional, wall-label typography, accordion details, cm/in toggle. Styles in `physical.css`.

## Environment Variables

Environment files (`.env.development`, `.env.production`) are excluded from version control. Use `.env.example` as the reference template.

Required variables:

- `API_URL` — Backend API base URL
- `BASE_URL` — Public-facing application URL
- `WALLET_CONNECT_PROJECT_ID`
- `BITCOIN_NETWORK` — `mainnet` or `testnet`
- `ORDINALS_API_URL`

## Development Guidelines

### Components

- Functional components only; MobX state consumers must be wrapped with `observer`.
- Props interfaces defined in the same file as the component.
- No `console.log`, `console.debug`, or `// TODO` in committed code.
- No inline styles for values that belong in the CSS design system.

### Wallet Integration

- All wallet operations are client-side only. No private key handling server-side.
- `WalletStore` validates the stored wallet session on load (24-hour expiry, structural validation).
- Balance for wallets without a native `getBalance` RPC (Leather, Phantom) is fetched via the Blockstream API (`https://blockstream.info/api/address/<address>`).
- To add a new wallet provider: implement a `connect<Provider>` method in `WalletStore`, add the provider to `WALLET_PROVIDERS` in `WalletConnect.tsx`, and extend `WalletProvider` in `types/wallet.ts`.

### Physical Art Acquisition Flow

- Pricing may be `null` (price on application). The `InquireModal` handles both priced and POA works.
- Provenance records are ordered chronologically in `ProvenanceTimeline`.
- The `DimensionsToggle` stores the user's cm/in preference in component state (no persistence needed).

### Adding New Routes

1. Create the page file under `src/app/<route>/page.tsx`.
2. If the page reads from a store, import the relevant hook from `StoreProvider.tsx`.
3. Add corresponding navigation entries in `Navigation.tsx`.
4. Write page-level CSS in the appropriate stylesheet (`components.css` for digital, `physical.css` for physical art).

## What NOT to Build

- Do not remove SOL from payment references — Solana payments are live alongside USDC, ETH, and BTC.

## Security Notes

- Never add private keys, seed phrases, or production secrets to any file in this repository.
- Wallet session data in `localStorage` uses the key `bitbasel_wallet` and contains only: `{ provider, address, timestamp, version }`.
- Security monitoring runs on a 30-second interval in `WalletStore.setupSecurityMonitoring()` and auto-disconnects on account change.

## Documentation

- [`README.md`](README.md) — Public-facing project overview and setup guide.
- [`SECURITY.md`](SECURITY.md) — Responsible disclosure and security architecture.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Branch conventions, commit standards, PR process.
- [`CHANGELOG.md`](CHANGELOG.md) — Version history in Keep a Changelog format.
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — Community standards.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System architecture and diagrams.
