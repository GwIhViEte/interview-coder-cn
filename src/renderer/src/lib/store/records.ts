import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type QARecord = {
  id: string
  timestamp: number
  screenshotData: string | null
  content: string
}

interface RecordsState {
  records: QARecord[]
}

interface RecordsStore extends RecordsState {
  addRecord: (record: Omit<QARecord, 'id' | 'timestamp'>) => void
  clearRecords: () => void
}

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const useRecordsStore = create<RecordsStore>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) => {
        set((state) => ({
          records: [
            {
              id: makeId(),
              timestamp: Date.now(),
              ...record
            },
            ...state.records
          ]
        }))
      },
      clearRecords: () => set({ records: [] })
    }),
    {
      name: 'interview-coder-records',
      version: 1
    }
  )
)
