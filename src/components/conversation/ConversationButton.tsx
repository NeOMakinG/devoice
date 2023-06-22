'use client'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Address, useEnsName } from 'wagmi'
import ImagePlaceholder from '../reusables/ImagePlaceholder'
import { useUIStore, selectUiStore } from '@/store/ui'
import { useFriends } from '@/hooks/useFriends'

type ConversationButtonProps = {
  nickname: Address
  lobbyId: string
  isActive?: boolean
}

export const ConversationButton: React.FC<ConversationButtonProps> = ({
  nickname,
  isActive,
  lobbyId,
}) => {
  const router = useRouter()
  const { data } = useEnsName({
    address: nickname,
  })
  const { setIsLoading } = useUIStore(selectUiStore)
  const { setSelectedFriendLobby } = useFriends()

  const handleClick = () => {
    setIsLoading(true)
    setSelectedFriendLobby(lobbyId)
    router.push(`/user/${nickname}`)
    setIsLoading(false)
  }

  return (
    <Box m="auto" onClick={handleClick}>
      <Flex
        as={Button}
        alignItems="center"
        justifyContent="flex-start"
        color="gray.400"
        bg={isActive ? 'gray.700' : 'transparent'}
        p="10px"
        mx="-10px"
        w="calc(100% + 20px)"
        my={2}
      >
        <ImagePlaceholder text={data ?? nickname} />
        <Text
          color="gray.300"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          fontWeight="600"
          fontSize="14px"
        >
          {data ?? nickname}
        </Text>
      </Flex>
    </Box>
  )
}
