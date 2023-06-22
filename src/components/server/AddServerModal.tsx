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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Switch,
} from '@chakra-ui/react'
import { ServerIcon } from '../ServerIcon'
import contracts from '@/constants/contracts'
import { useState } from 'react'
import { useAccount, useContractWrite } from 'wagmi'
import lensordAbi from '@/constants/abis/Lensord.json'
import { useServers } from '@/hooks/useServers'
import { Modes, selectSettings, useSettingsStore } from '@/store/settings'
import { useFauna } from '@/hooks/useFauna'

export const AddServerModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()
  const [serverAddress, setServerAddress] = useState<string>()
  const [serverName, setServerName] = useState<string>()
  const { address } = useAccount()
  const [isServerPrivate, setIsServerPrivate] = useState<boolean>(false)
  const { refetchServers } = useServers()
  const { write } = useContractWrite({
    address: contracts.lensord,
    abi: lensordAbi.abi,
    functionName: 'joinServer',
    mode: 'recklesslyUnprepared',
    onSuccess: () => {
      onClose()

      setTimeout(refetchServers, 4000)
    },
  })
  const { write: createServer } = useContractWrite({
    address: contracts.lensord,
    abi: lensordAbi.abi,
    functionName: 'createServer',
    mode: 'recklesslyUnprepared',
    onSuccess: () => {
      onCreateClose()

      setTimeout(refetchServers, 4000)
    },
  })
  const { settings } = useSettingsStore(selectSettings)
  const { createCServer, joinCServer } = useFauna()

  const handleJoinServer = () => {
    if (!serverAddress) return

    if (settings.mode === Modes.DECENTRALIZED) {
      write({ recklesslySetUnpreparedArgs: [serverAddress] })

      return
    }

    joinCServer(serverAddress)
  }

  const handleCreateServer = async () => {
    if (!address || !serverName) return

    if (settings.mode === Modes.DECENTRALIZED) {
      createServer({
        recklesslySetUnpreparedArgs: [isServerPrivate, [address], serverName],
      })

      return
    }

    await createCServer({
      isPrivate: isServerPrivate,
      members: [address],
      name: serverName,
    })
    onCreateClose()
  }

  return (
    <>
      <Menu>
        <MenuButton as={ServerIcon}>
          <AddIcon boxSize="4" color="teal.400" />
        </MenuButton>
        <MenuList color="white">
          <MenuItem onClick={onOpen}>Join a server</MenuItem>
          <MenuItem onClick={onCreateOpen}>Create a server</MenuItem>
        </MenuList>
      </Menu>

      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={10}>
            <FormControl>
              <FormLabel>Server address</FormLabel>
              <Input
                value={serverAddress}
                onChange={(e) => {
                  setServerAddress(e.target.value)
                }}
                type="text"
              />
              <FormHelperText>Please enter the server address.</FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" mr={3} onClick={handleJoinServer}>
              Validate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal size="2xl" isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={10}>
            <FormControl>
              <FormLabel>Server name</FormLabel>
              <Input
                value={serverName}
                onChange={(e) => {
                  setServerName(e.target.value)
                }}
                type="text"
              />
              <FormHelperText>Please enter the server address.</FormHelperText>
            </FormControl>

            <FormControl mt={4} display="flex" alignItems="center">
              <FormLabel htmlFor="isPrivate" mb="0">
                Is the server Private?
              </FormLabel>
              <Switch
                id="isPrivate"
                onChange={() => {
                  setIsServerPrivate(!isServerPrivate)
                }}
                isChecked={isServerPrivate}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onCreateClose}>
              Close
            </Button>
            <Button colorScheme="teal" mr={3} onClick={handleCreateServer}>
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
