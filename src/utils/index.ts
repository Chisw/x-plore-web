import { IDirectoryItem } from './types'

export const itemSorter = (a: IDirectoryItem, b: IDirectoryItem) => {
  const typeDirection = a.type - b.type
  if (typeDirection !== 0) return typeDirection
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}
