import type { MediaKind, MediaMetadata, PlaybackCapabilities } from '@shared/types/media'

/**
 * Abstraction over the underlying media probing/decoding backend so the
 * implementation (currently ffprobe + music-metadata + Chromium's native
 * decoders) can be swapped without touching callers.
 */
export interface MediaEngine {
  probe: (filePath: string) => Promise<MediaMetadata>
  detectKind: (filePath: string) => MediaKind
  getCapabilities: (filePath: string, metadata: MediaMetadata) => PlaybackCapabilities
}

export interface MediaSource {
  path: string
  kind: MediaKind
}
