import type { PlaylistRepository } from '@core/database'
import type { Playlist, PlaylistItem } from '@shared/types/playlist'

export class PlaylistService {
  constructor(private readonly repository: PlaylistRepository) {}

  getAll(): Playlist[] {
    return this.repository.getAll()
  }

  get(id: number): { playlist: Playlist; items: PlaylistItem[] } | null {
    const playlist = this.repository.getById(id)
    if (!playlist) return null
    return { playlist, items: this.repository.getItems(id) }
  }

  create(name: string, description?: string): Playlist {
    const trimmed = name.trim()
    if (!trimmed) throw new Error('Playlist name cannot be empty')
    return this.repository.create(trimmed, description?.trim() || undefined)
  }

  rename(id: number, name: string): void {
    const trimmed = name.trim()
    if (!trimmed) throw new Error('Playlist name cannot be empty')
    this.repository.rename(id, trimmed)
  }

  delete(id: number): void {
    this.repository.delete(id)
  }

  addItem(playlistId: number, mediaId: number): void {
    this.repository.addItem(playlistId, mediaId)
  }

  removeItem(playlistId: number, itemId: number): void {
    this.repository.removeItem(playlistId, itemId)
  }

  reorderItems(playlistId: number, orderedItemIds: number[]): void {
    this.repository.reorderItems(playlistId, orderedItemIds)
  }
}
