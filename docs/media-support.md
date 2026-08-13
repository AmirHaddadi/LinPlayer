# Media Support

## Formats LinPlayer is designed to support

Playback ultimately depends on Chromium's (Electron's) built-in media
pipeline, so actual support can vary by codec, not just container/file
extension. LinPlayer will attempt to index and play any file with one of
the extensions below, and will show a friendly error rather than crash if
a specific file's codec isn't supported by the runtime.

### Audio

`.mp3` `.wav` `.flac` `.aac` `.m4a` `.ogg` `.opus` `.aiff` `.aif` `.wma`\*

### Video

`.mp4` `.mkv` `.webm` `.mov` `.avi` `.m4v` `.mpeg` `.mpg` `.ts` `.flv`\*

\* `.wma` and `.flv` support depends on the underlying Chromium build and
is not guaranteed for every codec variant.

## How probing works

Every indexed file is probed with `ffprobe` (via `ffprobe-static` +
`fluent-ffmpeg`) for technical metadata (duration, codec, container,
bitrate, resolution, frame rate, sample rate, channel count), and audio
files additionally have their tags and embedded artwork read via
`music-metadata`. See `src/core/media/mediaProbeService.ts`.

## Artwork

Artwork is resolved in this order, entirely offline (no network lookups):

1. Embedded artwork in the file's own metadata (`music-metadata`).
2. A conventionally named cover image in the same folder as the media
   file — `cover`, `folder`, `album`, or `front`, any of `.jpg` `.jpeg`
   `.png` `.webp`, matched case-insensitively
   (`src/core/media/folderArtwork.ts`).
3. No artwork — the UI falls back to a kind-appropriate icon
   (`Artwork.tsx`), never a broken image.

Resolved artwork is written to a content-addressable cache
(`ArtworkCache`, keyed by a SHA-1 hash of the image bytes, not the source
path) under the app's `userData/artwork` directory — so an album folder
where every track shares one cover image only ever writes that image to
disk once. The cache directory is served to the renderer through the same
sandboxed `linplayer-media://` protocol used for audio/video streaming,
scoped to only that directory.

## Equalizer & visualizer (Web Audio API)

Both features share one Web Audio graph (`src/renderer/src/features/equalizer/audioGraph.ts`,
a singleton):

```
<audio>/<video> element
  → MediaElementAudioSourceNode
  → 7x BiquadFilterNode (60Hz, 150Hz, 400Hz, 1kHz, 2.4kHz, 6kHz, 15kHz —
     lowshelf / peaking / highshelf)
  → AnalyserNode (fftSize 2048)
  → AudioContext.destination
```

- **Equalizer**: `useEqualizerEngine` (used by `PlayerHost`) attaches both
  the audio and video elements to the graph once each — `createMediaElementSource`
  can only be called once per element for its lifetime — and pushes the
  active preset's (or custom) per-band gain into the filter chain whenever
  `AppSettings.audio.equalizerGains`/`equalizerEnabled` change. Disabling
  the equalizer sets every band to 0dB (audibly flat) rather than
  rewiring the graph, since the routing itself can't be undone. Presets
  live in `src/renderer/src/features/equalizer/presets.ts`.
- **Visualizer**: `AudioVisualizer.tsx` reads real FFT magnitude data from
  the same `AnalyserNode` via `getByteFrequencyData` on every animation
  frame (`requestAnimationFrame`, not a timer) and draws a radial
  spectrum on a `<canvas>` around the Now Playing artwork — bar length is
  exponentially smoothed (fast attack, slower release) so it reads as
  musically responsive rather than jittery, and it does not render
  anything when nothing is playing or `AppSettings.audio.visualizerEnabled`
  is off.

`AudioContext` starts `suspended` per Chromium's autoplay policy and is
resumed on the first pointer interaction — routing through Web Audio is
otherwise silent until then.

## Database schema

```
media               media metadata cache (one row per indexed file)
playlists            user-created playlists
playlist_items        ordered membership of media in playlists
playback_history      append-only log of plays, used for "History" and to
                       drive last-known playback position
settings              key/value app settings (JSON-encoded values)
library_folders        folders the user has added for scanning
```

Migrations live in `src/core/database/migrations` and are tracked in a
`schema_migrations` table so upgrades are additive and never destructive.

## Known limitations

- No subtitle support yet (planned — see the roadmap in the README).
- No multi-audio-track selection yet.
- Playback capability detection is best-effort: if ffprobe can read a
  file's duration/codec, LinPlayer assumes Chromium can likely play it,
  but this is not a guarantee for every codec/container combination.
- The equalizer ships one canonical band layout (7 bands) rather than a
  variable number of bands; presets are static gain curves, not
  auto-generated from audio analysis.
- The visualizer ships one visual mode (radial spectrum). The rendering
  code is written so additional modes could read from the same
  `AnalyserNode`, but no mode switcher UI exists yet.
