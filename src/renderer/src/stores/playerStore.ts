import { create } from 'zustand'
import type { MediaItem } from '@shared/types/media'

export type RepeatMode = 'off' | 'all' | 'one'

interface PlayerState {
  queue: MediaItem[]
  queueIndex: number
  current: MediaItem | null
  streamUrl: string | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  playbackRate: number
  shuffle: boolean
  repeat: RepeatMode
  isFullscreen: boolean
  error: string | null

  setQueue: (items: MediaItem[], startIndex?: number) => void
  playItem: (item: MediaItem, streamUrl: string, queue?: MediaItem[], index?: number) => void
  togglePlay: () => void
  setPlaying: (playing: boolean) => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setPlaybackRate: (rate: number) => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  setFullscreen: (value: boolean) => void
  setError: (message: string | null) => void
  setStreamForCurrent: (streamUrl: string) => void
}

function pickNextIndex(
  queueLength: number,
  currentIndex: number,
  shuffle: boolean,
  repeat: RepeatMode
): number | null {
  if (queueLength === 0) return null
  if (repeat === 'one') return currentIndex

  if (shuffle) {
    if (queueLength === 1) return repeat === 'all' ? 0 : null
    let next = currentIndex
    while (next === currentIndex) next = Math.floor(Math.random() * queueLength)
    return next
  }

  const next = currentIndex + 1
  if (next < queueLength) return next
  return repeat === 'all' ? 0 : null
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  queueIndex: -1,
  current: null,
  streamUrl: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  muted: false,
  playbackRate: 1,
  shuffle: false,
  repeat: 'off',
  isFullscreen: false,
  error: null,

  setQueue: (items, startIndex = 0) => set({ queue: items, queueIndex: startIndex }),

  playItem: (item, streamUrl, queue, index) =>
    set((state) => ({
      current: item,
      streamUrl,
      isPlaying: true,
      currentTime: 0,
      error: null,
      queue: queue ?? state.queue,
      queueIndex: index ?? state.queueIndex
    })),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (playing) => set({ isPlaying: playing }),

  next: () => {
    const { queue, queueIndex, shuffle, repeat } = get()
    const nextIndex = pickNextIndex(queue.length, queueIndex, shuffle, repeat)
    if (nextIndex === null) {
      set({ isPlaying: false })
      return
    }
    const item = queue[nextIndex]
    set({ current: item, queueIndex: nextIndex, currentTime: 0, isPlaying: true, streamUrl: null })
  },

  previous: () => {
    const { queue, queueIndex, currentTime } = get()
    if (currentTime > 3 || queue.length === 0) {
      set({ currentTime: 0 })
      return
    }
    const prevIndex = queueIndex - 1 < 0 ? (queue.length ? queue.length - 1 : -1) : queueIndex - 1
    if (prevIndex < 0) return
    const item = queue[prevIndex]
    set({ current: item, queueIndex: prevIndex, currentTime: 0, isPlaying: true, streamUrl: null })
  },

  seek: (time) => set({ currentTime: time }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)), muted: volume === 0 }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  cycleRepeat: () =>
    set((state) => ({
      repeat: state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off'
    })),
  setFullscreen: (value) => set({ isFullscreen: value }),
  setError: (message) => set({ error: message, isPlaying: false }),
  setStreamForCurrent: (streamUrl) => set({ streamUrl })
}))
