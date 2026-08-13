import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@renderer/components/common/IconButton'
import { usePlayerStore } from '@renderer/stores/playerStore'

export function PlayerControls(): JSX.Element {
  const { t } = useTranslation()
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const shuffle = usePlayerStore((s) => s.shuffle)
  const repeat = usePlayerStore((s) => s.repeat)
  const togglePlay = usePlayerStore((s) => s.togglePlay)
  const next = usePlayerStore((s) => s.next)
  const previous = usePlayerStore((s) => s.previous)
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle)
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat)
  const current = usePlayerStore((s) => s.current)

  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat

  return (
    <div className="flex items-center gap-1">
      <IconButton label={t('actions.shuffle')} size="sm" active={shuffle} onClick={toggleShuffle}>
        <Shuffle size={16} />
      </IconButton>
      <IconButton label={t('actions.previous')} onClick={previous} disabled={!current}>
        <SkipBack size={18} fill="currentColor" />
      </IconButton>
      <IconButton
        label={isPlaying ? t('actions.pause') : t('actions.play')}
        size="lg"
        onClick={togglePlay}
        disabled={!current}
        className="bg-base-100 text-base-950 hover:bg-white hover:text-base-950"
      >
        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
      </IconButton>
      <IconButton label={t('actions.next')} onClick={next} disabled={!current}>
        <SkipForward size={18} fill="currentColor" />
      </IconButton>
      <IconButton label={t('actions.repeat', { mode: t(`repeat.${repeat}`) })} size="sm" active={repeat !== 'off'} onClick={cycleRepeat}>
        <RepeatIcon size={16} />
      </IconButton>
    </div>
  )
}
