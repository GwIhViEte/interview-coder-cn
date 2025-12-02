import { useCallback, useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react'
import { Check, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

type PreProps = ComponentPropsWithoutRef<'pre'>

function PreBlock({ children, ...props }: PreProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = useCallback(async () => {
    if (!preRef.current || !navigator.clipboard) return

    const codeElement = preRef.current.querySelector('code')
    const codeText = codeElement?.textContent ?? preRef.current.textContent ?? ''

    if (!codeText) return

    try {
      await navigator.clipboard.writeText(codeText)
      setIsCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code block', error)
    }
  }, [])

  return (
    <div className="relative group">
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700/60 bg-zinc-900/60 text-zinc-300 opacity-0 transition-opacity hover:bg-zinc-800 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 group-hover:opacity-100"
      >
        <span className="sr-only">{isCopied ? 'Copied' : 'Copy code'}</span>
        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <div className="prose prose-sm prose-invert max-w-none prose-pre:p-0 prose-code:text-xs">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ node, ...props }) => {
            void node
            return <PreBlock {...props} />
          }
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
