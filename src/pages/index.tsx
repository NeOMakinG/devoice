'use client'

import { Button } from '@chakra-ui/react'
import { useConnect } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { useUIStore, selectUiStore } from '@/store/ui'
import { useRegister } from '@/hooks/useRegister'

const connector = new MetaMaskConnector({
  //chains: [hardhat],
  chains: [polygonMumbai],
})

export default function Home() {
  const { connect } = useConnect()
  const { setIsLoading } = useUIStore(selectUiStore)
  useRegister()

  const handleConnect = () => {
    setIsLoading(true)
    connect({ connector })
  }

  return (
    <div className="p-20">
      <Button onClick={handleConnect}>Connect</Button>
    </div>
  )
}
