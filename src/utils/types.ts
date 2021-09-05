import { FC } from 'react'

export interface IApp {
  id: string
  runningId: number
  title: string
  icon: string
  bgImg?: string
  defaultSize: {
    width: number
    height: number
  }
  Component: FC
}

export interface IVolume {
  label: string
  name: string
  type: number  // 0: volume  1: directory 2: file
  mount: string
  hasChildren: boolean
  fileSystem: string
  spaceFree: number
  spaceTotal: number
}

export interface IRootInfo {
  deviceName: string
  volumeList: IVolume[]
}

export interface IDirectoryItem {
  name: string
  type: number
  size?: number
  mime?: string
  hidden?: boolean
  timestamp?: number
  hasChildren?: boolean
}