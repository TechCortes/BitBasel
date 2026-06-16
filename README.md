# BitBasel

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-Ordinals-f7931a?style=flat-square&logo=bitcoin)](https://ordinals.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

BitBasel is an institutional-grade marketplace uniting Bitcoin Ordinals, physical fine art, and dynamic NFTs. The platform serves collectors, galleries, and artists through a curated exhibition model anchored on-chain.

## Table of Contents

- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Architecture

BitBasel is a Next.js 14 App Router application with client-side Bitcoin wallet integration and MobX reactive state management. A full architectural breakdown — including system diagrams, data flow, and scalability notes — is available in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

**Key directories:**

```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── artists/          # Artist profile routes
│   └── artworks/         # Physical artwork acquisition routes
├── components/           # Reusable React components
│   └── physical/         # Physical fine art sub-system
├── store/                # MobX state management
├── types/                # TypeScript type definitions
├── styles/               # CSS design system
└── data/                 # Development mock data
```

**Technology stack:**

| Layer | Technology |
|---|---|
| Framework | Next.js 14 with App Router |
| Language | TypeScript (strict mode) |
| State management | MobX 6 |
| HTTP client | Axios |
| Code quality | ESLint + Prettier + Husky |
| Wallet integration | Unisat, Xverse, Leather, Ordinals Wallet, Phantom |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
git clone https://github.com/TechCortes/BitBasel.git
cd BitBasel
npm install
```

### Environment setup

Copy the example environment file and populate the required values:

```bash
cp .env.example .env.development
```

Start the development server:

```bash
npm run dev
```

The application is available at `http://localhost:3000`.

---

## Configuration

All configuration is provided through environment variables. See [`.env.example`](.env.example) for the full reference. Never commit `.env.development` or `.env.production` — these are excluded by `.gitignore`.

| Variable | Required | Description |
|---|---|---|
| `API_URL` | Yes | Backend API base URL |
| `BASE_URL` | Yes | Public-facing application URL |
| `WALLET_CONNECT_PROJECT_ID` | Yes | WalletConnect project identifier |
| `BITCOIN_NETWORK` | Yes | `mainnet` or `testnet` |
| `ORDINALS_API_URL` | Yes | Bitcoin Ordinals API endpoint |
| `TWITTER_URL` | No | Social link rendered in footer |
| `DISCORD_URL` | No | Social link rendered in footer |
| `TELEGRAM_URL` | No | Social link rendered in footer |

---

## Development

```bash
# Start development server with hot reload
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Fix lint issues automatically
npm run lint:fix

# Format code
npm run prettier

# Production build
npm run build

# Start production server
npm start
```

Pre-commit hooks run `eslint` and `prettier` automatically via Husky. All commits must pass type checking, linting, and formatting.

---

## Deployment

### Vercel (recommended)

Connect the repository in the Vercel dashboard and set the [environment variables](#configuration) for each target environment. No additional configuration is required — the project deploys with zero configuration.

```bash
# Install Vercel CLI
npm i -g vercel

# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Self-hosted

```bash
npm run build
npm start
```

The application binds to port 3000 by default. Set the `PORT` environment variable to override.

---

## Security

BitBasel uses a client-side-only wallet architecture. No private keys are transmitted to or stored on any server. All transaction signing occurs locally within the user's wallet extension.

Full security documentation — including our responsible disclosure policy and bug bounty program — is available in [`SECURITY.md`](SECURITY.md).

To report a vulnerability, contact **security@bitbasel.miami**.

---

## Contributing

Contributions are welcome. Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch naming conventions, pull request requirements, and code standards before submitting changes. All contributors are expected to follow the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

---

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

&copy; 2026 BitBasel. All rights reserved.
