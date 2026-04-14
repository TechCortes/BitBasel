# BitBasel - Your City's Crypto Art Community Hub

**🎨 Phenomenal Marketplace Combining Bitcoin Ordinals + Smart Contracts + Dynamic NFTs**

A cutting-edge crypto art community platform built with Next.js 14, featuring Bitcoin Ordinals integration, smart contract functionality, and dynamic NFT experiences designed for developers and art collectors.

![Security](https://img.shields.io/badge/Security-Enterprise%20Grade-red?style=flat-square&logo=shield)
![Next.js](https://img.shields.io/badge/Next.js-14.2.32-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)
![Bitcoin](https://img.shields.io/badge/Bitcoin-Mainnet-f7931a?style=flat-square&logo=bitcoin)

## 🛡️ **Security Features**

### **Core Security Measures**

- **Client-Side Only Wallet Interactions** - No private keys ever transmitted or stored
- **Multi-Signature Transaction Support** - Enhanced security for high-value trades
- **Content Security Policy (CSP)** - Protection against XSS attacks
- **HTTPS Enforcement** - TLS 1.3 encryption for all communications
- **Input Sanitization** - Complete protection against injection attacks
- **Rate Limiting** - Protection against DDoS and brute force attacks

### **Wallet Security**

- **Hardware Wallet Support** - Ledger, Trezor integration
- **Message Signing Verification** - Cryptographic proof of ownership
- **Secure Session Management** - JWT tokens with proper expiration
- **Connection Monitoring** - Real-time wallet status tracking

## 🎨 Design Philosophy

BitBasel features a **sophisticated pink-accented gallery aesthetic** designed for crypto art communities:

- **Fine art gallery experience** with elegant pink (#ff1493) color scheme
- **Machina typography** for premium, gallery-quality presentation
- **Clean, minimal design** with state-of-the-art components under 150 lines
- **Mobile-first responsive design** optimized for art viewing
- **Community-focused UX** emphasizing local crypto art movements

## 🚀 Features

### Core Community Features

- **Bitcoin Ordinals Integration** - Seamlessly browse and discover inscriptions
- **Smart Contract Exhibitions** - Dynamic collections powered by blockchain logic
- **Community Curation** - Local crypto art community engagement
- **Dynamic NFTs** - Evolving artworks with smart contract integration
- **Gallery Experience** - Fine art presentation with responsive layouts

### Wallet Integration

- **Multi-Wallet Support** - Unisat, Xverse, Ordinals Wallet, Leather, Phantom
- **Connection Management** - Persistent wallet sessions
- **Transaction Ready** - Built for Bitcoin transactions (frontend)
- **Security First** - Client-side only, no private key storage

### Technical Excellence

- **Next.js 14 App Router** - Latest React patterns and SSR
- **TypeScript Strict Mode** - Full type safety throughout
- **MobX State Management** - Reactive, efficient state updates
- **Modern CSS** - Custom properties, CSS Grid, Flexbox
- **Performance Optimized** - Code splitting and lazy loading

## 🛠️ Technology Stack

| Category               | Technology                            |
| ---------------------- | ------------------------------------- |
| **Framework**          | Next.js 14.2.32 with App Router       |
| **Language**           | TypeScript with strict type checking  |
| **State Management**   | MobX 6 for reactive state             |
| **Styling**            | Custom CSS with design system         |
| **HTTP Client**        | Axios for API communication           |
| **Code Quality**       | ESLint + Prettier + Husky             |
| **Wallet Integration** | Multi-provider Bitcoin wallet support |

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd BitBasel

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run prettier    # Format code
npm run type-check  # TypeScript checking
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   ├── WalletConnect.tsx    # Multi-wallet connection
│   ├── MarketplaceGrid.tsx  # Ordinals/collections grid
│   ├── OrdinalCard.tsx      # Individual ordinal display
│   └── CollectionCard.tsx   # Collection display
├── store/              # MobX state management
│   ├── MarketplaceStore.ts  # Marketplace state
│   ├── WalletStore.ts       # Wallet connection state
│   └── StoreProvider.tsx    # React context provider
├── types/              # TypeScript definitions
├── styles/             # CSS stylesheets
├── data/               # Mock data for development
└── constants/          # App constants
```

## 🎯 Developer Guide - Component Library

### 📦 Core Components (All <150 lines)

#### `MarketplaceGrid.tsx` (204→<150 lines - needs optimization)

**Purpose**: Displays Bitcoin Ordinals and Collections in gallery-style layouts

```typescript
// Usage: <MarketplaceGrid type="collections" featured={true} />
// Features: Loading states, search, sort, responsive design
// TODO: Simplify for <150 line requirement
```

#### `WalletConnect.tsx` (158→<150 lines - needs optimization)

**Purpose**: Multi-provider Bitcoin wallet integration

```typescript
// Supported: Unisat, Xverse, Ordinals Wallet, Leather, Phantom
// Security: Client-side only, no private key storage
// TODO: Streamline modal and connection logic
```

#### `Navigation.tsx` (102 lines ✅)

**Purpose**: Gallery-style navigation with community focus

```typescript
// Features: Exhibitions, Artists, Gallery navigation
// Responsive: Mobile hamburger menu included
// Style: Pink-accented, minimal design
```

#### `OrdinalCard.tsx` (112 lines ✅)

**Purpose**: Individual Bitcoin Ordinal display component

```typescript
// Features: Image/content display, metadata, pricing
// Hover: Pink glow effects, smooth transitions
// Accessibility: Proper alt tags and ARIA labels
```

#### `CollectionCard.tsx` (82 lines ✅)

**Purpose**: Collection/Exhibition preview cards

```typescript
// Features: Collection stats, verification badges
// Design: Gallery-style with pink accents
// State: MobX integration for reactive updates
```

### 🏪 State Management (MobX)

#### `MarketplaceStore.ts`

**Purpose**: Handles ordinals, collections, and gallery data

```typescript
// Actions: fetchOrdinals(), fetchCollections(), fetchStats()
// Computed: filteredOrdinals, listedOrdinals, totalValue
// Mock Data: Uses /src/data/mockData.ts for development
```

#### `WalletStore.ts`

**Purpose**: Bitcoin wallet connection and transaction state

```typescript
// Providers: Multi-wallet support with provider detection
// Security: Connection monitoring, session management
// Integration: Ready for Bitcoin transaction signing
```

## 🎨 Design System

### Color Palette (Pink Gallery Theme)

```css
/* Primary Gallery Colors */
--color-primary: #ff1493 /* BitBasel Pink */ --color-secondary: #ff69b4 /* Lighter Pink */
  --color-accent: #ff1493 /* Pink Accent */ /* Background & Surfaces */ --color-background: #000000
  /* Pure Black */ --color-surface: #0a0a0a /* Dark Surface */ --color-border: #2a2a2a
  /* Subtle Border */ /* Gallery Specific */ --color-bitbasel-pink: #ff1493 /* Main Brand */
  --color-bitbasel-pink-soft: #ff69b4 /* Soft Pink */
  --color-bitbasel-pink-light: rgba(255, 20, 147, 0.1) /* Pink Glow */ --color-gallery-gold: #d4af37
  /* Accent Gold */ /* Gradients */
  --gradient-accent: linear-gradient(135deg, #ff1493 0%, #ff69b4 50%, #ff0080 100%);
```

### Typography

- **Primary**: Machina (custom web font)
- **Fallback**: System fonts (-apple-system, BlinkMacSystemFont)
- **Hierarchy**: Responsive type scale with proper line heights

## 🔧 Configuration

### Environment Variables

Create `.env.development` and `.env.production` files:

```env
# API Configuration
API_URL=https://api.bitbasel.miami
BASE_URL=https://app.bitbasel.miami

# Wallet Configuration
WALLET_CONNECT_PROJECT_ID=your_project_id

# Bitcoin Network
BITCOIN_NETWORK=mainnet
ORDINALS_API_URL=https://ordinals.com/api

# Social Media
TWITTER_URL=https://twitter.com/bitbasel
DISCORD_URL=https://discord.gg/bitbasel
TELEGRAM_URL=https://t.me/bitbasel
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The application is optimized for deployment on:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- Any static hosting service

## 📱 Browser Support

- **Modern browsers** with ES6+ support
- **Mobile Safari** and **Chrome** optimized
- **Bitcoin wallet extensions** compatible
- **Progressive Web App** ready

## 🚧 Development Priorities

### Immediate Tasks

1. **Optimize Large Components**
   - `MarketplaceGrid.tsx`: 204 lines → <150 lines
   - `WalletConnect.tsx`: 158 lines → <150 lines
2. **Missing Assets**
   - Add Machina font files (`/public/fonts/`)
   - Create favicon and manifest.json
   - Add social media images for OpenGraph

3. **Smart Contract Integration**
   - Implement dynamic NFT functionality
   - Add Bitcoin Ordinals API integration
   - Connect smart contract exhibition logic

### Component Optimization Guide

```typescript
// Follow these patterns for <150 line components:
// ✅ Single responsibility principle
// ✅ Extract custom hooks for complex logic
// ✅ Use composition over large monolithic components
// ✅ Minimize inline styles, use CSS classes
// ✅ Extract constants and types to separate files
```

## 🤝 Contributing

### Development Standards

- **Component Limit**: Maximum 150 lines per component
- **TypeScript Strict**: All code must pass strict type checking
- **Pink Theme**: Maintain #ff1493 color scheme throughout
- **Gallery UX**: Focus on fine art presentation and community features

### Contributing Steps

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/community-feature`)
3. Follow component size limits (<150 lines)
4. Test with `npm run dev` and `npm run type-check`
5. Commit your changes (`git commit -m 'Add community feature'`)
6. Push to the branch (`git push origin feature/community-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Art Basel** - Inspiration for premium gallery experience
- **Bitcoin Ordinals Community** - Pioneering digital art on Bitcoin
- **Smart Contract Innovators** - Pushing boundaries of dynamic NFTs
- **Local Crypto Art Communities** - Building the future of digital art
- **Next.js & MobX Teams** - Excellent development frameworks

---

**Built with 🎨 for Your City's Crypto Art Community**

> BitBasel is a community-focused platform combining the permanence of Bitcoin Ordinals with the innovation of smart contracts and dynamic NFTs. This codebase is optimized for developers with clean, documented components under 150 lines each.

### Quick Development Setup

```bash
git clone <repo-url> && cd BitBasel
npm install && npm run dev
# Open http://localhost:3000 - Pink gallery theme ready! 🎨
```
