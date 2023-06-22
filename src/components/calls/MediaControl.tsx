'use client'
import { useConference } from '@/contexts/ConferenceContext'
import { Flex, Icon, IconButton } from '@chakra-ui/react'
import {
  MdRecordVoiceOver,
  MdVoiceOverOff,
  MdVideocam,
  MdVideocamOff,
} from 'react-icons/md'

export const MediaControl = () => {
  const {
    isVideoActivated,
    isAudioActivated,
    setIsAudioActivated,
    setIsVideoActivated,
  } = useConference()
  return (
    <Flex alignItems="center">
      <IconButton
        aria-label="Mute my voice"
        onClick={() => setIsAudioActivated(!isAudioActivated)}
        me={2}
        icon={
          <Icon
            as={isAudioActivated ? MdRecordVoiceOver : MdVoiceOverOff}
            color={isAudioActivated ? 'leaf.500' : 'red.500'}
            boxSize="25px"
          />
        }
      ></IconButton>
      <IconButton
        aria-label="Mute my voice"
        onClick={() => setIsVideoActivated(!isVideoActivated)}
        icon={
          <Icon
            as={isVideoActivated ? MdVideocam : MdVideocamOff}
            color={isVideoActivated ? 'leaf.500' : 'red.500'}
            boxSize="25px"
          />
        }
      ></IconButton>
    </Flex>
  )
}
