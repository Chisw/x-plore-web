import { atom } from 'recoil'
import { IApp, IEntry, IRootInfo, ITransferEntry } from './types'

export const topWindowIndexState = atom<number>({
  key: 'topWindowIndexState',
  default: 0,
})

export const runningAppListState = atom<IApp[]>({
  key: 'runningAppListState',
  default: [],
})

export const rootInfoState = atom<IRootInfo>({
  key: 'rootInfoState',
  default: {
    deviceName: '--',
    volumeList: [],
  },
})

export const entryListMapState = atom<{ [KEY: string]: IEntry[] }>({
  key: 'entryListMapState',
  default: {},
})

export const sizeMapState = atom<{ [KEY: string]: number }>({
  key: 'sizeMapState',
  default: {},
})

export const transferEntryListState = atom<ITransferEntry[]>({
  key: 'transferEntryListState',
  default: [],
})