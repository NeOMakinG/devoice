'use client'
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormHelperText,
  FormLabel,
  Switch,
  Icon,
} from '@chakra-ui/react'
import { ServerIcon } from '../ServerIcon'
import { BiCog } from 'react-icons/bi'
import { Modes, selectSettings, useSettingsStore } from '@/store/settings'

export const SettingsModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { settings, setSettings } = useSettingsStore(selectSettings)

  return (
    <>
      <ServerIcon onClick={onOpen}>
        <Icon as={BiCog} color="teal.500" boxSize="25px" />
      </ServerIcon>

      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={10}>
            <FormControl>
              <FormLabel>Query mode</FormLabel>
              <Switch
                id="isPrivate"
                onChange={() => {
                  setSettings({
                    mode:
                      settings.mode === Modes.DECENTRALIZED
                        ? Modes.CENTRALIZED
                        : Modes.DECENTRALIZED,
                  })
                }}
                isChecked={settings.mode === Modes.DECENTRALIZED}
              >
                {settings.mode === Modes.DECENTRALIZED
                  ? Modes.DECENTRALIZED
                  : Modes.CENTRALIZED}
              </Switch>
              <FormHelperText>
                Select the app mode you want to use in priority.
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
