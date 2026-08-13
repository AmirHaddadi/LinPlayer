import { useEffect, useRef, useState } from 'react'
import { GripVertical, ListMusic, Pencil, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '@renderer/stores/uiStore'
import { usePlaylistStore } from '@renderer/stores/playlistStore'
import { usePlayerStore } from '@renderer/stores/playerStore'
import { usePlayMedia } from '@renderer/hooks/usePlayMedia'
import { Artwork } from '@renderer/components/common/Artwork'
import { Button } from '@renderer/components/common/Button'
import { IconButton } from '@renderer/components/common/IconButton'
import { EmptyState } from '@renderer/components/common/EmptyState'
import { formatDuration } from '@shared/utils/format'
import { clsx } from '@renderer/utils/clsx'

export function PlaylistDetailScreen(): JSX.Element {
  const { t } = useTranslation()
  const activePlaylistId = useUiStore((s) => s.activePlaylistId)
  const navigate = useUiStore((s) => s.navigate)
  const activePlaylist = usePlaylistStore((s) => s.activePlaylist)
  const activeItems = usePlaylistStore((s) => s.activeItems)
  const loadPlaylist = usePlaylistStore((s) => s.loadPlaylist)
  const renamePlaylist = usePlaylistStore((s) => s.renamePlaylist)
  const deletePlaylist = usePlaylistStore((s) => s.deletePlaylist)
  const removeItem = usePlaylistStore((s) => s.removeItem)
  const reorderItems = usePlaylistStore((s) => s.reorderItems)
  const currentId = usePlayerStore((s) => s.current?.id)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const playMedia = usePlayMedia()

  const [isEditingName, setIsEditingName] = useState(false)
  const [name, setName] = useState('')
  const dragIndex = useRef<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    if (activePlaylistId) void loadPlaylist(activePlaylistId)
  }, [activePlaylistId, loadPlaylist])

  if (!activePlaylist) {
    return <EmptyState icon={ListMusic} title={t('playlist.notFound')} />
  }

  const items = activeItems.map((item) => item.media)

  const commitRename = async (): Promise<void> => {
    setIsEditingName(false)
    const trimmed = name.trim()
    if (trimmed && trimmed !== activePlaylist.name) {
      await renamePlaylist(activePlaylist.id, trimmed)
    }
  }

  const handleDrop = async (targetIndex: number): Promise<void> => {
    if (dragIndex.current === null || dragIndex.current === targetIndex) {
      setDragOverIndex(null)
      return
    }
    const reordered = [...activeItems]
    const [moved] = reordered.splice(dragIndex.current, 1)
    reordered.splice(targetIndex, 0, moved)
    dragIndex.current = null
    setDragOverIndex(null)
    await reorderItems(activePlaylist.id, reordered.map((item) => item.id))
  }

  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex min-w-0 flex-wrap items-center gap-4">
        <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-gradient-to-br from-base-800 to-base-900 text-base-500 shrink-0">
          <ListMusic size={40} strokeWidth={1.25} />
        </div>
        <div className="min-w-0 flex-1">
          {isEditingName ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => e.key === 'Enter' && commitRename()}
              className="h-9 w-full max-w-xs rounded-md border border-base-700 bg-base-900 px-2 text-lg font-semibold outline-none focus:border-accent"
            />
          ) : (
            <h1 className="truncate text-2xl font-semibold text-base-100">{activePlaylist.name}</h1>
          )}
          <p className="mt-1 text-sm text-base-400">{t('playlist.trackCount', { count: items.length })}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="primary" size="sm" disabled={items.length === 0} onClick={() => playMedia(items[0], items, 0)}>
              {t('actions.playAll')}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setName(activePlaylist.name)
                setIsEditingName(true)
              }}
            >
              <Pencil size={14} className="me-1.5" />
              {t('actions.rename')}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                await deletePlaylist(activePlaylist.id)
                navigate('library')
              }}
            >
              <Trash2 size={14} className="me-1.5" />
              {t('actions.delete')}
            </Button>
          </div>
        </div>
      </div>

      {activeItems.length === 0 ? (
        <EmptyState icon={ListMusic} title={t('empty.playlistEmptyTitle')} description={t('empty.playlistEmptyDescription')} />
      ) : (
        <div className="flex flex-col">
          {activeItems.map((playlistItem, index) => (
            <div
              key={playlistItem.id}
              draggable
              onDragStart={() => (dragIndex.current = index)}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverIndex(index)
              }}
              onDrop={() => handleDrop(index)}
              className={clsx(
                'group grid grid-cols-[24px_40px_1fr_120px_64px_32px] items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-base-800/60',
                playlistItem.media.id === currentId && 'bg-base-800/80',
                dragOverIndex === index && 'border-t-2 border-accent'
              )}
            >
              <GripVertical size={14} className="cursor-grab text-base-600" />
              <Artwork
                src={playlistItem.media.artworkPath}
                kind={playlistItem.media.kind}
                size={40}
                playing={playlistItem.media.id === currentId && isPlaying}
              />
              <button onClick={() => playMedia(playlistItem.media, items, index)} className="min-w-0 text-start">
                <p className="truncate text-sm font-medium text-base-100">
                  {playlistItem.media.title ?? playlistItem.media.filename}
                </p>
                <p className="truncate text-xs text-base-400">{playlistItem.media.artist ?? t('player.unknownArtist')}</p>
              </button>
              <p className="truncate text-xs text-base-400">{playlistItem.media.album ?? '—'}</p>
              <p dir="ltr" className="text-end text-xs tabular-nums text-base-400">
                {formatDuration(playlistItem.media.duration)}
              </p>
              <IconButton
                label={t('actions.removeFromPlaylist')}
                size="sm"
                className="opacity-0 group-hover:opacity-100"
                onClick={() => removeItem(activePlaylist.id, playlistItem.id)}
              >
                <X size={14} />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
