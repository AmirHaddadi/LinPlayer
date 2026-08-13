import { useCallback, useRef, useState } from 'react'
import { clsx } from '@renderer/utils/clsx'

interface LinSliderProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label: string
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
  formatValue?: (value: number) => string
}

/**
 * Custom slider (replaces native <input type="range">, which is what caused
 * the Settings volume control to overflow its card on narrow windows —
 * native range inputs don't respect min-width:0 in a flex row). Track width
 * is always 100% of its flex parent, so it can never push a container wider
 * than intended.
 */
export function LinSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  disabled,
  orientation = 'horizontal',
  className,
  formatValue
}: LinSliderProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const isVertical = orientation === 'vertical'
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0

  const valueFromPointer = useCallback(
    (clientPos: number): number => {
      const track = trackRef.current
      if (!track) return value
      const rect = track.getBoundingClientRect()
      const isRtl = document.documentElement.dir === 'rtl'

      let ratio: number
      if (isVertical) {
        ratio = 1 - (clientPos - rect.top) / rect.height
      } else {
        ratio = (clientPos - rect.left) / rect.width
        if (isRtl) ratio = 1 - ratio
      }
      ratio = Math.min(1, Math.max(0, ratio))
      const raw = min + ratio * (max - min)
      return Math.round(raw / step) * step
    },
    [isVertical, max, min, step, value]
  )

  const handlePointerDown = (event: React.PointerEvent): void => {
    if (disabled) return
    ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
    setDragging(true)
    onChange(valueFromPointer(isVertical ? event.clientY : event.clientX))
  }

  const handlePointerMove = (event: React.PointerEvent): void => {
    if (!dragging || disabled) return
    onChange(valueFromPointer(isVertical ? event.clientY : event.clientX))
  }

  const handlePointerUp = (event: React.PointerEvent): void => {
    setDragging(false)
    ;(event.target as HTMLElement).releasePointerCapture(event.pointerId)
  }

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (disabled) return
    const isRtl = document.documentElement.dir === 'rtl'
    const increaseKeys = isVertical ? ['ArrowUp'] : isRtl ? ['ArrowLeft'] : ['ArrowRight']
    const decreaseKeys = isVertical ? ['ArrowDown'] : isRtl ? ['ArrowRight'] : ['ArrowLeft']

    if (increaseKeys.includes(event.key)) {
      event.preventDefault()
      onChange(Math.min(max, value + step))
    } else if (decreaseKeys.includes(event.key)) {
      event.preventDefault()
      onChange(Math.max(min, value - step))
    } else if (event.key === 'Home') {
      event.preventDefault()
      onChange(min)
    } else if (event.key === 'End') {
      event.preventDefault()
      onChange(max)
    }
  }

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={formatValue ? formatValue(value) : String(value)}
      aria-disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={clsx(
        'group relative shrink-0 touch-none select-none rounded-full bg-base-700 outline-none',
        'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base-950',
        disabled && 'opacity-40 pointer-events-none',
        isVertical ? 'h-full w-1.5 min-h-24' : 'h-1.5 w-full min-w-0 cursor-pointer',
        className
      )}
    >
      <div
        className={clsx('absolute rounded-full bg-accent', isVertical ? 'inset-x-0 bottom-0' : 'inset-y-0 start-0')}
        style={isVertical ? { height: `${pct}%` } : { width: `${pct}%` }}
      />
      <div
        className={clsx(
          'absolute h-3.5 w-3.5 rounded-full bg-white shadow-subtle transition-transform',
          dragging && 'scale-110',
          isVertical ? '-translate-x-1/2 translate-y-1/2 start-1/2' : 'top-1/2 -translate-y-1/2'
        )}
        style={
          isVertical
            ? { bottom: `${pct}%` }
            : { insetInlineStart: `calc(${pct}% - 7px)` }
        }
      />
    </div>
  )
}
