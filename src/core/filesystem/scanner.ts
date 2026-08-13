import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { getExtension } from '@shared/utils/path'
import { isSupportedExtension } from '@shared/constants/media'
import { createLogger } from '@core/logging/logger'

const logger = createLogger('filesystem:scanner')

export interface WalkOptions {
  signal?: AbortSignal
  onFile?: (filePath: string) => void
}

/**
 * Recursively walks a directory, yielding paths to supported media files.
 * Skips directories it cannot read (permissions) instead of failing the whole scan.
 */
export async function* walkMediaFiles(
  rootPath: string,
  options: WalkOptions = {}
): AsyncGenerator<string> {
  const stack: string[] = [rootPath]

  while (stack.length > 0) {
    if (options.signal?.aborted) return
    const current = stack.pop()!

    let entries: import('node:fs').Dirent[]
    try {
      entries = await fs.readdir(current, { withFileTypes: true })
    } catch (error) {
      logger.warn(`Unable to read directory: ${current}`, error)
      continue
    }

    for (const entry of entries) {
      const fullPath = join(current, entry.name)
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.')) continue
        stack.push(fullPath)
      } else if (entry.isFile()) {
        const ext = getExtension(entry.name)
        if (isSupportedExtension(ext)) {
          options.onFile?.(fullPath)
          yield fullPath
        }
      }
    }
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

