/* eslint-disable react-hooks/rules-of-hooks */
import {
  Center,
  Flex,
  Text,
  Image,
  Badge,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { formatEther } from '@ethersproject/units'

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}`

export default function InfoCard(land, count): JSX.Element {
  if (land) {
    return (
      <Center
        position="fixed"
        top="100px"
        left={0}
        right={0}
        zIndex={999}
        style={{ left: 0, right: 0 }}
      >
        <Stack
          w="90%"
          h="140px"
          borderWidth="1px"
          borderRadius="lg"
          direction={{ base: 'column', md: 'row' }}
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          padding={4}
        >
          <Flex w="full">
            <Image boxSize="100px" src={land.url} />
            <Stack flex={1} ml="20px" p="5px">
              <Stack spacing={1}>
                <Flex w="100%" justify="space-between" align="center">
                  <Text w="80px" fontSize="xl" fontWeight="bold">
                    {land.name}
                  </Text>
                  <Stack direction="row" display="inline-flex">
                    <Text
                      fontSize="sm"
                      color={useColorModeValue('gray.700', 'gray.400')}
                    >
                      {formatAddress(land.host)}
                    </Text>
                  </Stack>
                </Flex>
                <Text fontSize="sm">{formatEther(land.price)} ether</Text>
              </Stack>

              <Stack direction="row" w="100%" align="flex-end">
                <Text fontSize="sm" fontWeight="bold">
                  Guests: {count}
                </Text>
                {
                  // loop count times
                  Array.from({ length: count }, (_, i) => (
                    <Badge>0xaa</Badge>
                  ))
                }
              </Stack>
            </Stack>
          </Flex>
        </Stack>
      </Center>
    )
  }

  return null
}
