import type { EqualizerPresetName } from '@shared/types/settings'

/**
 * Gain values in dB for each of the 7 bands defined by
 * EQUALIZER_BAND_FREQUENCIES (60, 150, 400, 1k, 2.4k, 6k, 15k Hz).
 */
export const EQUALIZER_PRESETS: Record<EqualizerPresetName, number[]> = {
  flat: [0, 0, 0, 0, 0, 0, 0],
  bassBoost: [6, 5, 3, 0, 0, 0, 0],
  trebleBoost: [0, 0, 0, 0, 3, 5, 6],
  vocal: [-2, -1, 2, 4, 3, 0, -1],
  rock: [4, 3, -1, -2, 1, 3, 4],
  classical: [3, 2, 0, 0, 0, 2, 3],
  electronic: [5, 4, 0, -2, 2, 3, 5],
  custom: [0, 0, 0, 0, 0, 0, 0]
}
