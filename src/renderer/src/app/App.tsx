import { useEffect } from 'react'
import { AppShell } from './AppShell'
import { useSettingsStore } from '@renderer/stores/settingsStore'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { usePlaylistStore } from '@renderer/stores/playlistStore'

export function App(): JSX.Element {
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

  useEffect(() => {
    if (!isSettingsLoaded) return
    const root = document.documentElement
    const theme = settings.appearance.theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
    root.classList.toggle('dark', isDark)
  }, [settings.appearance.theme, isSettingsLoaded])

  return <AppShell />
}
