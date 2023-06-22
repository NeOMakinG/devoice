'use client'
import { Box, Heading, List, ListItem, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { selectFriendsStore, useFriendsStore } from '@/store/friends'

export const SentRequests: React.FC = () => {
  // const { data } = useContractRead<
  //   typeof lensordAbi.abi,
  //   string,
  //   TFriendRequest[]
  // >({
  //   address: contracts.lensord,
  //   abi: lensordAbi.abi,
  //   functionName: 'getSentFriendRequests',
  //   args: [address],
  // })
  const { sentFriendRequests } = useFriendsStore(selectFriendsStore)

  const hasSentRequests = useMemo(() => {
    return sentFriendRequests?.find((request: any) => !request.data.accepted)
  }, [sentFriendRequests])

  return (
    <Box>
      <Heading as="h3" mb={4} fontSize="18px">
        Sent requests
      </Heading>

      <List>
        {sentFriendRequests?.map((sentRequest: any) => {
          return !sentRequest.data.accepted ? (
            <ListItem my={2} fontSize="14px" key={sentRequest.data.to}>
              To: {sentRequest.data.to} status:
              <Text as={'span'} color="teal" fontWeight="500" ml={2}>
                Not accepted yet
              </Text>
            </ListItem>
          ) : null
        })}
        {!hasSentRequests && (
          <Text fontSize="14px" fontWeight="500" mb={4} color="gray.300">
            No friend requests sent.
          </Text>
        )}
      </List>
    </Box>
  )
}
