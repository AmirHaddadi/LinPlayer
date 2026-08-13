import type { LibraryFolder, LibraryScanProgress, MediaItem } from './media'
import type { HistoryEntry, Playlist, PlaylistItem } from './playlist'
import type { AppSettings } from './settings'

export interface OpenedMedia {
  item: MediaItem
  streamUrl: string
}

export interface LinPlayerApi {
  media: {
    openFileDialog: () => Promise<OpenedMedia[]>
    openFolderDialog: () => Promise<string | null>
    getStreamUrl: (path: string) => Promise<string>
    getPathForFile: (file: File) => string
    importPaths: (paths: string[]) => Promise<OpenedMedia[]>
  }
  library: {
    scan: (folderPath?: string) => Promise<void>
    onScanProgress: (callback: (progress: LibraryScanProgress) => void) => () => void
    getItems: (kind?: 'audio' | 'video') => Promise<MediaItem[]>
    getItem: (id: number) => Promise<MediaItem | null>
    search: (query: string) => Promise<MediaItem[]>
    removeMissing: () => Promise<number>
    getFolders: () => Promise<LibraryFolder[]>
    addFolder: (path: string) => Promise<LibraryFolder>
    removeFolder: (id: number) => Promise<void>
    toggleFavorite: (mediaId: number) => Promise<boolean>
    getFavorites: () => Promise<MediaItem[]>
  }
  playlists: {
    getAll: () => Promise<Playlist[]>
    get: (id: number) => Promise<{ playlist: Playlist; items: PlaylistItem[] } | null>
    create: (name: string, description?: string) => Promise<Playlist>
    rename: (id: number, name: string) => Promise<void>
    delete: (id: number) => Promise<void>
    addItem: (playlistId: number, mediaId: number) => Promise<void>
    removeItem: (playlistId: number, itemId: number) => Promise<void>
    reorderItems: (playlistId: number, orderedItemIds: number[]) => Promise<void>
  }
  history: {
    getRecent: (limit?: number) => Promise<HistoryEntry[]>
    addEntry: (mediaId: number, position: number) => Promise<void>
    clear: () => Promise<void>
  }
  settings: {
    getAll: () => Promise<AppSettings>
    get: <K extends keyof AppSettings>(key: K) => Promise<AppSettings[K]>
    set: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>
  }
  window: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
    isMaximized: () => Promise<boolean>
  }
}

declare global {
  interface Window {
    linplayer: LinPlayerApi
  }
}
