'use client'
import { AddIcon } from '@chakra-ui/icons'
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { useState } from 'react'
import contracts from '@/constants/contracts'
import { useContractWrite } from 'wagmi'
import lensordAbi from '@/constants/abis/Lensord.json'
import { selectServersStore, useServersStore } from '@/store/servers'
import { Modes, selectSettings, useSettingsStore } from '@/store/settings'
import { useFauna } from '@/hooks/useFauna'

export const AddChannelModal: React.FC = () => {
  const { selectedServer } = useServersStore(selectServersStore)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [channelName, setChannelName] = useState<string>()
  const { write } = useContractWrite({
    address: contracts.lensord,
    abi: lensordAbi.abi,
    functionName: 'createChannel',
    mode: 'recklesslyUnprepared',
    onSuccess: () => {
      onClose()
    },
  })
  const { settings } = useSettingsStore(selectSettings)
  const { createCChannel } = useFauna()

  if (!selectedServer) return null

  const handleCreateChannel = () => {
    if (!channelName) return

    if (settings.mode === Modes.DECENTRALIZED) {
      write({ recklesslySetUnpreparedArgs: [selectedServer.id, channelName] })
      return
    }

    createCChannel(channelName)
    onClose()
  }

  return (
    <>
      <IconButton
        onClick={onOpen}
        aria-label="Add channel"
        size="xs"
        icon={<AddIcon color="gray.400" />}
      />

      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={10}>
            <FormControl mt={4}>
              <FormLabel>Channel name</FormLabel>
              <Input
                value={channelName}
                onChange={(e) => {
                  setChannelName(e.target.value)
                }}
                type="text"
              />
              <FormHelperText>Please enter the channel name.</FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleCreateChannel}>
              Create channel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
