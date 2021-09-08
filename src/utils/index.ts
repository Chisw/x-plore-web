import { IDirItem } from './types'

export const itemSorter = (a: IDirItem, b: IDirItem) => {
  const typeDirection = a.type - b.type
  if (typeDirection !== 0) return typeDirection
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

export const copy = (str: string) => {
  const input = document.createElement('textarea')
  document.body.appendChild(input)
  input.value = str
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
}
