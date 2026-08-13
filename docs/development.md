# Development Guide

## Prerequisites

- Node.js 18+ (20 LTS recommended)
- npm 10+
- Linux (Ubuntu/Debian-based recommended for development, since that's the
  primary packaging target). Other platforms may work for `npm run dev`
  but are not officially supported yet.
- Build tools for native modules (`better-sqlite3` compiles from source on
  install): `python3`, `make`, and a C++ compiler (`build-essential` on
  Debian/Ubuntu: `sudo apt install build-essential python3`).

## Setup

```bash
git clone https://github.com/AmirHaddadi/LinPlayer.git
cd LinPlayer
npm install
npm run dev
```

`npm run dev` starts electron-vite in watch mode: the renderer runs on a
local Vite dev server with HMR, and the Electron main/preload processes
are rebuilt and the app relaunched on change.

## Scripts

| Command                    | Description                                   |
| --------------------------- | ---------------------------------------------- |
| `npm run dev`               | Start the app in development mode with HMR    |
| `npm run build`             | Type-check and build main/preload/renderer     |
| `npm run start`             | Preview a production build without packaging  |
| `npm run lint`               | ESLint over the whole codebase                |
| `npm run format`             | Prettier — format all files                   |
| `npm run typecheck`          | TypeScript project references, no emit        |
| `npm run test`               | Run unit + integration tests once (Vitest)    |
| `npm run test:watch`         | Run tests in watch mode                       |
| `npm run package`            | Build and package AppImage + .deb for Linux   |
| `npm run package:appimage`   | Build and package AppImage only               |
| `npm run package:deb`        | Build and package .deb only                   |

## Project layout

See [architecture.md](architecture.md) for the full breakdown of
`src/main`, `src/preload`, `src/renderer`, `src/core`, and `src/shared`.

## Media dependencies

LinPlayer bundles `ffprobe-static` (a static ffprobe binary) for media
probing, so no system-wide FFmpeg installation is required for
development or for end users. Actual decoding/rendering of audio and
video is done by Chromium's built-in media pipeline (the same one used by
`<audio>`/`<video>` elements), which is bundled with Electron.

## Native module note (better-sqlite3)

`better-sqlite3` is a native addon and must be compiled against whichever
runtime is loading it. `npm install`'s `postinstall` hook
(`electron-builder install-app-deps`) builds it against **Electron's**
Node ABI, which is what `npm run dev` / `npm run build` / `npm run package`
need. Running `npm run test` (plain Node via Vitest) against that same
build will fail with an `NODE_MODULE_VERSION` mismatch — if that happens,
run `npm rebuild better-sqlite3` to rebuild it for your system Node, then
run `npx electron-builder install-app-deps` again before running the
Electron app. This is a one-line fix, not a bug in the app itself.

## Database

The SQLite database lives at `$XDG_DATA_HOME/linplayer` (or
`~/.local/share/linplayer` by default on Linux, via Electron's
`app.getPath('userData')`). Delete `linplayer.sqlite3` there to reset all
local data during development.

## Testing

```bash
npm run test
```

Tests are split into `tests/unit` (pure functions, services with mocked
dependencies) and `tests/integration` (real SQLite database against a
temp file, via `better-sqlite3`). There is currently no automated E2E
suite — see the README's "Known limitations" section.
