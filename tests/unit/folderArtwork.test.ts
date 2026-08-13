import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { findFolderArtwork } from '@core/media/folderArtwork'

describe('findFolderArtwork', () => {
  let dir: string

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'linplayer-artwork-'))
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('finds a conventionally named cover image next to the media file, case-insensitively', async () => {
    writeFileSync(join(dir, 'track.mp3'), '')
    writeFileSync(join(dir, 'Cover.JPG'), Buffer.from([1, 2, 3]))

    const result = await findFolderArtwork(join(dir, 'track.mp3'))
    expect(result).not.toBeNull()
    expect(result?.mimeType).toBe('image/jpeg')
    expect(result?.buffer.equals(Buffer.from([1, 2, 3]))).toBe(true)
  })

  it('returns null when no candidate image exists', async () => {
    writeFileSync(join(dir, 'track.mp3'), '')
    const result = await findFolderArtwork(join(dir, 'track.mp3'))
    expect(result).toBeNull()
  })

  it('prefers "cover" over "folder" when both exist', async () => {
    writeFileSync(join(dir, 'track.mp3'), '')
    writeFileSync(join(dir, 'cover.png'), Buffer.from([9]))
    writeFileSync(join(dir, 'folder.png'), Buffer.from([8]))

    const result = await findFolderArtwork(join(dir, 'track.mp3'))
    expect(result?.buffer.equals(Buffer.from([9]))).toBe(true)
  })
})
