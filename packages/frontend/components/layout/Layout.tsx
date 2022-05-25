import { Container, Flex, Link, Box } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head, { MetaProps } from './Head'

/**
 * Prop Types
 */
interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

/**
 * Component
 */
const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  return (
    <>
      <Head customMeta={customMeta} />
      <Box as="header" position="fixed" width="100vw" zIndex={10}>
        <Container maxWidth="container.xl">
          <Flex alignItems="center" justifyContent="center" py="8">
            <ConnectButton showBalance />
          </Flex>
        </Container>
      </Box>
      <Box as="main">{children}</Box>
      {/* <footer>
        <Container mt="8" py="8" maxWidth="container.xl">
          <Text>I{"'"}m a empty footer</Text>
        </Container>
      </footer> */}
    </>
  )
}

export default Layout
