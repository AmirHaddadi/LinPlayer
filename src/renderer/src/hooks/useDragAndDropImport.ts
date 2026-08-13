import { useCallback, useState } from 'react'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { useUiStore } from '@renderer/stores/uiStore'

interface DropHandlers {
  onDragOver: (event: React.DragEvent) => void
  onDragLeave: (event: React.DragEvent) => void
  onDrop: (event: React.DragEvent) => void
}

export function useDragAndDropImport(): { isDraggingOver: boolean; dropHandlers: DropHandlers } {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const loadItems = useLibraryStore((s) => s.loadItems)
  const pushToast = useUiStore((s) => s.pushToast)

  const onDragOver = useCallback((event: React.DragEvent) => {
    if (event.dataTransfer.types.includes('Files')) {
      event.preventDefault()
      setIsDraggingOver(true)
    }
  }, [])

  const onDragLeave = useCallback((event: React.DragEvent) => {
    if (event.currentTarget === event.target) setIsDraggingOver(false)
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDraggingOver(false)

      const files = Array.from(event.dataTransfer.files)
      if (files.length === 0) return

      const paths = files.map((file) => window.linplayer.media.getPathForFile(file))

      window.linplayer.media
        .importPaths(paths)
        .then(async (opened) => {
          await loadItems()
          if (opened.length > 0) {
            pushToast(`Imported ${opened.length} file${opened.length === 1 ? '' : 's'}.`, 'success')
          }
        })
        .catch(() => pushToast('Some dropped items could not be imported.', 'error'))
    },
    [loadItems, pushToast]
  )

  return { isDraggingOver, dropHandlers: { onDragOver, onDragLeave, onDrop } }
}
