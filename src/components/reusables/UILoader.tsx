'use client'
import { Flex, FlexProps, Spinner } from '@chakra-ui/react'

interface UILoaderProps extends FlexProps {
  isLoading: boolean
}

const UILoader: React.FC<UILoaderProps> = ({ isLoading }) => {
  return (
    <Flex
      h="100vh"
      w="100vw"
      justifyContent="center"
      alignItems="center"
      background="blackAlpha.500"
      position="fixed"
      top="0"
      left="0"
      zIndex="999"
      transition=".1s eade-out"
      opacity={isLoading ? '1' : '0'}
      pointerEvents={isLoading ? 'all' : 'none'}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.700"
        color="teal.500"
        size="xl"
      />
    </Flex>
  )
}

export default UILoader
