'use client'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react'
import { Client } from '@xmtp/xmtp-js'
import { useAccount } from 'wagmi'

const XMTPContext = createContext<{ xmtp: Client | undefined }>({
  xmtp: undefined,
})

export const XMTPProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [xmtp, setXmtp] = useState<Client>()
  const { connector } = useAccount()

  useEffect(() => {
    ;(async () => {
      if (connector) {
        const signer = await connector.getSigner()
        const initXmtp = await Client.create(signer, { env: 'dev' })
        setXmtp(initXmtp)
      }
    })()
  }, [connector])

  return (
    <XMTPContext.Provider value={{ xmtp }}>{children}</XMTPContext.Provider>
  )
}

export const useXMTP = () => {
  const { xmtp } = useContext(XMTPContext)
  if (!xmtp) throw new Error('useXMTP must be used within an XMTPProvider')
  return { xmtp }
}
