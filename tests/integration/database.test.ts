import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseService } from '@core/database'
import type { MediaMetadata } from '@shared/types/media'

const emptyMetadata: MediaMetadata = {
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  genre: 'Electronic',
  duration: 180,
  mimeType: 'audio/mpeg',
  container: 'mp3',
  codec: 'mp3',
  width: null,
  height: null,
  sampleRate: 44100,
  bitrate: 320000,
  frameRate: null,
  audioChannels: 2,
  artworkBuffer: null,
  artworkMimeType: null
}

describe('DatabaseService', () => {
  let dir: string
  let db: DatabaseService

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'linplayer-test-'))
    db = new DatabaseService(join(dir, 'test.sqlite3'))
  })

  afterEach(() => {
    db.close()
    rmSync(dir, { recursive: true, force: true })
  })

  it('upserts and retrieves media by path', () => {
    const item = db.media.upsertByPath('/music/track.mp3', 'track.mp3', 'audio', emptyMetadata, null)
    expect(item.title).toBe('Test Track')
    expect(item.favorite).toBe(false)

    const again = db.media.upsertByPath(
      '/music/track.mp3',
      'track.mp3',
      'audio',
      { ...emptyMetadata, title: 'Updated Title' },
      null
    )
    expect(again.id).toBe(item.id)
    expect(again.title).toBe('Updated Title')
    expect(db.media.getAll()).toHaveLength(1)
  })

  it('toggles favorite state', () => {
    const item = db.media.upsertByPath('/music/track.mp3', 'track.mp3', 'audio', emptyMetadata, null)
    expect(db.media.toggleFavorite(item.id)).toBe(true)
    expect(db.media.getById(item.id)?.favorite).toBe(true)
    expect(db.media.toggleFavorite(item.id)).toBe(false)
  })

  it('searches across title, artist, and album', () => {
    db.media.upsertByPath('/music/a.mp3', 'a.mp3', 'audio', emptyMetadata, null)
    db.media.upsertByPath('/music/b.mp3', 'b.mp3', 'audio', { ...emptyMetadata, title: 'Other', artist: 'Someone Else' }, null)

    expect(db.media.search('Test Artist')).toHaveLength(1)
    expect(db.media.search('Other')).toHaveLength(1)
    expect(db.media.search('nonexistent')).toHaveLength(0)
  })

  it('creates playlists, adds items, and preserves order on reorder', () => {
    const trackA = db.media.upsertByPath('/music/a.mp3', 'a.mp3', 'audio', emptyMetadata, null)
    const trackB = db.media.upsertByPath('/music/b.mp3', 'b.mp3', 'audio', emptyMetadata, null)

    const playlist = db.playlists.create('My Mix')
    db.playlists.addItem(playlist.id, trackA.id)
    db.playlists.addItem(playlist.id, trackB.id)

    let items = db.playlists.getItems(playlist.id)
    expect(items.map((i) => i.mediaId)).toEqual([trackA.id, trackB.id])

    db.playlists.reorderItems(playlist.id, [items[1].id, items[0].id])
    items = db.playlists.getItems(playlist.id)
    expect(items.map((i) => i.mediaId)).toEqual([trackB.id, trackA.id])

    db.playlists.delete(playlist.id)
    expect(db.playlists.getById(playlist.id)).toBeNull()
  })

  it('persists settings and merges with defaults', () => {
    db.settings.set('playback', {
      rememberPosition: false,
      defaultVolume: 0.5,
      playbackSpeed: 1.5,
      resumeBehavior: 'never'
    })

    const playback = db.settings.get('playback')
    expect(playback.defaultVolume).toBe(0.5)
    expect(playback.resumeBehavior).toBe('never')

    // Untouched keys still return defaults.
    expect(db.settings.get('appearance').theme).toBe('dark')
  })

  it('persists language/theme and equalizer settings independently', () => {
    db.settings.set('appearance', { theme: 'light', language: 'fa', reducedMotion: true })
    db.settings.set('audio', {
      equalizerEnabled: true,
      equalizerPreset: 'bassBoost',
      equalizerGains: [6, 5, 3, 0, 0, 0, 0],
      visualizerEnabled: false
    })

    const all = db.settings.getAll()
    expect(all.appearance.language).toBe('fa')
    expect(all.appearance.theme).toBe('light')
    expect(all.audio.equalizerEnabled).toBe(true)
    expect(all.audio.equalizerPreset).toBe('bassBoost')
    // Playback settings untouched by the above writes still return defaults.
    expect(all.playback.resumeBehavior).toBe('ask')
  })

  it('records playback history and recent list survives repeated plays', () => {
    const track = db.media.upsertByPath('/music/a.mp3', 'a.mp3', 'audio', emptyMetadata, null)
    db.history.addEntry(track.id, 10)
    db.history.addEntry(track.id, 45)

    const recent = db.history.getRecent()
    expect(recent).toHaveLength(1)
    expect(recent[0].media.id).toBe(track.id)
    expect(db.media.getById(track.id)?.playCount).toBe(2)
  })

  it('removes media rows for files that no longer exist on disk', () => {
    db.media.upsertByPath('/music/a.mp3', 'a.mp3', 'audio', emptyMetadata, null)
    db.media.upsertByPath('/music/b.mp3', 'b.mp3', 'audio', emptyMetadata, null)

    const removed = db.media.deleteMissing(new Set(['/music/a.mp3']))
    expect(removed).toBe(1)
    expect(db.media.getAll().map((m) => m.path)).toEqual(['/music/a.mp3'])
  })
})
