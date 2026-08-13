# UI / Design System

## Design tokens

Every color in the app resolves through a CSS custom property, defined
once in `src/renderer/src/styles/globals.css` and consumed via
`tailwind.config.ts` (`rgb(var(--token) / <alpha-value>)`). Dark values
live under `:root.dark`, light values under bare `:root` — switching
themes is therefore a single class toggle on `<html>`, not a duplicated
stylesheet, and every component automatically follows because none of
them hard-code a hex color.

Tokens: `base-100`…`base-950` (a 10-step neutral ramp — low numbers are
foreground-leaning, high numbers are background-leaning, in **both**
themes, which is what lets every component work unmodified in light
mode — see below), `surface` / `surface-raised`, `accent` /
`accent-hover` / `accent-muted` / `accent-foreground`, `success`,
`warning`, `danger`.

### Why light mode "just works" without touching components

In dark mode, `base-950` is near-black (used for page backgrounds) and
`base-100` is near-white (used for text). In light mode, the *ramp is
inverted at the token level*: `base-950` becomes near-white and
`base-100` becomes near-black — so a component that says
`bg-base-950 text-base-100` renders correctly as "background / readable
text" in both themes without any component-level dark:/light: branching.

### Single source of truth for theme

`App.tsx` is the only place that reads `AppSettings.appearance.theme`,
resolves `system` against `prefers-color-scheme`, and toggles the `dark`
class on `<html>`. No other component keeps its own theme state.

## Custom controls

Native form controls were replaced with a small set of reusable,
accessible components (`src/renderer/src/components/common`):

- **`LinSwitch`** — animated toggle. Uses `margin-inline-start: auto` on
  the thumb (not a `translateX` transform) so the ON position is always
  the logical "end" of the track, which mirrors correctly under RTL for
  free.
- **`LinSelect`** — custom dropdown with keyboard navigation (arrows,
  Home/End, Enter, Escape), animated open/close, click-outside handling,
  and a viewport-boundary check that flips the panel upward when there
  isn't room below (this is also the fix for the "settings dropdowns
  overflow the window" class of bugs).
- **`LinSlider`** — replaces native `<input type="range">`, which was the
  root cause of the reported "volume control overflows its card" bug:
  native range inputs don't respect `min-width: 0` inside a flex row, so
  they can force their container wider than intended. `LinSlider`'s track
  is always `width: 100%` of its flex parent and never contributes
  intrinsic width, plus it supports both horizontal and vertical
  orientation (the equalizer bands use vertical).

All three support keyboard interaction, visible focus states, and
`disabled`.

## Layout overflow discipline

The general fix pattern applied across `Settings`, the `PlayerBar`, and
list rows: every flex/grid container that holds text or a fixed-width
control now has `min-w-0` on the row and `truncate` on the text node, and
fixed pixel widths were replaced with `max-w-*` + `w-full` so a control
can shrink but never force its container to grow. `PlayerBar`'s side
columns (now-playing info, volume/queue/fullscreen) are also responsive
(`w-40 sm:w-48 lg:w-64`) so they don't compress the transport controls
below the 960×600 minimum window size.

## Video container

The video element is positioned with logical inset properties
(`start-*`/`end-*`, not `left-*`/`right-*`) so it renders on the correct
side of the sidebar/queue regardless of UI direction, and always uses
`object-contain` to preserve the source aspect ratio — no stretching, no
unwanted cropping, letterboxed instead of distorted when the container's
aspect ratio doesn't match the video's.

## Single active player

See `PlayerHost.tsx`: whenever the active media's kind changes (or clears
to nothing), the element that is *not* the new active kind is explicitly
`.pause()`d, has its `src` attribute removed, and `.load()` is called on
it. This is what actually fixes "video plays under music" — relying on
React removing the `src` prop alone left a window where the previous
element could still be audible.

## Audio graph — equalizer & visualizer

See `docs/media-support.md` for the Web Audio API architecture shared by
the equalizer and the visualizer.

## Animation

A small set of reusable Tailwind animation utilities
(`animate-fade-in`, `animate-fade-slide-in`, `animate-scale-in`, plus the
`ease-premium` cubic-bezier) are defined once in `tailwind.config.ts` and
reused across dropdowns, toasts, and modals rather than one-off
transitions per component. `prefers-reduced-motion: reduce` and an
in-app "Reduce motion" setting both collapse all animation/transition
durations to effectively zero via a single global CSS rule.
