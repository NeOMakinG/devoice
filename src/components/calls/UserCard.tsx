'use client'
import { Flex } from '@chakra-ui/react'
import { Address } from 'wagmi'

type UserCardProps = {
  username: string | Address
}

export const UserCard: React.FC<UserCardProps> = ({ username }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      background="gray.700"
      p={5}
      height="150px"
      width="300px"
      color="white"
      borderRadius={10}
      boxShadow="0px 0px 10px rgba(255, 255, 255, 0.2)"
    >
      {username}
    </Flex>
  )
}
