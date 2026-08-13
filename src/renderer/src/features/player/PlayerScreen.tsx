import { Music2 } from 'lucide-react'
import { Artwork } from '@renderer/components/common/Artwork'
import { EmptyState } from '@renderer/components/common/EmptyState'
import { usePlayerStore } from '@renderer/stores/playerStore'
import { formatBitrate, formatDuration } from '@shared/utils/format'

export function PlayerScreen(): JSX.Element {
  const current = usePlayerStore((s) => s.current)

  if (!current) {
    return <EmptyState icon={Music2} title="Nothing is playing" description="Pick something from your library to get started." />
  }

  if (current.kind === 'video') {
    // The actual <video> element is positioned by PlayerHost to cover this
    // screen's content area; this view just supplies the surrounding chrome.
    return <div className="h-full w-full" />
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
      <Artwork src={current.artworkPath} kind={current.kind} size={280} rounded="lg" />
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-base-100">{current.title ?? current.filename}</h1>
        <p className="mt-1 text-base text-base-400">{current.artist ?? 'Unknown artist'}</p>
        {current.album && <p className="text-sm text-base-500">{current.album}</p>}
      </div>
      <div className="flex gap-4 text-xs text-base-500">
        <span>{formatDuration(current.duration)}</span>
        {current.codec && <span>{current.codec.toUpperCase()}</span>}
        {current.bitrate && <span>{formatBitrate(current.bitrate)}</span>}
        {current.sampleRate && <span>{Math.round(current.sampleRate / 1000)} kHz</span>}
      </div>
    </div>
  )
}
