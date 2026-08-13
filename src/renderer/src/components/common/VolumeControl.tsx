import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react'
import { IconButton } from './IconButton'

interface VolumeControlProps {
  volume: number
  muted: boolean
  onChange: (value: number) => void
  onToggleMute: () => void
}

export function VolumeControl({ volume, muted, onChange, onToggleMute }: VolumeControlProps): JSX.Element {
  const effective = muted ? 0 : volume
  const Icon = effective === 0 ? VolumeX : effective < 0.33 ? Volume : effective < 0.67 ? Volume1 : Volume2

  return (
    <div className="flex items-center gap-2 w-32">
      <IconButton label={muted ? 'Unmute' : 'Mute'} size="sm" onClick={onToggleMute}>
        <Icon size={17} />
      </IconButton>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={effective}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Volume"
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-base-700 accent-accent"
      />
    </div>
  )
}
