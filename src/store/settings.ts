'use client'
import { create } from 'zustand'

export enum Modes {
  DECENTRALIZED = 'Decentralized',
  CENTRALIZED = 'Centralized',
}

type Settings = {
  mode: Modes
}

export enum SettingsKeys {
  MODE = 'DEVOICE_MODE',
}

type SettingsStoreState = {
  settings: { mode: Modes }
  setSettings: (settings: Partial<Settings>) => void
}

export const selectSettings = (state: SettingsStoreState) => ({
  settings: state.settings,
  setSettings: state.setSettings,
})

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  settings: {
    mode: Modes.CENTRALIZED,
  },
  setSettings: (settings: Partial<Settings>) =>
    set((state) => {
      if (settings.mode) {
        localStorage.setItem(SettingsKeys.MODE, settings.mode)
      }

      return { settings: { ...state.settings, ...settings } }
    }),
}))
