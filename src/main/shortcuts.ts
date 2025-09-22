import { globalShortcut, ipcMain } from 'electron'
import { takeScreenshot } from './take-screenshot'
import { getSolutionStream } from './ai'
import { state } from './state'
import { settings } from './settings'

type Shortcut = {
  action: string
  key: string
  status: ShortcutStatus
}

enum ShortcutStatus {
  Registered = 'registered',
  Failed = 'failed',
  /** Shortcut is available to register but not registered. */
  Available = 'available'
}

const MOVE_STEP = 200
const shortcuts: Record<string, Shortcut> = {}

type AbortReason = 'user' | 'new-request'

interface StreamContext {
  controller: AbortController
  reason: AbortReason | null
}

let currentStreamContext: StreamContext | null = null

function abortCurrentStream(reason: AbortReason) {
  if (!currentStreamContext) return
  currentStreamContext.reason = reason
  currentStreamContext.controller.abort()
}

const callbacks: Record<string, () => void> = {
  hideOrShowMainWindow: async () => {
    const mainWindow = global.mainWindow
    if (!mainWindow || mainWindow.isDestroyed()) return
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  },

  takeScreenshot: async () => {
    const mainWindow = global.mainWindow
    if (!mainWindow || mainWindow.isDestroyed() || !state.inCoderPage || !settings.apiKey) return

    abortCurrentStream('new-request')
    const screenshotData = await takeScreenshot()
    if (screenshotData && mainWindow && !mainWindow.isDestroyed()) {
      const streamContext: StreamContext = {
        controller: new AbortController(),
        reason: null
      }
      currentStreamContext = streamContext
      mainWindow.webContents.send('screenshot-taken', screenshotData)
      let endedNaturally = true
      let streamStarted = false
      try {
        const solutionStream = getSolutionStream(screenshotData, streamContext.controller.signal)
        streamStarted = true
        try {
          for await (const chunk of solutionStream) {
            if (streamContext.controller.signal.aborted) {
              endedNaturally = false
              break
            }
            mainWindow.webContents.send('solution-chunk', chunk)
          }
        } catch (error) {
          if (!streamContext.controller.signal.aborted) {
            endedNaturally = false
            console.error('Error streaming solution:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            mainWindow.webContents.send('solution-error', errorMessage)
          } else {
            endedNaturally = false
          }
        }

        if (streamContext.controller.signal.aborted) {
          if (streamContext.reason === 'user') {
            mainWindow.webContents.send('solution-stopped')
          }
        } else if (endedNaturally) {
          mainWindow.webContents.send('solution-complete')
        }
      } catch (error) {
        if (streamContext.controller.signal.aborted) {
          if (streamContext.reason === 'user') {
            mainWindow.webContents.send('solution-stopped')
          }
        } else {
          endedNaturally = false
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error('Error streaming solution:', error)
          mainWindow.webContents.send('solution-error', errorMessage)
        }
      } finally {
        if (currentStreamContext === streamContext) {
          currentStreamContext = null
        }
        if (!streamStarted && streamContext.reason === 'user') {
          mainWindow.webContents.send('solution-stopped')
        }
      }
    }
  },

  ignoreOrEnableMouse: () => {
    const mainWindow = global.mainWindow
    if (!mainWindow || mainWindow.isDestroyed() || !state.inCoderPage) return
    state.ignoreMouse = !state.ignoreMouse
    mainWindow.setIgnoreMouseEvents(state.ignoreMouse)
    mainWindow.webContents.send('sync-app-state', state)
  },
  pageUp: () => {
    const mainWindow = global.mainWindow
    if (!mainWindow || mainWindow.isDestroyed() || !state.inCoderPage) return
    mainWindow.webContents.send('scroll-page-up')
  },

  pageDown: () => {
    const mainWindow = global.mainWindow
    if (!mainWindow || mainWindow.isDestroyed() || !state.inCoderPage) return
    mainWindow.webContents.send('scroll-page-down')
  },

  moveMainWindowUp: () => {
    const mainWindow = global.mainWindow
    if (!mainWindow || mainWindow.isDestroyed()) return
    const [x, y] = mainWindow.getPosition()
    mainWindow.setPosition(x, y - MOVE_STEP)
  },

  moveMainWindowDown: () => {
    const mainWindow = global.mainWindow
    if (!mainWindow || mainWindow.isDestroyed()) return
    const [x, y] = mainWindow.getPosition()
    mainWindow.setPosition(x, y + MOVE_STEP)
  },

  moveMainWindowLeft: () => {
    const mainWindow = global.mainWindow
    if (!mainWindow || mainWindow.isDestroyed()) return
    const [x, y] = mainWindow.getPosition()
    mainWindow.setPosition(x - MOVE_STEP, y)
  },

  moveMainWindowRight: () => {
    const mainWindow = global.mainWindow
    if (!mainWindow || mainWindow.isDestroyed()) return
    const [x, y] = mainWindow.getPosition()
    mainWindow.setPosition(x + MOVE_STEP, y)
  }
}

function registerShortcut(action: string, key: string) {
  if (shortcuts[action]?.status === ShortcutStatus.Registered) {
    globalShortcut.unregister(shortcuts[action].key)
    shortcuts[action].status = ShortcutStatus.Available
  }
  const ok = globalShortcut.register(key, callbacks[action])
  shortcuts[action] = {
    action,
    key,
    status: ok ? ShortcutStatus.Registered : ShortcutStatus.Failed
  }
}

ipcMain.handle('getShortcuts', () => shortcuts)

ipcMain.handle(
  'initShortcuts',
  (_event, shortcuts: Record<string, { action: string; key: string }>) => {
    Object.entries(shortcuts).forEach(([action, { key }]) => {
      registerShortcut(action, key)
    })
  }
)

ipcMain.handle('updateShortcuts', (_event, _shortcuts: { action: string; key: string }[]) => {
  _shortcuts.forEach((shortcut) => {
    if (shortcuts[shortcut.action]?.key !== shortcut.key) {
      registerShortcut(shortcut.action, shortcut.key)
    }
  })
})

ipcMain.handle('stopSolutionStream', () => {
  if (!currentStreamContext) return false
  abortCurrentStream('user')
  return true
})
