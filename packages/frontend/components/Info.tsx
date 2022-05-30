import {
    Box,
    Center,
    Flex,
    Text,
    Image,
    Badge,
    Stack,
    useColorModeValue,
    space,
  } from '@chakra-ui/react';
  
  export default function infoCard(land) {
    if (land) {
      console.log(land)
      return (
        <Center py={6}>
          <Stack 
            position="fixed"
            top="100px"
            zIndex={999}
            
            w="90%"
            h="140px"
            borderWidth="1px"
            borderRadius="lg"
            direction={{ base: 'column', md: 'row' }}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            padding={4}>
            <Flex bg="blue.200">
            <Image
                boxSize='100px'
                src={
                  land.url
                }
              />
            <Stack w='100%' ml="20px">
            <Flex w='100%' h='40px' p="5px" justify="space-between" align="flex-end">
              <Text w="80px" fontSize="xl" fontWeight="bold"> {land.name}</Text>
              <Text w="80px" color={useColorModeValue('gray.700', 'gray.400')}> {land.host.substr(0, 6)}</Text>
            </Flex>

            <Flex w='100%' h='40px' p="5px" justify="space-start" align="flex-end">
              <Badge>0xaa</Badge>-<Badge>0xbb</Badge>-<Badge>0xcc</Badge>
            </Flex>
          
            </Stack>     
            </Flex>
          </Stack>
        </Center>
      );
    }
  }