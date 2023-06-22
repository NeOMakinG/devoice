'use client'

import contracts from '@/constants/contracts'
import { useServersStore, selectServersStore } from '@/store/servers'
import { Server } from '@/types/server'
import { useAccount, useContractRead } from 'wagmi'
import lensordAbi from '@/constants/abis/Lensord.json'
import { Modes, selectSettings, useSettingsStore } from '@/store/settings'

type UserServersProps = {
  initialRequests?: boolean
  serverAddress?: string
}

export const useServers = (props?: UserServersProps) => {
  const { address } = useAccount()
  const { settings } = useSettingsStore(selectSettings)
  const { setServers, servers, selectedServer, setSelectedServer } =
    useServersStore(selectServersStore)
  const { refetch } = useContractRead<typeof lensordAbi.abi, string, Server[]>({
    address: contracts.lensord,
    abi: lensordAbi.abi,
    functionName: 'getJoinedServers',
    enabled:
      (props?.initialRequests && settings.mode === Modes.DECENTRALIZED) ??
      false,
    args: [address],
    onSuccess: (data) => {
      setServers(data)
    },
  })
  const { refetch: refetchSpecificServer } = useContractRead<
    typeof lensordAbi.abi,
    string,
    Server
  >({
    address: contracts.lensord,
    abi: lensordAbi.abi,
    functionName: 'getServer',
    overrides: {
      from: address,
    },
    args: [props?.serverAddress],
    enabled: false,
    onSuccess: (data) => {
      setSelectedServer(data)
    },
  })

  const refetchSelectedServer = () => {
    if (!props?.serverAddress) return

    if (settings.mode === Modes.DECENTRALIZED) {
      refetchSpecificServer()
      return
    }
  }

  return {
    servers,
    selectedServer,
    setServers,
    refetchServers: refetch,
    refetchSelectedServer,
    setSelectedServer,
  }
}
