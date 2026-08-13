import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AppShell } from './AppShell'
import { setDocumentLanguage } from '@renderer/i18n'
import { useSettingsStore } from '@renderer/stores/settingsStore'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { usePlaylistStore } from '@renderer/stores/playlistStore'

export function App(): JSX.Element {
  const { i18n } = useTranslation()
  const loadSettings = useSettingsStore((s) => s.load)
  const settings = useSettingsStore((s) => s.settings)
  const isSettingsLoaded = useSettingsStore((s) => s.isLoaded)
  const loadItems = useLibraryStore((s) => s.loadItems)
  const loadFavorites = useLibraryStore((s) => s.loadFavorites)
  const loadFolders = useLibraryStore((s) => s.loadFolders)
  const setScanProgress = useLibraryStore((s) => s.setScanProgress)
  const loadPlaylists = usePlaylistStore((s) => s.loadPlaylists)

  useEffect(() => {
    void loadSettings()
    void loadItems()
    void loadFavorites()
    void loadFolders()
    void loadPlaylists()

    const unsubscribe = window.linplayer.library.onScanProgress((progress) => {
      setScanProgress(progress)
      if (progress.type === 'completed') {
        setTimeout(() => setScanProgress(null), 2000)
        void loadItems()
      }
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Single source of truth for everything derived from settings: theme class,
  // document language/direction, active i18n language, and reduced-motion.
  useEffect(() => {
    if (!isSettingsLoaded) return
    const root = document.documentElement

    const theme = settings.appearance.theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
    root.classList.toggle('dark', isDark)

    if (i18n.language !== settings.appearance.language) {
      void i18n.changeLanguage(settings.appearance.language)
    }
    setDocumentLanguage(settings.appearance.language)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    root.dataset.reducedMotion = String(settings.appearance.reducedMotion || prefersReducedMotion)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.appearance.theme, settings.appearance.language, settings.appearance.reducedMotion, isSettingsLoaded])

  return <AppShell />
}
