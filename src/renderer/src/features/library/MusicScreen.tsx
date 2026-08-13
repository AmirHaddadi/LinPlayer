import { Music2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { MediaCollection } from './MediaCollection'

export function MusicScreen(): JSX.Element {
  const { t } = useTranslation()
  const items = useLibraryStore((s) => s.items)
  const searchQuery = useLibraryStore((s) => s.searchQuery)
  const searchResults = useLibraryStore((s) => s.searchResults)

  const audioItems = (searchQuery ? searchResults : items).filter((item) => item.kind === 'audio')

  return (
    <MediaCollection
      title={t('library.music')}
      items={audioItems}
      emptyIcon={Music2}
      emptyTitle={t('empty.musicTitle')}
      emptyDescription={t('empty.musicDescription')}
    />
  )
}
