'use client'
import contracts from '@/constants/contracts'
import { Box, Heading, List, ListItem, Text, Button } from '@chakra-ui/react'
import { Address, useContractWrite } from 'wagmi'
import lensordAbi from '@/constants/abis/Lensord.json'
import { useFriends } from '@/hooks/useFriends'
import { Modes, selectSettings, useSettingsStore } from '@/store/settings'
import { useMemo } from 'react'

export const ReceivedRequests: React.FC = () => {
  const { settings } = useSettingsStore(selectSettings)
  const {
    receivedFriendRequests,
    getFriendsRequests,
    getFriends,
    handleAcceptFriend,
  } = useFriends({ initialRequests: true })
  const { write } = useContractWrite({
    address: contracts.lensord,
    abi: lensordAbi.abi,
    functionName: 'acceptFriendRequest',
    mode: 'recklesslyUnprepared',
    onSuccess: () => {
      getFriends()
      setTimeout(getFriendsRequests, 4000)
    },
  })

  const handleAccept = async (peerAddress: Address, ref: string) => {
    if (settings.mode === Modes.DECENTRALIZED) {
      write({ recklesslySetUnpreparedArgs: [peerAddress] })

      return
    }

    await handleAcceptFriend(ref)
    getFriends()
    setTimeout(getFriendsRequests, 4000)
  }

  const hasReceivedRequests = useMemo(() => {
    return receivedFriendRequests?.find(
      (request: any) => !request.data.accepted
    )
  }, [receivedFriendRequests])

  return (
    <Box mb={10}>
      <Heading as="h3" mb={4} fontSize="18px">
        Received requests
      </Heading>

      <List>
        {receivedFriendRequests?.map((receivedRequest: any) => {
          return !receivedRequest.data.accepted ? (
            <ListItem my={2} fontSize="14px" key={receivedRequest.data.from}>
              To: {receivedRequest.data.from} status:
              {/* <Button colorScheme="red" mx={2} size="sm">
                Refuse
              </Button> */}
              <Button
                colorScheme="green"
                onClick={() =>
                  handleAccept(receivedRequest, receivedRequest.ref.value.id)
                }
                mx={2}
                size="sm"
              >
                Accept
              </Button>
            </ListItem>
          ) : null
        })}
        {!hasReceivedRequests && (
          <Text fontSize="14px" fontWeight="500" mb={4} color="gray.300">
            No friend requests received.
          </Text>
        )}
      </List>
    </Box>
  )
}
