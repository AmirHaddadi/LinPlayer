import { BrowserWindow, dialog, ipcMain } from 'electron'
import { stat as statAsync } from 'node:fs/promises'
import { IpcChannels } from '@shared/constants/ipc'
import type { AppSettings } from '@shared/types/settings'
import type { MediaItem } from '@shared/types/media'
import type { HistoryEntry, PlaylistItem } from '@shared/types/playlist'
import type { AppServices } from '../services/appServices'
import { buildArtworkUrl, buildStreamUrl } from '../services/mediaProtocol'
import { createLogger } from '@core/logging/logger'

const logger = createLogger('main:ipc')

const adhocOpenedPaths = new Set<string>()

export function isMediaPathAllowed(services: AppServices, filePath: string): boolean {
  return adhocOpenedPaths.has(filePath) || services.database.media.getByPath(filePath) !== null
}

/** Rewrites a raw filesystem artwork path into a renderer-loadable protocol URL. */
function withArtworkUrl(item: MediaItem): MediaItem {
  return item.artworkPath ? { ...item, artworkPath: buildArtworkUrl(item.artworkPath) } : item
}

function withArtworkUrlMany(items: MediaItem[]): MediaItem[] {
  return items.map(withArtworkUrl)
}

export function registerIpcHandlers(getWindow: () => BrowserWindow | null, services: AppServices): void {
  const { database, probeService, artworkCache, libraryScanner, playlistService, settingsService } =
    services

  // --- Media ---
  ipcMain.handle(IpcChannels.MediaOpenFileDialog, async () => {
    const window = getWindow()
    if (!window) return []

    const result = await dialog.showOpenDialog(window, {
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Media files', extensions: ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'opus', 'aiff', 'wma', 'mp4', 'mkv', 'webm', 'mov', 'avi', 'm4v', 'mpeg', 'ts', 'flv'] }
      ]
    })

    if (result.canceled) return []

    const opened: { item: MediaItem; streamUrl: string }[] = []
    for (const filePath of result.filePaths) {
      adhocOpenedPaths.add(filePath)
      const kind = probeService.detectKind(filePath)
      const metadata = await probeService.probe(filePath)
      let artworkPath: string | null = null
      if (metadata.artworkBuffer) {
        artworkPath = await artworkCache.save(filePath, metadata.artworkBuffer, metadata.artworkMimeType)
      }
      const item = database.media.upsertByPath(
        filePath,
        filePath.split(/[/\\]/).pop() ?? filePath,
        kind,
        metadata,
        artworkPath
      )
      opened.push({ item: withArtworkUrl(item), streamUrl: buildStreamUrl(filePath) })
    }
    return opened
  })

  ipcMain.handle(IpcChannels.MediaOpenFolderDialog, async () => {
    const window = getWindow()
    if (!window) return null
    const result = await dialog.showOpenDialog(window, { properties: ['openDirectory'] })
    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  ipcMain.handle(IpcChannels.MediaGetStreamUrl, (_event, filePath: string) => {
    adhocOpenedPaths.add(filePath)
    return buildStreamUrl(filePath)
  })

  ipcMain.handle(IpcChannels.MediaImportPaths, async (event, paths: string[]) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    const opened: { item: ReturnType<typeof withArtworkUrl>; streamUrl: string }[] = []

    for (const targetPath of paths) {
      let stat: import('node:fs').Stats
      try {
        stat = await statAsync(targetPath)
      } catch (error) {
        logger.warn(`Dropped path is not accessible: ${targetPath}`, error)
        continue
      }

      if (stat.isDirectory()) {
        database.libraryFolders.add(targetPath)
        await libraryScanner.scan(targetPath, (progress) => {
          window?.webContents.send(IpcChannels.LibraryScanProgress, progress)
        })
        continue
      }

      adhocOpenedPaths.add(targetPath)
      const kind = probeService.detectKind(targetPath)
      if (kind === 'unknown') continue

      const metadata = await probeService.probe(targetPath)
      let artworkPath: string | null = null
      if (metadata.artworkBuffer) {
        artworkPath = await artworkCache.save(targetPath, metadata.artworkBuffer, metadata.artworkMimeType)
      }
      const item = database.media.upsertByPath(
        targetPath,
        targetPath.split(/[/\\]/).pop() ?? targetPath,
        kind,
        metadata,
        artworkPath
      )
      opened.push({ item: withArtworkUrl(item), streamUrl: buildStreamUrl(targetPath) })
    }

    return opened
  })

  // --- Library ---
  ipcMain.handle(IpcChannels.LibraryScan, async (event, folderPath?: string) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    const targets = folderPath ? [folderPath] : database.libraryFolders.getAll().map((f) => f.path)

    for (const target of targets) {
      await libraryScanner.scan(target, (progress) => {
        window?.webContents.send(IpcChannels.LibraryScanProgress, progress)
      })
    }
  })

  ipcMain.handle(IpcChannels.LibraryGetItems, (_event, kind?: 'audio' | 'video') => {
    return withArtworkUrlMany(database.media.getAll(kind))
  })

  ipcMain.handle(IpcChannels.LibraryGetItem, (_event, id: number) => {
    const item = database.media.getById(id)
    return item ? withArtworkUrl(item) : null
  })

  ipcMain.handle(IpcChannels.LibrarySearch, (_event, query: string) => {
    return withArtworkUrlMany(database.media.search(query))
  })

  ipcMain.handle(IpcChannels.LibraryRemoveMissing, async () => {
    return libraryScanner.removeMissing()
  })

  ipcMain.handle(IpcChannels.LibraryGetFolders, () => {
    return database.libraryFolders.getAll()
  })

  ipcMain.handle(IpcChannels.LibraryAddFolder, async (event, folderPath: string) => {
    const folder = database.libraryFolders.add(folderPath)
    const window = BrowserWindow.fromWebContents(event.sender)
    void libraryScanner
      .scan(folderPath, (progress) => {
        window?.webContents.send(IpcChannels.LibraryScanProgress, progress)
      })
      .catch((error) => logger.error('Background scan failed', error))
    return folder
  })

  ipcMain.handle(IpcChannels.LibraryRemoveFolder, (_event, id: number) => {
    database.libraryFolders.remove(id)
  })

  ipcMain.handle(IpcChannels.LibraryToggleFavorite, (_event, mediaId: number) => {
    return database.media.toggleFavorite(mediaId)
  })

  ipcMain.handle(IpcChannels.LibraryGetFavorites, () => {
    return withArtworkUrlMany(database.media.getFavorites())
  })

  // --- Playlists ---
  ipcMain.handle(IpcChannels.PlaylistsGetAll, () => playlistService.getAll())
  ipcMain.handle(IpcChannels.PlaylistsGet, (_event, id: number) => {
    const result = playlistService.get(id)
    if (!result) return null
    return {
      playlist: result.playlist,
      items: result.items.map((item: PlaylistItem) => ({ ...item, media: withArtworkUrl(item.media) }))
    }
  })
  ipcMain.handle(IpcChannels.PlaylistsCreate, (_event, name: string, description?: string) =>
    playlistService.create(name, description)
  )
  ipcMain.handle(IpcChannels.PlaylistsRename, (_event, id: number, name: string) =>
    playlistService.rename(id, name)
  )
  ipcMain.handle(IpcChannels.PlaylistsDelete, (_event, id: number) => playlistService.delete(id))
  ipcMain.handle(IpcChannels.PlaylistsAddItem, (_event, playlistId: number, mediaId: number) =>
    playlistService.addItem(playlistId, mediaId)
  )
  ipcMain.handle(IpcChannels.PlaylistsRemoveItem, (_event, playlistId: number, itemId: number) =>
    playlistService.removeItem(playlistId, itemId)
  )
  ipcMain.handle(
    IpcChannels.PlaylistsReorderItems,
    (_event, playlistId: number, orderedItemIds: number[]) =>
      playlistService.reorderItems(playlistId, orderedItemIds)
  )

  // --- History ---
  ipcMain.handle(IpcChannels.HistoryGetRecent, (_event, limit?: number) =>
    database.history
      .getRecent(limit)
      .map((entry: HistoryEntry) => ({ ...entry, media: withArtworkUrl(entry.media) }))
  )
  ipcMain.handle(IpcChannels.HistoryAddEntry, (_event, mediaId: number, position: number) =>
    database.history.addEntry(mediaId, position)
  )
  ipcMain.handle(IpcChannels.HistoryClear, () => database.history.clear())

  // --- Settings ---
  ipcMain.handle(IpcChannels.SettingsGetAll, () => settingsService.getAll())
  ipcMain.handle(IpcChannels.SettingsGet, (_event, key: keyof AppSettings) =>
    settingsService.get(key)
  )
  ipcMain.handle(
    IpcChannels.SettingsSet,
    (_event, key: keyof AppSettings, value: AppSettings[keyof AppSettings]) =>
      settingsService.set(key, value)
  )

  // --- Window ---
  ipcMain.handle(IpcChannels.WindowMinimize, () => getWindow()?.minimize())
  ipcMain.handle(IpcChannels.WindowMaximize, () => {
    const window = getWindow()
    if (!window) return
    if (window.isMaximized()) window.unmaximize()
    else window.maximize()
  })
  ipcMain.handle(IpcChannels.WindowClose, () => getWindow()?.close())
  ipcMain.handle(IpcChannels.WindowIsMaximized, () => getWindow()?.isMaximized() ?? false)
}
