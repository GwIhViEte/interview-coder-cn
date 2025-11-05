import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { settings } from './settings'

export const PROMPT_SYSTEM = readFileSync(join(import.meta.dirname, 'prompts.md'), 'utf-8').trim()

export function getSolutionStream(base64Image: string, abortSignal?: AbortSignal) {
  const openai = createOpenAI({
    baseURL: settings.apiBaseURL,
    apiKey: settings.apiKey
  })

  const { textStream } = streamText({
    model: openai(settings.model || 'gpt-4o-mini'),
    system:
      settings.customPrompt || PROMPT_SYSTEM + `\n使用编程语言：${settings.codeLanguage} 解答。`,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `这是屏幕截图`
          },
          {
            type: 'image',
            image: base64Image
          }
        ]
      }
    ],
    abortSignal
  })
  return textStream
}
