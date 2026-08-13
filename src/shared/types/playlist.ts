import type { MediaItem } from './media'

export interface Playlist {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  itemCount: number
}

export interface PlaylistItem {
  id: number
  playlistId: number
  mediaId: number
  position: number
  addedAt: string
  media: MediaItem
}

export interface HistoryEntry {
  id: number
  mediaId: number
  position: number
  playedAt: string
  media: MediaItem
}
