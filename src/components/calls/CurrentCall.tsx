'use client'
import { Box, Flex, Icon, IconButton } from '@chakra-ui/react'
import { MdJoinFull, MdPhoneDisabled } from 'react-icons/md'
import { useMeeting } from '@/contexts/HuddleContext'
import { usePeers } from '@huddle01/react/hooks'
import { Audio, Video } from '@huddle01/react/components'
import { useEffect, useRef } from 'react'

export const CurrentCall = () => {
  const { isLobbyJoined, isRoomJoined, joinRoom, leaveRoom, videoStream } =
    useMeeting()
  const { peers } = usePeers()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoStream && videoRef.current)
      videoRef.current.srcObject = videoStream
  }, [videoStream])

  if (!isLobbyJoined && !isRoomJoined) return null

  return (
    <Box textAlign="center" p={5} mx={-2} background="gray.900" w="full">
      <Flex
        justifyContent="space-around"
        alignItems="center"
        flexWrap="wrap"
        mb={6}
      >
        <video ref={videoRef} autoPlay muted></video>
        {Object.values(peers)
          .filter((peer) => peer.cam)
          .map((peer) => (
            <>
              role: {peer.role}
              <Video
                key={peer.peerId}
                peerId={peer.peerId}
                track={peer.cam}
                debug
              />
            </>
          ))}
        {Object.values(peers)
          .filter((peer) => peer.mic)
          .map((peer) => (
            <Audio key={peer.peerId} peerId={peer.peerId} track={peer.mic} />
          ))}
      </Flex>
      {!isRoomJoined && (
        <IconButton
          aria-label="Join room"
          colorScheme="teal"
          borderRadius="full"
          onClick={joinRoom}
          me={8}
          icon={<Icon as={MdJoinFull} color={'gray.700'} boxSize="25px" />}
        ></IconButton>
      )}
      {isRoomJoined && (
        <IconButton
          aria-label="Deny call"
          colorScheme="red"
          borderRadius="full"
          onClick={leaveRoom}
          me={8}
          icon={<Icon as={MdPhoneDisabled} color={'gray.700'} boxSize="25px" />}
        ></IconButton>
      )}
    </Box>
  )
}
