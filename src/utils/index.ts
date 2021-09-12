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

export const line = (str: string) => str
  .replace(/\n/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

export const convertItemName = (item: IDirItem) => {
  const { type, name, hasChildren } = item
  return type === 1
    ? `${name}._dir${hasChildren ? '' : '_empty'}`
    : name
}

export const isEventKey = (e: any, key: string) => {
  const map: { [KEY: string]: number } = {
    'A': 65,
  }
  return e.keyCode === map[key]
}

export const isSameItem = (a: IDirItem, b: IDirItem) => {
  return a.name === b.name && a.type === b.type
}