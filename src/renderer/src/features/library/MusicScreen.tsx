import { Music2 } from 'lucide-react'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { MediaCollection } from './MediaCollection'

export function MusicScreen(): JSX.Element {
  const items = useLibraryStore((s) => s.items)
  const searchQuery = useLibraryStore((s) => s.searchQuery)
  const searchResults = useLibraryStore((s) => s.searchResults)

  const audioItems = (searchQuery ? searchResults : items).filter((item) => item.kind === 'audio')

  return (
    <MediaCollection
      title="Music"
      items={audioItems}
      emptyIcon={Music2}
      emptyTitle="No music yet"
      emptyDescription="Open audio files or scan a folder to build your music library."
    />
  )
}
