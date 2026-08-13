import { useEffect } from 'react'
import type { RefObject } from 'react'
import { audioGraph } from './audioGraph'
import { useSettingsStore } from '@renderer/stores/settingsStore'
import { EQUALIZER_BAND_FREQUENCIES } from '@shared/types/settings'
import type { MediaKind } from '@shared/types/media'

const FLAT_GAINS = EQUALIZER_BAND_FREQUENCIES.map(() => 0)

/**
 * Wires the <audio>/<video> elements into the shared Web Audio graph
 * (see audioGraph.ts) and keeps the per-band gains in sync with settings.
 * When the equalizer is disabled, gains are set to 0dB (audibly flat)
 * rather than tearing down the audio graph, since MediaElementSourceNode
 * routing can't be undone for a given element.
 */
export function useEqualizerEngine(
  audioRef: RefObject<HTMLAudioElement>,
  videoRef: RefObject<HTMLVideoElement>,
  activeKind: MediaKind | null
): void {
  const equalizerEnabled = useSettingsStore((s) => s.settings.audio.equalizerEnabled)
  const equalizerGains = useSettingsStore((s) => s.settings.audio.equalizerGains)

  useEffect(() => {
    audioGraph.attach(audioRef.current)
    audioGraph.attach(videoRef.current)
  }, [audioRef, videoRef, activeKind])

  useEffect(() => {
    const gains = equalizerEnabled ? equalizerGains : FLAT_GAINS
    audioGraph.setGains(gains)
    audioGraph.applyGainsTo(audioRef.current, gains)
    audioGraph.applyGainsTo(videoRef.current, gains)
  }, [equalizerEnabled, equalizerGains, audioRef, videoRef])

  useEffect(() => {
    const resumeOnGesture = (): void => {
      void audioGraph.resume()
    }
    window.addEventListener('pointerdown', resumeOnGesture, { once: true })
    return () => window.removeEventListener('pointerdown', resumeOnGesture)
  }, [])
}
