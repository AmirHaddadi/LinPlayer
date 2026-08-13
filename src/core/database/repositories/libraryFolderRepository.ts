import type Database from 'better-sqlite3'
import type { LibraryFolder } from '@shared/types/media'

interface LibraryFolderRow {
  id: number
  path: string
  added_at: string
}

function mapRow(row: LibraryFolderRow): LibraryFolder {
  return { id: row.id, path: row.path, addedAt: row.added_at }
}

export class LibraryFolderRepository {
  constructor(private readonly db: Database.Database) {}

  getAll(): LibraryFolder[] {
    const rows = this.db.prepare('SELECT * FROM library_folders ORDER BY added_at ASC').all() as LibraryFolderRow[]
    return rows.map(mapRow)
  }

  add(path: string): LibraryFolder {
    const existing = this.db.prepare('SELECT * FROM library_folders WHERE path = ?').get(path) as
      | LibraryFolderRow
      | undefined
    if (existing) return mapRow(existing)

    const result = this.db.prepare('INSERT INTO library_folders (path) VALUES (?)').run(path)
    const row = this.db
      .prepare('SELECT * FROM library_folders WHERE id = ?')
      .get(Number(result.lastInsertRowid)) as LibraryFolderRow
    return mapRow(row)
  }

  remove(id: number): void {
    this.db.prepare('DELETE FROM library_folders WHERE id = ?').run(id)
  }
}
