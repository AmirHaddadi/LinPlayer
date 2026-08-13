import { create } from 'zustand'
import type { Playlist, PlaylistItem } from '@shared/types/playlist'

interface PlaylistState {
  playlists: Playlist[]
  activePlaylist: Playlist | null
  activeItems: PlaylistItem[]
  isLoading: boolean

  loadPlaylists: () => Promise<void>
  loadPlaylist: (id: number) => Promise<void>
  createPlaylist: (name: string, description?: string) => Promise<Playlist>
  renamePlaylist: (id: number, name: string) => Promise<void>
  deletePlaylist: (id: number) => Promise<void>
  addItem: (playlistId: number, mediaId: number) => Promise<void>
  removeItem: (playlistId: number, itemId: number) => Promise<void>
  reorderItems: (playlistId: number, orderedItemIds: number[]) => Promise<void>
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  activePlaylist: null,
  activeItems: [],
  isLoading: false,

  loadPlaylists: async () => {
    set({ isLoading: true })
    const playlists = await window.linplayer.playlists.getAll()
    set({ playlists, isLoading: false })
  },

  loadPlaylist: async (id) => {
    const result = await window.linplayer.playlists.get(id)
    if (result) set({ activePlaylist: result.playlist, activeItems: result.items })
  },

  createPlaylist: async (name, description) => {
    const playlist = await window.linplayer.playlists.create(name, description)
    await get().loadPlaylists()
    return playlist
  },

  renamePlaylist: async (id, name) => {
    await window.linplayer.playlists.rename(id, name)
    await get().loadPlaylists()
  },

  deletePlaylist: async (id) => {
    await window.linplayer.playlists.delete(id)
    await get().loadPlaylists()
    if (get().activePlaylist?.id === id) set({ activePlaylist: null, activeItems: [] })
  },

  addItem: async (playlistId, mediaId) => {
    await window.linplayer.playlists.addItem(playlistId, mediaId)
    if (get().activePlaylist?.id === playlistId) await get().loadPlaylist(playlistId)
    await get().loadPlaylists()
  },

  removeItem: async (playlistId, itemId) => {
    await window.linplayer.playlists.removeItem(playlistId, itemId)
    if (get().activePlaylist?.id === playlistId) await get().loadPlaylist(playlistId)
  },

  reorderItems: async (playlistId, orderedItemIds) => {
    await window.linplayer.playlists.reorderItems(playlistId, orderedItemIds)
    if (get().activePlaylist?.id === playlistId) await get().loadPlaylist(playlistId)
  }
}))
