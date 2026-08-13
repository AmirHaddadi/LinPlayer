import { parseFile } from 'music-metadata'
import { createLogger } from '@core/logging/logger'

const logger = createLogger('media:tags')

export interface TagResult {
  title: string | null
  artist: string | null
  album: string | null
  genre: string | null
  artworkBuffer: Buffer | null
  artworkMimeType: string | null
}

const EMPTY_TAGS: TagResult = {
  title: null,
  artist: null,
  album: null,
  genre: null,
  artworkBuffer: null,
  artworkMimeType: null
}

export async function readTags(filePath: string): Promise<TagResult> {
  try {
    const metadata = await parseFile(filePath, { duration: false, skipCovers: false })
    const picture = metadata.common.picture?.[0]

    return {
      title: metadata.common.title ?? null,
      artist: metadata.common.artist ?? null,
      album: metadata.common.album ?? null,
      genre: metadata.common.genre?.[0] ?? null,
      artworkBuffer: picture ? Buffer.from(picture.data) : null,
      artworkMimeType: picture?.format ?? null
    }
  } catch (error) {
    logger.debug(`No readable tags for ${filePath}`, error)
    return EMPTY_TAGS
  }
}
