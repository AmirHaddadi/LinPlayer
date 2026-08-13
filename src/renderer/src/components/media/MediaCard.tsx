import { Play, Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Artwork } from '@renderer/components/common/Artwork'
import { clsx } from '@renderer/utils/clsx'
import { usePlayerStore } from '@renderer/stores/playerStore'
import type { MediaItem } from '@shared/types/media'

interface MediaCardProps {
  item: MediaItem
  onPlay: () => void
  onToggleFavorite: () => void
  onContextMenu?: (event: React.MouseEvent) => void
}

export function MediaCard({ item, onPlay, onToggleFavorite, onContextMenu }: MediaCardProps): JSX.Element {
  const { t } = useTranslation()
  const isActive = usePlayerStore((s) => s.current?.id === item.id)
  const isPlaying = usePlayerStore((s) => s.isPlaying) && isActive

  return (
    <div
      className="group relative flex flex-col rounded-lg p-3 transition-colors hover:bg-base-800/60"
      onContextMenu={onContextMenu}
    >
      <div className="relative">
        <Artwork
          src={item.artworkPath}
          kind={item.kind}
          size={160}
          rounded="lg"
          className={clsx('w-full aspect-square', isActive && 'ring-2 ring-accent')}
          playing={isPlaying}
        />
        <button
          onClick={onPlay}
          aria-label={`${t('actions.play')}: ${item.title ?? item.filename}`}
          className="absolute bottom-2 end-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-panel opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0"
        >
          <Play size={18} fill="currentColor" className="ms-0.5" />
        </button>
      </div>
      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={clsx('truncate text-sm font-medium', isActive ? 'text-accent' : 'text-base-100')}>
            {item.title ?? item.filename}
          </p>
          <p className="truncate text-xs text-base-400">{item.artist ?? t('player.unknownArtist')}</p>
        </div>
        <button
          onClick={onToggleFavorite}
          aria-label={item.favorite ? t('actions.removeFromFavorites') : t('actions.addToFavorites')}
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
