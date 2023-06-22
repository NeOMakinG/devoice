import { Channel, Server } from '@/types/server'
import faunadb from 'faunadb'
import { Address, useAccount } from 'wagmi'
import { useServers } from './useServers'
import { createRoom } from '@/api/create-room'

const query = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNA_KEY ?? '',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

type CUser = {
  ref: string
  ts: number
  data: UserData
}

type CServer = {
  ref: string
  ts: number
  data: ServerData
}

type CServers = {
  ref: string
  ts: number
  data: Array<CServer>
}

export type ServerData = {
  id: number
  owner: string
  updatedAt: string
  name: string
  isPrivate: boolean
  members: Array<string>
  channels: Array<Channel>
}

export type UserData = {
  address: string
  updatedAt: string
  joinedServers: Array<Server>
}

type CreateCServerProps = {
  name: string
  members?: Array<Address>
  channels?: Array<Channel>
  isPrivate?: boolean
}

export const useFauna = () => {
  const { address } = useAccount()
  const { setServers, setSelectedServer, selectedServer } = useServers()

  const isCRegistered = async () => {
    if (address) {
      try {
        const isRegistered = await client.query<CUser>(
          query.Get(query.Match(query.Index('userAddress'), address))
        )

        const joinedServers = await client.query<CServers>(
          query.Map(
            query.Paginate(query.Match(query.Index('joinedServers'), address)),
            query.Lambda('server', query.Get(query.Var('server')))
          )
        )

        const reducedServers = joinedServers.data.reduce(
          (tmp: Array<any>, current) => {
            const server = current.data

            tmp.push(server)

            return tmp
          },
          []
        )

        setServers(reducedServers)

        return isRegistered
      } catch (error) {
        console.log(error)
        return
      }
    }
  }

  const registerCUser = async () => {
    if (address) {
      const createUser = client.query<CUser>(
        query.Create(query.Collection('user'), {
          data: { address, updatedAt: Date.now(), joinedServers: [] },
        })
      )

      const response = await createUser

      return response
    }
  }

  const createCServer = async ({
    name,
    members = [],
    channels = [],
    isPrivate = false,
  }: CreateCServerProps) => {
    if (address) {
      const createServer = await client.query<CServer>(
        query.Create(query.Collection('server'), {
          data: {
            id: self.crypto.randomUUID(),
            owner: address,
            updatedAt: Date.now(),
            name: name,
            isPrivate,
            members: members,
            channels: [
              {
                id: 0,
                name: 'General',
              },
              ...channels,
            ],
          },
        })
      )

      const response = await createServer

      isCRegistered()

      return response
    }
  }

  const getSpecificServer = async (serverId: string) => {
    const specificServer = await client.query<any>(
      query.Get(query.Match(query.Index('serverId'), serverId))
    )

    setSelectedServer(specificServer.data)

    return specificServer
  }

  const createCChannel = async (name: string) => {
    if (!selectedServer) return

    const specificServer = await client.query<any>(
      query.Update(
        query.Select(
          'ref',
          query.Get(query.Match(query.Index('serverId'), selectedServer.id))
        ),
        {
          data: {
            channels: [
              ...selectedServer.channels,
              {
                id: self.crypto.randomUUID(),
                name,
              },
            ],
          },
        }
      )
    )

    setSelectedServer(specificServer.data)

    return specificServer
  }

  const joinCServer = async (serverId: string) => {
    if (!address) return
    const specificServer = await client.query<any>(
      query.Get(query.Match(query.Index('serverId'), serverId))
    )

    const joinedServer = await client.query<any>(
      query.Update(
        query.Select(
          'ref',
          query.Get(query.Match(query.Index('serverId'), serverId))
        ),
        {
          data: {
            members: [...specificServer.data.members, address],
          },
        }
      )
    )

    const joinedServers = await client.query<CServers>(
      query.Map(
        query.Paginate(query.Match(query.Index('joinedServers'), address)),
        query.Lambda('server', query.Get(query.Var('server')))
      )
    )

    const reducedServers = joinedServers.data.reduce(
      (tmp: Array<any>, current) => {
        const server = current.data

        tmp.push(server)

        return tmp
      },
      []
    )

    setServers(reducedServers)

    return joinedServer
  }

  const getCFriends = async () => {
    const received = await client.query<CServers>(
      query.Map(
        // eslint-disable-next-line
        query.Paginate(query.Match(query.Index('getFriendsByTo'), address!)),
        query.Lambda('friendRequests', query.Get(query.Var('friendRequests')))
      )
    )

    const sent = await client.query<CServers>(
      query.Map(
        // eslint-disable-next-line
        query.Paginate(query.Match(query.Index('getFriendsByFrom'), address!)),
        query.Lambda('friendRequests', query.Get(query.Var('friendRequests')))
      )
    )

    return { received: received.data, sent: sent.data }
  }

  const createCFriendRequest = async (friendAddress: string) => {
    if (!address) return

    const friendRequest = await client.query<CServer>(
      query.Create(query.Collection('friendRequests'), {
        data: {
          to: friendAddress,
          from: address,
          accepted: false,
        },
      })
    )

    return friendRequest
  }

  const acceptCFriendRequest = async (ref: string) => {
    if (!address) return

    const roomId = await createRoom(ref, [address])

    const acceptedRequest = await client.query<any>(
      query.Update(query.Ref(query.Collection('friendRequests'), ref), {
        data: {
          accepted: true,
          roomId: roomId.data.roomId,
        },
      })
    )

    return acceptedRequest
  }

  return {
    client,
    query,
    isCRegistered,
    registerCUser,
    createCServer,
    getSpecificServer,
    createCChannel,
    getCFriends,
    createCFriendRequest,
    acceptCFriendRequest,
    joinCServer,
  }
}
