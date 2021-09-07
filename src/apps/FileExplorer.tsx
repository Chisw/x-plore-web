import { ArrowUp16, Checkmark16, ChevronLeft16, ChevronRight16, VmdkDisk16, DocumentBlank16, Download16, Edit16, Export16, Filter16, Folder16, FolderAdd16, Grid16, Renew16, Star16, TrashCan16, View16 } from '@carbon/icons-react'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import Icon from '../components/Icon'
import useFetch from '../hooks/useFetch'
import { itemSorter } from '../utils'
import { getDirItems } from '../utils/api'
import { dirItemConverter } from '../utils/converters'
import { rootInfoState } from '../utils/state'
import { AppComponentProps } from '../utils/types'


export default function FileExplorer(props: AppComponentProps) {

  const { setHeaderTitle } = props

  const [rootInfo] = useRecoilState(rootInfoState)
  const [currentVolume, setCurrentVolume] = useState('')
  const [currentPath, setCurrentPath] = useState('')
  const [historyList, setHistoryList] = useState<string[]>([])

  useEffect(() => {
    console.log('historyList', historyList)
  }, [historyList])

  const { fetch, loading, data, setData } = useFetch(mount => getDirItems(mount as string))

  const updateHistoryList = useCallback((path: string) => {
    setHistoryList([...historyList, path])
  }, [historyList, setHistoryList])

  const handleVolumeClick = useCallback((volumeMount: string) => {
    setData(null)
    fetch(volumeMount)

    setCurrentVolume(volumeMount)

    setCurrentPath(volumeMount)
    updateHistoryList(volumeMount)

  }, [fetch, setData, updateHistoryList])

  const handleDirClick = useCallback((dirMount: string) => {
    const newPath = `${currentPath}/${dirMount}`
    setData(null)
    fetch(newPath)

    setCurrentPath(newPath)
    updateHistoryList(newPath)

    setHeaderTitle(dirMount)
  }, [fetch, currentPath, setData, setHeaderTitle, updateHistoryList])

  const {
    dirItems,
    dirCount,
    fileCount,
  } = useMemo(() => {
    const dirItems = data ? dirItemConverter(data).sort(itemSorter) : []
    let dirCount = 0
    let fileCount = 0
    dirItems.forEach(({ type }) => {
      if (type === 1) {
        dirCount++
      } else {
        fileCount++
      }
    })
    return {
      dirItems,
      dirCount,
      fileCount,
    }
  }, [data])

  return (
    <>
      <div className="absolute inset-0 flex">
        {/* side */}
        <div className="p-2 w-64 h-full flex-shrink-0 overflow-x-hidden overflow-y-auto border-r select-none">
          <p className="p-1 text-xs text-gray-400">宗卷</p>
          <div>
            {rootInfo.volumeList.map(({ label, mount }, volumeIndex) => {
              const title = `${mount} (${label})`
              const isActive = mount === currentVolume
              const canGoVolume = currentPath !== mount
              return (
                <div
                  key={volumeIndex}
                  title={title}
                  className={`
                    mb-1 p-1 text-xs flex items-center rounded
                    ${isActive
                      ? 'bg-gray-300 text-black'
                      : 'text-gray-500 cursor-pointer hover:bg-gray-200 hover:text-black'
                    }
                  `}
                  onClick={() => canGoVolume && handleVolumeClick(mount)}
                >
                  <VmdkDisk16 className="flex-shrink-0" />
                  <span className="ml-1 truncate">{title}</span>
                </div>
              )
            })}
          </div>
          <p className="mt-3 p-1 text-xs text-gray-400">收藏</p>
        </div>
        {/* main */}
        <div className="relative flex-grow h-full bg-white flex flex-col">
          <div className="flex-shrink-0 border-b px-2 py-1 text-xs text-gray-500 select-none flex justify-between items-center">
            <div>{currentPath}</div>
            <div className="flex items-center">
              <Folder16 />
              &nbsp;
              <span>{dirCount}</span>
              &emsp;
              <DocumentBlank16 />
              &nbsp;
              <span>{fileCount}</span>
            </div>
          </div>
          {/* tool bar */}
          <div className="h-8 bg-gray-100 flex-shrink-0 border-b flex">
            <ToolButton
              title="后退"
              className="border-r"
            >
              <ChevronLeft16 />
            </ToolButton>
            <ToolButton
              title="前进"
              className="border-r"
            >
              <ChevronRight16 />
            </ToolButton>
            <ToolButton
              title="刷新"
              className="border-r"
            >
              <Renew16 />
            </ToolButton>
            <ToolButton
              title="返回上级"
              className="border-r"
            >
              <ArrowUp16 />
            </ToolButton>

            <ToolButton
              title="新建文件夹"
              className="ml-4 border-l border-r"
            >
              <FolderAdd16 />
            </ToolButton>
            <ToolButton
              title="重命名"
              className="border-r"
            >
              <Edit16 />
            </ToolButton>
            <ToolButton
              title="上传"
              className="border-r"
            >
              <Export16 />
            </ToolButton>
            <ToolButton
              title="下载"
              className="border-r"
            >
              <Download16 />
            </ToolButton>
            <ToolButton
              title="收藏"
              className="border-r"
            >
              <Star16 />
            </ToolButton>
            <ToolButton
              title="删除"
              className="border-r"
            >
              <TrashCan16 />
            </ToolButton>

            <div className="flex-grow" />

            <ToolButton
              title="筛选"
              className="border-l"
            >
              <Filter16 />
            </ToolButton>
            <ToolButton
              title="选择"
              className="border-l"
            >
              <Checkmark16 />
            </ToolButton>
            <ToolButton
              title="显隐"
              className="border-l"
            >
              <View16 />
            </ToolButton>
            <ToolButton
              title="展示方式"
              className="border-l"
            >
              <Grid16 />
            </ToolButton>
          </div>
          <div
            className={`
              p-4 flex-grow overflow-x-hidden overflow-y-auto
              ${loading ? 'bg-loading' : ''}
            `}
          >
            <div className="flex flex-wrap">
              {dirItems.map(({ name, type, hidden }) => {
                return (
                  <div
                    key={encodeURIComponent(name)}
                    title={name}
                    className={`
                      px-1 py-4 w-32 overflow-hidden hover:bg-gray-100 rounded select-none
                      ${hidden ? 'opacity-50' : ''}
                    `}
                    onDoubleClick={() => type === 1 && handleDirClick(name)}
                  >
                    <div className="text-center">
                      <Icon
                        itemName={type === 1 ? `${name}._dir` : name}
                      />
                    </div>
                    <p className="mt-2 text-xs text-center text-gray-700 truncate">{name}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface ToolButtonProps {
  title: string
  children: ReactNode
  className?: string
}

function ToolButton(props: ToolButtonProps) {

  const {
    title,
    children,
    className = '',
  } = props

  return (
    <div
      title={title}
      className={`
        w-8 h-full flex justify-center items-center cursor-pointer
        bg-white text-gray-500 hover:text-black active:bg-gray-200
        ${className}
      `}
    >
      {children}
    </div>
  )
}
