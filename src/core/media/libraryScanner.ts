import type { MediaRepository } from '@core/database'
import type { LibraryScanProgress } from '@shared/types/media'
import { getFilename } from '@shared/utils/path'
import { fileExists, walkMediaFiles } from '@core/filesystem/scanner'
import { createLogger } from '@core/logging/logger'
import type { ArtworkCache } from './artworkCache'
import type { MediaProbeService } from './mediaProbeService'

const logger = createLogger('media:scanner')

export type ScanProgressCallback = (progress: LibraryScanProgress) => void

export class LibraryScanner {
  constructor(
    private readonly probeService: MediaProbeService,
    private readonly mediaRepository: MediaRepository,
    private readonly artworkCache: ArtworkCache
  ) {}

  async scan(rootPath: string, onProgress?: ScanProgressCallback): Promise<void> {
    onProgress?.({ type: 'started', scanned: 0, total: 0 })

    let scanned = 0
    const errors: string[] = []

    for await (const filePath of walkMediaFiles(rootPath)) {
      scanned++
      onProgress?.({ type: 'progress', scanned, total: 0, currentPath: filePath })

      try {
        const kind = this.probeService.detectKind(filePath)
        const metadata = await this.probeService.probe(filePath)

        let artworkPath: string | null = null
        if (metadata.artworkBuffer) {
          artworkPath = await this.artworkCache.save(
            filePath,
            metadata.artworkBuffer,
            metadata.artworkMimeType
          )
        }

        this.mediaRepository.upsertByPath(filePath, getFilename(filePath), kind, metadata, artworkPath)
      } catch (error) {
        logger.warn(`Failed to index ${filePath}`, error)
        errors.push(filePath)
      }
    }

    onProgress?.({
      type: 'completed',
      scanned,
      total: scanned,
      error: errors.length ? `${errors.length} file(s) could not be indexed` : undefined
    })
  }

  async removeMissing(): Promise<number> {
    const allPaths = this.mediaRepository.getAllPaths()
    const stillExisting = new Set<string>()

    for (const path of allPaths) {
      if (await fileExists(path)) stillExisting.add(path)
    }

    return this.mediaRepository.deleteMissing(stillExisting)
  }
}
