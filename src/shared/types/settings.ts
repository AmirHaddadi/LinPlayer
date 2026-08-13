export type AppearanceTheme = 'dark' | 'light' | 'system'
export type ResumeBehavior = 'always' | 'ask' | 'never'
export type AppLanguage = 'en' | 'fa'
export type EqualizerPresetName =
  | 'flat'
  | 'bassBoost'
  | 'trebleBoost'
  | 'vocal'
  | 'rock'
  | 'classical'
  | 'electronic'
  | 'custom'

export interface AppSettings {
  appearance: {
    theme: AppearanceTheme
    language: AppLanguage
    reducedMotion: boolean
  }
  playback: {
    rememberPosition: boolean
    defaultVolume: number
    playbackSpeed: number
    resumeBehavior: ResumeBehavior
  }
  audio: {
    equalizerEnabled: boolean
    equalizerPreset: EqualizerPresetName
    equalizerGains: number[]
    visualizerEnabled: boolean
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

export const EQUALIZER_BAND_FREQUENCIES = [60, 150, 400, 1000, 2400, 6000, 15000] as const

export const DEFAULT_SETTINGS: AppSettings = {
  appearance: {
    theme: 'dark',
    language: 'en',
    reducedMotion: false
  },
  playback: {
    rememberPosition: true,
    defaultVolume: 0.8,
    playbackSpeed: 1,
    resumeBehavior: 'ask'
  },
  audio: {
    equalizerEnabled: false,
    equalizerPreset: 'flat',
    equalizerGains: EQUALIZER_BAND_FREQUENCIES.map(() => 0),
    visualizerEnabled: true
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
