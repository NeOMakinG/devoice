'use client'
import { Flex, GridItem, Heading } from '@chakra-ui/react'
import { ProfileButton } from '@/components/user/ProfileButton'
import { Address, useAccount } from 'wagmi'
import { Server } from '@/types/server'
import { ChannelsList } from '@/components/server/ChannelsList'
import { useXMTP } from '@/contexts/XmtpContext'
import { DecodedMessage, Conversation, Client } from '@xmtp/xmtp-js'
import { useState, useEffect, useMemo } from 'react'
import { ChannelContent } from '@/components/channel/ChannelContent'
import { AddChannelModal } from '@/components/server/AddChannelModal'
import { selectServersStore, useServersStore } from '@/store/servers'
import { useRouter } from 'next/router'

export default function Server() {
  const router = useRouter()
  const params = router.query as unknown as {
    address: Address
    owner: Address
    channel: number
  }
  const { address } = useAccount()
  const { selectedServer } = useServersStore(selectServersStore)
  const [initialMessages, setInitialMessages] = useState<DecodedMessage[]>()
  const [messages, setMessages] = useState<DecodedMessage[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const { xmtp } = useXMTP()

  useEffect(() => {
    ;(async () => {
      if (xmtp && selectedServer) {
        const broadcasts_canMessage = await Client.canMessage(
          selectedServer.members
        )
        let storeMessages: Array<DecodedMessage> = []
        let storeConversations: Array<Conversation> = []

        for (let i = 0; i < selectedServer.members.length; i++) {
          const wallet = selectedServer.members[i]
          const canMessage = broadcasts_canMessage[i] && wallet !== address
          if (canMessage) {
            const conversation = await xmtp.conversations.newConversation(
              wallet,
              {
                conversationId: `lensord.io/${params.address}/${params.channel}`,
                metadata: {
                  title: params.channel.toString(),
                },
              }
            )
            const defaultMessages = await conversation.messages()
            storeMessages = [...storeMessages, ...defaultMessages]

            storeConversations = [...conversations, conversation]
          }
        }

        setInitialMessages(storeMessages)
        setConversations(storeConversations)
      }
    })()
    // eslint-disable-next-line
  }, [xmtp, selectedServer, address])

  useEffect(() => {
    ;(async () => {
      if (conversations) {
        conversations.forEach((conversation) => {
          ;(async () => {
            for await (const message of await conversation.streamMessages()) {
              setMessages([...messages, message])
            }
          })()
        })
      }
    })()
  }, [messages, xmtp, params.address, setMessages, conversations])

  const currentChannelName = useMemo(() => {
    return selectedServer?.channels.find(
      (channel) => channel.id == params.channel
    )?.name
  }, [params.channel, selectedServer])

  if (!selectedServer) return null

  return (
    <>
      <GridItem p="2" px="2" bg="gray.800" area={'lists'} position="relative">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          color="gray.400"
          mb={2}
          p={2}
        >
          <Heading as="h5" fontSize="14px" fontWeight="600">
            {selectedServer.name}
          </Heading>
          <AddChannelModal />
        </Flex>
        <ChannelsList activeChannel={params.channel} />
        <ProfileButton />
      </GridItem>
      <GridItem p="2" bg="gray.700" area={'content'}>
        <ChannelContent
          conversations={conversations}
          nickname={currentChannelName ?? ''}
          messages={initialMessages ? [...initialMessages, ...messages] : null}
        />
      </GridItem>
    </>
  )
}
