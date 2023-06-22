// eslint-disable-next-line
export function formatPicture(picture: any) {
  if (picture.__typename === 'MediaSet') {
    if (picture.original.url.startsWith('ipfs://')) {
      const result = picture.original.url.substring(
        7,
        picture.original.url.length
      )
      return `http://lens.infura-ipfs.io/ipfs/${result}`
    } else if (picture.original.url.startsWith('ar://')) {
      const result = picture.original.url.substring(
        4,
        picture.original.url.length
      )
      return `http://arweave.net/${result}`
    } else {
      return picture.original.url
    }
  } else {
    return picture
  }
}
