import { Pointer, PointerOff, Square } from 'lucide-react'
import { useSolutionStore } from '@/lib/store/solution'
import { useShortcutsStore } from '@/lib/store/shortcuts'
import { useAppStore } from '@/lib/store/app'
import ShortcutRenderer from '@/components/ShortcutRenderer'
import { Button } from '@/components/ui/button'

export function AppStatusBar() {
  const { isLoading: isReceivingSolution, setIsLoading } = useSolutionStore()
  const { ignoreMouse } = useAppStore()
  const { shortcuts } = useShortcutsStore()

  const handleStop = () => {
    setIsLoading(false)
    void window.api.stopSolutionStream()
  }

  return (
    <div className="absolute bottom-0 flex items-center justify-between w-full text-blue-100 bg-gray-600/10 px-4 pb-1">
      <div>
        {isReceivingSolution && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-[currentColor]"></div>
            <span className="text-sm">正在生成...</span>
            <Button
              variant="secondary"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleStop}
            >
              <Square className="w-3 h-3 mr-1" />
              停止生成
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4 select-none">
        {/* Mouse Status Indicator */}
        <div className="flex items-center">
          {ignoreMouse ? (
            <>
              <PointerOff className="w-4 h-4 mr-2" />
              <span className="text-xs">
                取消鼠标透传
                <ShortcutRenderer
                  shortcut={shortcuts.ignoreOrEnableMouse.key}
                  className="inline-block scale-75 text-xs border border-current bg-transparent py-0 px-1"
                />
              </span>
            </>
          ) : (
            <Pointer className="w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  )
}
