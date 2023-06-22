'use client'
import { useConference } from '@/contexts/ConferenceContext'
import { Box, Flex, Icon, IconButton, Text } from '@chakra-ui/react'
import { MdPhone, MdPhoneDisabled } from 'react-icons/md'

export const ComingCall = () => {
  const { isCallComing } = useConference()

  if (!isCallComing) return null

  return (
    <Box
      textAlign="center"
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      background="gray.900"
      p={10}
      borderRadius={10}
    >
      <Text fontWeight="bold">John Doe is calling you.</Text>
      <Flex justifyContent="center" alignItems="center" mt={4}>
        <IconButton
          aria-label="Deny call"
          colorScheme="red"
          me={8}
          icon={<Icon as={MdPhoneDisabled} color={'gray.700'} boxSize="25px" />}
        ></IconButton>
        <IconButton
          aria-label="Deny call"
          colorScheme="green"
          icon={<Icon as={MdPhone} color={'gray.700'} boxSize="25px" />}
        ></IconButton>
      </Flex>
    </Box>
  )
}
