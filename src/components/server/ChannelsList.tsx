'use client'
import { Box, Button } from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/router'
import { selectServersStore, useServersStore } from '@/store/servers'

type ConversationsListProps = {
  activeChannel?: number
}

export const ChannelsList: React.FC<ConversationsListProps> = ({
  activeChannel,
}) => {
  const router = useRouter()
  const { selectedServer } = useServersStore(selectServersStore)

  if (!selectedServer) return null

  return (
    <Box position="relative">
      {selectedServer?.channels?.map((channel) => (
        <Button
          size="sm"
          width="full"
          key={channel.id}
          color="white"
          fontSize="14px"
          justifyContent="flex-start"
          variant="ghost"
          isActive={activeChannel === channel.id}
          onClick={() =>
            router.push(`/server/${selectedServer.id}/${channel.id}`)
          }
        >
          # {channel.name}
        </Button>
      ))}
    </Box>
  )
}
