# LinPlayer — Milestone 1

## Premium Experience, Media Visuals, Internationalization & UX Stabilization

Repository:

https://github.com/AmirHaddadi/LinPlayer.git

Current branch:

`main`

Current version:

`v0.1.0`

---

# 0. ROLE

You are continuing development of an existing production-oriented open-source Linux desktop application called **LinPlayer**.

Do NOT rebuild the application from scratch.

Do NOT replace the existing architecture unless there is a demonstrated technical reason.

The existing foundation is already implemented and tested:

* Electron
* React
* TypeScript
* Vite
* SQLite
* Zustand
* secure preload/contextBridge
* typed IPC
* media metadata extraction
* ffprobe
* music-metadata
* library scanning
* playlists
* favorites
* history
* settings
* keyboard shortcuts
* drag & drop
* AppImage
* `.deb`
* GitHub Actions
* unit/integration tests

The goal of this milestone is to transform the current technically functional MVP into a **polished, premium, stable, bilingual Linux media player**.

This milestone combines:

1. UI/UX redesign
2. Responsive/resizing fixes
3. visual media experience
4. Equalizer
5. audio-reactive visualizer
6. video playback corrections
7. theme system correction
8. custom controls
9. Persian/English localization
10. typography
11. animation
12. bug fixing
13. accessibility
14. performance
15. Git hygiene

---

# 1. ABSOLUTE RULES

Before changing code:

1. Inspect the current repository.
2. Inspect the existing architecture.
3. Inspect existing components.
4. Inspect existing Zustand stores.
5. Inspect IPC APIs.
6. Inspect media engine.
7. Inspect database schema.
8. Inspect theme implementation.
9. Inspect settings implementation.
10. Inspect existing tests.

Do not blindly overwrite working functionality.

Preserve all currently working features.

The following must continue working:

* import
* file open
* folder scan
* playlists
* favorites
* history
* search
* settings
* audio playback
* video playback
* queue
* shuffle
* repeat
* keyboard shortcuts
* AppImage
* `.deb`

---

# 2. PRIMARY GOAL

The current application works functionally but has visible UX/UI problems.

The objective is:

> Make LinPlayer feel like a premium modern desktop media player rather than an MVP.

The final result should feel:

* polished
* fluid
* intentional
* modern
* elegant
* responsive
* visually rich
* professional
* Linux-native
* fast

Do not make it visually noisy.

Do not overuse gradients.

Do not overuse glassmorphism.

Do not turn the application into a dashboard.

---

# 3. CURRENTLY REPORTED ISSUES

The following issues have been manually verified by the maintainer and must be addressed.

## Critical UI issues

### Window resizing

The application has resizing/layout problems.

Fix:

* responsive layout
* minimum window size
* flex/grid behavior
* overflow
* sidebar behavior
* content scaling
* player bar behavior
* settings layout
* media cards
* video container

No important UI element should leave the viewport.

---

# 4. SETTINGS OVERFLOW BUG

Current issue:

The sound/volume settings element in the bottom-right of Settings visually extends outside its intended container.

Also:

* toggle controls
* switch controls
* inline controls
* range inputs
* dropdown/select controls

have visual overflow/alignment issues.

Fix all of them systematically.

Do NOT simply add arbitrary margins.

Find the actual layout cause.

Check:

* flex shrink
* min-width
* width
* max-width
* overflow
* box-sizing
* grid columns
* RTL behavior
* responsive breakpoints

---

# 5. CUSTOM CONTROLS

The current native Linux/browser-looking controls are not acceptable for the final LinPlayer visual language.

Replace generic controls with a custom LinPlayer design system.

This includes:

* switches
* toggles
* sliders
* select/dropdown
* checkboxes where appropriate
* range controls
* buttons
* segmented controls

They must feel like part of one coherent product.

---

# 6. CUSTOM SWITCH DESIGN

Create a custom animated LinPlayer switch.

Requirements:

* smooth transition
* clear ON/OFF states
* keyboard accessible
* focus state
* hover state
* disabled state
* dark theme
* light theme
* RTL compatible
* no layout overflow

Do not use the browser's default switch appearance.

Use reusable component:

```text
LinSwitch
```

or equivalent.

---

# 7. CUSTOM SELECT / DROPDOWN

Replace generic Linux/native selector visuals with a custom LinPlayer component.

Requirements:

* keyboard navigation
* accessible
* animated opening
* animated closing
* selected state
* hover state
* disabled state
* dark/light theme
* RTL support
* no overflow outside viewport
* proper z-index/layering

Use a reusable component.

---

# 8. DESIGN SYSTEM

Create or improve a centralized LinPlayer design system.

Define reusable tokens for:

* colors
* background surfaces
* elevated surfaces
* borders
* typography
* spacing
* radius
* shadows
* blur
* transitions
* animation durations
* easing curves

Do not scatter arbitrary CSS values across components.

The design system must work in both:

* Dark mode
* Light mode

---

# 9. DARK / LIGHT THEME

Current theme switch exists but does not work correctly.

Fix it completely.

Requirements:

* instant but smooth theme transition
* no flash of wrong theme
* persistent theme setting
* system theme support if already available
* all components respond to theme
* settings page responds
* player responds
* sidebar responds
* modals respond
* dropdowns respond
* switches respond
* media cards respond
* visualizer responds
* video controls respond

Theme state must have a single reliable source of truth.

Avoid duplicating theme state across components.

---

# 10. THEME ARCHITECTURE

Use CSS variables/design tokens where possible.

Example conceptual structure:

```text
--background
--foreground
--surface
--surface-elevated
--border
--muted
--accent
--accent-hover
--danger
--success
--player-background
--sidebar-background
```

Dark and light themes should override the variables instead of duplicating entire stylesheets.

---

# 11. ALBUM ART / COVER ART

This is a major feature.

Current issue:

Music cover artwork is not properly displayed.

Implement reliable artwork support.

Artwork sources should be attempted in an intelligent order:

1. Embedded artwork in media metadata
2. Local folder artwork
3. Common filenames such as:

   * cover
   * folder
   * album
   * front
4. Cached artwork
5. fallback artwork

Do not download artwork from the internet in this milestone.

This is important for privacy and offline functionality.

---

# 12. ARTWORK CACHE

Use the existing artwork cache architecture.

Improve it if necessary.

Requirements:

* deterministic cache keys
* no duplicate unnecessary extraction
* thumbnail generation where appropriate
* efficient loading
* avoid decoding huge artwork unnecessarily
* cleanup strategy where appropriate
* graceful failure

UI should never freeze while artwork is being extracted.

---

# 13. ARTWORK UI

Create beautiful reusable artwork components.

Examples:

```text
Artwork
ArtworkThumbnail
ArtworkCard
NowPlayingArtwork
```

Support:

* loading state
* fallback
* broken artwork
* hover
* selected
* playing state

When music is playing, the artwork should visually communicate active playback.

---

# 14. PREMIUM NOW PLAYING EXPERIENCE

Redesign the current player experience.

Create a visually strong Now Playing area.

Include:

* large album artwork
* title
* artist
* album
* progress
* controls
* volume
* queue
* favorite
* playback mode
* optional visualizer

The current media should be visually dominant.

Avoid clutter.

---

# 15. AUDIO VISUALIZER

Implement a serious audio-reactive visualizer.

This is NOT a decorative fake animation.

The visualizer must react to the actual playing audio signal where technically possible.

Use a suitable audio analysis approach.

Possible approaches include:

* Web Audio API
* AudioContext
* AnalyserNode
* FFT analysis

Choose the most reliable architecture compatible with Electron and the existing media engine.

---

# 16. VISUALIZER DESIGN

The visualizer should feel distinctive to LinPlayer.

Avoid generic:

```text
████████████
████████████
```

equalizer bars.

Design something more premium.

Possible visual language:

* dynamic radial spectrum
* particles
* frequency rings
* fluid waveform
* reactive glow
* spectrum arcs
* layered frequency field

The exact final design should be chosen based on performance and readability.

The visualizer must react to:

* bass
* mids
* treble
* overall amplitude

Movement should feel musically synchronized.

---

# 17. VISUALIZER PERFORMANCE

This is extremely important.

Do NOT render hundreds/thousands of expensive DOM elements every animation frame.

Prefer:

* Canvas
* WebGL if justified
* requestAnimationFrame
* efficient FFT sampling

Keep CPU usage reasonable.

Visualizer must be disableable.

Settings:

```text
Visualizer:
[ On / Off ]
```

Potential future modes should be architecturally possible:

```text
Spectrum
Wave
Particles
Radial
```

Do not necessarily implement all modes now.

Implement one excellent mode first.

---

# 18. VISUALIZER BEHAVIOR

When audio is:

* playing → active
* paused → gracefully settle/freeze
* stopped → fade out
* switching tracks → transition smoothly

Avoid abrupt visual jumps.

Add smoothing to FFT values.

Use interpolation where appropriate.

---

# 19. EQUALIZER

Implement a real audio equalizer architecture.

Do not create a fake UI that changes nothing.

Initial bands:

```text
60 Hz
150 Hz
400 Hz
1 kHz
2.4 kHz
6 kHz
15 kHz
```

Provide:

* gain control
* reset
* enable/disable

Presets:

```text
Flat
Bass Boost
Treble Boost
Vocal
Rock
Classical
Electronic
```

The exact number of bands may be adjusted based on the actual audio architecture.

---

# 20. EQUALIZER UI

Design a premium equalizer interface.

Use:

* vertical sliders
* frequency labels
* dB labels
* smooth animation
* tooltips
* reset
* preset selector

It must be responsive.

It must work in RTL.

It must not overflow.

Do not use native browser sliders.

Create a custom LinPlayer slider component.

---

# 21. EQUALIZER ARCHITECTURE

The equalizer must be separated from UI.

Conceptually:

```text
EqualizerEngine
EqualizerPreset
EqualizerSettings
```

The UI should call an abstraction.

Do not couple the React components directly to Web Audio implementation details.

If the current media architecture cannot safely apply equalization without redesign, document the limitation and implement the correct architecture rather than creating fake controls.

---

# 22. VIDEO PLAYBACK BUG

Current issue:

Video does not properly fill its container.

Fix:

* aspect ratio
* object-fit
* responsive resizing
* fullscreen
* container sizing
* window resize handling
* player layout

Video must resize with its parent container.

No black/empty region caused by incorrect layout unless required by the actual aspect ratio.

Do not stretch video unnaturally.

Preserve aspect ratio.

---

# 23. VIDEO / AUDIO CONCURRENCY BUG

Current serious issue:

Video can appear to play simultaneously with music.

Investigate the player state architecture.

There must be exactly one active playback session unless the application explicitly supports multi-source playback.

When starting a new media item:

1. stop previous media
2. release previous playback resources
3. update active media
4. initialize new media
5. begin playback

Audio and video must not accidentally create independent playback instances.

Create tests for this.

---

# 24. SINGLE ACTIVE PLAYER MODEL

Establish one canonical playback state.

Conceptually:

```text
activeMediaId
playbackState
mediaType
currentTime
duration
volume
isMuted
repeatMode
shuffle
```

There must not be multiple components independently controlling playback.

---

# 25. PLAYER TRANSITIONS

When switching tracks:

* fade UI smoothly
* update artwork
* update title
* update metadata
* update progress
* update visualizer
* update queue

Avoid stale state.

No old song information should remain visible after the new track starts.

---

# 26. RESPONSIVE LAYOUT

The application must support:

* small desktop windows
* normal desktop
* maximized
* fullscreen

At minimum define responsive behavior for:

```text
compact
normal
large
```

Sidebar should adapt.

Player should adapt.

Cards should adapt.

Settings should adapt.

---

# 27. SETTINGS REDESIGN

Settings currently works functionally but requires a major UX redesign.

Create sections such as:

```text
Appearance
Playback
Audio
Library
General
Keyboard
About
```

Do not create unnecessary complexity.

Each section should have:

* title
* description
* grouped settings
* consistent controls
* clear hierarchy

---

# 28. SETTINGS UX

Use cards/sections where appropriate.

Each setting should have:

```text
Setting name
Short description
Control
```

Avoid giant walls of switches.

Make the page scannable.

---

# 29. ANIMATION SYSTEM

LinPlayer should have a coherent animation system.

Create reusable motion patterns.

Examples:

```text
fade
fade-slide
scale
drawer
modal
tooltip
page transition
list insertion
list removal
hover
press
```

Animation should be subtle and premium.

Avoid animation everywhere.

---

# 30. REDUCED MOTION

Respect:

```text
prefers-reduced-motion
```

and ideally provide an application-level reduced-motion option if appropriate.

When reduced motion is active:

* disable large transitions
* reduce visualizer motion
* simplify page transitions

---

# 31. BILINGUAL SUPPORT

LinPlayer must support:

## English

`en`

## Persian

`fa`

Implement proper internationalization.

Do NOT hard-code UI strings directly into components.

Use an i18n layer.

Suggested conceptual structure:

```text
src/
  renderer/
    i18n/
      en/
      fa/
```

The exact library is your choice, but use a mature React-compatible solution.

---

# 32. PERSIAN FONT

A font file exists in the project root:

```text
Shabnam.ttf
```

This font MUST be integrated correctly.

For Persian UI:

```text
Shabnam
```

must be the primary application font.

Create appropriate `@font-face` configuration.

Do not load it inefficiently.

Make sure packaging includes the font.

---

# 33. RTL

Persian mode must use:

```html
dir="rtl"
```

English:

```html
dir="ltr"
```

RTL must affect:

* sidebar
* settings
* forms
* player
* playlists
* search
* dropdowns
* sliders
* visualizer labels
* dialogs
* context menus

Do not simply mirror the entire application blindly.

Respect logical UI direction.

---

# 34. LANGUAGE SWITCH

Settings should allow:

```text
Language
English
فارسی
```

Changing language should update the application without requiring a full restart if technically practical.

Persist the language selection.

---

# 35. LOCALIZATION QUALITY

Do NOT use machine-translated awkward UI language.

Persian UI should feel native.

Use concise natural Persian terminology.

Examples:

```text
Settings → تنظیمات
Library → کتابخانه
Playlists → فهرست‌های پخش
Favorites → موردعلاقه‌ها
History → تاریخچه
Now Playing → در حال پخش
```

Adapt terminology where necessary for natural UX.

---

# 36. LANGUAGE FALLBACK

If a translation key is missing:

1. fallback to English
2. log missing translation in development
3. never render undefined/null

Create a validation strategy for translation keys.

---

# 37. ICONOGRAPHY

Use one coherent icon library.

Lucide or the existing icon system is acceptable.

Do not mix random icon styles.

Icons should have:

* consistent stroke
* consistent size
* accessible labels where necessary

---

# 38. EMPTY STATES

Create polished empty states.

Examples:

No music:

> هنوز موسیقی‌ای اضافه نشده است

No playlist:

> هنوز فهرست پخشی ساخته نشده است

No favorites:

> هنوز موردعلاقه‌ای ندارید

No history:

> هنوز چیزی پخش نشده است

Provide a useful action where appropriate.

---

# 39. LOADING STATES

Replace abrupt loading behavior with:

* skeletons
* progress indicators
* subtle transitions

Especially:

* library scanning
* artwork extraction
* media loading
* playlist loading

---

# 40. ERROR STATES

Create consistent error UX.

Do not dump technical stack traces into the interface.

Use:

* user-friendly message
* retry action where appropriate
* technical details in logs

---

# 41. MICROINTERACTIONS

Add carefully selected microinteractions:

* button press
* favorite animation
* playlist addition
* media hover
* active playback indicator
* queue insertion
* theme transition
* language transition

Do not overanimate.

---

# 42. ACCESSIBILITY

All new controls must support:

* keyboard
* focus
* Enter
* Space
* Arrow keys where appropriate
* Escape for dismissible overlays
* screen-reader labels

Custom switches/sliders/selects must not reduce accessibility.

---

# 43. PERFORMANCE

Do not allow visual improvements to destroy performance.

Monitor:

* React render frequency
* artwork memory
* visualizer CPU usage
* animation frame rate
* library rendering
* video rendering

Avoid unnecessary re-renders.

Use memoization only where justified.

---

# 44. TESTS

Add tests for every major bug fixed.

At minimum:

### Theme

* dark mode
* light mode
* persistence
* switching

### Playback

* audio → video
* video → audio
* previous player cleanup
* single active media

### Playlist

* create
* add
* remove
* reorder
* persistence

### Equalizer

* preset
* reset
* enable/disable
* value persistence

### i18n

* English
* Persian
* RTL
* fallback

### Responsive

Where automated testing is practical, test important layout/state behavior.

---

# 45. E2E TESTING

This milestone is the appropriate time to introduce an E2E framework if the existing architecture permits it.

Prefer a modern solution compatible with Electron.

Cover at minimum:

```text
Launch
Open file
Play audio
Pause
Change track
Create playlist
Add item
Switch theme
Switch language
Open settings
```

Do not attempt to automate every visual detail.

---

# 46. GIT AUTHOR / COMMIT POLICY

This is a strict requirement.

The project owner/maintainer wants the repository history to contain ONLY the maintainer's identity.

The name:

**Claude**

must NOT appear in:

* commit author
* commit committer
* commit message
* generated Git metadata
* documentation referring to commit authorship

Do not add AI attribution to commits.

Do not create commits such as:

```text
Co-authored-by: Claude
Generated by Claude
AI generated
```

or similar.

Use the repository owner's configured Git identity.

Before committing, inspect:

```bash
git config user.name
git config user.email
```

Do not invent an identity.

If the configured identity is not the repository owner's identity, STOP before creating commits and report the issue.

---

# 47. EXISTING COMMIT HISTORY

Inspect the existing six commits.

If unwanted author metadata or unwanted "Claude" references exist, determine whether history rewriting is actually necessary.

DO NOT automatically force-push.

First inspect:

```bash
git log --format=fuller
git shortlog -sne
git remote -v
git status
```

If history contains unwanted author information:

1. explain exactly what is present
2. create a safe backup/reference if possible
3. rewrite only if authorized by the repository state and necessary
4. preserve commit content
5. verify rewritten history
6. never destroy uncommitted work
7. do not force-push without explicit confirmation if the branch is already shared

If the six existing commits already use the correct maintainer identity and contain no unwanted references, leave history untouched.

---

# 48. GITHUB ACCOUNT

Use only the repository owner's GitHub identity.

Repository:

```text
https://github.com/AmirHaddadi/LinPlayer
```

Do not create or configure another GitHub identity.

Do not add external contributors automatically.

Do not add bot authorship to normal commits.

---

# 49. COMMIT STRATEGY

Use meaningful commits.

Suggested grouping:

```text
fix: stabilize responsive application layout
fix: correct theme switching and settings controls
feat: add artwork extraction and caching UI
feat: add premium now playing experience
feat: add audio visualizer
feat: add equalizer
fix: synchronize audio and video playback lifecycle
feat: add Persian and English localization
feat: add RTL support and Shabnam typography
style: redesign LinPlayer interaction system
test: add regression and playback tests
docs: update milestone documentation
```

Do not create dozens of meaningless micro-commits.

Do not squash useful independent work unless necessary.

---

# 50. README / DOCUMENTATION

Update documentation to reflect actual functionality.

Add/update:

```text
docs/
  architecture.md
  media-support.md
  development.md
  release.md
  i18n.md
  ui.md
```

Document:

* i18n
* RTL
* Shabnam font
* equalizer architecture
* visualizer architecture
* artwork system
* theme architecture

Do not claim unsupported features.

---

# 51. SECURITY

Maintain all existing Electron security guarantees.

Do not weaken:

```text
contextIsolation
sandbox
nodeIntegration disabled
typed IPC
minimal preload API
```

Do not expose Web Audio implementation through unrestricted IPC.

Do not allow renderer arbitrary process execution.

---

# 52. BUILD & PACKAGING

After implementation verify:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run package
```

Both must continue to build:

```text
AppImage
.deb
```

Ensure:

* Shabnam.ttf is packaged
* artwork cache paths are valid
* assets are available in packaged application
* visualizer works in production build
* equalizer does not rely on dev-only paths

---

# 53. ACCEPTANCE CRITERIA

Milestone is NOT complete until:

### UI

* [ ] no major overflow
* [ ] resizing works
* [ ] settings layout is stable
* [ ] switches are custom
* [ ] selects are custom
* [ ] sliders are custom
* [ ] theme switching works
* [ ] dark mode works
* [ ] light mode works
* [ ] responsive layout works

### Media

* [ ] audio works
* [ ] video works
* [ ] audio/video cannot play simultaneously accidentally
* [ ] video resizes correctly
* [ ] fullscreen works
* [ ] artwork displays
* [ ] artwork caching works

### Audio

* [ ] equalizer works
* [ ] presets work
* [ ] reset works
* [ ] visualizer reacts to real audio
* [ ] visualizer can be disabled
* [ ] visualizer performance is acceptable

### Internationalization

* [ ] English works
* [ ] Persian works
* [ ] Shabnam.ttf works
* [ ] RTL works
* [ ] language persists
* [ ] no hard-coded UI strings remain in primary UI

### UX

* [ ] animations are smooth
* [ ] loading states exist
* [ ] empty states exist
* [ ] error states exist
* [ ] accessibility is preserved
* [ ] keyboard navigation works

### Engineering

* [ ] no architecture regression
* [ ] no Electron security regression
* [ ] no direct Node access from renderer
* [ ] tests pass
* [ ] typecheck passes
* [ ] lint passes
* [ ] production build passes
* [ ] AppImage builds
* [ ] `.deb` builds

### Git

* [ ] no Claude attribution
* [ ] correct maintainer Git identity
* [ ] no accidental third-party author
* [ ] history inspected
* [ ] no unsafe force push

---

# 54. DO NOT FAKE COMPLETION

Never report:

> Equalizer implemented

if the controls only change UI values.

Never report:

> Visualizer implemented

if it is just a looping animation unrelated to audio.

Never report:

> Theme fixed

if only the Settings page changes.

Never report:

> RTL implemented

if only text alignment changes.

Every feature must be functionally connected to the actual architecture.

---

# 55. PRIORITY ORDER

Implement in this order:

## Phase A — Stabilization

1. Inspect architecture
2. Fix resize
3. Fix settings overflow
4. Fix switches
5. Fix selectors
6. Fix sliders
7. Fix theme switching
8. Fix video resizing
9. Fix simultaneous audio/video playback

## Phase B — Media Experience

10. Artwork extraction
11. Artwork cache
12. Artwork UI
13. Now Playing redesign

## Phase C — Audio

14. Equalizer architecture
15. Equalizer UI
16. Presets
17. Visualizer engine
18. Premium visualizer

## Phase D — Internationalization

19. i18n architecture
20. English translations
21. Persian translations
22. Shabnam font
23. RTL
24. Language persistence

## Phase E — Premium UX

25. Animation system
26. Microinteractions
27. Loading states
28. Empty states
29. Error states
30. Accessibility improvements

## Phase F — Quality

31. Regression tests
32. E2E tests
33. Performance review
34. Packaging verification
35. Documentation
36. Git history/identity audit

---

# 56. FINAL VALIDATION

Before declaring completion:

Run the actual application.

Do not rely solely on static analysis.

Test on a real graphical Linux environment when available.

Verify:

* resizing
* settings
* audio
* video
* playlists
* artwork
* theme
* equalizer
* visualizer
* language
* RTL
* fullscreen
* keyboard
* drag/drop

Then run all automated checks.

---

# 57. FINAL REPORT

At completion provide:

## Changed

List the major changes.

## Fixed

List every reported bug fixed.

## New Features

List:

* artwork
* equalizer
* visualizer
* bilingual UI
* RTL
* theme
* premium UI

## Tests

Report actual results.

## Build

Report:

```text
AppImage
.deb
```

## Git

Report:

* current branch
* current commit
* author identity
* whether history was modified
* whether force push was required

## Known Limitations

Be completely honest.

## Recommended Next Milestone

Based on the actual implementation, recommend the next logical milestone.

---

# START

Begin by auditing the existing LinPlayer repository.

Do not rebuild it.

Do not remove working functionality.

Fix the reported issues first.

Then implement the new premium media experience.

Prioritize correctness over visual shortcuts.

The final application should feel like:

**LinPlayer 0.2 — a serious, premium Linux media player.**
