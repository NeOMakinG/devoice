'use client'
import { Box, Divider, Grid, GridItem } from '@chakra-ui/react'
import { ServerIcon } from './ServerIcon'
import { useAccount } from 'wagmi'
import { Server } from '@/types/server'
import { AddServerModal } from './server/AddServerModal'
import { useServers } from '@/hooks/useServers'
import { SettingsModal } from './settings/SettingsModal'

export const LeftBar = () => {
  const { address } = useAccount()
  const { servers } = useServers({ initialRequests: true })

  return (
    <Grid
      templateAreas={`"home"
      "servers"
      "options"
      `}
      gridTemplateRows={'90px 1fr 50px'}
      h="calc(100vh - 16px)"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem area={'home'}>
        <ServerIcon colorScheme="teal" m="0" position="relative">
          <Box p="3" fontSize="8" fontWeight="bold">
            Devoice
          </Box>
        </ServerIcon>
        <Divider
          height="1px"
          bg="whiteAlpha.400"
          width="60%"
          mx="auto"
          my={3}
        />
      </GridItem>
      <GridItem
        area={'servers'}
        position="relative"
        overflow="hidden"
        py={2}
        overflowY="scroll"
      >
        {address && (
          <>
            {servers?.map((server: Server, key: number) => (
              <ServerIcon server={server} key={key}></ServerIcon>
            ))}
            <AddServerModal />
          </>
        )}
      </GridItem>
      <GridItem area={'options'}>
        <SettingsModal />
      </GridItem>
    </Grid>
  )
}
