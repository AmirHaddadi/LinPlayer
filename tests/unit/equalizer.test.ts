import { describe, expect, it } from 'vitest'
import { EQUALIZER_PRESETS } from '@renderer/features/equalizer/presets'
import { EQUALIZER_BAND_FREQUENCIES, DEFAULT_SETTINGS } from '@shared/types/settings'

describe('equalizer presets', () => {
  it('every preset defines a gain for each of the 7 bands', () => {
    for (const [name, gains] of Object.entries(EQUALIZER_PRESETS)) {
      expect(gains, `preset "${name}"`).toHaveLength(EQUALIZER_BAND_FREQUENCIES.length)
    }
  })

  it('the flat preset is silent (0dB on every band)', () => {
    expect(EQUALIZER_PRESETS.flat.every((gain) => gain === 0)).toBe(true)
  })

  it('bass boost raises low bands more than high bands', () => {
    const [low] = EQUALIZER_PRESETS.bassBoost
    const high = EQUALIZER_PRESETS.bassBoost[EQUALIZER_PRESETS.bassBoost.length - 1]
    expect(low).toBeGreaterThan(high)
  })
})

describe('default settings', () => {
  it('equalizer is off by default with a flat, correctly-sized gain array', () => {
    expect(DEFAULT_SETTINGS.audio.equalizerEnabled).toBe(false)
    expect(DEFAULT_SETTINGS.audio.equalizerGains).toHaveLength(EQUALIZER_BAND_FREQUENCIES.length)
    expect(DEFAULT_SETTINGS.audio.equalizerGains.every((g) => g === 0)).toBe(true)
  })

  it('defaults to English with dark theme and motion enabled', () => {
    expect(DEFAULT_SETTINGS.appearance.language).toBe('en')
    expect(DEFAULT_SETTINGS.appearance.theme).toBe('dark')
    expect(DEFAULT_SETTINGS.appearance.reducedMotion).toBe(false)
  })
})
