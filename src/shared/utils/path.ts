export function getExtension(filePath: string): string {
  const match = /\.[^./\\]+$/.exec(filePath)
  return match ? match[0].toLowerCase() : ''
}

export function getFilename(filePath: string): string {
  const parts = filePath.split(/[/\\]/)
  return parts[parts.length - 1] ?? filePath
}
