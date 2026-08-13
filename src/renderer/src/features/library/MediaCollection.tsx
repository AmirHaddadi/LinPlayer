import { LayoutGrid, List } from 'lucide-react'
import { useState } from 'react'
import { MediaCard } from '@renderer/components/media/MediaCard'
import { MediaRow } from '@renderer/components/media/MediaRow'
import { ContextMenu, type ContextMenuItem } from '@renderer/components/common/ContextMenu'
import { EmptyState } from '@renderer/components/common/EmptyState'
import { IconButton } from '@renderer/components/common/IconButton'
import { usePlayMedia } from '@renderer/hooks/usePlayMedia'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { usePlaylistStore } from '@renderer/stores/playlistStore'
import { usePlayerStore } from '@renderer/stores/playerStore'
import { useUiStore } from '@renderer/stores/uiStore'
import { clsx } from '@renderer/utils/clsx'
import type { LucideIcon } from 'lucide-react'
import type { MediaItem } from '@shared/types/media'

interface MediaCollectionProps {
  title: string
  items: MediaItem[]
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription?: string
}

export function MediaCollection({ title, items, emptyIcon, emptyTitle, emptyDescription }: MediaCollectionProps): JSX.Element {
  const viewMode = useUiStore((s) => s.viewMode)
  const setViewMode = useUiStore((s) => s.setViewMode)
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite)
  const playlists = usePlaylistStore((s) => s.playlists)
  const addItem = usePlaylistStore((s) => s.addItem)
  const currentId = usePlayerStore((s) => s.current?.id)
  const playMedia = usePlayMedia()
  const [menu, setMenu] = useState<{ x: number; y: number; item: MediaItem } | null>(null)

  const openMenu = (event: React.MouseEvent, item: MediaItem): void => {
    event.preventDefault()
    setMenu({ x: event.clientX, y: event.clientY, item })
  }

  const menuItems: ContextMenuItem[] = menu
    ? [
        { label: 'Play', onSelect: () => playMedia(menu.item, items, items.indexOf(menu.item)) },
        {
          label: menu.item.favorite ? 'Remove from favorites' : 'Add to favorites',
          onSelect: () => toggleFavorite(menu.item.id)
        },
        ...playlists.map((playlist) => ({
          label: `Add to ${playlist.name}`,
          onSelect: () => addItem(playlist.id, menu.item.id)
        }))
      ]
    : []

  return (
    <div className="px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-base-100">{title}</h1>
        <div className="flex items-center gap-1 rounded-lg border border-base-700 p-0.5">
          <IconButton label="Grid view" size="sm" active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
            <LayoutGrid size={15} />
          </IconButton>
          <IconButton label="List view" size="sm" active={viewMode === 'list'} onClick={() => setViewMode('list')}>
            <List size={15} />
          </IconButton>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
          {items.map((item, index) => (
            <MediaCard
              key={item.id}
              item={item}
              onPlay={() => playMedia(item, items, index)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onContextMenu={(e) => openMenu(e, item)}
            />
          ))}
        </div>
      ) : (
        <div className={clsx('flex flex-col')}>
          {items.map((item, index) => (
            <MediaRow
              key={item.id}
              item={item}
              index={index}
              active={item.id === currentId}
              onPlay={() => playMedia(item, items, index)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onContextMenu={(e) => openMenu(e, item)}
            />
          ))}
        </div>
      )}

      {menu && <ContextMenu x={menu.x} y={menu.y} items={menuItems} onClose={() => setMenu(null)} />}
    </div>
  )
}
