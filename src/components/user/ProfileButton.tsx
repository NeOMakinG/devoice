'use client'
import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'
import ImagePlaceholder from '../reusables/ImagePlaceholder'
import { MediaControl } from '../calls/MediaControl'

export const ProfileButton: React.FC = () => {
  const { address } = useAccount()
  const { data } = useEnsName({
    address,
  })
  const { data: ensAvatar } = useEnsAvatar({
    address,
  })

  return (
    <Flex
      alignItems="center"
      position="absolute"
      bottom="0"
      width="100%"
      color="gray.300"
      background="whiteAlpha.100"
      left="0"
      padding={3}
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        {ensAvatar ? (
          <Image
            borderRadius="full"
            boxSize="50px"
            alt="Avatar"
            me={2}
            src={ensAvatar}
          />
        ) : (
          <ImagePlaceholder text={address ?? ''} />
        )}
        <Box width="full">
          {data && (
            <Heading as="h4" fontSize="12px">
              {data}
            </Heading>
          )}
          <Text
            textOverflow="ellipsis"
            maxWidth="125px"
            overflow="hidden"
            whiteSpace="nowrap"
            fontSize="12px"
          >
            {address}
          </Text>
        </Box>
      </Flex>
      <MediaControl />
    </Flex>
  )
}
