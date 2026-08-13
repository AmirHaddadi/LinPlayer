import { Video } from 'lucide-react'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { MediaCollection } from './MediaCollection'

export function VideosScreen(): JSX.Element {
  const items = useLibraryStore((s) => s.items)
  const searchQuery = useLibraryStore((s) => s.searchQuery)
  const searchResults = useLibraryStore((s) => s.searchResults)

  const videoItems = (searchQuery ? searchResults : items).filter((item) => item.kind === 'video')

  return (
    <MediaCollection
      title="Videos"
      items={videoItems}
      emptyIcon={Video}
      emptyTitle="No videos yet"
      emptyDescription="Open video files or scan a folder to build your video library."
    />
  )
}
