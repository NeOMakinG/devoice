import { Address } from 'wagmi'

export type Channel = {
  id: number
  name: string
}

export type Server = {
  id: Address
  name: string
  members: Array<Address>
  isPrivate: boolean
  owner: Address
  channels: Array<Channel>
}
