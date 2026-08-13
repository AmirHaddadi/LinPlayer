<div align="center">

# LinPlayer

**A beautiful, fast, modern and privacy-friendly media player built specifically for Linux.**

</div>

---

> **Status:** early foundation (v0.1.0, pre-release). Core playback,
> library, playlists, and packaging work end-to-end; see
> [Known limitations](#known-limitations) below before relying on it
> day-to-day.

## Screenshots

_Screenshots will be added here once the UI has been visually verified on
a variety of Linux desktop environments. None are included yet — see
[Known limitations](#known-limitations)._

## Features

- 🎵 **Audio & video playback** — MP3, WAV, FLAC, AAC, M4A, OGG, Opus,
  AIFF, WMA\*, MP4, MKV, WebM, MOV, AVI, M4V, MPEG, TS, FLV\* (see
  [docs/media-support.md](docs/media-support.md))
- 📚 **Library** — open files, scan folders recursively, background
  indexing with progress, missing-file cleanup
- 🖼 **Rich metadata** — duration, codec, bitrate, resolution, embedded
  artwork via ffprobe + music-metadata
- 📃 **Playlists** — create, rename, delete, add/remove tracks,
  drag-to-reorder, persisted in SQLite
- ❤️ **Favorites** and **History** — recently played, resumable
- 🔍 **Global search** across title, artist, album, genre, filename
- ⌨️ **Keyboard shortcuts** and **drag & drop** file/folder import
- 🎛 **Full playback controls** — shuffle, repeat, queue, playback speed,
  volume, fullscreen video
- 🌙 **Dark-first custom UI** — not a generic shadcn/ui demo
- 🔒 **Secure by default** — sandboxed renderer, no direct Node/Electron
  access from the UI, no telemetry, fully offline
- 🐧 **Linux-native packaging** — AppImage and `.deb` via electron-builder

\* format support depends on the underlying codec — see
[docs/media-support.md](docs/media-support.md).

## Installation

Pre-built AppImage/`.deb` releases will be published under
[Releases](https://github.com/AmirHaddadi/LinPlayer/releases) once a
public 0.1.0 release is tagged. Until then, build from source:

```bash
git clone https://github.com/AmirHaddadi/LinPlayer.git
cd LinPlayer
npm install
npm run package        # produces release/*.AppImage and release/*.deb
```

Then either run the AppImage directly (`chmod +x` it first) or install the
`.deb` with `sudo dpkg -i release/*.deb`.

## Development

```bash
git clone https://github.com/AmirHaddadi/LinPlayer.git
cd LinPlayer
npm install
npm run dev
```

See [docs/development.md](docs/development.md) for prerequisites, all
available scripts, and how the database/media backend work in
development.

## Build & test commands

```bash
npm run dev          # development mode with hot reload
npm run build         # production build (main + preload + renderer)
npm run test           # unit + integration tests (Vitest)
npm run lint            # ESLint
npm run typecheck        # TypeScript, no emit
npm run package            # AppImage + .deb
```

## Supported platforms

Linux (Ubuntu/Debian-based is the primary target for v0.1). Flatpak, Snap,
RPM, and Arch packages are on the roadmap but not built yet.

## Architecture

LinPlayer is an Electron + React + TypeScript app with a strict layered
architecture (UI → state → core/domain → infrastructure) and SQLite for
all local persistence — no remote backend, no cloud database. See
[docs/architecture.md](docs/architecture.md) for the full breakdown.

## Roadmap

Near-term, in rough priority order:

1. Playback position resume (settings exist; wiring the "resume from last
   position" prompt into the player is not yet implemented)
2. Automated E2E tests for the critical playback/playlist flows
3. Equalizer and audio visualization
4. Subtitle support (embedded + external `.srt`/`.vtt`)
5. Multiple audio track selection
6. Gapless playback and crossfade
7. Smart playlists and watch folders
8. MPRIS integration (Linux system media controls) and tray/mini player
9. Internet radio / URL playback, M3U playlist import
10. Flatpak, Snap, RPM, and Arch packages

See [Section 33 of the original foundation spec](Start.md) for the full
long-term list this architecture was designed to accommodate without a
rewrite.

## Known limitations

Read this before assuming everything "just works":

- **Not yet run against a real display** in this environment — see the
  latest development report for what was actually verified
  (typecheck/lint/tests/build) versus what still needs manual
  verification on a Linux desktop with a display.
- Playback capability detection is best-effort (based on whether ffprobe
  can read the file), not a guarantee every codec plays.
- No subtitles, no multi-audio-track UI, no gapless/crossfade yet — these
  are architected for (see `docs/architecture.md`) but not implemented.
- No automated E2E test suite yet (unit + integration tests only).
- The open-source license has **not** been finalized — see
  [LICENSE](LICENSE). Do not treat this as usable/distributable software
  until a real license is added.
- AppImage/`.deb` packaging is configured but has only been exercised in
  this environment to the extent described in the latest build report —
  test on your actual distribution before relying on it.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Security

See [SECURITY.md](SECURITY.md) for the security model and how to report
vulnerabilities.

## License

See [LICENSE](LICENSE) — **not yet finalized**. The maintainer must choose
an OSI-approved license before the first public release.
