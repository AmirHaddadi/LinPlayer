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
