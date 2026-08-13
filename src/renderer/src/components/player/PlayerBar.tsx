import { ListMusic, Maximize2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Artwork } from '@renderer/components/common/Artwork'
import { ProgressBar } from '@renderer/components/common/ProgressBar'
import { VolumeControl } from '@renderer/components/common/VolumeControl'
import { IconButton } from '@renderer/components/common/IconButton'
import { PlayerControls } from './PlayerControls'
import { usePlayerStore } from '@renderer/stores/playerStore'
import { useUiStore } from '@renderer/stores/uiStore'
import { formatDuration } from '@shared/utils/format'

export function PlayerBar(): JSX.Element {
  const { t } = useTranslation()
  const current = usePlayerStore((s) => s.current)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration = usePlayerStore((s) => s.duration)
  const volume = usePlayerStore((s) => s.volume)
  const muted = usePlayerStore((s) => s.muted)
  const seek = usePlayerStore((s) => s.seek)
  const setVolume = usePlayerStore((s) => s.setVolume)
  const toggleMute = usePlayerStore((s) => s.toggleMute)
  const setFullscreen = usePlayerStore((s) => s.setFullscreen)
  const toggleQueue = useUiStore((s) => s.toggleQueue)
  const isQueueOpen = useUiStore((s) => s.isQueueOpen)

  return (
    <footer className="flex h-22 min-w-0 shrink-0 items-center gap-3 border-t border-base-800 bg-base-950 px-3 lg:gap-4 lg:px-4">
      <button
        className="flex w-40 min-w-0 shrink items-center gap-3 text-left disabled:cursor-default sm:w-48 lg:w-64"
        disabled={!current}
        onClick={() => useUiStore.getState().navigate('player')}
      >
        <Artwork src={current?.artworkPath ?? null} kind={current?.kind ?? 'unknown'} size={52} rounded="md" className="hidden sm:flex" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-base-100">
            {current?.title ?? current?.filename ?? t('player.nothingPlaying')}
          </p>
          <p className="truncate text-xs text-base-400">{current?.artist ?? '—'}</p>
        </div>
      </button>

      {/* Transport controls stay LTR regardless of app language — a deliberate
          convention (also used by most media players) since play direction
          and elapsed/remaining time read left-to-right universally. */}
      <div dir="ltr" className="flex min-w-0 flex-1 flex-col items-center gap-1.5 max-w-2xl mx-auto w-full">
        <PlayerControls />
        <div className="flex w-full min-w-0 items-center gap-2">
          <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-base-400">
            {formatDuration(currentTime)}
          </span>
          <ProgressBar value={currentTime} max={duration || 0} onSeek={seek} className="min-w-0 flex-1" />
          <span className="w-10 shrink-0 text-[11px] tabular-nums text-base-400">{formatDuration(duration)}</span>
        </div>
      </div>

      <div className="flex w-28 min-w-0 shrink items-center justify-end gap-1 sm:w-40 lg:w-64">
        <IconButton label={t('actions.queue')} size="sm" active={isQueueOpen} onClick={toggleQueue}>
          <ListMusic size={17} />
        </IconButton>
        {current?.kind === 'video' && (
          <IconButton label={t('actions.fullscreen')} size="sm" onClick={() => setFullscreen(true)}>
            <Maximize2 size={16} />
          </IconButton>
        )}
        <VolumeControl volume={volume} muted={muted} onChange={setVolume} onToggleMute={toggleMute} />
      </div>
    </footer>
  )
}
