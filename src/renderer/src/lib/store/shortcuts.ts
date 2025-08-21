import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Shortcut = {
  action: string
  key: string
  defaultKey: string
  category: string
  status?: ShortcutStatus
}

export enum ShortcutStatus {
  Registered = 'registered',
  Failed = 'failed',
  /** Shortcut is available to register but not registered. */
  Available = 'available'
}

interface ShortcutsState {
  shortcuts: Record<string, Shortcut>
}

interface ShortcutsStore extends ShortcutsState {
  updateShortcut: (action: string, shortcut: Shortcut) => void
  updateShortcuts: (shortcuts: Record<string, Shortcut>) => void
  resetShortcuts: () => void
}

const defaultShortcuts: Record<string, Omit<Shortcut, 'defaultKey'>> = {
  hideOrShowMainWindow: {
    action: 'hideOrShowMainWindow',
    key: 'Alt+H',
    category: 'Window Management'
  },
  ignoreOrEnableMouse: {
    action: 'ignoreOrEnableMouse',
    key: 'Alt+M',
    category: 'Window Management'
  },
  takeScreenshot: { action: 'takeScreenshot', key: 'Alt+Enter', category: 'Screenshot & AI' },
  pageUp: { action: 'pageUp', key: 'CommandOrControl+J', category: 'Navigation' },
  pageDown: { action: 'pageDown', key: 'CommandOrControl+K', category: 'Navigation' },
  moveMainWindowUp: {
    action: 'moveMainWindowUp',
    key: 'CommandOrControl+Up',
    category: 'Window Movement'
  },
  moveMainWindowDown: {
    action: 'moveMainWindowDown',
    key: 'CommandOrControl+Down',
    category: 'Window Movement'
  },
  moveMainWindowLeft: {
    action: 'moveMainWindowLeft',
    key: 'CommandOrControl+Left',
    category: 'Window Movement'
  },
  moveMainWindowRight: {
    action: 'moveMainWindowRight',
    key: 'CommandOrControl+Right',
    category: 'Window Movement'
  }
}

export const useShortcutsStore = create<ShortcutsStore>()(
  persist(
    (set) => ({
      shortcuts: Object.fromEntries(
        Object.entries(defaultShortcuts).map(([action, shortcut]) => [
          action,
          { ...shortcut, defaultKey: shortcut.key }
        ])
      ),
      updateShortcut: (action, shortcut) => {
        set((state) => ({
          shortcuts: {
            ...state.shortcuts,
            [action]: shortcut
          }
        }))
      },
      updateShortcuts: (shortcuts) => {
        set({ shortcuts })
      },
      resetShortcuts: () => {
        set({
          shortcuts: Object.fromEntries(
            Object.entries(defaultShortcuts).map(([action, shortcut]) => [
              action,
              { ...shortcut, defaultKey: shortcut.key }
            ])
          )
        })
      }
    }),
    {
      name: 'interview-coder-shortcuts',
      version: 1
    }
  )
)
