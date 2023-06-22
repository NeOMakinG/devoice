'use client'
import contracts from '@/constants/contracts'
import { useRouter } from 'next/router'
import { useContractWrite, useContractRead, useAccount } from 'wagmi'
import lensordAbi from '@/constants/abis/Lensord.json'
import { useUIStore, selectUiStore } from '@/store/ui'
import { useEffect } from 'react'
import { Modes, selectSettings, useSettingsStore } from '@/store/settings'
import { useFauna } from './useFauna'

export const useRegister = () => {
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const { setIsLoading } = useUIStore(selectUiStore)
  const { settings } = useSettingsStore(selectSettings)
  const { isCRegistered, registerCUser } = useFauna()
  const { write, data: isRegistered } = useContractWrite({
    address: contracts.lensord,
    abi: lensordAbi.abi,
    functionName: 'registerUser',
    mode: 'recklesslyUnprepared',
    onSuccess: () => {
      setIsLoading(false)
      router.push('/app')
    },
  })
  const { refetch: getIsRegistered, isLoading } = useContractRead({
    address: contracts.lensord,
    abi: lensordAbi.abi,
    functionName: 'isRegistered',
    enabled: false,
    args: [address],
    onSuccess: (data) => {
      if (data) {
        setIsLoading(false)
        router.push('/app')
        return
      }

      write()
    },
  })

  useEffect(() => {
    if (
      isConnected &&
      address &&
      !isLoading &&
      settings.mode === Modes.DECENTRALIZED
    ) {
      getIsRegistered()

      return
    }

    if (isConnected && address && !isLoading) {
      ;(async () => {
        const response = await isCRegistered()

        if (response?.data?.address) {
          setIsLoading(false)
          router.push('/app')

          return
        }

        const createdUser = await registerCUser()

        if (createdUser?.data?.address) {
          setIsLoading(false)
          router.push('/app')
        }
      })()
    }
  }, [
    isConnected,
    address,
    getIsRegistered,
    isLoading,
    settings.mode,
    isCRegistered,
    router,
    setIsLoading,
    registerCUser,
  ])

  return {
    isRegistered,
  }
}
