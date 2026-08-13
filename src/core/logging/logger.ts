export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 }

export interface LoggerOptions {
  minLevel?: LogLevel
  scope?: string
}

class Logger {
  private minLevel: LogLevel

  constructor(private readonly scope: string, minLevel: LogLevel = 'info') {
    this.minLevel = minLevel
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level
  }

  private log(level: LogLevel, message: string, meta?: unknown): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.minLevel]) return
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.scope}]`
    const consoleMethod = level === 'debug' ? 'log' : level
    if (meta !== undefined) {
      // eslint-disable-next-line no-console
      console[consoleMethod](prefix, message, meta)
    } else {
      // eslint-disable-next-line no-console
      console[consoleMethod](prefix, message)
    }
  }

  debug(message: string, meta?: unknown): void {
    this.log('debug', message, meta)
  }

  info(message: string, meta?: unknown): void {
    this.log('info', message, meta)
  }

  warn(message: string, meta?: unknown): void {
    this.log('warn', message, meta)
  }

  error(message: string, meta?: unknown): void {
    this.log('error', message, meta)
  }

  child(scope: string): Logger {
    return new Logger(`${this.scope}:${scope}`, this.minLevel)
  }
}

const isDev = process.env.NODE_ENV !== 'production'
export const rootLogger = new Logger('linplayer', isDev ? 'debug' : 'info')

export function createLogger(scope: string): Logger {
  return rootLogger.child(scope)
}
