import { ReactNode } from 'react'

export interface AppComponentProps {
  setHeaderLoading: (loading: boolean) => void
  setHeaderTitle: (title: string) => void
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

export interface IDirItem {
  name: string
  type: number
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
  indicator: number
  list: string[]
}
