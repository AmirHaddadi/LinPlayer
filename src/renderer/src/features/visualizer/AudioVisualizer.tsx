import { useEffect, useRef } from 'react'
import { audioGraph } from '@renderer/features/equalizer/audioGraph'
import { usePlayerStore } from '@renderer/stores/playerStore'

interface AudioVisualizerProps {
  size: number
  /** Inner radius (px) left empty so artwork can sit in the middle. */
  innerRadius: number
  className?: string
}

const BAR_COUNT = 64

/**
 * Radial, audio-reactive spectrum drawn on a <canvas> around the Now
 * Playing artwork. Reads real FFT magnitude data from the shared
 * AnalyserNode (see audioGraph.ts) — this is not a decorative loop
 * animation, it silently does nothing if there is no analyser data.
 */
export function AudioVisualizer({ size, innerRadius, className }: AudioVisualizerProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>()
  const smoothedRef = useRef<number[]>(new Array(BAR_COUNT).fill(0))
  const isPlaying = usePlayerStore((s) => s.isPlaying)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const analyser = audioGraph.getAnalyser()
    const bufferLength = analyser?.frequencyBinCount ?? 0
    const data = new Uint8Array(bufferLength)
    const center = size / 2
    const maxBarLength = center - innerRadius - 4

    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '91 140 255'

    const draw = (): void => {
      frameRef.current = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, size, size)

      if (analyser) analyser.getByteFrequencyData(data)

      const smoothed = smoothedRef.current

      for (let i = 0; i < BAR_COUNT; i++) {
        // Sample the lower ~70% of the spectrum (the audible energy that
        // reads as "musical" — highest bins are mostly noise) and fold it
        // logarithmically so bass isn't the only thing visible.
        const dataIndex = Math.floor((i / BAR_COUNT) * bufferLength * 0.7)
        const target = analyser && isPlaying ? (data[dataIndex] ?? 0) / 255 : 0

        // Exponential smoothing: fast attack, slower release, so the
        // visualizer feels musically responsive but never jitters or jump-cuts.
        const prev = smoothed[i] ?? 0
        smoothed[i] = target > prev ? prev + (target - prev) * 0.5 : prev + (target - prev) * 0.12

        const angle = (i / BAR_COUNT) * Math.PI * 2 - Math.PI / 2
        const barLength = Math.max(2, smoothed[i] * maxBarLength)
        const x1 = center + Math.cos(angle) * innerRadius
        const y1 = center + Math.sin(angle) * innerRadius
        const x2 = center + Math.cos(angle) * (innerRadius + barLength)
        const y2 = center + Math.sin(angle) * (innerRadius + barLength)

        ctx.strokeStyle = `rgba(${accentColor.replace(/\s+/g, ',')}, ${0.35 + smoothed[i] * 0.65})`
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }

    draw()
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [size, innerRadius, isPlaying])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
      aria-hidden="true"
    />
  )
}
