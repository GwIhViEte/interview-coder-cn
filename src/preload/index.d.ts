import { ElectronAPI } from '@electron-toolkit/preload'
import type { AppState } from '../main/state'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getAppSettings: () => AppSettings
      updateAppSettings: (settings: Partial<AppSettings>) => void
      updateAppState: (state: Partial<AppState>) => void
      onSyncAppSettings: (callback: (settings: AppSettings) => void) => void
      removeSyncAppSettingsListener: () => void
      onSyncAppState: (callback: (state: AppState) => void) => void
      removeSyncAppStateListener: () => void
      initShortcuts: (shortcuts: Record<string, { action: string; key: string }>) => Promise<void>
      getShortcuts: () => Promise<Record<string, { action: string; status: string }>>
      updateShortcuts: (shortcuts: { action: string; key: string }[]) => Promise<void>
      onScreenshotTaken: (callback: (screenshotData: string) => void) => void
      removeScreenshotListener: () => void
      onSolutionChunk: (callback: (chunk: string) => void) => void
      removeSolutionChunkListener: () => void
      stopSolutionStream: () => Promise<boolean>
      onSolutionComplete: (callback: () => void) => void
      removeSolutionCompleteListener: () => void
      onSolutionStopped: (callback: () => void) => void
      removeSolutionStoppedListener: () => void
      onSolutionError: (callback: (message: string) => void) => void
      removeSolutionErrorListener: () => void
      onScrollPageUp: (callback: () => void) => void
      removeScrollPageUpListener: () => void
      onScrollPageDown: (callback: () => void) => void
      removeScrollPageDownListener: () => void
    }
  }
}
