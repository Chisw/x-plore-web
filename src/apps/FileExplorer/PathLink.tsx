import { Checkmark16, Copy16, DocumentBlank16, Folder16 } from '@carbon/icons-react'
import { useMemo } from 'react'
import Toast from '../../components/EasyToast'
import { copy } from '../../utils'

interface PathLinkProps {
  loading: boolean
  selectedLen: number
  dirCount: number
  fileCount: number
  currentPath: string
  currentVolume: string
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
    currentVolume,
    onDirClick,
    onVolumeClick,
  } = props

  const {
    mountList,
    isVolumeDisabled,
  } = useMemo(() => {
    const mountList = currentPath.replace(currentVolume, '').split('/').filter(Boolean)
    const isVolumeDisabled = currentPath === currentVolume || !mountList.length
    return {
      mountList,
      isVolumeDisabled,
    }
  }, [currentPath, currentVolume])

  if (!currentVolume) return <div />

  return (
    <div className="flex-shrink-0 px-2 py-1 text-xs text-gray-400 select-none flex justify-between items-center bg-gray-100">
      <div className="group flex-shrink-0">
        <span
          title={currentVolume}
          className={isVolumeDisabled ? '' : 'cursor-pointer hover:text-black'}
          onClick={() => !isVolumeDisabled && onVolumeClick(currentVolume)}
        >
          {currentVolume}
        </span>
        {mountList.map((mount, mountIndex) => {
          const prefix = mountList.filter((m, mIndex) => mIndex < mountIndex).join('/')
          const fullPath = `${currentVolume}/${prefix ? `${prefix}/` : ''}${mount}`
          const isDirDisabled = mountIndex > mountList.length - 2
          return (
            <span key={encodeURIComponent(fullPath)}>
              <span>/</span>
              <span
                title={fullPath}
                className={isDirDisabled ? '' : 'cursor-pointer hover:text-black'}
                onClick={() => !isDirDisabled && onDirClick(fullPath)}
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
          <Copy16 className="inline" />
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
