import { describe, expect, it } from 'vitest'
import { formatDuration, formatBitrate, formatFileSize } from '@shared/utils/format'

describe('formatDuration', () => {
  it('formats seconds under an hour as m:ss', () => {
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(9)).toBe('0:09')
  })

  it('formats durations over an hour as h:mm:ss', () => {
    expect(formatDuration(3725)).toBe('1:02:05')
  })

  it('falls back to placeholder for invalid input', () => {
    expect(formatDuration(null)).toBe('--:--')
    expect(formatDuration(undefined)).toBe('--:--')
    expect(formatDuration(-5)).toBe('--:--')
    expect(formatDuration(NaN)).toBe('--:--')
  })
})

describe('formatBitrate', () => {
  it('converts bits per second to kbps', () => {
    expect(formatBitrate(320000)).toBe('320 kbps')
  })

  it('returns placeholder for falsy input', () => {
    expect(formatBitrate(null)).toBe('—')
    expect(formatBitrate(0)).toBe('—')
  })
})

describe('formatFileSize', () => {
  it('scales through units', () => {
    expect(formatFileSize(500)).toBe('500 B')
    expect(formatFileSize(2048)).toBe('2.0 KB')
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
  })
})
