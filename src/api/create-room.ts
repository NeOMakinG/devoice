import axios from 'axios'
import { Address } from 'wagmi'

export const createRoom = async (
  title: string,
  hostWallets: Array<Address>
) => {
  try {
    const { data } = await axios.post(
      'https://api.huddle01.com/api/v1/create-room',
      {
        title,
        hostWallets,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.HUDDLE_KEY,
        },
      }
    )

    return data
  } catch (error) {
    console.log(error)
  }
}
