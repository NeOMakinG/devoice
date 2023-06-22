'use client'
import { GridItem } from '@chakra-ui/react'
import { ConversationsList } from '@/components/conversation/ConversationsList'
import { ProfileButton } from '@/components/user/ProfileButton'

export default function App() {
  return (
    <>
      <GridItem p="2" bg="gray.800" area={'lists'} position="relative">
        <ConversationsList />
        <ProfileButton />
      </GridItem>
      <GridItem p="2" bg="gray.700" area={'content'}></GridItem>
    </>
  )
}
