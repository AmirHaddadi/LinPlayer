import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { MediaCollection } from '@renderer/features/library/MediaCollection'

export function FavoritesScreen(): JSX.Element {
  const { t } = useTranslation()
  const favorites = useLibraryStore((s) => s.favorites)

  return (
    <MediaCollection
      title={t('nav.favorites')}
      items={favorites}
      emptyIcon={Heart}
      emptyTitle={t('empty.favoritesTitle')}
      emptyDescription={t('empty.favoritesDescription')}
    />
  )
}
