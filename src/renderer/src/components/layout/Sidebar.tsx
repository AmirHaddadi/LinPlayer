import { Clock, Heart, Home, ListMusic, Music2, Plus, Video } from 'lucide-react'
import { clsx } from '@renderer/utils/clsx'
import { useUiStore, type RouteName } from '@renderer/stores/uiStore'
import { usePlaylistStore } from '@renderer/stores/playlistStore'
import { useState } from 'react'

const NAV_ITEMS: { route: RouteName; label: string; icon: typeof Home }[] = [
  { route: 'home', label: 'Home', icon: Home },
  { route: 'music', label: 'Music', icon: Music2 },
  { route: 'videos', label: 'Videos', icon: Video }
]

const LIBRARY_ITEMS: { route: RouteName; label: string; icon: typeof Home }[] = [
  { route: 'favorites', label: 'Favorites', icon: Heart },
  { route: 'history', label: 'History', icon: Clock }
]

export function Sidebar(): JSX.Element {
  const route = useUiStore((s) => s.route)
  const activePlaylistId = useUiStore((s) => s.activePlaylistId)
  const navigate = useUiStore((s) => s.navigate)
  const playlists = usePlaylistStore((s) => s.playlists)
  const createPlaylist = usePlaylistStore((s) => s.createPlaylist)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  const handleCreate = async (): Promise<void> => {
    const trimmed = name.trim()
    setCreating(false)
    setName('')
    if (!trimmed) return
    const playlist = await createPlaylist(trimmed)
    navigate('playlist', playlist.id)
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-base-800 bg-base-950 px-3 py-4">
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.route} {...item} active={route === item.route} onClick={() => navigate(item.route)} />
        ))}
      </nav>

      <div className="mt-6">
        <SectionLabel>Library</SectionLabel>
        <nav className="flex flex-col gap-0.5">
          {LIBRARY_ITEMS.map((item) => (
            <NavButton key={item.route} {...item} active={route === item.route} onClick={() => navigate(item.route)} />
          ))}
        </nav>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => navigate('library')}
            className="text-[11px] font-semibold uppercase tracking-wider text-base-500 hover:text-base-300"
          >
            Playlists
          </button>
          <button
            onClick={() => setCreating(true)}
            aria-label="New playlist"
            className="flex h-6 w-6 items-center justify-center rounded-md text-base-400 hover:bg-base-800 hover:text-base-100"
          >
            <Plus size={14} />
          </button>
        </div>

        {creating && (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleCreate}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
              if (e.key === 'Escape') {
                setCreating(false)
                setName('')
              }
            }}
            placeholder="Playlist name"
            className="mx-2 mt-1 h-8 rounded-md border border-base-700 bg-base-900 px-2 text-sm outline-none focus:border-accent"
          />
        )}

        <div className="mt-1 flex-1 overflow-y-auto">
          {playlists.map((playlist) => (
            <NavButton
              key={playlist.id}
              route="playlist"
              label={playlist.name}
              icon={ListMusic}
              active={route === 'playlist' && activePlaylistId === playlist.id}
              onClick={() => navigate('playlist', playlist.id)}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}

function SectionLabel({ children }: { children: string }): JSX.Element {
  return <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-500">{children}</p>
}

function NavButton({
  label,
  icon: Icon,
  active,
  onClick
}: {
  route: RouteName
  label: string
  icon: typeof Home
  active: boolean
  onClick: () => void
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
        active ? 'bg-base-800 text-base-100' : 'text-base-400 hover:bg-base-800/60 hover:text-base-100'
      )}
    >
      <Icon size={17} strokeWidth={1.75} />
      <span className="truncate">{label}</span>
    </button>
  )
}
