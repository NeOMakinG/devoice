'use client'
/* eslint-disable */
import type { Peer } from 'peerjs'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Address, useAccount } from 'wagmi'
import dynamic from 'next/dynamic'

interface ConnectionContextType {
  peer: Peer | null
  call: any | null
  connect: (id: Address) => void
  callPeer: (id: Address) => void
  closeConnection: () => void
  setIsVideoActivated: (isActivated: boolean) => void
  setIsAudioActivated: (isActivated: boolean) => void
  isAudioActivated: boolean
  isVideoActivated: boolean
  isCallComing: boolean
  setIsCallComing: (isCallComing: boolean) => void
}

const initialState: ConnectionContextType = {
  peer: null,
  call: null,
  isAudioActivated: true,
  isVideoActivated: false,
  connect: () => {},
  callPeer: () => {},
  closeConnection: () => {},
  setIsVideoActivated: () => {},
  setIsAudioActivated: () => {},
  isCallComing: false,
  setIsCallComing: () => {},
}

const ConnectionContext = createContext<ConnectionContextType>(initialState)

const ConnectionProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { address } = useAccount()
  const [peer, setPeer] = useState<Peer | null>(null)
  const [call, setCall] = useState<any | null>(null)
  const [isCallComing, setIsCallComing] = useState<boolean>(false)
  const [isAudioActivated, setIsAudioActivated] = useState<boolean>(true)
  const [isVideoActivated, setIsVideoActivated] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (address) {
        const PeerClient = (await import('peerjs')).default
        const newPeer = new PeerClient(address)
        setPeer(newPeer)

        newPeer.on('call', (call) => {
          setCall(call)
          setIsCallComing(true)
        })
      }
    })()

    return () => {
      if (peer) {
        peer.destroy()
      }
    }
  }, [address])

  const connect = (id: string) => {
    if (peer) {
      const connection = peer.connect(`${id}-lensord`)
    }
  }

  const callPeer = async (id: string) => {
    if (peer && navigator) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoActivated,
        audio: isAudioActivated,
      })
      const call = peer.call(`${id}-lensord`, stream)
      setCall(call)
      // call.on('stream', (remoteStream) => {
      // Show stream in some <video> element.
      // })
    }
  }

  const closeConnection = () => {
    if (call) {
      call.close()
      setCall(null)
    }
  }

  return (
    <ConnectionContext.Provider
      value={{
        peer,
        call,
        connect,
        callPeer,
        closeConnection,
        setIsVideoActivated,
        setIsAudioActivated,
        isAudioActivated,
        isVideoActivated,
        isCallComing,
        setIsCallComing,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

const useConference = () => {
  const conference = useContext(ConnectionContext)
  if (!conference)
    throw new Error('useConference must be used within an ConnectionProvider')
  return conference
}

export { ConnectionContext, ConnectionProvider, useConference }
