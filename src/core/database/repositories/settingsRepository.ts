import type Database from 'better-sqlite3'
import { DEFAULT_SETTINGS, type AppSettings } from '@shared/types/settings'

export class SettingsRepository {
  constructor(private readonly db: Database.Database) {}

  getAll(): AppSettings {
    const rows = this.db.prepare('SELECT key, value FROM settings').all() as {
      key: string
      value: string
    }[]

    const stored: Record<string, unknown> = {}
    for (const row of rows) {
      try {
        stored[row.key] = JSON.parse(row.value)
      } catch {
        // ignore malformed value
      }
    }

    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      appearance: { ...DEFAULT_SETTINGS.appearance, ...(stored.appearance as object) },
      playback: { ...DEFAULT_SETTINGS.playback, ...(stored.playback as object) },
      audio: { ...DEFAULT_SETTINGS.audio, ...(stored.audio as object) },
      library: { ...DEFAULT_SETTINGS.library, ...(stored.library as object) },
      general: { ...DEFAULT_SETTINGS.general, ...(stored.general as object) }
    } as AppSettings
  }

  get<K extends keyof AppSettings>(key: K): AppSettings[K] {
    const row = this.db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as
      | { value: string }
      | undefined
    if (!row) return DEFAULT_SETTINGS[key]
    try {
      return { ...DEFAULT_SETTINGS[key], ...JSON.parse(row.value) }
    } catch {
      return DEFAULT_SETTINGS[key]
    }
  }

  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    this.db
      .prepare(
        `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      )
      .run(key, JSON.stringify(value))
  }
}
