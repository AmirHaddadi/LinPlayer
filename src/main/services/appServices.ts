import { join } from 'node:path'
import { app } from 'electron'
import { DatabaseService } from '@core/database'
import { MediaProbeService, LibraryScanner, ArtworkCache } from '@core/media'
import { PlaylistService } from '@core/playlists/playlistService'
import { SettingsService } from '@core/settings/settingsService'

export interface AppServices {
  database: DatabaseService
  probeService: MediaProbeService
  artworkCache: ArtworkCache
  libraryScanner: LibraryScanner
  playlistService: PlaylistService
  settingsService: SettingsService
  paths: {
    userData: string
    database: string
    artwork: string
  }
}

export async function createAppServices(): Promise<AppServices> {
  const userDataPath = app.getPath('userData')
  const databasePath = join(userDataPath, 'linplayer.sqlite3')
  const artworkPath = join(userDataPath, 'artwork')

  const database = new DatabaseService(databasePath)
  const probeService = new MediaProbeService()
  const artworkCache = new ArtworkCache(artworkPath)
  await artworkCache.init()

  const libraryScanner = new LibraryScanner(probeService, database.media, artworkCache)
  const playlistService = new PlaylistService(database.playlists)
  const settingsService = new SettingsService(database.settings)

  return {
    database,
    probeService,
    artworkCache,
    libraryScanner,
    playlistService,
    settingsService,
    paths: {
      userData: userDataPath,
      database: databasePath,
      artwork: artworkPath
    }
  }
}
