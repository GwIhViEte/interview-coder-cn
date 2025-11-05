import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const PROMPT_SYSTEM = readFileSync(join(import.meta.dirname, 'prompts.md'), 'utf-8').trim()
