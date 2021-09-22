import { NextOutline16 } from '@carbon/icons-react'
import { useState } from 'react'
import { line } from '../../utils'
import { IVolume } from '../../utils/types'
import VolumeList from './VolumeList'

interface SideProps {
  currentPath: string
  currentVolume: string
  volumeList: IVolume[]
  onVolumeClick: (mount: string) => void
}

export default function Side(props: SideProps) {

  const {
    currentPath,
    currentVolume,
    volumeList,
    onVolumeClick,
  } = props

  const [sideCollapse, setSideCollapse] = useState(false)
  
  return (
    <div
      className={line(`
        flex-shrink-0 h-full transition-all duration-300 select-none overflow-hidden group
        ${sideCollapse ? 'w-0' : 'w-64'}
      `)}
    >
      <div className="p-2 w-64 h-full border-r overflow-x-hidden overflow-y-auto">
        <p className="p-1 text-xs text-gray-400">宗卷</p>
        <VolumeList
          {...{ currentPath, currentVolume, volumeList }}
          onVolumeClick={onVolumeClick}
        />
        <p className="mt-3 p-1 text-xs text-gray-400">收藏</p>
      </div>
      <div
        title={sideCollapse ? '展开' : '收起'}
        className={line(`
          absolute z-10 bottom-0 left-0 p-1
          opacity-10 group-hover:opacity-80
          transition-all duration-200
          transform cursor-pointer
          ${sideCollapse ? '' : '-rotate-180'}
        `)}
        onClick={() => setSideCollapse(!sideCollapse)}
      >
        <NextOutline16 />
      </div>
    </div>
  )
}
