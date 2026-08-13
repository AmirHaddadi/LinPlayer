import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@renderer/stores/playerStore'
import { useUiStore } from '@renderer/stores/uiStore'

/**
 * Owns the actual <audio>/<video> elements and keeps them in sync with
 * playerStore. Mounted once at the app root so playback survives navigation
 * between screens.
 */
export function PlayerHost(): JSX.Element {
  const route = useUiStore((s) => s.route)
  const isQueueOpen = useUiStore((s) => s.isQueueOpen)
  const current = usePlayerStore((s) => s.current)
  const streamUrl = usePlayerStore((s) => s.streamUrl)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const volume = usePlayerStore((s) => s.volume)
  const muted = usePlayerStore((s) => s.muted)
  const playbackRate = usePlayerStore((s) => s.playbackRate)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const isFullscreen = usePlayerStore((s) => s.isFullscreen)
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime)
  const setDuration = usePlayerStore((s) => s.setDuration)
  const setError = usePlayerStore((s) => s.setError)
  const setFullscreen = usePlayerStore((s) => s.setFullscreen)
  const next = usePlayerStore((s) => s.next)
  const pushToast = useUiStore((s) => s.pushToast)

  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasRecordedPlay = useRef(false)

  const activeElement = current?.kind === 'video' ? videoRef.current : audioRef.current

  // Fetch a stream URL when a queue navigation set `current` without one.
  useEffect(() => {
    if (current && !streamUrl) {
      window.linplayer.media
        .getStreamUrl(current.path)
        .then((url) => usePlayerStore.getState().setStreamForCurrent(url))
        .catch(() => setError('Unable to play this file. The format or codec may not be supported.'))
    }
  }, [current, streamUrl, setError])

  useEffect(() => {
    hasRecordedPlay.current = false
  }, [current?.id])

  useEffect(() => {
    if (!activeElement) return
    if (isPlaying) {
      void activeElement.play().catch(() => {
        setError('Unable to play this file. The format or codec may not be supported.')
      })
    } else {
      activeElement.pause()
    }
  }, [isPlaying, activeElement, streamUrl, setError])

  useEffect(() => {
    if (!activeElement) return
    activeElement.volume = volume
    activeElement.muted = muted
  }, [volume, muted, activeElement])

  useEffect(() => {
    if (!activeElement) return
    activeElement.playbackRate = playbackRate
  }, [playbackRate, activeElement])

  // Only push seeks originating from the UI (progress bar clicks); playback-driven
  // updates already keep this in sync within a fraction of a second.
  useEffect(() => {
    if (!activeElement) return
    if (Math.abs(activeElement.currentTime - currentTime) > 1) {
      activeElement.currentTime = currentTime
    }
  }, [currentTime, activeElement])

  useEffect(() => {
    if (videoRef.current && isFullscreen) {
      videoRef.current.requestFullscreen?.().catch(() => undefined)
    } else if (!isFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined)
    }
  }, [isFullscreen])

  useEffect(() => {
    const onFullscreenChange = (): void => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [setFullscreen])

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLMediaElement>): void => {
    const time = event.currentTarget.currentTime
    setCurrentTime(time)

    if (!hasRecordedPlay.current && current && time > 1) {
      hasRecordedPlay.current = true
      void window.linplayer.history.addEntry(current.id, time)
    }
  }

  const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLMediaElement>): void => {
    setDuration(event.currentTarget.duration || current?.duration || 0)
  }

  const handleEnded = (): void => {
    next()
  }

  const handleError = (): void => {
    setError('Unable to play this file. The format or codec may not be supported.')
    pushToast('Playback failed — unsupported format or codec.', 'error')
  }

  const isVideoVisible = current?.kind === 'video' && (isFullscreen || route === 'player')

  return (
    <>
      <audio
        ref={audioRef}
        src={current?.kind === 'audio' ? (streamUrl ?? undefined) : undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        className="hidden"
      />
      <video
        id="linplayer-video-surface"
        ref={videoRef}
        src={current?.kind === 'video' ? (streamUrl ?? undefined) : undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        className={
          isFullscreen
            ? 'fixed inset-0 z-40 h-full w-full bg-black object-contain'
            : isVideoVisible
              ? `fixed top-14 bottom-22 left-60 z-20 bg-black object-contain ${isQueueOpen ? 'right-72' : 'right-0'}`
              : 'fixed h-px w-px overflow-hidden opacity-0 pointer-events-none'
        }
      />
    </>
  )
}
