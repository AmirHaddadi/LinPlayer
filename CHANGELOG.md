# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
