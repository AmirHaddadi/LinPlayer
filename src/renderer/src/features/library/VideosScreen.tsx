import { Video } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { MediaCollection } from './MediaCollection'

export function VideosScreen(): JSX.Element {
  const { t } = useTranslation()
  const items = useLibraryStore((s) => s.items)
  const searchQuery = useLibraryStore((s) => s.searchQuery)
  const searchResults = useLibraryStore((s) => s.searchResults)

  const videoItems = (searchQuery ? searchResults : items).filter((item) => item.kind === 'video')

  return (
    <MediaCollection
      title={t('library.videos')}
      items={videoItems}
      emptyIcon={Video}
      emptyTitle={t('empty.videosTitle')}
      emptyDescription={t('empty.videosDescription')}
    />
  )
}
