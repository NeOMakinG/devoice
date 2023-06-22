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
import { SentRequests } from './SentRequests'
import { ReceivedRequests } from './ReceivedRequests'
import { useState } from 'react'
import contracts from '@/constants/contracts'
import { useContractWrite } from 'wagmi'
import lensordAbi from '@/constants/abis/Lensord.json'
import { Modes, selectSettings, useSettingsStore } from '@/store/settings'
import { useFauna } from '@/hooks/useFauna'
import { useFriends } from '@/hooks/useFriends'

export const FriendsModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [friendAddress, setFriendAddress] = useState<string>()
  const { settings } = useSettingsStore(selectSettings)
  const { createCFriendRequest } = useFauna()
  const { getFriends } = useFriends()
  const { write } = useContractWrite({
    address: contracts.lensord,
    abi: lensordAbi.abi,
    functionName: 'sendFriendRequest',
    mode: 'recklesslyUnprepared',
  })

  const handleInvite = async () => {
    if (!friendAddress) return

    if (settings.mode === Modes.DECENTRALIZED) {
      write({ recklesslySetUnpreparedArgs: [friendAddress] })
      onClose()
      return
    }

    await createCFriendRequest(friendAddress)
    getFriends()
    onClose()
  }

  return (
    <>
      <IconButton
        onClick={onOpen}
        aria-label="Add mp"
        size="xs"
        icon={<AddIcon color="gray.400" />}
      />

      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={10}>
            <ReceivedRequests />
            <SentRequests />

            <FormControl mt={4}>
              <FormLabel>Friend address</FormLabel>
              <Input
                value={friendAddress}
                onChange={(e) => {
                  setFriendAddress(e.target.value)
                }}
                type="text"
              />
              <FormHelperText>Please enter the friend address.</FormHelperText>
            </FormControl>
            <Button
              size="sm"
              mt={4}
              colorScheme="blue"
              mr={3}
              onClick={handleInvite}
            >
              Send an invitation
            </Button>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
