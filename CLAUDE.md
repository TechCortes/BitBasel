# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BitBasel is a modern NextJS application for a Bitcoin Ordinals marketplace - Your City's CryptoArt Community. The project features wallet integration, responsive design, and state-of-the-art architecture.

## Technology Stack

- **Framework**: Next.js 14.2.32 with App Router
- **Language**: TypeScript with strict type checking
- **State Management**: MobX 6 for reactive state management
- **UI Framework**: Custom CSS with modern design system
- **HTTP Client**: Axios for API communication
- **Code Quality**: ESLint + Prettier + Husky for git hooks
- **Wallet Integration**: Support for multiple Bitcoin wallets (Unisat, Xverse, etc.)

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting and formatting
npm run lint
npm run lint:fix
npm run prettier
npm run prettier:check

# Type checking
npm run type-check
```

## Architecture

### Core Structure

- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/` - Reusable React components
- `/src/store/` - MobX state management
- `/src/types/` - TypeScript type definitions
- `/src/styles/` - CSS stylesheets and design system

### State Management

- `/src/store/MarketplaceStore.ts` - Ordinals and collections state
- `/src/store/WalletStore.ts` - Wallet connection and transaction state
- `/src/store/StoreProvider.tsx` - Root store and React context

### Key Components

- `Navigation.tsx` - Responsive navigation with wallet integration
- `WalletConnect.tsx` - Multi-wallet connection modal
- `MarketplaceGrid.tsx` - Grid layout for ordinals and collections
- `OrdinalCard.tsx` - Individual ordinal display component
- `CollectionCard.tsx` - Collection display component

### Types and Interfaces

- `/src/types/ordinals.ts` - Bitcoin Ordinals, Collections, Galleries
- `/src/types/wallet.ts` - Wallet connection and transaction types

## Environment Variables

Create environment files for different stages:

- `.env.development` - Development settings
- `.env.production` - Production settings

Required variables:

- `API_URL` - Backend API URL
- `BASE_URL` - Frontend base URL
- `WALLET_CONNECT_PROJECT_ID` - Wallet connection configuration
- `BITCOIN_NETWORK` - 'mainnet' or 'testnet'
- Social media links (TWITTER_URL, DISCORD_URL, TELEGRAM_URL)

## Design System

### Typography

- Custom "Machina" font family with fallbacks
- Responsive typography classes (.text-heading-1, .text-body, etc.)

### Color Scheme

- CSS custom properties in `:root`
- Bitcoin/crypto specific colors (--color-bitcoin, --color-ordinals)
- Dark mode support via prefers-color-scheme

### Components

- Atomic design methodology
- Consistent spacing and sizing
- Mobile-first responsive design

## Key Features

1. **Bitcoin Wallet Integration**: Multi-wallet support for Bitcoin transactions
2. **Ordinals Marketplace**: Display and trade Bitcoin Ordinal inscriptions
3. **Collection Management**: Curated collections with verification badges
4. **Responsive Design**: Mobile-optimized interface
5. **State Management**: Reactive MobX stores for complex state
6. **Type Safety**: Full TypeScript implementation
7. **Modern CSS**: Custom properties, Grid, Flexbox
8. **SEO Optimized**: Next.js metadata API for search optimization

## Development Guidelines

### Code Quality

- ESLint configuration with Next.js rules
- Prettier for consistent formatting
- Husky pre-commit hooks for quality gates
- TypeScript strict mode enabled

### Component Patterns

- Functional components with hooks
- MobX observer components for reactive updates
- Props interfaces for all components
- Error boundaries for wallet interactions

### Security Considerations

- Wallet connections are client-side only
- No private key storage or handling
- Environment variables for sensitive configuration
- Secure headers in Next.js config

## Common Tasks

### Adding New Components

1. Create component in `/src/components/`
2. Export from component file
3. Add corresponding CSS to `/src/styles/components.css`
4. Import and use in pages/components

### Wallet Integration

- Extend `WalletStore.ts` for new wallet providers
- Update `WalletConnect.tsx` with new wallet options
- Test wallet connections in development environment

### API Integration

- Add API endpoints to respective stores (MarketplaceStore, etc.)
- Use Axios for HTTP requests
- Handle loading states and error cases
- Update TypeScript interfaces as needed

## Build and Deployment

The application builds to static files optimized for deployment:

- Next.js optimized bundles
- Static asset optimization
- Environment-specific configurations
- Error tracking during build process

## Browser Support

- Modern browsers with ES6+ support
- Mobile Safari and Chrome optimization
- Bitcoin wallet extension compatibility
- LocalStorage API for wallet persistence
