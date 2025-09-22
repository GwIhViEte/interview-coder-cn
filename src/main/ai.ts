import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { PROMPT_SYSTEM } from './prompts'
import { settings } from './settings'

export function getSolutionStream(base64Image: string, abortSignal?: AbortSignal) {
  const openai = createOpenAI({
    baseURL: settings.apiBaseURL,
    apiKey: settings.apiKey
  })

  const { textStream } = streamText({
    model: openai(settings.model || 'gpt-4o-mini'),
    system: settings.customPrompt || PROMPT_SYSTEM,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `以下是一张截图。编程语言：${settings.codeLanguage || '未指定'}。请严格将所有代码放在 Markdown 代码块中（使用三反引号，若可请标注语言），解释文字放在代码块之外。`
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
