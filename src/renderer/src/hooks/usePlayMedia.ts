import { useCallback } from 'react'
import { usePlayerStore } from '@renderer/stores/playerStore'
import type { MediaItem } from '@shared/types/media'

export function usePlayMedia(): (item: MediaItem, queue?: MediaItem[], index?: number) => Promise<void> {
  const playItem = usePlayerStore((s) => s.playItem)
  const setError = usePlayerStore((s) => s.setError)

  return useCallback(
    async (item: MediaItem, queue?: MediaItem[], index?: number) => {
      try {
        const streamUrl = await window.linplayer.media.getStreamUrl(item.path)
        playItem(item, streamUrl, queue, index)
      } catch {
        setError('Unable to play this file. The format or codec may not be supported.')
      }
    },
    [playItem, setError]
  )
}
