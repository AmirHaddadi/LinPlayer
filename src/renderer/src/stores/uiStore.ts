import { create } from 'zustand'

export type ViewMode = 'grid' | 'list'
export type RouteName =
  | 'home'
  | 'music'
  | 'videos'
  | 'library'
  | 'favorites'
  | 'history'
  | 'playlist'
  | 'settings'
  | 'player'

export interface Toast {
  id: string
  message: string
  variant: 'info' | 'success' | 'error'
}

interface UiState {
  route: RouteName
  activePlaylistId: number | null
  sidebarCollapsed: boolean
  viewMode: ViewMode
  toasts: Toast[]
  isQueueOpen: boolean

  navigate: (route: RouteName, playlistId?: number) => void
  toggleSidebar: () => void
  setViewMode: (mode: ViewMode) => void
  pushToast: (message: string, variant?: Toast['variant']) => void
  dismissToast: (id: string) => void
  toggleQueue: () => void
}

export const useUiStore = create<UiState>((set) => ({
  route: 'home',
  activePlaylistId: null,
  sidebarCollapsed: false,
  viewMode: 'grid',
  toasts: [],
  isQueueOpen: false,

  navigate: (route, playlistId) => set({ route, activePlaylistId: playlistId ?? null }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setViewMode: (mode) => set({ viewMode: mode }),
  pushToast: (message, variant = 'info') =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, variant }]
    })),
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen }))
}))
