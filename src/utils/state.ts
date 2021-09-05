import { atom } from 'recoil'
import { IApp } from './types'

export const runningAppListState = atom<IApp[]>({
  key: 'runningAppListState',
  default: [],
})
