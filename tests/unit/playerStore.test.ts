import { beforeEach, describe, expect, it } from 'vitest'
import { usePlayerStore } from '@renderer/stores/playerStore'
import type { MediaItem } from '@shared/types/media'

function makeItem(id: number, kind: 'audio' | 'video' = 'audio'): MediaItem {
  return {
    id,
    path: `/music/${id}.mp3`,
    filename: `${id}.mp3`,
    title: `Track ${id}`,
    artist: null,
    album: null,
    genre: null,
    duration: 100,
    mimeType: null,
    container: null,
    codec: null,
    width: null,
    height: null,
    sampleRate: null,
    bitrate: null,
    artworkPath: null,
    kind,
    createdAt: '',
    updatedAt: '',
    lastPlayedAt: null,
    playCount: 0,
    favorite: false
  }
}

describe('playerStore playback transitions', () => {
  beforeEach(() => {
    usePlayerStore.setState(usePlayerStore.getInitialState())
  })

  it('advances to the next track in order with repeat off', () => {
    const queue = [makeItem(1), makeItem(2), makeItem(3)]
    usePlayerStore.getState().playItem(queue[0], 'stream://1', queue, 0)

    usePlayerStore.getState().next()
    expect(usePlayerStore.getState().current?.id).toBe(2)
    expect(usePlayerStore.getState().isPlaying).toBe(true)
  })

  it('stops after the last track when repeat is off', () => {
    const queue = [makeItem(1), makeItem(2)]
    usePlayerStore.getState().playItem(queue[1], 'stream://2', queue, 1)

    usePlayerStore.getState().next()
    expect(usePlayerStore.getState().isPlaying).toBe(false)
  })

  it('wraps to the first track when repeat is "all"', () => {
    const queue = [makeItem(1), makeItem(2)]
    usePlayerStore.setState({ repeat: 'all' })
    usePlayerStore.getState().playItem(queue[1], 'stream://2', queue, 1)

    usePlayerStore.getState().next()
    expect(usePlayerStore.getState().current?.id).toBe(1)
  })

  it('replays the same track when repeat is "one"', () => {
    const queue = [makeItem(1), makeItem(2)]
    usePlayerStore.setState({ repeat: 'one' })
    usePlayerStore.getState().playItem(queue[0], 'stream://1', queue, 0)

    usePlayerStore.getState().next()
    expect(usePlayerStore.getState().current?.id).toBe(1)
  })

  it('switching from an audio track to a video track updates the single active media item', () => {
    const audioItem = makeItem(1, 'audio')
    const videoItem = makeItem(2, 'video')

    usePlayerStore.getState().playItem(audioItem, 'stream://audio', [audioItem], 0)
    expect(usePlayerStore.getState().current?.kind).toBe('audio')

    usePlayerStore.getState().playItem(videoItem, 'stream://video', [videoItem], 0)
    const state = usePlayerStore.getState()
    expect(state.current?.kind).toBe('video')
    expect(state.current?.id).toBe(2)
    // There is exactly one `current` item at any time — playItem always
    // replaces it rather than layering a second concurrent playback target.
  })

  it('toggling shuffle never removes the current track from the queue', () => {
    const queue = [makeItem(1), makeItem(2), makeItem(3)]
    usePlayerStore.getState().playItem(queue[0], 'stream://1', queue, 0)
    usePlayerStore.getState().toggleShuffle()
    expect(usePlayerStore.getState().queue).toHaveLength(3)
    expect(usePlayerStore.getState().shuffle).toBe(true)
  })
})
