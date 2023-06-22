'use client'
import { Box, Flex, Text } from '@chakra-ui/react'
import ImagePlaceholder from '../reusables/ImagePlaceholder'

type ConversationButtonProps = {
  nickname: string
  date?: Date
  message: string
}

export const ConversationItem: React.FC<ConversationButtonProps> = ({
  nickname,
  date,
  message,
}) => {
  return (
    <Box m="auto">
      <Flex
        alignItems="center"
        justifyContent="flex-start"
        color="gray.400"
        w="full"
        my={4}
      >
        <ImagePlaceholder text={nickname} />
        <Box>
          <Flex alignItems={'center'}>
            <Text color="gray.100" fontWeight="600" fontSize="14px" me={2}>
              {nickname}
            </Text>
            {date && (
              <Text color="gray.500" fontWeight="500" fontSize="12px">
                {date.toUTCString()}
              </Text>
            )}
          </Flex>
          <Text color="gray.200" fontSize="13px" fontWeight="500">
            {message}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
