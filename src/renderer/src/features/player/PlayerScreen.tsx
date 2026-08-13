import { Heart, Music2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Artwork } from '@renderer/components/common/Artwork'
import { EmptyState } from '@renderer/components/common/EmptyState'
import { IconButton } from '@renderer/components/common/IconButton'
import { usePlayerStore } from '@renderer/stores/playerStore'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { useSettingsStore } from '@renderer/stores/settingsStore'
import { AudioVisualizer } from '@renderer/features/visualizer/AudioVisualizer'
import { formatBitrate, formatDuration } from '@shared/utils/format'

const ARTWORK_SIZE = 280
const VISUALIZER_SIZE = 380

export function PlayerScreen(): JSX.Element {
  const { t } = useTranslation()
  const current = usePlayerStore((s) => s.current)
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite)
  const visualizerEnabled = useSettingsStore((s) => s.settings.audio.visualizerEnabled)

  if (!current) {
    return <EmptyState icon={Music2} title={t('player.nothingPlayingTitle')} description={t('player.nothingPlayingDescription')} />
  }

  if (current.kind === 'video') {
    // The actual <video> element is positioned by PlayerHost to cover this
    // screen's content area; this view just supplies the surrounding chrome.
    return <div className="h-full w-full" />
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
      <div className="relative flex items-center justify-center" style={{ width: VISUALIZER_SIZE, height: VISUALIZER_SIZE }}>
        {visualizerEnabled && (
          <AudioVisualizer
            size={VISUALIZER_SIZE}
            innerRadius={ARTWORK_SIZE / 2 + 10}
            className="absolute inset-0"
          />
        )}
        <Artwork
          src={current.artworkPath}
          kind={current.kind}
          size={ARTWORK_SIZE}
          rounded="lg"
          className="shadow-panel"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-base-100">{current.title ?? current.filename}</h1>
          <p className="mt-1 text-base text-base-400">{current.artist ?? t('player.unknownArtist')}</p>
          {current.album && <p className="text-sm text-base-500">{current.album}</p>}
        </div>
        <IconButton
          label={current.favorite ? t('actions.removeFromFavorites') : t('actions.addToFavorites')}
          active={current.favorite}
          onClick={() => toggleFavorite(current.id)}
        >
          <Heart size={18} fill={current.favorite ? 'currentColor' : 'none'} />
        </IconButton>
      </div>

      <div dir="ltr" className="flex gap-4 text-xs text-base-500">
        <span>{formatDuration(current.duration)}</span>
        {current.codec && <span>{current.codec.toUpperCase()}</span>}
        {current.bitrate && <span>{formatBitrate(current.bitrate)}</span>}
        {current.sampleRate && <span>{Math.round(current.sampleRate / 1000)} kHz</span>}
      </div>
    </div>
  )
}
