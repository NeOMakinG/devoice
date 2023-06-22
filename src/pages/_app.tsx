'use client'
import { LensConfig, production, LensProvider } from '@lens-protocol/react-web'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import * as lensWagmi from '@lens-protocol/wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { RouteGuard } from '@/components/authentication/RouteGuard'
import theme from '@/config/theme'
import { ChakraProvider } from '@chakra-ui/react'
import { XMTPProvider } from '@/contexts/XmtpContext'
import { ConnectionProvider } from '@/contexts/ConferenceContext'
import { AppComponent } from 'next/dist/shared/lib/router/router'
import Layout from '@/components/layout'
import { useEffect } from 'react'
import {
  Modes,
  SettingsKeys,
  selectSettings,
  useSettingsStore,
} from '@/store/settings'
import { useHuddle01 } from '@huddle01/react'
import { MeetingProvider } from '@/contexts/HuddleContext'

const lensConfig: LensConfig = {
  bindings: lensWagmi.bindings(),
  environment: production,
}

const { provider, webSocketProvider } = configureChains(
  // [hardhat],
  [polygonMumbai],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

const MyApp: AppComponent = ({ Component, pageProps }) => {
  const { setSettings, settings } = useSettingsStore(selectSettings)
  const { initialize } = useHuddle01()

  useEffect(() => {
    if (process.env.HUDDLE_PROJECT_ID) {
      initialize(process.env.HUDDLE_PROJECT_ID)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const mode = localStorage.getItem(SettingsKeys.MODE) as Modes

    if (mode && mode !== settings.mode) {
      setSettings({ mode })
    }
  }, [setSettings, settings])

  return (
    <WagmiConfig client={client}>
      <LensProvider config={lensConfig}>
        <XMTPProvider>
          <ChakraProvider theme={theme}>
            <ConnectionProvider>
              <MeetingProvider>
                <Layout>
                  <RouteGuard>
                    <Component {...pageProps} />
                  </RouteGuard>
                </Layout>
              </MeetingProvider>
            </ConnectionProvider>
          </ChakraProvider>
        </XMTPProvider>
      </LensProvider>
    </WagmiConfig>
  )
}

export default MyApp
