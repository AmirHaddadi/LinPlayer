import { promises as fs } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { createLogger } from '@core/logging/logger'

const logger = createLogger('media:folderArtwork')

const CANDIDATE_NAMES = ['cover', 'folder', 'album', 'front']
const CANDIDATE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

const MIME_BY_IMAGE_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
}

export interface FolderArtwork {
  buffer: Buffer
  mimeType: string
}

/**
 * Looks for a conventionally-named cover image (cover/folder/album/front,
 * any common extension, case-insensitive) next to a media file. This never
 * reaches out to the network — purely a local filesystem check — matching
 * the "no internet artwork lookups this milestone" requirement.
 */
export async function findFolderArtwork(mediaFilePath: string): Promise<FolderArtwork | null> {
  const dir = dirname(mediaFilePath)

  let entries: string[]
  try {
    entries = await fs.readdir(dir)
  } catch (error) {
    logger.debug(`Unable to read directory for folder artwork: ${dir}`, error)
    return null
  }

  const byLowerName = new Map(entries.map((name) => [name.toLowerCase(), name]))

  for (const candidate of CANDIDATE_NAMES) {
    for (const ext of CANDIDATE_EXTENSIONS) {
      const match = byLowerName.get(`${candidate}${ext}`)
      if (!match) continue

      try {
        const filePath = join(dir, match)
        const buffer = await fs.readFile(filePath)
        const mimeType = MIME_BY_IMAGE_EXT[extname(match).toLowerCase()] ?? 'image/jpeg'
        return { buffer, mimeType }
      } catch (error) {
        logger.debug(`Failed to read folder artwork candidate: ${match}`, error)
      }
    }
  }

  return null
}
