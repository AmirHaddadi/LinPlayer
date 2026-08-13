import { Minus, Settings, Square, X } from 'lucide-react'
import { SearchBar } from '@renderer/components/common/SearchBar'
import { IconButton } from '@renderer/components/common/IconButton'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { useUiStore } from '@renderer/stores/uiStore'

export function TopBar(): JSX.Element {
  const searchQuery = useLibraryStore((s) => s.searchQuery)
  const setSearchQuery = useLibraryStore((s) => s.setSearchQuery)
  const runSearch = useLibraryStore((s) => s.runSearch)
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
        <span className="text-sm font-semibold text-base-100">LinPlayer</span>
      </div>

      <div className="w-full max-w-md app-no-drag">
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
      </div>

      <div className="flex items-center gap-1 app-no-drag">
        <IconButton
          label="Settings"
          size="sm"
          active={route === 'settings'}
          onClick={() => navigate('settings')}
        >
          <Settings size={17} />
        </IconButton>

        <div className="ml-2 flex items-center gap-0.5 border-l border-base-800 pl-2">
          <IconButton label="Minimize" size="sm" onClick={() => window.linplayer.window.minimize()}>
            <Minus size={15} />
          </IconButton>
          <IconButton label="Maximize" size="sm" onClick={() => window.linplayer.window.maximize()}>
            <Square size={12} />
          </IconButton>
          <IconButton
            label="Close"
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
