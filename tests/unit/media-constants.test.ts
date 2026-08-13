import { describe, expect, it } from 'vitest'
import { isAudioExtension, isSupportedExtension, isVideoExtension } from '@shared/constants/media'

describe('media extension helpers', () => {
  it('recognizes audio extensions', () => {
    expect(isAudioExtension('.mp3')).toBe(true)
    expect(isAudioExtension('.FLAC')).toBe(true)
    expect(isAudioExtension('.mp4')).toBe(false)
  })

  it('recognizes video extensions', () => {
    expect(isVideoExtension('.mkv')).toBe(true)
    expect(isVideoExtension('.mp3')).toBe(false)
  })

  it('flags unsupported extensions', () => {
    expect(isSupportedExtension('.mp3')).toBe(true)
    expect(isSupportedExtension('.txt')).toBe(false)
    expect(isSupportedExtension('.exe')).toBe(false)
  })
})
