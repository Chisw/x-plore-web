import { line } from '../../utils'
import { IVolume } from '../../utils/types'
import VolumeList from './VolumeList'

interface SideProps {
  sideCollapse: boolean
  currentPath: string
  activeVolume: string
  volumeList: IVolume[]
  onVolumeClick: (mount: string) => void
}

export default function Side(props: SideProps) {

  const {
    sideCollapse,
    currentPath,
    activeVolume,
    volumeList,
    onVolumeClick,
  } = props
  
  return (
    <div
      className={line(`
        relative flex-shrink-0 h-full transition-all duration-300 select-none overflow-hidden
        ${sideCollapse ? 'w-0' : 'w-64'}
      `)}
    >
      <div className="p-2 w-64 h-full border-r overflow-x-hidden overflow-y-auto">
        <p className="p-1 text-xs text-gray-400">宗卷</p>
        <VolumeList
          {...{ currentPath, activeVolume, volumeList }}
          onVolumeClick={onVolumeClick}
        />
        <p className="mt-3 p-1 text-xs text-gray-400">收藏</p>
      </div>
    </div>
  )
}
