# Contributing to LinPlayer

Thanks for your interest in contributing! LinPlayer is a young project and
contributions of all sizes are welcome — bug reports, documentation fixes,
tests, and features.

## Getting started

```bash
git clone https://github.com/AmirHaddadi/LinPlayer.git
cd LinPlayer
npm install
npm run dev
```

See [docs/development.md](docs/development.md) for prerequisites and
architecture notes.

## Workflow

1. Fork the repository and create a branch from `main`.
2. Make your change, keeping commits focused and descriptive.
3. Run the full check suite before opening a PR:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```
4. Open a pull request describing the change and, for UI changes, include
   a screenshot or short clip if practical.

## Code style

- TypeScript in strict mode; avoid `any` unless justified with a comment.
- Business logic belongs in `src/core`, not in React components.
- The renderer must never import Node.js or Electron APIs directly — go
  through `window.linplayer` (see `src/preload`).
- Run `npm run format` before committing (Prettier).

## Architecture

Please read [docs/architecture.md](docs/architecture.md) before making
structural changes — LinPlayer follows a layered dependency direction
(UI → state → core/domain → infrastructure) that keeps the codebase
testable and maintainable.

## Reporting bugs / requesting features

Use the issue templates under **Issues → New Issue**.
