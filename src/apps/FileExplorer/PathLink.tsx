import { Checkmark16, Copy16, DocumentBlank16, Folder16, ChevronRight16 } from '@carbon/icons-react'
import { useMemo } from 'react'
import Toast from '../../components/EasyToast'
import { copy } from '../../utils'

interface PathLinkProps {
  loading: boolean
  selectedLen: number
  dirCount: number
  fileCount: number
  currentPath: string
  activeVolume: string
  onDirClick: (mount: string) => void
  onVolumeClick: (mount: string) => void
}

export default function PathLink(props: PathLinkProps) {

  const {
    loading,
    selectedLen,
    dirCount,
    fileCount,
    currentPath,
    activeVolume,
    onDirClick,
    onVolumeClick,
  } = props

  const {
    mountList,
    isVolumeDisabled,
  } = useMemo(() => {
    const mountList = currentPath.replace(activeVolume, '').split('/').filter(Boolean)
    const isVolumeDisabled = currentPath === activeVolume || !mountList.length
    return {
      mountList,
      isVolumeDisabled,
    }
  }, [currentPath, activeVolume])

  if (!activeVolume) return <div />

  return (
    <div className="flex-shrink-0 px-2 py-1 text-xs text-gray-400 select-none flex justify-between items-center bg-gray-100 border-t">
      <div className="group flex-shrink-0">
        <span
          title={activeVolume}
          className={isVolumeDisabled ? '' : 'cursor-pointer hover:text-black'}
          onClick={() => !isVolumeDisabled && onVolumeClick(activeVolume)}
        >
          {activeVolume}
        </span>
        {mountList.map((mount, mountIndex) => {
          const prefix = mountList.filter((m, mIndex) => mIndex < mountIndex).join('/')
          const fullPath = `${activeVolume}/${prefix ? `${prefix}/` : ''}${mount}`
          const isDisabledDir = mountIndex > mountList.length - 2
          return (
            <span key={encodeURIComponent(fullPath)}>
              <ChevronRight16 className="inline transform scale-75 -mt-2px" />
              <span
                title={fullPath}
                className={isDisabledDir ? '' : 'cursor-pointer hover:text-black'}
                onClick={() => !isDisabledDir && onDirClick(fullPath)}
              >
                {mount}
              </span>
            </span>
          )
        })}
        <span
          title="复制"
          className="invisible ml-1 px-1 cursor-pointer group-hover:visible text-xs hover:text-gray-500 active:opacity-50"
          onClick={() => {
            copy(currentPath)
            Toast.toast('路径复制成功')
          }}
        >
          <Copy16 className="inline transform scale-75 -mt-2px" />
        </span>
      </div>
      <div className="flex-shrink-0 flex items-center pl-4 pr-1 font-din">
        {!!selectedLen && (
          <>
            <Checkmark16 />&nbsp;<span>{loading ? '-' : selectedLen}</span>
            &emsp;
          </>
        )}
        <Folder16 />&nbsp;<span>{loading ? '-' : dirCount}</span>
        &emsp;
        <DocumentBlank16 />&nbsp;<span>{loading ? '-' : fileCount}</span>
      </div>
    </div>
  )
}
