import { ListMusic } from 'lucide-react'
import type { Playlist } from '@shared/types/playlist'

interface PlaylistCardProps {
  playlist: Playlist
  onOpen: () => void
  onContextMenu?: (event: React.MouseEvent) => void
}

export function PlaylistCard({ playlist, onOpen, onContextMenu }: PlaylistCardProps): JSX.Element {
  return (
    <button
      onClick={onOpen}
      onContextMenu={onContextMenu}
      className="group flex flex-col items-start rounded-lg p-3 text-left transition-colors hover:bg-base-800/60"
    >
      <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gradient-to-br from-base-800 to-base-900 text-base-500">
        <ListMusic size={40} strokeWidth={1.25} />
      </div>
      <p className="mt-2.5 truncate text-sm font-medium text-base-100 w-full">{playlist.name}</p>
      <p className="truncate text-xs text-base-400">
        {playlist.itemCount} {playlist.itemCount === 1 ? 'track' : 'tracks'}
      </p>
    </button>
  )
}
