import { useUiStore } from '@renderer/stores/uiStore'
import { HomeScreen } from '@renderer/features/home/HomeScreen'
import { MusicScreen } from '@renderer/features/library/MusicScreen'
import { VideosScreen } from '@renderer/features/library/VideosScreen'
import { FavoritesScreen } from '@renderer/features/favorites/FavoritesScreen'
import { HistoryScreen } from '@renderer/features/history/HistoryScreen'
import { PlaylistsScreen } from '@renderer/features/playlists/PlaylistsScreen'
import { PlaylistDetailScreen } from '@renderer/features/playlists/PlaylistDetailScreen'
import { SettingsScreen } from '@renderer/features/settings/SettingsScreen'
import { PlayerScreen } from '@renderer/features/player/PlayerScreen'

export function ScreenRouter(): JSX.Element {
  const route = useUiStore((s) => s.route)

  switch (route) {
    case 'home':
      return <HomeScreen />
    case 'music':
      return <MusicScreen />
    case 'videos':
      return <VideosScreen />
    case 'favorites':
      return <FavoritesScreen />
    case 'history':
      return <HistoryScreen />
    case 'library':
      return <PlaylistsScreen />
    case 'playlist':
      return <PlaylistDetailScreen />
    case 'settings':
      return <SettingsScreen />
    case 'player':
      return <PlayerScreen />
    default:
      return <HomeScreen />
  }
}
