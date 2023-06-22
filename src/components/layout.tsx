'use client'

import { RouteGuard } from '@/components/authentication/RouteGuard'
import theme from '@/config/theme'
import { CSSReset, ColorModeScript, Grid, GridItem } from '@chakra-ui/react'
import { LeftBar } from '@/components/LeftBar'
import { selectUiStore, useUIStore } from '@/store/ui'
import UILoader from '@/components/reusables/UILoader'
import { ComingCall } from '@/components/calls/ComingCall'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isUILoading } = useUIStore(selectUiStore)

  return (
    <>
      <CSSReset />
      {/* 👇 Here's the script */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <UILoader isLoading={isUILoading} />
      <ComingCall />
      <Grid
        templateAreas={`"nav lists content"`}
        gridTemplateColumns={'75px 20% 1fr'}
        h="100vh"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem textAlign="center" h="full" p="2" bg="gray.900" area={'nav'}>
          <LeftBar />
        </GridItem>
        <RouteGuard>{children}</RouteGuard>
      </Grid>
    </>
  )
}
