import { Heart, Play } from 'lucide-react'
import { Artwork } from '@renderer/components/common/Artwork'
import { formatDuration } from '@shared/utils/format'
import { clsx } from '@renderer/utils/clsx'
import type { MediaItem } from '@shared/types/media'

interface MediaRowProps {
  item: MediaItem
  index?: number
  active?: boolean
  onPlay: () => void
  onToggleFavorite: () => void
  onContextMenu?: (event: React.MouseEvent) => void
}

export function MediaRow({ item, index, active, onPlay, onToggleFavorite, onContextMenu }: MediaRowProps): JSX.Element {
  return (
    <div
      className={clsx(
        'group grid grid-cols-[24px_40px_1fr_120px_64px_40px] items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-base-800/60',
        active && 'bg-base-800/80'
      )}
      onDoubleClick={onPlay}
      onContextMenu={onContextMenu}
    >
      <div className="flex items-center justify-center text-xs text-base-500">
        {index !== undefined ? (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <button onClick={onPlay} aria-label="Play" className="hidden group-hover:flex text-base-100">
              <Play size={13} fill="currentColor" />
            </button>
          </>
        ) : (
          <button onClick={onPlay} aria-label="Play" className="text-base-400 hover:text-base-100">
            <Play size={13} fill="currentColor" />
          </button>
        )}
      </div>
      <Artwork src={item.artworkPath} kind={item.kind} size={40} rounded="md" />
      <div className="min-w-0">
        <p className={clsx('truncate text-sm font-medium', active ? 'text-accent' : 'text-base-100')}>
          {item.title ?? item.filename}
        </p>
        <p className="truncate text-xs text-base-400">{item.artist ?? 'Unknown artist'}</p>
      </div>
      <p className="truncate text-xs text-base-400">{item.album ?? '—'}</p>
      <p className="text-right text-xs text-base-400 tabular-nums">{formatDuration(item.duration)}</p>
      <button
        onClick={onToggleFavorite}
        aria-label={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
        className={clsx(
          'flex justify-center opacity-0 group-hover:opacity-100 transition-opacity',
          item.favorite && 'opacity-100 text-accent'
        )}
      >
        <Heart size={14} fill={item.favorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}
