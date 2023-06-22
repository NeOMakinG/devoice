'use client'
import { ChatIcon, PhoneIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { ConversationItem } from './ConversationItem'
import { Conversation, DecodedMessage } from '@xmtp/xmtp-js'
import { useState } from 'react'
import ImagePlaceholder from '../reusables/ImagePlaceholder'
import { selectFriendsStore, useFriendsStore } from '@/store/friends'
import { CurrentCall } from '../calls/CurrentCall'
import { useMeeting } from '@/contexts/HuddleContext'

type ContentProps = {
  messages: DecodedMessage[] | null
  conversation?: Conversation
}

export const Content: React.FC<ContentProps> = ({ messages, conversation }) => {
  const [messageToSend, setMessageToSend] = useState<string>()
  const { selectedFriend, selectedFriendLobby } =
    useFriendsStore(selectFriendsStore)
  const { joinLobby, isLobbyJoined, isRoomJoined } = useMeeting()

  const handleSend = async () => {
    if (conversation) {
      try {
        await conversation.send(messageToSend)
      } catch (error) {
        console.log(error)
      }
      setMessageToSend('')
    }
  }

  const handleCall = async () => {
    await joinLobby(selectedFriendLobby)
  }

  return (
    <Grid
      templateAreas={
        isLobbyJoined || isRoomJoined
          ? `"header"
      "call"
      "messages"
      "send"
      `
          : `"header"
      "messages"
      "send"
      `
      }
      gridTemplateRows={
        !isLobbyJoined && !isRoomJoined ? '50px 1fr 60px' : '50px 1fr 1fr 60px'
      }
      h="calc(100vh - 16px)"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem
        display="flex"
        alignItems="center"
        color="gray.400"
        w="full"
        borderBottomWidth="1px"
        borderColor="gray.600"
        justifyContent="space-between"
        pb={2}
        area={'header'}
      >
        <Flex alignItems="center" justifyContent="flex-start">
          <ImagePlaceholder text={selectedFriend} />
          <Text color="gray.300" fontWeight="600" fontSize="14px">
            {selectedFriend}
          </Text>
        </Flex>

        <IconButton
          aria-label="call"
          icon={<PhoneIcon />}
          color="gray.300"
          onClick={handleCall}
          m={0}
        />
      </GridItem>
      {(isLobbyJoined || isRoomJoined) && (
        <GridItem
          display="flex"
          alignItems="center"
          color="gray.400"
          w="calc(100% + 16px)"
          justifyContent="space-between"
          area={'call'}
        >
          <CurrentCall />
        </GridItem>
      )}
      <GridItem
        p={2}
        alignItems="center"
        color="gray.400"
        w="full"
        justifyContent="space-between"
        h="100%"
        pb={2}
        overflowY="scroll"
        area={'messages'}
      >
        {messages ? (
          <>
            {messages.map((message) => (
              <ConversationItem
                key={message.id}
                date={message.sent}
                nickname={message.senderAddress}
                message={message.content}
              />
            ))}
            {!messages.length && (
              <Text color="gray.200" fontSize="14" mt={4}>
                No messages yet.
              </Text>
            )}
          </>
        ) : (
          <Box textAlign="center" py={10} w="full">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.700"
              color="teal.500"
              size="xl"
            />
          </Box>
        )}
      </GridItem>
      <GridItem
        display="flex"
        p={2}
        alignItems="center"
        color="gray.400"
        w="full"
        justifyContent="space-between"
        pb={2}
        overflowY="scroll"
        area={'send'}
      >
        <Input
          placeholder="Type a message"
          value={messageToSend}
          color="gray.300"
          onChange={(e) => setMessageToSend(e.target.value)}
          me={2}
        />
        <IconButton
          aria-label="Send message"
          colorScheme="teal"
          icon={<ChatIcon />}
          onClick={handleSend}
        />
      </GridItem>
    </Grid>
  )
}
