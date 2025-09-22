import { useEffect } from 'react'
import { useShortcutsStore } from '@/lib/store/shortcuts'
import { useSolutionStore } from '@/lib/store/solution'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import ShortcutRenderer from '@/components/ShortcutRenderer'

const SCROLL_OFFSET = 120

export function AppContent() {
  const {
    isLoading,
    screenshotData,
    solutionChunks,
    setScreenshotData,
    setIsLoading,
    addSolutionChunk,
    clearSolution
  } = useSolutionStore()

  // Ensure any unfinished fenced code block is closed when a run ends
  const ensureClosedFence = () => {
    const text = useSolutionStore.getState().solutionChunks.join('')
    const fenceCount = (text.match(/```/g) || []).length
    if (fenceCount % 2 === 1) {
      addSolutionChunk('\n```')
    }
  }

  useEffect(() => {
    // Listen for screenshot events
    window.api.onScreenshotTaken((data: string) => {
      setScreenshotData(data)
      // Clear previous solution when new screenshot is taken
      clearSolution()
      setIsLoading(true)
    })

    // Listen for solution chunks
    window.api.onSolutionChunk((chunk: string) => {
      addSolutionChunk(chunk)
    })

    // Cleanup listeners on unmount
    return () => {
      window.api.removeScreenshotListener()
      window.api.removeSolutionChunkListener()
    }
  }, [setScreenshotData, clearSolution, setIsLoading, addSolutionChunk])

  useEffect(() => {
    window.api.onSolutionComplete(() => {
      setIsLoading(false)
    })
    window.api.onSolutionStopped(() => {
      setIsLoading(false)
    })
    window.api.onSolutionError((message: string) => {
      setIsLoading(false)
      addSolutionChunk(`\n\n> 生成失败：${message}`)
    })
    return () => {
      window.api.removeSolutionCompleteListener()
      window.api.removeSolutionStoppedListener()
      window.api.removeSolutionErrorListener()
    }
  }, [setIsLoading, addSolutionChunk])

  // Mark solution as complete when chunks stop coming
  useEffect(() => {
    if (isLoading && solutionChunks.length > 0) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000) // Wait 1 second after last chunk to mark as complete

      return () => clearTimeout(timer)
    }
    return undefined
  }, [solutionChunks, isLoading, setIsLoading])

  // When run ends (isLoading goes false), ensure code fence is closed
  useEffect(() => {
    if (!isLoading) {
      ensureClosedFence()
    }
  }, [isLoading])

  useEffect(() => {
    window.api.onScrollPageUp(() => {
      const container = document.getElementById('app-content')
      if (!container) return
      container.scrollTo({
        top: container.scrollTop - window.innerHeight + SCROLL_OFFSET,
        behavior: 'smooth'
      })
    })
    return () => {
      window.api.removeScrollPageUpListener()
    }
  }, [])

  useEffect(() => {
    window.api.onScrollPageDown(() => {
      const container = document.getElementById('app-content')
      if (!container) return
      container.scrollTo({
        top: container.scrollTop + window.innerHeight - SCROLL_OFFSET,
        behavior: 'smooth'
      })
    })
    return () => {
      window.api.removeScrollPageDownListener()
    }
  }, [])

  return (
    <div id="app-content" className="px-6 py-4">
      {/* Screenshot Display */}
      {screenshotData ? (
        <div className="mb-4">
          <img
            src={`data:image/png;base64,${screenshotData}`}
            alt="Screenshot"
            className="w-40 h-auto border border-gray-600 rounded-lg shadow-lg"
          />
        </div>
      ) : (
        <ShortcutTip />
      )}

      {/* Solution Display */}
      <MarkdownRenderer>{solutionChunks.join('')}</MarkdownRenderer>
    </div>
  )
}

function ShortcutTip() {
  const { shortcuts } = useShortcutsStore()
  return (
    <div className="flex items-center justify-center h-full text-xl text-gray-400 select-none">
      请按下快捷键
      <ShortcutRenderer
        shortcut={shortcuts.takeScreenshot.key}
        className="mx-1 font-bold text-black"
      />
      抓取屏幕进行分析
    </div>
  )
}
