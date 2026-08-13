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

  async save(sourcePath: string, buffer: Uint8Array, mimeType: string | null): Promise<string> {
    const ext = MIME_EXT[mimeType ?? ''] ?? '.jpg'
    const hash = createHash('sha1').update(sourcePath).digest('hex')
    const filePath = join(this.cacheDir, `${hash}${ext}`)
    await fs.writeFile(filePath, buffer)
    return filePath
  }
}
