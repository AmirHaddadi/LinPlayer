import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from './IconButton'
import { LinSlider } from './LinSlider'

interface VolumeControlProps {
  volume: number
  muted: boolean
  onChange: (value: number) => void
  onToggleMute: () => void
}

export function VolumeControl({ volume, muted, onChange, onToggleMute }: VolumeControlProps): JSX.Element {
  const { t } = useTranslation()
  const effective = muted ? 0 : volume
  const Icon = effective === 0 ? VolumeX : effective < 0.33 ? Volume : effective < 0.67 ? Volume1 : Volume2

  return (
    <div className="flex w-full min-w-0 max-w-[8rem] items-center gap-2">
      <IconButton label={muted ? t('actions.unmute') : t('actions.mute')} size="sm" onClick={onToggleMute}>
        <Icon size={17} />
      </IconButton>
      <LinSlider
        label={t('actions.volume')}
        min={0}
        max={1}
        step={0.01}
        value={effective}
        onChange={onChange}
        className="flex-1"
      />
    </div>
  )
}
