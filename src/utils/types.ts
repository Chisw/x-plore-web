import { ReactNode } from 'react'


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
  AppComponent: IAppComponent
  width: number
  height: number
  resizeRange: {
    maxWidth?: number
    maxHeight?: number
    minWidth?: number
    minHeight?: number
  }
  bgImg?: string
  matchList?: string[]
}

export interface IVolume {
  label: string
  name: string
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

export interface IEntry {
  name: string
  type: 'directory' | 'file'
  parentPath: string
  extension?: string
  size?: number
  mime?: string
  hidden?: boolean
  lastModified?: number
  hasChildren?: boolean
}

export interface IOpenedEntry extends IEntry {
  openAppId: string
  isOpen: boolean
}

export interface IEntryIcon {
  type: string
  icon: ReactNode
  iconClassName: string
  matchList: string[]
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

export interface IFilePack {
  file: File
  packPath?: string  // 多层文件夹嵌套上传时的相对路径，包含文件名
}

export interface IUploadTask {
  filePack: IFilePack
  destDir?: string
  startTime: number
  endTime: number
  abortController?: AbortController
}
