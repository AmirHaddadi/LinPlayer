import type Database from 'better-sqlite3'
import type { Playlist, PlaylistItem } from '@shared/types/playlist'
import { MediaRepository } from './mediaRepository'

interface PlaylistRow {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
  item_count: number
}

interface PlaylistItemRow {
  id: number
  playlist_id: number
  media_id: number
  position: number
  added_at: string
}

export class PlaylistRepository {
  private readonly mediaRepository: MediaRepository

  constructor(private readonly db: Database.Database) {
    this.mediaRepository = new MediaRepository(db)
  }

  private mapPlaylist(row: PlaylistRow): Playlist {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      itemCount: row.item_count
    }
  }

  getAll(): Playlist[] {
    const rows = this.db
      .prepare(
        `SELECT p.*, (SELECT COUNT(*) FROM playlist_items pi WHERE pi.playlist_id = p.id) AS item_count
         FROM playlists p ORDER BY p.created_at DESC`
      )
      .all() as PlaylistRow[]
    return rows.map((r) => this.mapPlaylist(r))
  }

  getById(id: number): Playlist | null {
    const row = this.db
      .prepare(
        `SELECT p.*, (SELECT COUNT(*) FROM playlist_items pi WHERE pi.playlist_id = p.id) AS item_count
         FROM playlists p WHERE p.id = ?`
      )
      .get(id) as PlaylistRow | undefined
    return row ? this.mapPlaylist(row) : null
  }

  getItems(playlistId: number): PlaylistItem[] {
    const rows = this.db
      .prepare('SELECT * FROM playlist_items WHERE playlist_id = ? ORDER BY position ASC')
      .all(playlistId) as PlaylistItemRow[]

    return rows
      .map((row) => {
        const media = this.mediaRepository.getById(row.media_id)
        if (!media) return null
        return {
          id: row.id,
          playlistId: row.playlist_id,
          mediaId: row.media_id,
          position: row.position,
          addedAt: row.added_at,
          media
        }
      })
      .filter((x): x is PlaylistItem => x !== null)
  }

  create(name: string, description?: string): Playlist {
    const result = this.db
      .prepare('INSERT INTO playlists (name, description) VALUES (?, ?)')
      .run(name, description ?? null)
    return this.getById(Number(result.lastInsertRowid))!
  }

  rename(id: number, name: string): void {
    this.db
      .prepare(
        "UPDATE playlists SET name = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?"
      )
      .run(name, id)
  }

  delete(id: number): void {
    this.db.prepare('DELETE FROM playlists WHERE id = ?').run(id)
  }

  addItem(playlistId: number, mediaId: number): void {
    const maxPos = this.db
      .prepare('SELECT COALESCE(MAX(position), -1) AS maxPos FROM playlist_items WHERE playlist_id = ?')
      .get(playlistId) as { maxPos: number }

    this.db
      .prepare(
        'INSERT INTO playlist_items (playlist_id, media_id, position) VALUES (?, ?, ?)'
      )
      .run(playlistId, mediaId, maxPos.maxPos + 1)
  }

  removeItem(playlistId: number, itemId: number): void {
    this.db
      .prepare('DELETE FROM playlist_items WHERE id = ? AND playlist_id = ?')
      .run(itemId, playlistId)
  }

  reorderItems(playlistId: number, orderedItemIds: number[]): void {
    const stmt = this.db.prepare(
      'UPDATE playlist_items SET position = ? WHERE id = ? AND playlist_id = ?'
    )
    const tx = this.db.transaction((ids: number[]) => {
      ids.forEach((itemId, index) => stmt.run(index, itemId, playlistId))
    })
    tx(orderedItemIds)
  }
}
