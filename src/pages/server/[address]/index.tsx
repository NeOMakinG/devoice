'use client'
import { Flex, GridItem, Heading } from '@chakra-ui/react'
import { ProfileButton } from '@/components/user/ProfileButton'
import { Address } from 'wagmi'
import { Server } from '@/types/server'
import { ChannelsList } from '@/components/server/ChannelsList'
import { AddChannelModal } from '@/components/server/AddChannelModal'
import { useRouter } from 'next/router'
import { useServers } from '@/hooks/useServers'
import { useEffect } from 'react'
import { Modes, selectSettings, useSettingsStore } from '@/store/settings'
import { useFauna } from '@/hooks/useFauna'

export default function Server() {
  const router = useRouter()
  const params = router.query as { address: Address; owner: Address }
  const { getSpecificServer } = useFauna()
  const { settings } = useSettingsStore(selectSettings)
  const { selectedServer, refetchSelectedServer } = useServers({
    serverAddress: params.address,
  })

  useEffect(() => {
    if (settings.mode === Modes.DECENTRALIZED) {
      refetchSelectedServer()
      return
    }

    getSpecificServer(params.address)
  }, [refetchSelectedServer, getSpecificServer, settings.mode, params.address])

  if (!selectedServer) return

  return (
    <>
      <GridItem p="2" px="2" bg="gray.800" area={'lists'} position="relative">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          color="gray.400"
          mb={2}
          p={2}
        >
          <Heading as="h5" fontSize="14px" fontWeight="600">
            {selectedServer.name}
          </Heading>
          <AddChannelModal />
        </Flex>
        <ChannelsList />
        <ProfileButton />
      </GridItem>
      <GridItem p="2" bg="gray.700" area={'content'}></GridItem>
    </>
  )
}
