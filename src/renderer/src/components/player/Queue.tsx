import { X } from 'lucide-react'
import { Artwork } from '@renderer/components/common/Artwork'
import { IconButton } from '@renderer/components/common/IconButton'
import { usePlayerStore } from '@renderer/stores/playerStore'
import { useUiStore } from '@renderer/stores/uiStore'
import { usePlayMedia } from '@renderer/hooks/usePlayMedia'
import { clsx } from '@renderer/utils/clsx'
import { formatDuration } from '@shared/utils/format'

export function Queue(): JSX.Element | null {
  const isOpen = useUiStore((s) => s.isQueueOpen)
  const toggleQueue = useUiStore((s) => s.toggleQueue)
  const queue = usePlayerStore((s) => s.queue)
  const queueIndex = usePlayerStore((s) => s.queueIndex)
  const playMedia = usePlayMedia()

  if (!isOpen) return null

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-l border-base-800 bg-base-950">
      <div className="flex h-12 items-center justify-between border-b border-base-800 px-4">
        <p className="text-sm font-semibold text-base-100">Queue</p>
        <IconButton label="Close queue" size="sm" onClick={toggleQueue}>
          <X size={16} />
        </IconButton>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {queue.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-base-500">Queue is empty.</p>
        ) : (
          queue.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              onClick={() => playMedia(item, queue, index)}
              className={clsx(
                'flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-base-800/60',
                index === queueIndex && 'bg-base-800/80'
              )}
            >
              <Artwork src={item.artworkPath} kind={item.kind} size={36} rounded="md" />
              <div className="min-w-0 flex-1">
                <p className={clsx('truncate text-sm', index === queueIndex ? 'text-accent' : 'text-base-100')}>
                  {item.title ?? item.filename}
                </p>
                <p className="truncate text-xs text-base-400">{item.artist ?? 'Unknown artist'}</p>
              </div>
              <span className="text-[11px] tabular-nums text-base-500">{formatDuration(item.duration)}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  )
}
