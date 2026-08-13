import { ListMusic, Plus } from 'lucide-react'
import { useState } from 'react'
import { usePlaylistStore } from '@renderer/stores/playlistStore'
import { useUiStore } from '@renderer/stores/uiStore'
import { PlaylistCard } from '@renderer/components/media/PlaylistCard'
import { EmptyState } from '@renderer/components/common/EmptyState'
import { Button } from '@renderer/components/common/Button'
import { ContextMenu, type ContextMenuItem } from '@renderer/components/common/ContextMenu'
import type { Playlist } from '@shared/types/playlist'

export function PlaylistsScreen(): JSX.Element {
  const playlists = usePlaylistStore((s) => s.playlists)
  const createPlaylist = usePlaylistStore((s) => s.createPlaylist)
  const deletePlaylist = usePlaylistStore((s) => s.deletePlaylist)
  const navigate = useUiStore((s) => s.navigate)
  const [menu, setMenu] = useState<{ x: number; y: number; playlist: Playlist } | null>(null)

  const handleCreate = async (): Promise<void> => {
    const playlist = await createPlaylist('New Playlist')
    navigate('playlist', playlist.id)
  }

  const menuItems: ContextMenuItem[] = menu
    ? [{ label: 'Delete playlist', danger: true, onSelect: () => deletePlaylist(menu.playlist.id) }]
    : []

  return (
    <div className="px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-base-100">Playlists</h1>
        <Button variant="secondary" size="sm" onClick={handleCreate}>
          <Plus size={14} className="mr-1.5" />
          New playlist
        </Button>
      </div>

      {playlists.length === 0 ? (
        <EmptyState icon={ListMusic} title="No playlists yet" description="Create a playlist to start organizing your media." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onOpen={() => navigate('playlist', playlist.id)}
              onContextMenu={(e) => {
                e.preventDefault()
                setMenu({ x: e.clientX, y: e.clientY, playlist })
              }}
            />
          ))}
        </div>
      )}

      {menu && <ContextMenu x={menu.x} y={menu.y} items={menuItems} onClose={() => setMenu(null)} />}
    </div>
  )
}
