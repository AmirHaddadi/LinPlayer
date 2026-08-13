import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'

const MIME_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
}

export class ArtworkCache {
  constructor(private readonly cacheDir: string) {}

  async init(): Promise<void> {
    await fs.mkdir(this.cacheDir, { recursive: true })
  }

  /**
   * Cache key is a hash of the artwork bytes themselves (content-addressable),
   * not the source media path — this way an album folder where every track
   * shares the same embedded/folder cover only ever writes that image once.
   */
  async save(_sourcePath: string, buffer: Uint8Array, mimeType: string | null): Promise<string> {
    const ext = MIME_EXT[mimeType ?? ''] ?? '.jpg'
    const hash = createHash('sha1').update(buffer).digest('hex')
    const filePath = join(this.cacheDir, `${hash}${ext}`)

    try {
      await fs.access(filePath)
      return filePath
    } catch {
      await fs.writeFile(filePath, buffer)
      return filePath
    }
  }
}
