import { describe, expect, it } from 'vitest'
import { getExtension, getFilename } from '@shared/utils/path'

describe('path utils', () => {
  it('extracts lowercase extensions', () => {
    expect(getExtension('/music/Song.MP3')).toBe('.mp3')
    expect(getExtension('C:\\videos\\clip.MKV')).toBe('.mkv')
    expect(getExtension('no-extension')).toBe('')
  })

  it('extracts filenames from posix and windows paths', () => {
    expect(getFilename('/a/b/c.mp3')).toBe('c.mp3')
    expect(getFilename('C:\\a\\b\\c.mp3')).toBe('c.mp3')
    expect(getFilename('just-a-file.mp3')).toBe('just-a-file.mp3')
  })
})
