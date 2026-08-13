import { create } from 'zustand'
import type { LibraryFolder, LibraryScanProgress, MediaItem } from '@shared/types/media'

interface LibraryState {
  items: MediaItem[]
  favorites: MediaItem[]
  folders: LibraryFolder[]
  isLoading: boolean
  scanProgress: LibraryScanProgress | null
  searchQuery: string
  searchResults: MediaItem[]

  loadItems: () => Promise<void>
  loadFavorites: () => Promise<void>
  loadFolders: () => Promise<void>
  addFolder: (path: string) => Promise<void>
  removeFolder: (id: number) => Promise<void>
  scan: (folderPath?: string) => Promise<void>
  toggleFavorite: (mediaId: number) => Promise<void>
  setSearchQuery: (query: string) => void
  runSearch: (query: string) => Promise<void>
  setScanProgress: (progress: LibraryScanProgress | null) => void
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  items: [],
  favorites: [],
  folders: [],
  isLoading: false,
  scanProgress: null,
  searchQuery: '',
  searchResults: [],

  loadItems: async () => {
    set({ isLoading: true })
    try {
      const items = await window.linplayer.library.getItems()
      set({ items, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  loadFavorites: async () => {
    const favorites = await window.linplayer.library.getFavorites()
    set({ favorites })
  },

  loadFolders: async () => {
    const folders = await window.linplayer.library.getFolders()
    set({ folders })
  },

  addFolder: async (path) => {
    await window.linplayer.library.addFolder(path)
    await get().loadFolders()
  },

  removeFolder: async (id) => {
    await window.linplayer.library.removeFolder(id)
    await get().loadFolders()
  },

  scan: async (folderPath) => {
    await window.linplayer.library.scan(folderPath)
    await get().loadItems()
  },

  toggleFavorite: async (mediaId) => {
    const favorite = await window.linplayer.library.toggleFavorite(mediaId)
    set((state) => ({
      items: state.items.map((item) => (item.id === mediaId ? { ...item, favorite } : item))
    }))
    await get().loadFavorites()
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  runSearch: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] })
      return
    }
    const results = await window.linplayer.library.search(query)
    set({ searchResults: results })
  },

  setScanProgress: (progress) => set({ scanProgress: progress })
}))
