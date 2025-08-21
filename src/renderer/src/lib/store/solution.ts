import { create } from 'zustand'

interface SolutionState {
  isLoading: boolean
  solutionChunks: string[]
  screenshotData: string | null
}

interface SolutionStore extends SolutionState {
  setIsLoading: (isReceiving: boolean) => void
  addSolutionChunk: (chunk: string) => void
  setSolutionChunks: (chunks: string[]) => void
  setScreenshotData: (data: string | null) => void
  clearSolution: () => void
  resetState: () => void
}

const defaultState: SolutionState = {
  isLoading: false,
  solutionChunks: [],
  screenshotData: null
}

export const useSolutionStore = create<SolutionStore>()((set) => ({
  ...defaultState,
  setIsLoading: (isReceiving) => {
    set({ isLoading: isReceiving })
  },
  addSolutionChunk: (chunk) => {
    set((state) => ({
      solutionChunks: [...state.solutionChunks, chunk]
    }))
  },
  setSolutionChunks: (chunks) => {
    set({ solutionChunks: chunks })
  },
  setScreenshotData: (data) => {
    set({ screenshotData: data })
  },
  clearSolution: () => {
    set({ solutionChunks: [], isLoading: false })
  },
  resetState: () => {
    set(defaultState)
  }
}))
