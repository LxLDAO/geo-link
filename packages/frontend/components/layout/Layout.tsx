import { Container, Flex, Link, Text } from '@chakra-ui/react'
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
      <header>
        <Container maxWidth="container.xl">
          <Flex alignItems="center" justifyContent="space-between" py="8">
            <Flex py={[4, null, null, 0]}>
              <NextLink href="/" passHref>
                <Link px="4" py="1">
                  Home
                </Link>
              </NextLink>
              <NextLink href="/graph-example" passHref>
                <Link px="4" py="1">
                  Graph Example
                </Link>
              </NextLink>
            </Flex>
            <ConnectButton showBalance  />
          </Flex>
        </Container>
      </header>
      <main>
        <Container maxWidth="container.xl">{children}</Container>
      </main>
      <footer>
        <Container mt="8" py="8" maxWidth="container.xl">
          <Text>I{"'"}m a empty footer</Text>
        </Container>
      </footer>
    </>
  )
}

export default Layout
