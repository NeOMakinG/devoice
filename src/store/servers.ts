'use client'
import { Server } from '@/types/server'
import { create } from 'zustand'

type ServersStoreState = {
  servers: Server[]
  selectedServer: Server | null
  selectedChannel: number | string | null
  setServers: (servers: Server[]) => void
  setSelectedServer: (server: Server) => void
  setSelectedChannel: (channel: number | string | null) => void
}

export const selectServersStore = (state: ServersStoreState) => ({
  servers: state.servers,
  selectedServer: state.selectedServer,
  selectedChannel: state.selectedChannel,
  setServers: state.setServers,
  setSelectedServer: state.setSelectedServer,
  setSelectedChannel: state.setSelectedChannel,
})

export const useServersStore = create<ServersStoreState>((set) => ({
  servers: [],
  selectedServer: null,
  selectedChannel: null,
  setServers: (servers: Server[]) => set(() => ({ servers })),
  setSelectedServer: (server: Server) =>
    set(() => ({ selectedServer: server })),
  setSelectedChannel: (channel: number | string | null) =>
    set(() => ({ selectedChannel: channel })),
}))
