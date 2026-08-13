import { getExtension, getFilename } from '@shared/utils/path'
import { isAudioExtension, isVideoExtension } from '@shared/constants/media'
import type { MediaKind, MediaMetadata, PlaybackCapabilities } from '@shared/types/media'
import type { MediaEngine } from './types'
import { ffprobeFile } from './ffprobe'
import { readTags } from './tags'
import { findFolderArtwork } from './folderArtwork'
import { createLogger } from '@core/logging/logger'

const logger = createLogger('media:probe')

const MIME_BY_EXT: Record<string, string> = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.flac': 'audio/flac',
  '.aac': 'audio/aac',
  '.m4a': 'audio/mp4',
  '.ogg': 'audio/ogg',
  '.opus': 'audio/opus',
  '.aiff': 'audio/aiff',
  '.aif': 'audio/aiff',
  '.wma': 'audio/x-ms-wma',
  '.mp4': 'video/mp4',
  '.mkv': 'video/x-matroska',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.m4v': 'video/x-m4v',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
  '.ts': 'video/mp2t',
  '.flv': 'video/x-flv'
}

export class MediaProbeService implements MediaEngine {
  detectKind(filePath: string): MediaKind {
    const ext = getExtension(filePath)
    if (isVideoExtension(ext)) return 'video'
    if (isAudioExtension(ext)) return 'audio'
    return 'unknown'
  }

  async probe(filePath: string): Promise<MediaMetadata> {
    const ext = getExtension(filePath)
    const kind = this.detectKind(filePath)
    const filename = getFilename(filePath)

    let probe: Awaited<ReturnType<typeof ffprobeFile>> | null = null
    try {
      probe = await ffprobeFile(filePath)
    } catch (error) {
      logger.warn(`ffprobe failed for ${filePath}`, error)
    }

    const tags = kind === 'audio' ? await readTags(filePath) : null

    // Artwork lookup order: embedded tag artwork first, then a conventionally
    // named cover image in the same folder. Never fetched from the network.
    let artworkBuffer = tags?.artworkBuffer ?? null
    let artworkMimeType = tags?.artworkMimeType ?? null
    if (!artworkBuffer) {
      const folderArtwork = await findFolderArtwork(filePath)
      if (folderArtwork) {
        artworkBuffer = folderArtwork.buffer
        artworkMimeType = folderArtwork.mimeType
      }
    }

    const fallbackTitle = filename.replace(/\.[^./]+$/, '')

    return {
      title: tags?.title ?? probe?.format.tags?.title ?? fallbackTitle,
      artist: tags?.artist ?? probe?.format.tags?.artist ?? null,
      album: tags?.album ?? probe?.format.tags?.album ?? null,
      genre: tags?.genre ?? probe?.format.tags?.genre ?? null,
      duration: probe?.format.duration ?? null,
      mimeType: MIME_BY_EXT[ext] ?? null,
      container: probe?.format.formatName ?? ext.replace('.', ''),
      codec: probe?.videoStream?.codec ?? probe?.audioStream?.codec ?? null,
      width: probe?.videoStream?.width ?? null,
      height: probe?.videoStream?.height ?? null,
      sampleRate: probe?.audioStream?.sampleRate ?? null,
      bitrate: probe?.format.bitRate ?? probe?.audioStream?.bitRate ?? null,
      frameRate: probe?.videoStream?.frameRate ?? null,
      audioChannels: probe?.audioStream?.channels ?? null,
      artworkBuffer,
      artworkMimeType
    }
  }

  getCapabilities(filePath: string, metadata: MediaMetadata): PlaybackCapabilities {
    const ext = getExtension(filePath)
    const kind = this.detectKind(filePath)

    if (kind === 'unknown') {
      return { canPlay: false, reason: `Unsupported file extension: ${ext}` }
    }

    if (!metadata.duration && !metadata.codec) {
      return {
        canPlay: false,
        reason: 'Unable to read media information. The file may be corrupt or use an unsupported codec.'
      }
    }

    return { canPlay: true }
  }
}
