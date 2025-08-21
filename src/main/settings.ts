import { ipcMain } from 'electron'

ipcMain.handle('getAppSettings', () => {
  return settings
})

ipcMain.handle('updateAppSettings', (_event, _settings) => {
  Object.assign(settings, _settings)
})

export const settings = {
  apiBaseURL: process.env.API_BASE_URL || 'https://api.openai.com/v1',
  apiKey: process.env.API_KEY || '',
  model: process.env.MODEL || 'gpt-4o-mini',
  codeLanguage: process.env.CODE_LANGUAGE || 'typescript',
  customPrompt: ''
}

export type AppSettings = typeof settings
