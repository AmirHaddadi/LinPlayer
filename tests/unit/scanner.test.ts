import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { walkMediaFiles } from '@core/filesystem/scanner'

describe('walkMediaFiles', () => {
  let dir: string

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'linplayer-scan-'))
    writeFileSync(join(dir, 'song.mp3'), '')
    writeFileSync(join(dir, 'notes.txt'), '')
    mkdirSync(join(dir, '.hidden'))
    writeFileSync(join(dir, '.hidden', 'hidden.mp3'), '')
    mkdirSync(join(dir, 'nested'))
    writeFileSync(join(dir, 'nested', 'clip.mp4'), '')
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('finds supported media files recursively while skipping hidden dirs and unsupported extensions', async () => {
    const found: string[] = []
    for await (const file of walkMediaFiles(dir)) {
      found.push(file)
    }

    expect(found).toContain(join(dir, 'song.mp3'))
    expect(found).toContain(join(dir, 'nested', 'clip.mp4'))
    expect(found).not.toContain(join(dir, 'notes.txt'))
    expect(found).not.toContain(join(dir, '.hidden', 'hidden.mp3'))
    expect(found).toHaveLength(2)
  })
})
