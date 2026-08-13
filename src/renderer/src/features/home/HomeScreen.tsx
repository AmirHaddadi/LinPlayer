import { useEffect, useState } from 'react'
import { FolderOpen, LayoutGrid, Music2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { usePlayMedia } from '@renderer/hooks/usePlayMedia'
import { useUiStore } from '@renderer/stores/uiStore'
import { EmptyState } from '@renderer/components/common/EmptyState'
import { Button } from '@renderer/components/common/Button'
import { MediaCard } from '@renderer/components/media/MediaCard'
import type { HistoryEntry } from '@shared/types/playlist'
import type { MediaItem } from '@shared/types/media'

export function HomeScreen(): JSX.Element {
  const { t } = useTranslation()
  const items = useLibraryStore((s) => s.items)
  const favorites = useLibraryStore((s) => s.favorites)
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite)
  const scanProgress = useLibraryStore((s) => s.scanProgress)
  const pushToast = useUiStore((s) => s.pushToast)
  const playMedia = usePlayMedia()
  const [recent, setRecent] = useState<HistoryEntry[]>([])

  useEffect(() => {
    window.linplayer.history.getRecent(10).then(setRecent).catch(() => setRecent([]))
  }, [items])

  const recentlyAdded = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  const handleOpenFile = async (): Promise<void> => {
    const opened = await window.linplayer.media.openFileDialog()
    if (opened.length > 0) {
      await useLibraryStore.getState().loadItems()
      pushToast(t('toast.openedFiles', { count: opened.length }), 'success')
      await playMedia(opened[0].item)
    }
  }

  const handleScanFolder = async (): Promise<void> => {
    const folderPath = await window.linplayer.media.openFolderDialog()
    if (folderPath) {
      await useLibraryStore.getState().addFolder(folderPath)
      pushToast(t('toast.scanningFolder'), 'info')
    }
  }

  if (items.length === 0 && !scanProgress) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={Music2}
          title={t('empty.libraryTitle')}
          description={t('empty.libraryDescription')}
          action={
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={handleOpenFile}>
                {t('actions.openFile')}
              </Button>
              <Button variant="secondary" onClick={handleScanFolder}>
                <FolderOpen size={15} className="me-1.5" />
                {t('actions.scanFolder')}
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className="px-6 py-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-base-100">{t('home.welcome')}</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleOpenFile}>
            {t('actions.openFile')}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleScanFolder}>
            <FolderOpen size={14} className="me-1.5" />
            {t('actions.scanFolder')}
          </Button>
        </div>
      </div>

      {recent.length > 0 && (
        <Section title={t('home.continueListening')}>
          <CardGrid items={recent.map((entry) => entry.media)} onPlay={playMedia} onToggleFavorite={toggleFavorite} />
        </Section>
      )}

      {favorites.length > 0 && (
        <Section title={t('home.favorites')}>
          <CardGrid items={favorites.slice(0, 10)} onPlay={playMedia} onToggleFavorite={toggleFavorite} />
        </Section>
      )}

      <Section title={t('home.recentlyAdded')}>
        {recentlyAdded.length > 0 ? (
          <CardGrid items={recentlyAdded} onPlay={playMedia} onToggleFavorite={toggleFavorite} />
        ) : (
          <EmptyState icon={LayoutGrid} title={t('empty.nothingHereYet')} />
        )}
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-base-200">{title}</h2>
      {children}
    </section>
  )
}

function CardGrid({
  items,
  onPlay,
  onToggleFavorite
}: {
  items: MediaItem[]
  onPlay: (item: MediaItem, queue?: MediaItem[], index?: number) => void
  onToggleFavorite: (id: number) => void
}): JSX.Element {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
      {items.map((item, index) => (
        <MediaCard
          key={item.id}
          item={item}
          onPlay={() => onPlay(item, items, index)}
          onToggleFavorite={() => onToggleFavorite(item.id)}
        />
      ))}
    </div>
  )
}
