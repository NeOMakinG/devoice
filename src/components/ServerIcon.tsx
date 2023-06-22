'use client'
import { useUIStore, selectUiStore } from '@/store/ui'
import { Server } from '@/types/server'
import {
  Button,
  ButtonProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface ServerIconProps extends ButtonProps {
  server?: Server
  onClick?: () => void
}

export const ServerIcon: React.FC<ServerIconProps> = ({
  children,
  server,
  onClick,
  ...props
}) => {
  const router = useRouter()
  const { setIsLoading } = useUIStore(selectUiStore)

  const handleClick = () => {
    setIsLoading(true)
    if (server) {
      router.push(`/server/${server.id}`)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    router.push(`/app`)
  }

  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Button
          {...props}
          borderRadius="14"
          h="50px"
          w="50px"
          padding="0"
          m="0"
          transition=".2s ease-out"
          position="relative"
          overflow="hidden"
          onClick={onClick ?? handleClick}
          mb="2"
          _hover={{
            borderRadius: '8',
            opacity: '.9',
          }}
        >
          {children ? (
            children
          ) : (
            <Text fontSize="10px" color="gray.200" whiteSpace="break-spaces">
              {server?.name}
            </Text>
          )}
        </Button>
      </PopoverTrigger>
      {server && (
        <Portal>
          <PopoverContent w="auto">
            <PopoverArrow />
            <PopoverBody textAlign="center" fontSize="12px">
              {server?.name}
            </PopoverBody>
          </PopoverContent>
        </Portal>
      )}
    </Popover>
  )
}
