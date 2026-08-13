# Architecture

LinPlayer follows a layered architecture with a strict dependency
direction:

```
UI (React components)
  ↓
Application state (Zustand stores) / hooks
  ↓
Domain / Core (src/core — media, database, playlists, filesystem, settings)
  ↓
Infrastructure (better-sqlite3, ffprobe, music-metadata, node:fs)
  ↓
OS / SQLite / Media backend
```

React components never talk to SQLite, the filesystem, `child_process`, or
FFmpeg directly. They call into Zustand store actions, which call the typed
`window.linplayer` API exposed by the preload bridge, which invokes IPC
handlers in the main process that delegate to `src/core` services.

## Process layout

```
src/main        Electron main process: window management, IPC handlers,
                 service wiring, the linplayer-media:// protocol handler.
src/preload      contextBridge bridge exposing window.linplayer. No
                 business logic — pure IPC forwarding.
src/renderer     React application (Vite). UI only; talks to the app
                 exclusively through window.linplayer.
src/core         Framework-agnostic domain/services: database, media
                 engine, filesystem, playlists, settings, logging. Runs in
                 the main process, but has no Electron-specific imports
                 itself besides Node built-ins, so it is unit-testable in
                 isolation (see tests/integration/database.test.ts).
src/shared       Types and constants shared between main, preload, and
                 renderer (no runtime dependencies on Electron/Node).
```

## Electron security

- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`.
- The renderer's only entry point into the app is `window.linplayer`
  (`src/shared/types/api.ts` defines the full typed surface).
- Local media files are streamed to `<audio>`/`<video>` elements through a
  registered `linplayer-media://` protocol (`src/main/services/mediaProtocol.ts`)
  rather than `file://`, so the main process can allow-list which paths are
  servable (library items and files explicitly opened by the user) and
  support HTTP Range requests for seeking.
- A strict CSP is set in `src/renderer/index.html`.

## Media engine

`src/core/media` defines a small `MediaEngine` interface
(`probe`, `detectKind`, `getCapabilities`) implemented by
`MediaProbeService`, which combines:

- **ffprobe** (via `fluent-ffmpeg` + `ffprobe-static`) for technical
  details: duration, codec, container, bitrate, resolution, frame rate,
  sample rate, channels.
- **music-metadata** for audio tags (title/artist/album/genre) and
  embedded artwork.

`LibraryScanner` walks a folder asynchronously (`src/core/filesystem/scanner.ts`,
an async generator so it never blocks the event loop for large libraries),
probes each supported file, and upserts it into SQLite — emitting progress
events consumed by the renderer's scan progress UI.

This is intentionally an abstraction: the ffprobe/music-metadata backend
can be swapped later (e.g. for a native decoder) without touching callers,
since everything goes through `MediaEngine`.

## Database

SQLite via `better-sqlite3`, with a minimal migration runner
(`src/core/database/migrator.ts`) that tracks applied migrations in a
`schema_migrations` table — safe to run on every startup, and additive
across app upgrades. See `docs/media-support.md` for the schema.

## State management

Renderer state is split into five focused Zustand stores
(`src/renderer/src/stores`) rather than one global store:

- `playerStore` — playback state, queue, shuffle/repeat.
- `libraryStore` — media items, favorites, folders, search, scan progress.
- `playlistStore` — playlists and the active playlist's items.
- `settingsStore` — persisted app settings.
- `uiStore` — navigation, view mode, toasts, queue panel visibility.

## UI, theming, and localization

See [`docs/ui.md`](ui.md) for the design token system, custom form
controls (`LinSwitch`/`LinSelect`/`LinSlider`), and the single-active-media
player fix, and [`docs/i18n.md`](i18n.md) for the English/Persian
internationalization and RTL architecture.

## Known simplifications (see README "Known limitations")

- Playback capability detection is best-effort (based on whether ffprobe
  could read the file) rather than a full compatibility matrix per codec.
- Library scan progress reports files scanned so far without a
  pre-computed total (avoids a second full directory walk).
