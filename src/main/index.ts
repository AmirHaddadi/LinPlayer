import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createLogger } from '@core/logging/logger'
import { createAppServices, type AppServices } from './services/appServices'
import { registerMediaProtocolHandler, registerMediaProtocolPrivileges } from './services/mediaProtocol'
import { createMainWindow } from './window/mainWindow'
import { registerIpcHandlers, isMediaPathAllowed } from './ipc/registerIpcHandlers'
import { IpcChannels } from '@shared/constants/ipc'

const logger = createLogger('main')

registerMediaProtocolPrivileges()

let mainWindow: BrowserWindow | null = null
let services: AppServices | null = null

function getWindow(): BrowserWindow | null {
  return mainWindow
}

function persistWindowBounds(): void {
  if (!mainWindow || !services) return
  const settings = services.settingsService.getAll()
  if (!settings.general.rememberWindowSize && !settings.general.rememberWindowPosition) return

  const bounds = mainWindow.getBounds()
  services.settingsService.set('general', {
    ...settings.general,
    windowBounds: {
      width: settings.general.rememberWindowSize ? bounds.width : settings.general.windowBounds?.width ?? bounds.width,
      height: settings.general.rememberWindowSize ? bounds.height : settings.general.windowBounds?.height ?? bounds.height,
      x: settings.general.rememberWindowPosition ? bounds.x : undefined,
      y: settings.general.rememberWindowPosition ? bounds.y : undefined
    }
  })
}

async function bootstrap(): Promise<void> {
  electronApp.setAppUserModelId('dev.linplayer.app')

  services = await createAppServices()
  registerMediaProtocolHandler(
    (filePath) => isMediaPathAllowed(services!, filePath),
    (filePath) => filePath.startsWith(services!.paths.artwork)
  )

  const settings = services.settingsService.getAll()
  mainWindow = createMainWindow(settings)

  registerIpcHandlers(getWindow, services)

  mainWindow.on('resized', persistWindowBounds)
  mainWindow.on('moved', persistWindowBounds)
  mainWindow.on('maximize', () => mainWindow?.webContents.send(IpcChannels.WindowIsMaximized, true))
  mainWindow.on('unmaximize', () => mainWindow?.webContents.send(IpcChannels.WindowIsMaximized, false))

  if (settings.library.scanOnStartup && services.database.libraryFolders.getAll().length > 0) {
    for (const folder of services.database.libraryFolders.getAll()) {
      services.libraryScanner
        .scan(folder.path, (progress) => {
          mainWindow?.webContents.send(IpcChannels.LibraryScanProgress, progress)
        })
        .catch((error) => logger.error(`Startup scan failed for ${folder.path}`, error))
    }
  }
}

app.whenReady().then(() => {
  app.on('browser-window-created', (_event, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  bootstrap().catch((error) => {
    logger.error('Failed to bootstrap application', error)
    app.quit()
  })

  // 'activate' is macOS-specific (dock icon re-open); LinPlayer targets Linux
  // first, so we simply recreate the window without re-registering IPC
  // handlers, which are process-global and must only be registered once.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && services) {
      mainWindow = createMainWindow(services.settingsService.getAll())
    }
  })
})

app.on('window-all-closed', () => {
  services?.database.close()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error)
})

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', reason)
})
