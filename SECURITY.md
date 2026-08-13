# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in LinPlayer, please report it
privately by opening a GitHub Security Advisory
(**Security → Advisories → Report a vulnerability**) on this repository,
rather than filing a public issue.

We aim to acknowledge reports within a few days and to release a fix as
soon as reasonably possible.

## Security Design

LinPlayer is a local, offline-first desktop application with no user
accounts, no remote backend, and no telemetry. Its main security surfaces
are:

- **Electron renderer isolation** — `contextIsolation` is enabled,
  `nodeIntegration` is disabled, and the renderer runs sandboxed
  (`sandbox: true`). Node.js/Electron internals (`require`, `process`,
  `fs`, `child_process`, `shell`) are never exposed to the renderer.
- **Typed preload bridge** — the renderer only has access to the explicit,
  typed `window.linplayer` API defined in `src/preload`. All IPC arguments
  are handled by main-process handlers that validate input shape before
  touching the filesystem or database.
- **Custom media protocol** — local media files are streamed to the
  renderer through a dedicated `linplayer-media://` protocol handler that
  only serves paths already known to the application (library items or
  files explicitly opened by the user), not arbitrary filesystem paths.
- **Content Security Policy** — the renderer's `index.html` sets a strict
  CSP that disallows remote script execution and restricts media/image
  sources to the app's own origin and the custom media protocol.
- **No arbitrary code execution** — LinPlayer never executes user-provided
  files; it only reads and probes them for playback and metadata.

## Supported Versions

Security fixes are applied to the latest released version. LinPlayer is
pre-1.0 software; there is currently no long-term support branch.
