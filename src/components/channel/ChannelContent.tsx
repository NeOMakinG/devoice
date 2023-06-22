'use client'
import { ChatIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, Input, Spinner, Text } from '@chakra-ui/react'
import { ConversationItem } from '../conversation/ConversationItem'
import { Conversation, DecodedMessage } from '@xmtp/xmtp-js'
import { useState } from 'react'
import ImagePlaceholder from '../reusables/ImagePlaceholder'

type ContentProps = {
  nickname: string
  messages: DecodedMessage[] | null
  conversations?: Conversation[]
}

export const ChannelContent: React.FC<ContentProps> = ({
  nickname,
  messages,
  conversations,
}) => {
  const [messageToSend, setMessageToSend] = useState<string>()

  const handleSend = async () => {
    if (conversations) {
      try {
        conversations.forEach((conversation) => {
          ;(async () => {
            await conversation.send(messageToSend)
          })()
        })
      } catch (error) {
        console.log(error)
      }
      setMessageToSend('')
    }
  }

  return (
    <Box w="full" position="relative">
      <Flex
        alignItems="center"
        color="gray.400"
        w="full"
        borderBottomWidth="1px"
        borderColor="gray.600"
        justifyContent="space-between"
        pb={2}
      >
        <Flex alignItems="center" justifyContent="flex-start">
          <ImagePlaceholder text={nickname} />
          <Text color="gray.300" fontWeight="600" fontSize="14px">
            {nickname}
          </Text>
        </Flex>
      </Flex>
      <Box p={2} maxHeight="85vh" overflowY="scroll">
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
      </Box>
      <Flex position="fixed" w="73.5%" bottom="10px">
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
      </Flex>
    </Box>
  )
}
