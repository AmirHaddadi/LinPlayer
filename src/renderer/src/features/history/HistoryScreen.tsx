import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@renderer/components/common/Button'
import { LoadingState } from '@renderer/components/common/LoadingState'
import { MediaCollection } from '@renderer/features/library/MediaCollection'
import type { HistoryEntry } from '@shared/types/playlist'

export function HistoryScreen(): JSX.Element {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null)

  const load = (): void => {
    window.linplayer.history.getRecent(100).then(setEntries).catch(() => setEntries([]))
  }

  useEffect(() => {
    load()
  }, [])

  const handleClear = async (): Promise<void> => {
    await window.linplayer.history.clear()
    setEntries([])
  }

  if (entries === null) return <LoadingState />

  return (
    <div className="relative">
      {entries.length > 0 && (
        <div className="absolute end-6 top-6">
          <Button variant="ghost" size="sm" onClick={handleClear}>
            {t('actions.clearHistory')}
          </Button>
        </div>
      )}
      <MediaCollection
        title={t('nav.history')}
        items={entries.map((entry) => entry.media)}
        emptyIcon={Clock}
        emptyTitle={t('empty.historyTitle')}
        emptyDescription={t('empty.historyDescription')}
      />
    </div>
  )
}
