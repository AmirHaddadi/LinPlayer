export type MediaKind = 'audio' | 'video' | 'unknown'

export interface MediaItem {
  id: number
  path: string
  filename: string
  title: string | null
  artist: string | null
  album: string | null
  genre: string | null
  duration: number | null
  mimeType: string | null
  container: string | null
  codec: string | null
  width: number | null
  height: number | null
  sampleRate: number | null
  bitrate: number | null
  artworkPath: string | null
  kind: MediaKind
  createdAt: string
  updatedAt: string
  lastPlayedAt: string | null
  playCount: number
  favorite: boolean
}

export interface MediaMetadata {
  title: string | null
  artist: string | null
  album: string | null
  genre: string | null
  duration: number | null
  mimeType: string | null
  container: string | null
  codec: string | null
  width: number | null
  height: number | null
  sampleRate: number | null
  bitrate: number | null
  frameRate: number | null
  audioChannels: number | null
  artworkBuffer: Uint8Array | null
  artworkMimeType: string | null
}

export interface PlaybackCapabilities {
  canPlay: boolean
  reason?: string
}

export type ScanEventType = 'started' | 'progress' | 'completed' | 'error'

export interface LibraryScanProgress {
  type: ScanEventType
  scanned: number
  total: number
  currentPath?: string
  error?: string
}

export interface LibraryFolder {
  id: number
  path: string
  addedAt: string
}
