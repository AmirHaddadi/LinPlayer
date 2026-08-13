# LinPlayer — Linux Desktop Media Player

## Master Foundation Prompt — Initial Architecture & Production-Ready MVP

You are the lead software architect, senior full-stack desktop engineer, UI/UX engineer, media-engine engineer, DevOps engineer, and open-source maintainer responsible for building **LinPlayer**.

LinPlayer is a **public, open-source, Linux-first desktop media player**.

GitHub repository:

https://github.com/AmirHaddadi/LinPlayer.git

The repository is currently intentionally empty. Build the project from the ground up.

---

# 1. PRIMARY OBJECTIVE

Create the initial production-quality foundation of **LinPlayer**, a modern Linux desktop media player capable of playing audio and video files with an exceptional user experience.

This is NOT a throwaway prototype.

The initial implementation must establish a clean, scalable, maintainable architecture that allows future development without requiring a major rewrite.

The application must be designed as a real open-source project that can eventually attract users, contributors, GitHub stars, issues, pull requests, and community contributions.

The product name is:

**LinPlayer**

Brand positioning:

> A beautiful, fast, modern and privacy-friendly media player built specifically for Linux.

---

# 2. IMPORTANT PRODUCT PRINCIPLES

Prioritize these principles in this exact order:

1. Stability
2. Excellent UX
3. Clean architecture
4. Media playback reliability
5. Performance
6. Extensibility
7. Accessibility
8. Security
9. Developer experience
10. Visual polish

Do NOT build a visually impressive but technically fragile application.

Do NOT create a giant monolithic React component.

Do NOT put business logic inside UI components.

Do NOT expose Electron/Node.js APIs directly to the renderer.

Do NOT hard-code future features into the architecture.

Do NOT use unnecessary cloud services.

Do NOT introduce a remote backend unless absolutely required.

LinPlayer should work completely offline.

---

# 3. TECHNOLOGY STACK

Use the following stack unless there is a strong technical reason to change something.

## Desktop

* Electron
* Node.js
* TypeScript

## Frontend

* React
* TypeScript
* Vite

## UI

* Tailwind CSS
* shadcn/ui where appropriate
* Lucide icons
* CSS variables for theming

The UI must NOT look like a generic shadcn demo.

Customize the visual system heavily.

## State

Use Zustand or an equivalent lightweight predictable state-management solution.

Separate:

* UI state
* Player state
* Library state
* Playlist state
* Settings state

Do not create one enormous global store.

## Database

Use:

**SQLite**

SQLite is the local persistence layer.

Do NOT introduce PostgreSQL, MySQL, MongoDB, Firebase, Supabase or another remote database.

LinPlayer is a desktop application and its core data should remain local.

Database responsibilities:

* media metadata cache
* playlists
* playlist items
* favorites
* playback history
* playback positions
* user settings where appropriate
* library/index metadata

Design the database layer behind a repository/service abstraction so the implementation can evolve later without coupling the UI to SQLite.

---

# 4. MEDIA ENGINE

Media support is a core feature.

The architecture must support:

### Audio

At minimum design for:

* MP3
* WAV
* FLAC
* AAC
* M4A
* OGG
* OPUS
* AIFF
* WMA where backend support exists

### Video

At minimum design for:

* MP4
* MKV
* WebM
* MOV
* AVI
* M4V
* MPEG
* TS
* FLV where backend support exists

Do not falsely claim that every media extension is guaranteed to work.

The application should use a robust media backend and detect unsupported codecs/formats gracefully.

Design the media layer around interfaces such as:

```text
MediaEngine
MediaSource
MediaMetadata
MediaStream
PlaybackState
PlaybackCapabilities
```

The UI must not directly depend on the underlying decoder implementation.

The media implementation should be replaceable.

---

# 5. FFmpeg / MEDIA ANALYSIS

Integrate media analysis in a way that supports future expansion.

Use appropriate FFmpeg tooling/backend capabilities where required.

Use media probing functionality for:

* duration
* codec
* container
* bitrate
* resolution
* frame rate
* audio channels
* sample rate
* metadata
* embedded artwork when available

Do not scan an entire library synchronously on the UI thread.

Media indexing must happen asynchronously.

Large folders must not freeze the interface.

---

# 6. ELECTRON ARCHITECTURE

Use a secure Electron architecture.

Separate:

```text
Main Process
Renderer Process
Preload
Services
Database
Media Engine
Filesystem Layer
```

The renderer must NOT receive unrestricted Node.js access.

Use:

* contextIsolation
* preload bridge
* typed IPC
* minimal exposed APIs
* secure defaults

Never expose:

```text
require
process
fs
child_process
shell
```

directly to the renderer.

Create a typed API such as:

```text
window.linplayer
```

with explicit methods.

Example conceptual API:

```text
window.linplayer.media.open()
window.linplayer.media.play()
window.linplayer.media.pause()
window.linplayer.media.seek()
window.linplayer.media.stop()

window.linplayer.library.scan()
window.linplayer.library.getItems()

window.linplayer.playlists.create()
window.linplayer.playlists.update()
window.linplayer.playlists.delete()

window.linplayer.settings.get()
window.linplayer.settings.set()
```

The exact implementation is up to you, but maintain strict separation of concerns.

---

# 7. PROJECT STRUCTURE

Create a scalable architecture similar to:

```text
LinPlayer/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── build-linux.yml
│   │   └── release.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── build/
│   ├── icons/
│   └── linux/
│
├── docs/
│   ├── architecture.md
│   ├── development.md
│   ├── release.md
│   └── media-support.md
│
├── src/
│   ├── main/
│   │   ├── index.ts
│   │   ├── window/
│   │   ├── ipc/
│   │   └── services/
│   │
│   ├── preload/
│   │   ├── index.ts
│   │   └── api/
│   │
│   ├── renderer/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── player/
│   │   │   ├── playlists/
│   │   │   ├── library/
│   │   │   ├── favorites/
│   │   │   ├── history/
│   │   │   └── settings/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── styles/
│   │   └── utils/
│   │
│   ├── core/
│   │   ├── media/
│   │   ├── database/
│   │   ├── filesystem/
│   │   ├── playlists/
│   │   └── settings/
│   │
│   ├── shared/
│   │   ├── types/
│   │   ├── constants/
│   │   └── utils/
│   │
│   └── types/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.*
├── electron-builder.yml
├── eslint.config.*
├── prettier.config.*
├── .gitignore
├── LICENSE
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── SECURITY.md
```

Adapt the exact structure if necessary, but preserve the architectural principles.

---

# 8. DATABASE DESIGN

Create a clean initial SQLite schema.

At minimum:

```text
media
-----
id
path
filename
title
artist
album
genre
duration
mime_type
container
codec
width
height
sample_rate
bitrate
artwork_path
created_at
updated_at
last_played_at
play_count
favorite

playlists
---------
id
name
description
created_at
updated_at

playlist_items
--------------
id
playlist_id
media_id
position
added_at

playback_history
----------------
id
media_id
position
played_at

settings
--------
key
value
updated_at
```

Use foreign keys where appropriate.

Use indexes for frequently queried fields.

Use migrations.

Never rely on destructive database recreation during normal development.

The database must survive application upgrades.

---

# 9. UI/UX DIRECTION

UI/UX is one of the highest priorities.

The application should feel like a premium modern desktop application.

Visual inspiration may include the usability principles of:

* Spotify
* Apple Music
* VLC
* Plex
* modern GNOME applications
* modern KDE applications

But DO NOT clone their UI.

LinPlayer needs its own visual identity.

---

# 10. VISUAL LANGUAGE

Default theme:

**Dark**

Design characteristics:

* elegant
* minimal
* modern
* smooth
* slightly futuristic
* professional
* Linux-native feeling
* subtle depth
* restrained glass effects
* excellent typography
* strong spacing system
* clear hierarchy

Avoid:

* excessive gradients
* excessive glassmorphism
* giant shadows
* childish colors
* unnecessary animations
* clutter
* generic dashboard appearance

The application should look like something a serious open-source project could proudly put on its GitHub README.

---

# 11. MAIN APPLICATION LAYOUT

Create a desktop layout approximately consisting of:

```text
┌──────────────────────────────────────────────────────────────┐
│ LinPlayer                                     Window Controls │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ Home          │                                              │
│ Music         │                  Main Content                │
│ Videos        │                                              │
│               │                                              │
│ Library       │                                              │
│ Favorites     │                                              │
│ History       │                                              │
│               │                                              │
│ Playlists     │                                              │
│   + New       │                                              │
│               │                                              │
├───────────────┴──────────────────────────────────────────────┤
│ Mini Player / Playback Controls                              │
└──────────────────────────────────────────────────────────────┘
```

The exact design should be improved substantially beyond this wireframe.

---

# 12. CORE SCREENS

Implement the initial versions of:

## Home

Show:

* recently played
* favorites
* recently added
* quick access
* empty state when no media exists

## Music

Grid/list toggle.

Show:

* artwork
* title
* artist
* album
* duration

## Videos

Video-focused library.

## Playlists

Show all playlists.

Allow:

* create
* rename
* delete
* open
* reorder

## Favorites

Show favorited media.

## History

Show recently played media.

## Player

Create a dedicated full player experience.

---

# 13. PLAYER CONTROLS

Implement:

* Play
* Pause
* Previous
* Next
* Seek
* Volume
* Mute
* Progress bar
* Current time
* Duration
* Shuffle
* Repeat
* Playback speed
* Fullscreen for video
* Queue

Keyboard shortcuts:

```text
Space      Play/Pause
Left       Seek backward
Right      Seek forward
Up         Volume up
Down       Volume down
M          Mute
F          Fullscreen
N          Next
P          Previous
```

Do not hijack shortcuts when the user is typing in a text field.

---

# 14. PLAYLIST SYSTEM

Playlist behavior must be real, persistent functionality.

Support:

* Create playlist
* Rename
* Delete
* Add media
* Remove media
* Reorder items
* Drag and drop
* Play playlist
* Queue playlist
* Shuffle playlist

Persist everything in SQLite.

---

# 15. DRAG & DROP

Support:

### External files

User can drag:

* audio files
* video files
* folders

into LinPlayer.

### Internal media

Allow dragging media into:

* playlists
* queue
* player

Provide clear visual drop states.

---

# 16. FILE SYSTEM

Support:

* Open file
* Open folder
* Scan folder
* Drag/drop
* recursive scanning
* supported-extension filtering

Do not block the UI during scanning.

Use background processing where appropriate.

Show scan progress.

Handle:

* missing files
* deleted files
* moved files
* permission errors
* inaccessible folders

gracefully.

---

# 17. PERFORMANCE

LinPlayer must remain responsive with large libraries.

Design for:

* thousands of media files
* lazy rendering
* virtualization for long lists
* debounced search
* background indexing
* cached metadata
* minimal unnecessary React re-renders

Never load thousands of large album-art images simultaneously.

Use thumbnails and caching.

---

# 18. SEARCH

Implement global search architecture.

Search across:

* title
* artist
* album
* genre
* filename

Search should be fast and debounced.

Design the search layer so it can later support advanced filtering.

---

# 19. SETTINGS

Initial settings:

### Appearance

* Dark
* Light
* System

### Playback

* Remember playback position
* Default volume
* Playback speed
* Resume behavior

### Library

* Library folders
* Automatically scan on startup
* Remove missing files

### General

* Start minimized
* Remember window size
* Remember window position

Do not overbuild the settings page in version 1.

---

# 20. WINDOW MANAGEMENT

Support:

* minimize
* maximize
* close
* resize
* remember window dimensions
* remember position when appropriate

Use a polished custom title bar only if it does not compromise Linux usability.

Respect platform conventions where appropriate.

---

# 21. LINUX-FIRST REQUIREMENTS

LinPlayer is primarily designed for Linux.

Initial target:

**Ubuntu / Debian-based Linux**

Build:

```text
.AppImage
.deb
```

Keep architecture open for:

```text
Flatpak
Snap
RPM
Arch packages
```

in future releases.

electron-builder should be used for packaging.

Do not hard-code Ubuntu-only filesystem paths.

Respect XDG conventions where appropriate.

Store application data in proper Linux user directories.

---

# 22. INSTALLATION

The project must eventually support:

```bash
npm install
npm run dev
npm run build
npm run package
```

Provide explicit commands for:

```text
development
production build
Linux AppImage
Linux .deb
tests
lint
format
typecheck
```

The exact scripts should be documented in README.

---

# 23. GITHUB ACTIONS / CI/CD

Create GitHub Actions.

At minimum:

## CI

On:

* push
* pull request

Run:

```text
install
lint
typecheck
unit tests
build
```

## Linux Build

Build:

```text
AppImage
.deb
```

on Ubuntu GitHub runners.

## Release

When a GitHub tag such as:

```text
v0.1.0
```

is pushed:

1. install dependencies
2. run checks
3. build application
4. package Linux artifacts
5. create GitHub Release
6. upload AppImage
7. upload .deb

Do not require manual packaging for every release.

---

# 24. GITHUB REPOSITORY QUALITY

The repository is public.

Make it look professional.

Create:

```text
README.md
CONTRIBUTING.md
CODE_OF_CONDUCT.md
SECURITY.md
LICENSE
CHANGELOG.md
```

README must include:

* LinPlayer logo/name
* project description
* screenshots placeholder section
* features
* installation
* development
* build instructions
* supported platforms
* roadmap
* contributing
* license

Do not fake screenshots.

Do not claim features that do not exist.

---

# 25. OPEN SOURCE LICENSE

Do not silently choose a license.

If no license has been specified by the repository owner, create a clear placeholder and document that the maintainer must choose the final open-source license before the first public release.

Do not invent ownership information.

---

# 26. SECURITY

Follow Electron security best practices.

Requirements:

* contextIsolation enabled
* sandbox where compatible
* nodeIntegration disabled in renderer
* secure IPC
* validate IPC inputs
* avoid arbitrary shell execution
* sanitize filesystem paths
* do not execute user-provided files
* avoid unsafe `eval`
* validate external URLs
* minimize preload API surface

Create SECURITY.md.

---

# 27. ERROR HANDLING

Never allow an unsupported media file to crash the application.

Show friendly messages:

```text
Unable to play this file.
The format or codec may not be supported.
```

Log technical details separately.

Create a structured logger.

Do not expose sensitive local filesystem information unnecessarily in UI error messages.

---

# 28. OBSERVABILITY

Create development-friendly logging.

Levels:

```text
debug
info
warn
error
```

Production logging should be controlled and not excessively verbose.

Never send telemetry to a server in the initial version.

LinPlayer should be privacy-first.

---

# 29. TESTING

Create an initial testing strategy.

Unit tests for:

* playlist logic
* database repositories
* media metadata parsing
* path utilities
* settings
* player state transitions

Integration tests for:

* SQLite
* IPC
* playlist persistence

E2E tests for critical flows where practical:

```text
Launch app
Open media
Play media
Pause
Create playlist
Add media
Restart app
Verify playlist persists
```

Do not aim for meaningless 100% coverage.

Focus on business-critical functionality.

---

# 30. CODE QUALITY

Use:

* strict TypeScript
* ESLint
* Prettier
* clear naming
* small focused modules
* typed interfaces
* no `any` unless absolutely justified
* no dead code
* no duplicated business logic

Comments should explain WHY, not WHAT.

---

# 31. ARCHITECTURAL RULE

The following dependency direction should be respected:

```text
UI
 ↓
Application State / Use Cases
 ↓
Domain / Core
 ↓
Infrastructure
 ↓
OS / SQLite / Media Engine
```

Do not allow:

```text
React Component → SQLite directly
React Component → fs directly
React Component → child_process directly
React Component → FFmpeg directly
```

Everything must pass through the appropriate abstraction.

---

# 32. INITIAL MVP SCOPE

The first implementation must actually work.

Do NOT build dozens of fake buttons.

Version 0.1 should provide a strong functional foundation with:

* application shell
* modern UI
* library
* open file
* open folder
* audio playback
* video playback
* play/pause
* seek
* volume
* next/previous
* queue
* playlist creation
* playlist persistence
* favorites
* playback history
* SQLite
* search
* settings
* keyboard shortcuts
* drag/drop
* error handling
* Linux packaging
* CI
* documentation

Features that cannot be implemented robustly should be represented honestly as future roadmap items.

---

# 33. FUTURE-READY ARCHITECTURE

Prepare the architecture for future capabilities without implementing them prematurely:

* equalizer
* audio visualization
* waveform
* subtitles
* multiple audio tracks
* subtitle tracks
* external subtitle files
* playback synchronization
* media conversion
* metadata editing
* album artwork management
* network streams
* URL playback
* internet radio
* M3U playlists
* smart playlists
* watch folders
* system media controls
* MPRIS integration
* tray mode
* mini player
* gapless playback
* crossfade
* replay gain
* themes
* plugins
* Flatpak
* Snap
* RPM
* Arch package

Do NOT implement these now unless required by the MVP.

Create architecture that does not prevent them.

---

# 34. IMPORTANT: DO NOT OVERENGINEER

Do not introduce:

* microservices
* remote backend
* cloud database
* unnecessary containers
* Kubernetes
* GraphQL
* authentication
* user accounts
* online telemetry
* unnecessary third-party SaaS

This is a local Linux desktop application.

Keep the architecture powerful but appropriate.

---

# 35. DEVELOPMENT EXPERIENCE

A new contributor should be able to clone the repository and understand the project quickly.

README must explain:

```bash
git clone ...
cd LinPlayer
npm install
npm run dev
```

Document prerequisites.

Document Linux dependencies if any.

Document how media dependencies are packaged.

Document how to run tests.

Document how to build AppImage and .deb.

---

# 36. GIT WORKFLOW

Initialize the repository correctly.

Create meaningful commits.

Suggested initial commits:

```text
chore: initialize LinPlayer architecture
feat: add Electron and React foundation
feat: add secure IPC bridge
feat: add SQLite persistence layer
feat: add media engine abstraction
feat: add player UI
feat: add library
feat: add playlists
feat: add Linux packaging
ci: add GitHub workflows
docs: add project documentation
```

Do not create one gigantic meaningless commit if the environment allows incremental commits.

---

# 37. BRANDING

Application name:

**LinPlayer**

Short description:

**Modern Linux Media Player**

The UI should consistently use LinPlayer branding.

Create a simple initial application icon/logo placeholder if no official logo exists yet.

Do not use copyrighted logos from other applications.

---

# 38. DESIGN SYSTEM

Create reusable design tokens for:

* spacing
* typography
* radius
* shadows
* surfaces
* borders
* transitions
* player controls
* cards
* buttons

Do not scatter arbitrary values everywhere.

Create reusable components such as:

```text
AppShell
Sidebar
TopBar
MediaCard
MediaRow
Artwork
PlayerBar
PlayerControls
ProgressBar
VolumeControl
Queue
PlaylistCard
SearchBar
EmptyState
LoadingState
ContextMenu
Modal
Toast
```

---

# 39. ACCESSIBILITY

Implement:

* keyboard navigation
* visible focus states
* semantic buttons
* tooltips
* accessible labels
* sufficient contrast
* reduced motion consideration

Do not sacrifice accessibility for visual effects.

---

# 40. FINAL IMPLEMENTATION RULE

Before considering the initial implementation complete:

1. Run the application.
2. Verify the UI loads.
3. Verify Electron launches correctly.
4. Verify React renderer works.
5. Verify IPC works.
6. Verify SQLite database initializes.
7. Verify media can be opened.
8. Verify audio playback.
9. Verify video playback.
10. Verify playlist persistence.
11. Verify search.
12. Verify keyboard controls.
13. Verify drag/drop.
14. Verify application restart.
15. Verify production build.
16. Verify AppImage generation.
17. Verify `.deb` generation.
18. Run lint.
19. Run typecheck.
20. Run tests.

Fix actual errors instead of merely documenting them.

---

# 41. DO NOT STOP AT SCAFFOLDING

This is extremely important.

Do NOT respond with:

> "The architecture has been created."

The initial version must contain actual working functionality.

If a dependency or media backend creates an implementation problem, solve it properly or choose the most reliable compatible alternative.

Do not create fake implementations.

Do not create buttons that do nothing.

Do not create placeholder functionality disguised as complete functionality.

---

# 42. FINAL DELIVERABLE

At the end, the repository should contain:

* working LinPlayer application
* clean source architecture
* React UI
* Electron main process
* secure preload bridge
* SQLite persistence
* media playback foundation
* playlist system
* library
* search
* history
* favorites
* settings
* tests
* documentation
* GitHub Actions
* Linux packaging configuration
* AppImage build
* `.deb` build

The project should be ready for the next development phase.

---

# 43. FINAL RESPONSE TO THE DEVELOPER

After implementation, report:

### Architecture

Briefly describe the final architecture.

### Implemented

List what actually works.

### Commands

Show:

```text
npm install
npm run dev
npm run build
npm run test
npm run lint
npm run typecheck
npm run package
```

### Linux artifacts

Report the generated:

```text
.AppImage
.deb
```

and their exact paths if available.

### Tests

Report actual test results.

### Known limitations

Be honest.

### Next recommended milestones

Suggest the next 5–10 development milestones based on the actual state of the codebase.

Do not claim success for anything that was not actually tested.

---

# START NOW

First inspect the existing repository and environment.

Because the GitHub repository is currently empty, initialize the complete LinPlayer project from scratch.

Do not ask unnecessary questions.

Make sensible engineering decisions autonomously.

Build the foundation first, then implement the functional MVP.

Keep the codebase clean enough that another senior developer can continue development immediately.

The final result must feel like the beginning of a serious open-source Linux application, not a coding exercise.
