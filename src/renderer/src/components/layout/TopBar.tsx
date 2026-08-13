import { Loader2, Minus, Settings, Square, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SearchBar } from '@renderer/components/common/SearchBar'
import { IconButton } from '@renderer/components/common/IconButton'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { useUiStore } from '@renderer/stores/uiStore'

export function TopBar(): JSX.Element {
  const { t } = useTranslation()
  const searchQuery = useLibraryStore((s) => s.searchQuery)
  const setSearchQuery = useLibraryStore((s) => s.setSearchQuery)
  const runSearch = useLibraryStore((s) => s.runSearch)
  const scanProgress = useLibraryStore((s) => s.scanProgress)
  const navigate = useUiStore((s) => s.navigate)
  const route = useUiStore((s) => s.route)

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value)
    void runSearch(value)
  }

  return (
    <header className="app-drag flex h-14 shrink-0 items-center justify-between gap-4 border-b border-base-800 bg-base-950 px-4">
      <div className="flex items-center gap-2 app-no-drag">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground font-bold text-sm">
          L
        </div>
        <span className="text-sm font-semibold text-base-100">{t('app.name')}</span>
      </div>

      <div className="flex w-full max-w-md min-w-0 items-center gap-2 app-no-drag">
        <SearchBar value={searchQuery} onChange={handleSearchChange} placeholder={t('topbar.searchPlaceholder')} />
        {scanProgress?.type === 'progress' && (
          <div className="flex shrink-0 items-center gap-1.5 text-xs text-base-400">
            <Loader2 size={13} className="animate-spin" />
            <span className="hidden lg:inline">{t('library.scanningProgress', { count: scanProgress.scanned })}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 app-no-drag">
        <IconButton
          label={t('topbar.settings')}
          size="sm"
          active={route === 'settings'}
          onClick={() => navigate('settings')}
        >
          <Settings size={17} />
        </IconButton>

        <div className="ms-2 flex items-center gap-0.5 border-s border-base-800 ps-2">
          <IconButton label={t('topbar.minimize')} size="sm" onClick={() => window.linplayer.window.minimize()}>
            <Minus size={15} />
          </IconButton>
          <IconButton label={t('topbar.maximize')} size="sm" onClick={() => window.linplayer.window.maximize()}>
            <Square size={12} />
          </IconButton>
          <IconButton
            label={t('topbar.close')}
            size="sm"
            className="hover:bg-danger/20 hover:text-danger"
            onClick={() => window.linplayer.window.close()}
          >
            <X size={16} />
          </IconButton>
        </div>
      </div>
    </header>
  )
}
