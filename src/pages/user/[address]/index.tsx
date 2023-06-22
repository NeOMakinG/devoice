'use client'
import { GridItem } from '@chakra-ui/react'
import { ConversationsList } from '@/components/conversation/ConversationsList'
import { Content } from '@/components/conversation/Content'
import { ProfileButton } from '@/components/user/ProfileButton'
import { Address } from 'wagmi'
import { Conversation, DecodedMessage } from '@xmtp/xmtp-js'
import { useEffect, useState } from 'react'
import { useXMTP } from '@/contexts/XmtpContext'
import { selectFriendsStore, useFriendsStore } from '@/store/friends'
import { useRouter } from 'next/router'

export default function User() {
  const router = useRouter()
  const params = router.query as { address: Address }
  const [initialMessages, setInitialMessages] = useState<DecodedMessage[]>()
  const [messages, setMessages] = useState<DecodedMessage[]>([])
  const [conversation, setConversation] = useState<Conversation>()
  const { xmtp } = useXMTP()
  const { setSelectedFriend } = useFriendsStore(selectFriendsStore)

  useEffect(() => {
    setSelectedFriend(params.address)
    ;(async () => {
      if (xmtp) {
        const defaultConversation = await xmtp.conversations.newConversation(
          params.address
        )

        setConversation(defaultConversation)

        const defaultMessages = await defaultConversation.messages()
        setInitialMessages(defaultMessages)
      }
    })()
  }, [xmtp, params.address, setConversation, setSelectedFriend])

  useEffect(() => {
    ;(async () => {
      if (conversation) {
        for await (const message of await conversation.streamMessages()) {
          setMessages([...messages, message])
        }
      }
    })()
  }, [messages, xmtp, params.address, setMessages, conversation])

  return (
    <>
      <GridItem p="2" bg="gray.800" area={'lists'} position="relative">
        <ConversationsList />
        <ProfileButton />
      </GridItem>
      <GridItem p="2" bg="gray.700" area={'content'}>
        <Content
          conversation={conversation}
          messages={initialMessages ? [...initialMessages, ...messages] : null}
        />
      </GridItem>
    </>
  )
}
