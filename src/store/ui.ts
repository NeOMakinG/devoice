'use client'
import { create } from 'zustand'

type UIStoreState = {
  isUILoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const selectUiStore = (state: UIStoreState) => ({
  isUILoading: state.isUILoading,
  setIsLoading: state.setIsLoading,
})

export const useUIStore = create<UIStoreState>((set) => ({
  isUILoading: false,
  setIsLoading: (isLoading: boolean) => set(() => ({ isUILoading: isLoading })),
}))
