import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { IpcChannels } from '@shared/constants/ipc'
import type { LinPlayerApi } from '@shared/types/api'
import type { LibraryScanProgress } from '@shared/types/media'

const linplayerApi: LinPlayerApi = {
  media: {
    openFileDialog: () => ipcRenderer.invoke(IpcChannels.MediaOpenFileDialog),
    openFolderDialog: () => ipcRenderer.invoke(IpcChannels.MediaOpenFolderDialog),
    getStreamUrl: (path) => ipcRenderer.invoke(IpcChannels.MediaGetStreamUrl, path),
    getPathForFile: (file) => webUtils.getPathForFile(file),
    importPaths: (paths) => ipcRenderer.invoke(IpcChannels.MediaImportPaths, paths)
  },
  library: {
    scan: (folderPath) => ipcRenderer.invoke(IpcChannels.LibraryScan, folderPath),
    onScanProgress: (callback) => {
      const listener = (_event: Electron.IpcRendererEvent, progress: LibraryScanProgress): void =>
        callback(progress)
      ipcRenderer.on(IpcChannels.LibraryScanProgress, listener)
      return () => ipcRenderer.removeListener(IpcChannels.LibraryScanProgress, listener)
    },
    getItems: (kind) => ipcRenderer.invoke(IpcChannels.LibraryGetItems, kind),
    getItem: (id) => ipcRenderer.invoke(IpcChannels.LibraryGetItem, id),
    search: (query) => ipcRenderer.invoke(IpcChannels.LibrarySearch, query),
    removeMissing: () => ipcRenderer.invoke(IpcChannels.LibraryRemoveMissing),
    getFolders: () => ipcRenderer.invoke(IpcChannels.LibraryGetFolders),
    addFolder: (path) => ipcRenderer.invoke(IpcChannels.LibraryAddFolder, path),
    removeFolder: (id) => ipcRenderer.invoke(IpcChannels.LibraryRemoveFolder, id),
    toggleFavorite: (mediaId) => ipcRenderer.invoke(IpcChannels.LibraryToggleFavorite, mediaId),
    getFavorites: () => ipcRenderer.invoke(IpcChannels.LibraryGetFavorites)
  },
  playlists: {
    getAll: () => ipcRenderer.invoke(IpcChannels.PlaylistsGetAll),
    get: (id) => ipcRenderer.invoke(IpcChannels.PlaylistsGet, id),
    create: (name, description) => ipcRenderer.invoke(IpcChannels.PlaylistsCreate, name, description),
    rename: (id, name) => ipcRenderer.invoke(IpcChannels.PlaylistsRename, id, name),
    delete: (id) => ipcRenderer.invoke(IpcChannels.PlaylistsDelete, id),
    addItem: (playlistId, mediaId) => ipcRenderer.invoke(IpcChannels.PlaylistsAddItem, playlistId, mediaId),
    removeItem: (playlistId, itemId) =>
      ipcRenderer.invoke(IpcChannels.PlaylistsRemoveItem, playlistId, itemId),
    reorderItems: (playlistId, orderedItemIds) =>
      ipcRenderer.invoke(IpcChannels.PlaylistsReorderItems, playlistId, orderedItemIds)
  },
  history: {
    getRecent: (limit) => ipcRenderer.invoke(IpcChannels.HistoryGetRecent, limit),
    addEntry: (mediaId, position) => ipcRenderer.invoke(IpcChannels.HistoryAddEntry, mediaId, position),
    clear: () => ipcRenderer.invoke(IpcChannels.HistoryClear)
  },
  settings: {
    getAll: () => ipcRenderer.invoke(IpcChannels.SettingsGetAll),
    get: (key) => ipcRenderer.invoke(IpcChannels.SettingsGet, key),
    set: (key, value) => ipcRenderer.invoke(IpcChannels.SettingsSet, key, value)
  },
  window: {
    minimize: () => ipcRenderer.invoke(IpcChannels.WindowMinimize),
    maximize: () => ipcRenderer.invoke(IpcChannels.WindowMaximize),
    close: () => ipcRenderer.invoke(IpcChannels.WindowClose),
    isMaximized: () => ipcRenderer.invoke(IpcChannels.WindowIsMaximized)
  }
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('linplayer', linplayerApi)
} else {
  // Fallback only used if contextIsolation is disabled (not the default here).
  window.linplayer = linplayerApi
}
