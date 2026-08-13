import type Database from 'better-sqlite3'
import { createDatabase } from './connection'
import { MediaRepository } from './repositories/mediaRepository'
import { PlaylistRepository } from './repositories/playlistRepository'
import { HistoryRepository } from './repositories/historyRepository'
import { SettingsRepository } from './repositories/settingsRepository'
import { LibraryFolderRepository } from './repositories/libraryFolderRepository'

export class DatabaseService {
  readonly connection: Database.Database
  readonly media: MediaRepository
  readonly playlists: PlaylistRepository
  readonly history: HistoryRepository
  readonly settings: SettingsRepository
  readonly libraryFolders: LibraryFolderRepository

  constructor(filePath: string) {
    this.connection = createDatabase(filePath)
    this.media = new MediaRepository(this.connection)
    this.playlists = new PlaylistRepository(this.connection)
    this.history = new HistoryRepository(this.connection)
    this.settings = new SettingsRepository(this.connection)
    this.libraryFolders = new LibraryFolderRepository(this.connection)
  }

  close(): void {
    this.connection.close()
  }
}

export * from './repositories/mediaRepository'
export * from './repositories/playlistRepository'
export * from './repositories/historyRepository'
export * from './repositories/settingsRepository'
export * from './repositories/libraryFolderRepository'
