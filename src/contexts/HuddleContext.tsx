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
import { useAudio, useLobby, useRoom, useVideo } from '@huddle01/react/hooks'
import { useConference } from './ConferenceContext'

interface ConnectionContextType {
  isCallComing: boolean
  setIsCallComing: (isCallComing: boolean) => void
  joinLobby: any
  isLobbyJoined: boolean
  joinRoom: any
  isRoomJoined: boolean
  leaveRoom: any
  leaveLobby: any
  videoStream: any
}

const initialState: ConnectionContextType = {
  isCallComing: false,
  setIsCallComing: () => {},
  joinLobby: () => {},
  isLobbyJoined: false,
  joinRoom: () => {},
  isRoomJoined: false,
  leaveRoom: () => {},
  leaveLobby: () => {},
  videoStream: undefined,
}

const MeetingContext = createContext<ConnectionContextType>(initialState)

const MeetingProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { address } = useAccount()
  const [isCallComing, setIsCallComing] = useState<boolean>(false)
  const { joinLobby, isLobbyJoined, leaveLobby } = useLobby()
  const { joinRoom, isRoomJoined, leaveRoom } = useRoom()
  const { isAudioActivated, isVideoActivated } = useConference()
  const {
    fetchAudioStream,
    produceAudio,
    stopProducingAudio,
    stopAudioStream,
    isProducing,
    stream,
    error,
  } = useAudio()
  const {
    fetchVideoStream,
    stopVideoStream,
    produceVideo,
    isProducing: isVideoProducting,
    stream: videoStream,
    error: videoError,
    stopProducingVideo,
  } = useVideo()

  useEffect(() => {
    if (isLobbyJoined) {
      fetchAudioStream()
      fetchVideoStream()
    }
  }, [isLobbyJoined])

  useEffect(() => {
    if (isAudioActivated) {
      produceAudio(stream)
    } else {
      stopProducingAudio()
    }

    if (isVideoActivated) {
      produceVideo(videoStream)
    } else {
      stopProducingVideo()
    }
  }, [isRoomJoined, isAudioActivated, isVideoActivated])

  return (
    <MeetingContext.Provider
      value={{
        isCallComing,
        setIsCallComing,
        joinLobby,
        isLobbyJoined,
        joinRoom,
        isRoomJoined,
        leaveRoom,
        leaveLobby,
        videoStream,
      }}
    >
      {children}
    </MeetingContext.Provider>
  )
}

const useMeeting = () => {
  const conference = useContext(MeetingContext)
  if (!conference)
    throw new Error('useConference must be used within an ConnectionProvider')
  return conference
}

export { MeetingContext, MeetingProvider, useMeeting }
