'use client'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { ConversationButton } from './ConversationButton'
import contracts from '@/constants/contracts'
import { Address, useAccount, useContractRead } from 'wagmi'
import mainContract from '@/constants/abis/Lensord.json'
import { FriendsModal } from '../friends/FriendsModal'
import React, { useEffect, useMemo } from 'react'
import { selectFriendsStore, useFriendsStore } from '@/store/friends'
import { Modes, selectSettings, useSettingsStore } from '@/store/settings'
import { useFriends } from '@/hooks/useFriends'

const { abi: lensordAbi } = mainContract

export const ConversationsList: React.FC = () => {
  const { address } = useAccount()
  const { settings } = useSettingsStore(selectSettings)
  const {
    setFriends,
    selectedFriend,
    sentFriendRequests,
    receivedFriendRequests,
  } = useFriendsStore(selectFriendsStore)
  const { getFriends } = useFriends()
  const { data: friends } = useContractRead<
    typeof lensordAbi,
    string,
    Address[]
  >({
    address: contracts.lensord,
    abi: lensordAbi,
    functionName: 'getFriendList',
    enabled: settings.mode && settings.mode === Modes.DECENTRALIZED,
    overrides: {
      from: address,
    },
    onSuccess: (friends: any) => {
      setFriends(friends)
    },
  })

  useEffect(() => {
    if (settings.mode === Modes.CENTRALIZED) {
      getFriends()
    }
    // eslint-disable-next-line
  }, [settings.mode])

  const friendList = useMemo(() => {
    return receivedFriendRequests.length || sentFriendRequests.length
      ? [
          ...receivedFriendRequests.filter((e: any) => e.data.accepted),
          ...sentFriendRequests.filter((e: any) => e.data.accepted),
        ]
      : []
  }, [receivedFriendRequests, sentFriendRequests])

  const hasFriends = useMemo(() => {
    return (
      friends?.find(
        (friend: Address) =>
          friend !== '0x0000000000000000000000000000000000000000'
      ) || friendList.length
    )
  }, [friends, friendList])

  return (
    <Box p="2" position="relative">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        color="gray.400"
        mb={2}
      >
        <Heading as="h5" fontSize="14px" fontWeight="600">
          PRIVATE MESSAGES
        </Heading>
        <FriendsModal />
      </Flex>
      {/* {friends?.map((friend) => {
        if (friend === '0x0000000000000000000000000000000000000000') return null

        return (
          <ConversationButton
            isActive={friend === selectedFriend}
            key={friend}
            nickname={friend}
          />
        )
      })} */}

      {friendList?.map((friend) => {
        return (
          <ConversationButton
            isActive={
              friend.data.from === selectedFriend ||
              friend.data.to === selectedFriend
            }
            lobbyId={friend.data.roomId}
            key={friend}
            nickname={
              friend.data.from !== address ? friend.data.from : friend.data.to
            }
          />
        )
      })}

      {!hasFriends && (
        <Text fontSize="14px" color="gray.300" mt={4}>
          You have no friends for the moment.
        </Text>
      )}
    </Box>
  )
}
