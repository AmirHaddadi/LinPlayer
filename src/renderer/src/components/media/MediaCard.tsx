import { Play, Heart } from 'lucide-react'
import { Artwork } from '@renderer/components/common/Artwork'
import { clsx } from '@renderer/utils/clsx'
import type { MediaItem } from '@shared/types/media'

interface MediaCardProps {
  item: MediaItem
  onPlay: () => void
  onToggleFavorite: () => void
  onContextMenu?: (event: React.MouseEvent) => void
}

export function MediaCard({ item, onPlay, onToggleFavorite, onContextMenu }: MediaCardProps): JSX.Element {
  return (
    <div
      className="group relative flex flex-col rounded-lg p-3 transition-colors hover:bg-base-800/60"
      onContextMenu={onContextMenu}
    >
      <div className="relative">
        <Artwork src={item.artworkPath} kind={item.kind} size={160} rounded="lg" className="w-full aspect-square" />
        <button
          onClick={onPlay}
          aria-label={`Play ${item.title ?? item.filename}`}
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-panel opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0"
        >
          <Play size={18} fill="currentColor" className="ml-0.5" />
        </button>
      </div>
      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-base-100">{item.title ?? item.filename}</p>
          <p className="truncate text-xs text-base-400">{item.artist ?? 'Unknown artist'}</p>
        </div>
        <button
          onClick={onToggleFavorite}
          aria-label={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
          className={clsx(
            'shrink-0 opacity-0 group-hover:opacity-100 transition-opacity',
            item.favorite && 'opacity-100 text-accent'
          )}
        >
          <Heart size={15} fill={item.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}
