import { Music2, Video } from 'lucide-react'
import { clsx } from '@renderer/utils/clsx'
import type { MediaKind } from '@shared/types/media'

interface ArtworkProps {
  src: string | null
  kind: MediaKind
  size?: number
  rounded?: 'md' | 'lg' | 'full'
  className?: string
}

export function Artwork({ src, kind, size = 48, rounded = 'md', className }: ArtworkProps): JSX.Element {
  const roundedClass = rounded === 'full' ? 'rounded-full' : rounded === 'lg' ? 'rounded-lg' : 'rounded-md'
  const Icon = kind === 'video' ? Video : Music2

  return (
    <div
      style={{ width: size, height: size }}
      className={clsx(
        'flex shrink-0 items-center justify-center overflow-hidden bg-base-800 text-base-500',
        roundedClass,
        className
      )}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
      ) : (
        <Icon size={Math.max(14, size * 0.4)} strokeWidth={1.5} />
      )}
    </div>
  )
}
