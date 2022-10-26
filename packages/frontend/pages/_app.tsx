import '@rainbow-me/rainbowkit/styles.css'
import { ApolloProvider } from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'
import {
  RainbowKitProvider,
  apiProvider,
  getDefaultWallets,
  configureChains,
  lightTheme,
} from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import React from 'react'
import { chain, createClient, WagmiConfig } from 'wagmi'
import { useApollo } from '../lib/apolloClient'

export const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID

const { chains, provider } = configureChains(
  [chain.mainnet, chain.kovan, chain.rinkeby, chain.ropsten, chain.goerli],
  [
    apiProvider.alchemy(process.env.NEXT_PUBLIC_ALCHEMY_ID),
    apiProvider.fallback(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Geo Link',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps)
  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig client={wagmiClient}>
        <ChakraProvider>
          <RainbowKitProvider
            chains={chains}
            theme={lightTheme({
              borderRadius: 'large',
            })}
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </ChakraProvider>
      </WagmiConfig>
    </ApolloProvider>
  )
}

export default MyApp
