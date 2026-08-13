import { describe, expect, it, vi } from 'vitest'
import { PlaylistService } from '@core/playlists/playlistService'
import type { PlaylistRepository } from '@core/database'

function createMockRepository(): PlaylistRepository {
  return {
    create: vi.fn((name: string) => ({ id: 1, name, description: null, createdAt: '', updatedAt: '', itemCount: 0 })),
    rename: vi.fn(),
    getAll: vi.fn(() => []),
    getById: vi.fn(),
    getItems: vi.fn(() => []),
    delete: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
    reorderItems: vi.fn()
  } as unknown as PlaylistRepository
}

describe('PlaylistService', () => {
  it('trims playlist names on create', () => {
    const repository = createMockRepository()
    const service = new PlaylistService(repository)
    service.create('  My Playlist  ')
    expect(repository.create).toHaveBeenCalledWith('My Playlist', undefined)
  })

  it('rejects empty playlist names', () => {
    const service = new PlaylistService(createMockRepository())
    expect(() => service.create('   ')).toThrow('Playlist name cannot be empty')
    expect(() => service.rename(1, '')).toThrow('Playlist name cannot be empty')
  })
})
