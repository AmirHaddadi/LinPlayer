import { useEffect } from 'react'
import { usePlayerStore } from '@renderer/stores/playerStore'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || target.isContentEditable
}

export function useKeyboardShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (isTypingTarget(event.target)) return

      const store = usePlayerStore.getState()

      switch (event.key) {
        case ' ':
          event.preventDefault()
          store.togglePlay()
          break
        case 'ArrowLeft':
          store.seek(Math.max(0, store.currentTime - 5))
          break
        case 'ArrowRight':
          store.seek(Math.min(store.duration, store.currentTime + 5))
          break
        case 'ArrowUp':
          event.preventDefault()
          store.setVolume(Math.min(1, store.volume + 0.05))
          break
        case 'ArrowDown':
          event.preventDefault()
          store.setVolume(Math.max(0, store.volume - 0.05))
          break
        case 'm':
        case 'M':
          store.toggleMute()
          break
        case 'f':
        case 'F':
          if (store.current?.kind === 'video') store.setFullscreen(!store.isFullscreen)
          break
        case 'n':
        case 'N':
          store.next()
          break
        case 'p':
        case 'P':
          store.previous()
          break
        case 'Escape':
          if (store.isFullscreen) store.setFullscreen(false)
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
