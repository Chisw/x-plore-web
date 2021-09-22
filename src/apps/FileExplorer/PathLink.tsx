import { Copy16 } from '@carbon/icons-react'
import { useMemo } from 'react'
import Toast from '../../components/EasyToast'
import { copy } from '../../utils'

interface PathLinkProps {
  currentPath: string
  currentVolume: string
  onDirClick: (mount: string) => void
  onVolumeClick: (mount: string) => void
}

export default function PathLink(props: PathLinkProps) {

  const {
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
  )
}
