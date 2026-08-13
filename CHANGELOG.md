# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.0] — Unreleased

### Added

- CSS custom-property design token system so dark **and** light themes are
  both fully supported (previously only dark rendered correctly).
- Custom, accessible form controls — `LinSwitch`, `LinSelect`, `LinSlider`
  — replacing native browser controls app-wide, fixing the Settings
  volume/dropdown overflow bugs in the process.
- English + Persian localization (`i18next`/`react-i18next`), full RTL
  layout via CSS logical properties, and the Shabnam typeface for Persian.
- Artwork fallback chain: embedded tags → folder cover image
  (cover/folder/album/front) → icon fallback, with a content-addressable
  artwork cache (dedupes identical covers across an album).
- Real 7-band equalizer (Web Audio API `BiquadFilterNode` chain) with
  presets, and a Canvas + `AnalyserNode` audio-reactive radial visualizer
  — both wired into actual playback, not decorative.
- Redesigned "Now Playing" screen with large artwork, the visualizer, and
  a favorite toggle.
- Explicit single-active-player guarantee: switching between audio and
  video now pauses and unloads the previously active `<audio>`/`<video>`
  element instead of relying on React prop removal alone.
- Loading state for the history/library views while data is still being
  fetched, and a scan-progress indicator in the top bar.

### Fixed

- Settings volume control and other narrow-container controls overflowing
  their card on smaller windows (root cause: native range inputs and
  fixed pixel widths ignoring `min-width: 0` in flex rows).
- Theme switching not visibly changing anything outside the Settings page.
- Video element not resizing/positioning correctly relative to the
  sidebar and queue panel.
- Video and audio being able to play concurrently when switching track
  kinds.

## [0.1.0] — Unreleased

### Added

- Initial Electron + React + TypeScript foundation with a secure,
  contextIsolated preload bridge (`window.linplayer`).
- SQLite persistence layer (media, playlists, playlist items, playback
  history, settings, library folders) with a migration runner.
- Media engine: ffprobe-based technical probing, `music-metadata` tag/
  artwork extraction, async recursive folder scanning with progress
  reporting.
- Audio and video playback via native `<audio>`/`<video>` elements,
  streamed through a sandboxed `linplayer-media://` protocol with HTTP
  Range support for seeking.
- Library, Music, Videos, Favorites, History, Playlists, Settings, and a
  dedicated Player screen.
- Playlist creation, rename, delete, add/remove items, and drag-to-reorder.
- Global search, favorites, playback history.
- Keyboard shortcuts, drag-and-drop file/folder import.
- Dark-themed custom design system (Tailwind CSS + Lucide icons).
- Unit and integration tests (Vitest) for the database layer, playlist
  service, filesystem scanner, and shared utilities.
- GitHub Actions CI, Linux build, and tag-triggered release workflows.
- electron-builder configuration targeting AppImage and `.deb`.
