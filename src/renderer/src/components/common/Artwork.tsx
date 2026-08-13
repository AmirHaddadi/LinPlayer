import { useState } from 'react'
import { Music2, Video } from 'lucide-react'
import { clsx } from '@renderer/utils/clsx'
import type { MediaKind } from '@shared/types/media'

interface ArtworkProps {
  src: string | null
  kind: MediaKind
  size?: number
  rounded?: 'md' | 'lg' | 'full'
  className?: string
  /** Shows a small animated indicator communicating that this item is the one currently playing. */
  playing?: boolean
}

export function Artwork({ src, kind, size = 48, rounded = 'md', className, playing }: ArtworkProps): JSX.Element {
  const [loaded, setLoaded] = useState(false)
  const [broken, setBroken] = useState(false)
  const roundedClass = rounded === 'full' ? 'rounded-full' : rounded === 'lg' ? 'rounded-lg' : 'rounded-md'
  const Icon = kind === 'video' ? Video : Music2
  const showImage = src && !broken

  return (
    <div
      style={{ width: size, height: size }}
      className={clsx(
        'relative flex shrink-0 items-center justify-center overflow-hidden bg-base-800 text-base-500',
        roundedClass,
        className
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setBroken(true)}
          className={clsx('h-full w-full object-cover transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0')}
        />
      ) : null}

      {(!showImage || !loaded) && (
        <Icon
          size={Math.max(14, size * 0.4)}
          strokeWidth={1.5}
          className={clsx('absolute', showImage && !loaded && 'animate-pulse')}
        />
      )}

      {playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <PlayingIndicator />
        </div>
      )}
    </div>
  )
}

function PlayingIndicator(): JSX.Element {
  return (
    <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className="w-0.5 rounded-full bg-white"
          style={{
            animation: `linplayer-eq 0.9s ease-in-out ${bar * 0.15}s infinite`
          }}
        />
      ))}
    </div>
  )
}
