export type AppearanceTheme = 'dark' | 'light' | 'system'
export type ResumeBehavior = 'always' | 'ask' | 'never'

export interface AppSettings {
  appearance: {
    theme: AppearanceTheme
  }
  playback: {
    rememberPosition: boolean
    defaultVolume: number
    playbackSpeed: number
    resumeBehavior: ResumeBehavior
  }
  library: {
    folders: string[]
    scanOnStartup: boolean
    removeMissingFiles: boolean
  }
  general: {
    startMinimized: boolean
    rememberWindowSize: boolean
    rememberWindowPosition: boolean
    windowBounds?: { width: number; height: number; x?: number; y?: number }
  }
}

export const DEFAULT_SETTINGS: AppSettings = {
  appearance: {
    theme: 'dark'
  },
  playback: {
    rememberPosition: true,
    defaultVolume: 0.8,
    playbackSpeed: 1,
    resumeBehavior: 'ask'
  },
  library: {
    folders: [],
    scanOnStartup: true,
    removeMissingFiles: false
  },
  general: {
    startMinimized: false,
    rememberWindowSize: true,
    rememberWindowPosition: true
  }
}
