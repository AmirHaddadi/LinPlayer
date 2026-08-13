import { useTranslation } from 'react-i18next'
import { Sidebar } from '@renderer/components/layout/Sidebar'
import { TopBar } from '@renderer/components/layout/TopBar'
import { PlayerBar } from '@renderer/components/player/PlayerBar'
import { PlayerHost } from '@renderer/components/player/PlayerHost'
import { Queue } from '@renderer/components/player/Queue'
import { ToastContainer } from '@renderer/components/common/Toast'
import { ScreenRouter } from './ScreenRouter'
import { useKeyboardShortcuts } from '@renderer/hooks/useKeyboardShortcuts'
import { useDragAndDropImport } from '@renderer/hooks/useDragAndDropImport'

export function AppShell(): JSX.Element {
  const { t } = useTranslation()
  useKeyboardShortcuts()
  const { isDraggingOver, dropHandlers } = useDragAndDropImport()

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-base-950">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="relative min-w-0 flex-1 overflow-y-auto" {...dropHandlers}>
          <ScreenRouter />
          {isDraggingOver && (
            <div className="pointer-events-none absolute inset-2 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-accent bg-accent/5">
              <p className="text-sm font-medium text-accent">{t('dragDrop.prompt')}</p>
            </div>
          )}
        </main>
        <Queue />
      </div>
      <PlayerBar />
      <PlayerHost />
      <ToastContainer />
    </div>
  )
}
