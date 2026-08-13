import type Database from 'better-sqlite3'
import type { HistoryEntry } from '@shared/types/playlist'
import { MediaRepository } from './mediaRepository'

interface HistoryRow {
  id: number
  media_id: number
  position: number
  played_at: string
}

export class HistoryRepository {
  private readonly mediaRepository: MediaRepository

  constructor(private readonly db: Database.Database) {
    this.mediaRepository = new MediaRepository(db)
  }

  getRecent(limit = 50): HistoryEntry[] {
    const rows = this.db
      .prepare(
        `SELECT h.* FROM playback_history h
         GROUP BY h.media_id
         HAVING MAX(h.played_at)
         ORDER BY h.played_at DESC
         LIMIT ?`
      )
      .all(limit) as HistoryRow[]

    return rows
      .map((row) => {
        const media = this.mediaRepository.getById(row.media_id)
        if (!media) return null
        return {
          id: row.id,
          mediaId: row.media_id,
          position: row.position,
          playedAt: row.played_at,
          media
        }
      })
      .filter((x): x is HistoryEntry => x !== null)
  }

  addEntry(mediaId: number, position: number): void {
    this.db
      .prepare('INSERT INTO playback_history (media_id, position) VALUES (?, ?)')
      .run(mediaId, position)
    this.mediaRepository.recordPlay(mediaId)
  }

  clear(): void {
    this.db.prepare('DELETE FROM playback_history').run()
  }

  getLastPosition(mediaId: number): number | null {
    const row = this.db
      .prepare('SELECT position FROM playback_history WHERE media_id = ? ORDER BY played_at DESC LIMIT 1')
      .get(mediaId) as { position: number } | undefined
    return row ? row.position : null
  }
}
