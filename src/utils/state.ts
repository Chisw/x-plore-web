import { atom } from 'recoil'
import { IApp, INotification, IRootInfo } from './types'

export const notificationListState = atom<INotification[]>({
  key: 'notificationListState',
  // default: [],
  default: [{ id: 1412342134123, icon: '', title: 'test' }],
})

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
