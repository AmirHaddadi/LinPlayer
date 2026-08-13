import { createReadStream, statSync } from 'node:fs'
import { protocol } from 'electron'
import { Readable } from 'node:stream'
import { createLogger } from '@core/logging/logger'

const logger = createLogger('main:mediaProtocol')

export const MEDIA_PROTOCOL = 'linplayer-media'

export function registerMediaProtocolPrivileges(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: MEDIA_PROTOCOL,
      privileges: {
        standard: true,
        secure: true,
        stream: true,
        supportFetchAPI: true,
        bypassCSP: true,
        corsEnabled: true
      }
    }
  ])
}

export function buildStreamUrl(filePath: string): string {
  return `${MEDIA_PROTOCOL}://stream?path=${encodeURIComponent(filePath)}`
}

export function buildArtworkUrl(filePath: string): string {
  return `${MEDIA_PROTOCOL}://artwork?path=${encodeURIComponent(filePath)}`
}

export function registerMediaProtocolHandler(
  isPathAllowed: (path: string) => boolean,
  isArtworkPathAllowed: (path: string) => boolean
): void {
  protocol.handle(MEDIA_PROTOCOL, async (request) => {
    const url = new URL(request.url)
    const filePath = url.searchParams.get('path')
    const isArtworkRequest = url.hostname === 'artwork'

    if (!filePath) {
      return new Response('Not found', { status: 404 })
    }
    if (isArtworkRequest ? !isArtworkPathAllowed(filePath) : !isPathAllowed(filePath)) {
      return new Response('Not found', { status: 404 })
    }

    let stat: ReturnType<typeof statSync>
    try {
      stat = statSync(filePath)
    } catch (error) {
      logger.warn(`Media file missing: ${filePath}`, error)
      return new Response('Not found', { status: 404 })
    }

    const range = request.headers.get('range')
    const fileSize = stat.size

    if (range) {
      const match = /bytes=(\d+)-(\d*)/.exec(range)
      const start = match ? Number(match[1]) : 0
      const end = match && match[2] ? Number(match[2]) : fileSize - 1
      const chunkSize = end - start + 1

      const stream = createReadStream(filePath, { start, end })
      return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunkSize)
        }
      })
    }

    const stream = createReadStream(filePath)
    return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
      status: 200,
      headers: {
        'Content-Length': String(fileSize),
        'Accept-Ranges': 'bytes'
      }
    })
  })
}
