import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { PROMPT_SYSTEM } from './prompts'
import { settings } from './settings'

export function getSolutionStream(base64Image: string) {
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
            text: `The screenshot is as follows, and the programming language is ${settings.codeLanguage}.`
          },
          {
            type: 'image',
            image: base64Image
          }
        ]
      }
    ]
  })
  return textStream
}
