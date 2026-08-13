import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { Button } from '@renderer/components/common/Button'
import { MediaCollection } from '@renderer/features/library/MediaCollection'
import type { HistoryEntry } from '@shared/types/playlist'

export function HistoryScreen(): JSX.Element {
  const [entries, setEntries] = useState<HistoryEntry[]>([])

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

  return (
    <div className="relative">
      {entries.length > 0 && (
        <div className="absolute right-6 top-6">
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear history
          </Button>
        </div>
      )}
      <MediaCollection
        title="History"
        items={entries.map((entry) => entry.media)}
        emptyIcon={Clock}
        emptyTitle="No playback history yet"
        emptyDescription="Media you play will show up here."
      />
    </div>
  )
}
