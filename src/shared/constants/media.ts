export const AUDIO_EXTENSIONS = [
  '.mp3',
  '.wav',
  '.flac',
  '.aac',
  '.m4a',
  '.ogg',
  '.opus',
  '.aiff',
  '.aif',
  '.wma'
] as const

export const VIDEO_EXTENSIONS = [
  '.mp4',
  '.mkv',
  '.webm',
  '.mov',
  '.avi',
  '.m4v',
  '.mpeg',
  '.mpg',
  '.ts',
  '.flv'
] as const

export const SUPPORTED_EXTENSIONS = [...AUDIO_EXTENSIONS, ...VIDEO_EXTENSIONS] as const

export type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[number]

export function isSupportedExtension(ext: string): ext is SupportedExtension {
  return (SUPPORTED_EXTENSIONS as readonly string[]).includes(ext.toLowerCase())
}

export function isAudioExtension(ext: string): boolean {
  return (AUDIO_EXTENSIONS as readonly string[]).includes(ext.toLowerCase())
}

export function isVideoExtension(ext: string): boolean {
  return (VIDEO_EXTENSIONS as readonly string[]).includes(ext.toLowerCase())
}
