import type Database from 'better-sqlite3'
import * as migration001 from './migrations/001_initial'

interface Migration {
  id: string
  up: (db: Database.Database) => void
}

const MIGRATIONS: Migration[] = [migration001]

export function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `)

  const applied = new Set(
    db.prepare('SELECT id FROM schema_migrations').all().map((row) => (row as { id: string }).id)
  )

  const applyMigration = db.transaction((migration: Migration) => {
    migration.up(db)
    db.prepare('INSERT INTO schema_migrations (id) VALUES (?)').run(migration.id)
  })

  for (const migration of MIGRATIONS) {
    if (!applied.has(migration.id)) {
      applyMigration(migration)
    }
  }
}
