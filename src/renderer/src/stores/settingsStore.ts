import { create } from 'zustand'
import { DEFAULT_SETTINGS, type AppSettings } from '@shared/types/settings'

interface SettingsState {
  settings: AppSettings
  isLoaded: boolean
  load: () => Promise<void>
  update: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoaded: false,

  load: async () => {
    const settings = await window.linplayer.settings.getAll()
    set({ settings, isLoaded: true })
  },

  update: async (key, value) => {
    await window.linplayer.settings.set(key, value)
    set({ settings: { ...get().settings, [key]: value } })
  }
}))
