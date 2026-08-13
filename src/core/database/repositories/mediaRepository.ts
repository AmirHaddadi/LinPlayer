import type Database from 'better-sqlite3'
import type { MediaItem, MediaKind, MediaMetadata } from '@shared/types/media'

interface MediaRow {
  id: number
  path: string
  filename: string
  title: string | null
  artist: string | null
  album: string | null
  genre: string | null
  duration: number | null
  mime_type: string | null
  container: string | null
  codec: string | null
  width: number | null
  height: number | null
  sample_rate: number | null
  bitrate: number | null
  artwork_path: string | null
  kind: string
  created_at: string
  updated_at: string
  last_played_at: string | null
  play_count: number
  favorite: number
}

function mapRow(row: MediaRow): MediaItem {
  return {
    id: row.id,
    path: row.path,
    filename: row.filename,
    title: row.title,
    artist: row.artist,
    album: row.album,
    genre: row.genre,
    duration: row.duration,
    mimeType: row.mime_type,
    container: row.container,
    codec: row.codec,
    width: row.width,
    height: row.height,
    sampleRate: row.sample_rate,
    bitrate: row.bitrate,
    artworkPath: row.artwork_path,
    kind: row.kind as MediaKind,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastPlayedAt: row.last_played_at,
    playCount: row.play_count,
    favorite: Boolean(row.favorite)
  }
}

export class MediaRepository {
  constructor(private readonly db: Database.Database) {}

  upsertByPath(
    path: string,
    filename: string,
    kind: MediaKind,
    metadata: MediaMetadata,
    artworkPath: string | null
  ): MediaItem {
    const stmt = this.db.prepare(`
      INSERT INTO media (
        path, filename, title, artist, album, genre, duration, mime_type, container,
        codec, width, height, sample_rate, bitrate, artwork_path, kind, updated_at
      ) VALUES (
        @path, @filename, @title, @artist, @album, @genre, @duration, @mimeType, @container,
        @codec, @width, @height, @sampleRate, @bitrate, @artworkPath, @kind, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      )
      ON CONFLICT(path) DO UPDATE SET
        filename = excluded.filename,
        title = excluded.title,
        artist = excluded.artist,
        album = excluded.album,
        genre = excluded.genre,
        duration = excluded.duration,
        mime_type = excluded.mime_type,
        container = excluded.container,
        codec = excluded.codec,
        width = excluded.width,
        height = excluded.height,
        sample_rate = excluded.sample_rate,
        bitrate = excluded.bitrate,
        artwork_path = excluded.artwork_path,
        kind = excluded.kind,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    `)

    stmt.run({
      path,
      filename,
      title: metadata.title,
      artist: metadata.artist,
      album: metadata.album,
      genre: metadata.genre,
      duration: metadata.duration,
      mimeType: metadata.mimeType,
      container: metadata.container,
      codec: metadata.codec,
      width: metadata.width,
      height: metadata.height,
      sampleRate: metadata.sampleRate,
      bitrate: metadata.bitrate,
      artworkPath,
      kind
    })

    return this.getByPath(path)!
  }

  getByPath(path: string): MediaItem | null {
    const row = this.db.prepare('SELECT * FROM media WHERE path = ?').get(path) as
      | MediaRow
      | undefined
    return row ? mapRow(row) : null
  }

  getById(id: number): MediaItem | null {
    const row = this.db.prepare('SELECT * FROM media WHERE id = ?').get(id) as
      | MediaRow
      | undefined
    return row ? mapRow(row) : null
  }

  getAll(kind?: MediaKind): MediaItem[] {
    const rows = kind
      ? (this.db
          .prepare('SELECT * FROM media WHERE kind = ? ORDER BY title COLLATE NOCASE ASC')
          .all(kind) as MediaRow[])
      : (this.db.prepare('SELECT * FROM media ORDER BY title COLLATE NOCASE ASC').all() as MediaRow[])
    return rows.map(mapRow)
  }

  getFavorites(): MediaItem[] {
    const rows = this.db
      .prepare('SELECT * FROM media WHERE favorite = 1 ORDER BY title COLLATE NOCASE ASC')
      .all() as MediaRow[]
    return rows.map(mapRow)
  }

  getRecentlyAdded(limit = 20): MediaItem[] {
    const rows = this.db
      .prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT ?')
      .all(limit) as MediaRow[]
    return rows.map(mapRow)
  }

  search(query: string): MediaItem[] {
    const like = `%${query}%`
    const rows = this.db
      .prepare(
        `SELECT * FROM media
         WHERE title LIKE ? OR artist LIKE ? OR album LIKE ? OR genre LIKE ? OR filename LIKE ?
         ORDER BY title COLLATE NOCASE ASC
         LIMIT 200`
      )
      .all(like, like, like, like, like) as MediaRow[]
    return rows.map(mapRow)
  }

  setFavorite(id: number, favorite: boolean): void {
    this.db
      .prepare('UPDATE media SET favorite = ?, updated_at = strftime(\'%Y-%m-%dT%H:%M:%fZ\', \'now\') WHERE id = ?')
      .run(favorite ? 1 : 0, id)
  }

  toggleFavorite(id: number): boolean {
    const item = this.getById(id)
    if (!item) throw new Error(`Media item ${id} not found`)
    const next = !item.favorite
    this.setFavorite(id, next)
    return next
  }

  recordPlay(id: number): void {
    this.db
      .prepare(
        `UPDATE media SET play_count = play_count + 1,
         last_played_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`
      )
      .run(id)
  }

  getAllPaths(): string[] {
    const rows = this.db.prepare('SELECT path FROM media').all() as { path: string }[]
    return rows.map((r) => r.path)
  }

  deleteByPath(path: string): void {
    this.db.prepare('DELETE FROM media WHERE path = ?').run(path)
  }

  deleteMissing(existingPaths: Set<string>): number {
    const all = this.getAllPaths()
    const missing = all.filter((p) => !existingPaths.has(p))
    const del = this.db.prepare('DELETE FROM media WHERE path = ?')
    const tx = this.db.transaction((paths: string[]) => {
      for (const p of paths) del.run(p)
    })
    tx(missing)
    return missing.length
  }
}
