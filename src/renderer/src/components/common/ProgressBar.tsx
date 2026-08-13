import { useRef, useState } from 'react'
import { clsx } from '@renderer/utils/clsx'

interface ProgressBarProps {
  value: number
  max: number
  onSeek: (value: number) => void
  className?: string
}

export function ProgressBar({ value, max, onSeek, className }: ProgressBarProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null)
  const [hoverPct, setHoverPct] = useState<number | null>(null)
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0

  const pctFromEvent = (event: React.MouseEvent): number => {
    const rect = trackRef.current!.getBoundingClientRect()
    return Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  }

  return (
    <div
      ref={trackRef}
      className={clsx('group relative h-4 flex items-center cursor-pointer', className)}
      onMouseMove={(e) => setHoverPct(pctFromEvent(e))}
      onMouseLeave={() => setHoverPct(null)}
      onClick={(e) => onSeek(pctFromEvent(e) * max)}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
    >
      <div className="h-1 w-full rounded-full bg-base-700 overflow-hidden">
        <div className="h-full bg-base-400 group-hover:bg-accent transition-colors" style={{ width: `${pct}%` }} />
      </div>
      <div
        className="absolute h-3 w-3 rounded-full bg-base-100 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
        style={{ left: `${hoverPct !== null ? hoverPct * 100 : pct}%` }}
      />
    </div>
  )
}
