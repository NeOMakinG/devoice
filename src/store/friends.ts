'use client'
import { Address } from 'wagmi'
import { create } from 'zustand'

export type Friend = {
  accepted: boolean
  requester: Address
}

type FriendsStoreState = {
  friends: Friend[]
  sentFriendRequests: any
  receivedFriendRequests: any
  selectedFriend: Address | null
  selectedFriendLobby: string | null
  setFriends: (friends: Friend[]) => void
  setSentFriendRequests: (friends: any) => void
  setReceivedFriendRequests: (friends: any) => void
  setSelectedFriend: (friend: Address) => void
  setSelectedFriendLobby: (lobbyId: string) => void
}

export const selectFriendsStore = (state: FriendsStoreState) => ({
  friends: state.friends,
  sentFriendRequests: state.sentFriendRequests,
  receivedFriendRequests: state.receivedFriendRequests,
  selectedFriend: state.selectedFriend,
  selectedFriendLobby: state.selectedFriendLobby,
  setFriends: state.setFriends,
  setSelectedFriend: state.setSelectedFriend,
  setSelectedFriendLobby: state.setSelectedFriendLobby,
  setSentFriendRequests: state.setSentFriendRequests,
  setReceivedFriendRequests: state.setReceivedFriendRequests,
})

export const useFriendsStore = create<FriendsStoreState>((set) => ({
  friends: [],
  sentFriendRequests: [],
  receivedFriendRequests: [],
  selectedFriend: null,
  selectedFriendLobby: null,
  setFriends: (friends: Friend[]) => set(() => ({ friends })),
  setSelectedFriend: (friend: Address) =>
    set(() => ({ selectedFriend: friend })),
  setSelectedFriendLobby: (lobbyId: string) =>
    set(() => ({ selectedFriendLobby: lobbyId })),
  setSentFriendRequests: (friend: Address) =>
    set(() => ({ sentFriendRequests: friend })),
  setReceivedFriendRequests: (friend: Address) =>
    set(() => ({ receivedFriendRequests: friend })),
}))
