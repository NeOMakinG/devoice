'use client'
import { Flex, FlexProps, Text } from '@chakra-ui/react'
import { Address } from 'wagmi'

interface ImagePlaceholderProps extends FlexProps {
  text: string | Address | null
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  text,
  ...props
}) => {
  return (
    <Flex
      h="30px"
      w="30px"
      minHeight="30px"
      minWidth="30px"
      borderRadius="full"
      justifyContent="center"
      fontSize="8px"
      background="teal.700"
      alignItems="center"
      mr={2}
      p={1}
      {...props}
    >
      <Text
        width="100%"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
      >
        {text?.replace('0x', '')}
      </Text>
    </Flex>
  )
}

export default ImagePlaceholder
