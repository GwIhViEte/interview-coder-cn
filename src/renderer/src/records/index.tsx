import { Link } from 'react-router'
import { ArrowLeft, Clock, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { useRecordsStore } from '@/lib/store/records'

export default function RecordsPage() {
  const { records, clearRecords } = useRecordsStore()

  const handleClear = () => {
    if (records.length === 0) return
    const ok = window.confirm('确定要清空所有问答记录吗？此操作不可恢复。')
    if (ok) {
      clearRecords()
    }
  }

  return (
    <>
      {/* Header */}
      <div id="app-header" className="flex items-center">
        <div className="actions flex items-center">
          <Button variant="ghost" asChild size="icon" className="w-12 mr-2 rounded-none">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        <h1 className="flex-1 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          问答记录
        </h1>
        <div className="actions">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClear}
            disabled={records.length === 0}
            className="h-7"
          >
            <Trash2 className="w-4 h-4" /> 清空记录
          </Button>
        </div>
      </div>

      {/* Content */}
      <div id="app-content" className="p-6 space-y-4">
        {records.length === 0 ? (
          <div className="text-center text-gray-500 py-12">暂无记录</div>
        ) : (
          <div className="flex flex-col gap-4">
            {records.map((r) => (
              <div
                key={r.id}
                className="bg-gray-300/80 rounded-lg p-4 text-gray-900 overflow-hidden"
              >
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div>{new Date(r.timestamp).toLocaleString()}</div>
                </div>
                {r.screenshotData && (
                  <img
                    src={`data:image/png;base64,${r.screenshotData}`}
                    alt="Screenshot"
                    className="w-40 h-auto border border-gray-400 rounded-md shadow mb-3"
                  />
                )}
                <div className="bg-gray-900/95 text-white rounded-md p-3">
                  <MarkdownRenderer>{r.content}</MarkdownRenderer>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
