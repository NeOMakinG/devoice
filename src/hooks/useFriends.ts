'use client'

import contracts from '@/constants/contracts'
import { useAccount, useContractRead } from 'wagmi'
import lensordAbi from '@/constants/abis/Lensord.json'
import { Friend, selectFriendsStore, useFriendsStore } from '@/store/friends'
import { TFriendRequest } from '@/types/friends'
import { Modes, selectSettings, useSettingsStore } from '@/store/settings'
import { useFauna } from './useFauna'

type UserFriendsProps = {
  initialRequests?: boolean
}

export const useFriends = (props?: UserFriendsProps) => {
  const { address } = useAccount()
  const { settings } = useSettingsStore(selectSettings)
  const {
    setFriends,
    setSentFriendRequests,
    setReceivedFriendRequests,
    setSelectedFriendLobby,
    selectedFriendLobby,
    selectedFriend,
    receivedFriendRequests: receivedCFriendRequests,
    friends,
  } = useFriendsStore(selectFriendsStore)
  const { getCFriends, acceptCFriendRequest } = useFauna()
  const { refetch: getDFriends } = useContractRead<
    typeof lensordAbi.abi,
    string,
    Friend[]
  >({
    address: contracts.lensord,
    abi: lensordAbi.abi,
    functionName: 'getFriendList',
    enabled:
      (props?.initialRequests && settings.mode === Modes.DECENTRALIZED) ??
      false,
    overrides: {
      from: address,
    },
    onSuccess: (friends) => {
      setFriends(friends)
    },
  })
  const { refetch: getDFriendsRequests, data: receivedDFriendRequests } =
    useContractRead<typeof lensordAbi.abi, string, TFriendRequest[]>({
      address: contracts.lensord,
      abi: lensordAbi.abi,
      functionName: 'getFriendRequests',
      enabled:
        (props?.initialRequests && settings.mode === Modes.DECENTRALIZED) ??
        false,
      args: [address],
    })
  // const { write: sendAcceptFriend } = useContractWrite({
  //   address: contracts.lensord,
  //   abi: lensordAbi.abi,
  //   functionName: 'acceptFriendRequest',
  //   mode: 'recklesslyUnprepared',
  // })

  const getFriendsRequests = () => {
    if (settings.mode === Modes.DECENTRALIZED) {
      return getDFriendsRequests()
    }
  }

  const getFriends = async () => {
    if (settings.mode === Modes.DECENTRALIZED) {
      return getDFriends()
    }

    const { received, sent } = await getCFriends()
    setReceivedFriendRequests(received)
    setSentFriendRequests(sent)
  }

  const handleAcceptFriend = async (ref: string) => {
    const { received, sent } = await acceptCFriendRequest(ref)
    setReceivedFriendRequests(received)
    setSentFriendRequests(sent)
  }

  return {
    handleAcceptFriend,
    getFriendsRequests,
    getFriends,
    setSelectedFriendLobby,
    selectedFriend,
    selectedFriendLobby,
    friends,
    receivedFriendRequests: receivedDFriendRequests ?? receivedCFriendRequests,
  }
}
