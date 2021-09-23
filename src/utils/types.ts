import { ReactNode } from 'react'

// 0: volume  1: directory 2: file
export type ItemType = 0 | 1 | 2
export type DirectionType = 1 | -1

export interface AppComponentProps {
  isTopWindow: boolean
  setWindowLoading: (loading: boolean) => void
  setWindowTitle: (title: string) => void
}

interface IAppComponent {
  (props: AppComponentProps): JSX.Element
}

export interface IApp {
  id: string
  runningId: number
  title: string
  icon: string
  bgImg?: string
  width: number
  height: number
  resizeRange: {
    maxWidth?: number
    maxHeight?: number
    minWidth?: number
    minHeight?: number
  }
  AppComponent: IAppComponent
}

export interface IVolume {
  label: string
  name: string
  type: ItemType
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

export interface IDirItem {
  name: string
  type: ItemType
  size?: number
  mime?: string
  hidden?: boolean
  timestamp?: number
  hasChildren?: boolean
}

export interface IDirItemIcon {
  name: string
  icon: ReactNode
  bg: string
  match: string[]
}

export interface IHistory {
  position: number
  list: string[]
}

export interface IRectInfo {
  startX: number
  startY: number
  endX: number
  endY: number
}

export interface IOffsetInfo {
  offsetTop: number
  offsetLeft: number
  offsetWidth: number
  offsetHeight: number
}