import { atom } from 'recoil'
import { IApp, IRootInfo } from './types'

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
