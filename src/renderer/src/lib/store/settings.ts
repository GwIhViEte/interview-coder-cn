import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Settings {
  // theme: 'light' | 'dark'an
  apiBaseURL: string
  apiKey: string
  customPrompt: string

  opacity: number
  codeLanguage: string
  model: string
}

interface SettingsStore extends Settings {
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  syncSettings: (settings: Partial<Settings>) => void
}

const defaultSettings: Settings = {
  apiBaseURL: '',
  apiKey: '',
  customPrompt: '',
  codeLanguage: '',
  model: '',

  opacity: 0.8
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSetting: (key, value) => {
        set({ [key]: value })
      },
      syncSettings: (settings) => {
        set(settings)
      }
    }),
    {
      name: 'interview-coder-settings',
      version: 3
    }
  )
)
