# Contributing to BitBasel

Thank you for your interest in contributing to BitBasel. This document describes the process for submitting changes, the standards all contributions must meet, and how the review process works.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Before You Start](#before-you-start)
- [Development Setup](#development-setup)
- [Branch Conventions](#branch-conventions)
- [Commit Standards](#commit-standards)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Security Vulnerabilities](#security-vulnerabilities)

---

## Code of Conduct

All contributors must adhere to the [Code of Conduct](CODE_OF_CONDUCT.md). Participation in this project constitutes acceptance of its terms.

---

## Before You Start

For significant changes — new features, architectural modifications, or breaking changes — open an issue first to discuss the approach. This prevents duplicate work and ensures alignment before implementation effort is invested.

For bug fixes and documentation improvements, you may proceed directly to a pull request.

---

## Development Setup

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/BitBasel.git
   cd BitBasel
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure your local environment:

   ```bash
   cp .env.example .env.development
   # Edit .env.development with your local values
   ```

4. Verify the setup:

   ```bash
   npm run type-check
   npm run lint
   npm run dev
   ```

---

## Branch Conventions

Branch from `main` using the following naming scheme:

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<description>` | `feat/artist-profile-page` |
| Bug fix | `fix/<description>` | `fix/wallet-disconnect-error` |
| Documentation | `docs/<description>` | `docs/api-reference` |
| Refactor | `refactor/<description>` | `refactor/marketplace-store` |
| Chore | `chore/<description>` | `chore/dependency-updates` |

Keep branches focused on a single concern. Avoid mixing feature work with unrelated refactors in the same branch.

---

## Commit Standards

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`

**Examples:**

```
feat(wallet): add Phantom Bitcoin connection support
fix(marketplace): prevent duplicate fetch on store re-mount
docs(contributing): add branch naming conventions
```

Commit messages must be in the imperative mood and written in English. The summary line must not exceed 72 characters.

---

## Pull Request Process

1. Ensure your branch is up to date with `main` before opening a PR.
2. All CI checks must pass: type checking, linting, and formatting.
3. Provide a clear description of what the PR changes and why.
4. Reference any related issues using `Closes #<issue-number>`.
5. Assign at least one reviewer from the core team.
6. Address all review comments before requesting re-review.
7. Do not merge your own pull requests.

Pull requests that introduce breaking changes must update `CHANGELOG.md` and clearly document the migration path in the PR description.

---

## Code Standards

### TypeScript

- Strict mode is enforced. No `any` types without explicit justification in a comment.
- All exported functions and components must have typed signatures.
- Prefer `interface` over `type` for object shapes.

### React Components

- Use functional components exclusively.
- Components that read MobX store state must be wrapped with `observer`.
- Props interfaces must be defined in the same file as the component.
- Avoid `useEffect` for derived state — use MobX computed values instead.

### CSS

- All new styles must use CSS custom properties defined in `globals.css`.
- Do not use inline styles for values that are part of the design system.
- Follow mobile-first ordering: base styles first, then media query overrides.

### General

- Remove all `console.log` and `console.debug` calls before committing.
- Do not leave `// TODO` or `// FIXME` comments in committed code — convert them to tracked issues instead.
- No commented-out code blocks.

---

## Security Vulnerabilities

Do not open public issues for security vulnerabilities. Follow the responsible disclosure process described in [SECURITY.md](SECURITY.md) and contact **security@bitbasel.miami** directly.
