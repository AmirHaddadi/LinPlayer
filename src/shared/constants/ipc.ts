export const IpcChannels = {
  MediaOpenFileDialog: 'media:openFileDialog',
  MediaOpenFolderDialog: 'media:openFolderDialog',
  MediaProbe: 'media:probe',
  MediaGetStreamUrl: 'media:getStreamUrl',
  MediaImportPaths: 'media:importPaths',

  LibraryScan: 'library:scan',
  LibraryScanProgress: 'library:scanProgress',
  LibraryGetItems: 'library:getItems',
  LibraryGetItem: 'library:getItem',
  LibraryRemoveMissing: 'library:removeMissing',
  LibrarySearch: 'library:search',
  LibraryGetFolders: 'library:getFolders',
  LibraryAddFolder: 'library:addFolder',
  LibraryRemoveFolder: 'library:removeFolder',
  LibraryToggleFavorite: 'library:toggleFavorite',
  LibraryGetFavorites: 'library:getFavorites',

  PlaylistsGetAll: 'playlists:getAll',
  PlaylistsGet: 'playlists:get',
  PlaylistsCreate: 'playlists:create',
  PlaylistsRename: 'playlists:rename',
  PlaylistsDelete: 'playlists:delete',
  PlaylistsAddItem: 'playlists:addItem',
  PlaylistsRemoveItem: 'playlists:removeItem',
  PlaylistsReorderItems: 'playlists:reorderItems',

  HistoryGetRecent: 'history:getRecent',
  HistoryAddEntry: 'history:addEntry',
  HistoryClear: 'history:clear',

  SettingsGetAll: 'settings:getAll',
  SettingsGet: 'settings:get',
  SettingsSet: 'settings:set',

  WindowMinimize: 'window:minimize',
  WindowMaximize: 'window:maximize',
  WindowClose: 'window:close',
  WindowIsMaximized: 'window:isMaximized'
} as const

export type IpcChannel = (typeof IpcChannels)[keyof typeof IpcChannels]
