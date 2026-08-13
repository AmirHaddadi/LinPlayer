import { Heart } from 'lucide-react'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { MediaCollection } from '@renderer/features/library/MediaCollection'

export function FavoritesScreen(): JSX.Element {
  const favorites = useLibraryStore((s) => s.favorites)

  return (
    <MediaCollection
      title="Favorites"
      items={favorites}
      emptyIcon={Heart}
      emptyTitle="No favorites yet"
      emptyDescription="Tap the heart icon on any track or video to add it here."
    />
  )
}
