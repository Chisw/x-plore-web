import { ArrowUp16, Checkmark16, ChevronLeft16, ChevronRight16, VmdkDisk16, DocumentBlank16, Download16, Edit16, Export16, Filter16, Folder16, FolderAdd16, Grid16, Renew16, Star16, TrashCan16, View16, CropGrowth32 } from '@carbon/icons-react'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import Icon from '../components/Icon'
import useFetch from '../hooks/useFetch'
import { itemSorter } from '../utils'
import { getDirItems } from '../utils/api'
import { dirItemConverter } from '../utils/converters'
import { rootInfoState } from '../utils/state'
import { AppComponentProps, IHistory } from '../utils/types'


export default function FileExplorer(props: AppComponentProps) {

  const { setHeaderTitle } = props

  const [rootInfo] = useRecoilState(rootInfoState)
  const [currentVolume, setCurrentVolume] = useState('')
  const [currentPath, setCurrentPath] = useState('')
  const [history, setHistory] = useState<IHistory>({ indicator: -1, list: [] })

  const {
    volumeList,
    volumeMountList,
  } = useMemo(() => {
    const { volumeList } = rootInfo
    const volumeMountList = volumeList.map(v => v.mount)
    return {
      volumeList,
      volumeMountList,
    }
  }, [rootInfo])

  useEffect(() => {
    const title: string = volumeMountList.includes(currentPath)
      ? currentPath
      : currentPath.split('/').pop() as string
    setHeaderTitle(title)
  }, [currentPath, setHeaderTitle, volumeMountList])

  const { fetch, loading, data, setData } = useFetch(path => getDirItems(path as string))

  const fetchPath = useCallback((path) => {
    setData(null)
    fetch(path)
  }, [setData, fetch])

  const updateHistory = useCallback((direction: 1 | -1, path?: string) => {
    const { indicator: _ind, list: _li } = history
    const indicator: number = _ind + direction
    let list = [..._li]
    if (direction === 1) {
      if (path) {
        list = list.filter((i, index) => index < indicator)
        list.push(path)
      }
    }
    setHistory({ indicator, list })
  }, [history])

  const handleVolumeClick = useCallback((volumeMount: string) => {
    setCurrentVolume(volumeMount)
    setCurrentPath(volumeMount)
    fetchPath(volumeMount)
    updateHistory(1, volumeMount)
  }, [fetchPath, updateHistory])

  const handleDirClick = useCallback((dirMount: string) => {
    const newPath = `${currentPath}/${dirMount}`
    setCurrentPath(newPath)
    fetchPath(newPath)
    updateHistory(1, newPath)
  }, [fetchPath, currentPath, updateHistory])

  const handleNavBack = useCallback(() => {
    const { indicator: _ind, list: _li } = history
    const targetPath = _li[_ind - 1]
    setCurrentPath(targetPath)
    fetchPath(targetPath)
    updateHistory(-1)
  }, [history, updateHistory, fetchPath])

  const handleNavForward = useCallback(() => {
    const { indicator: _ind, list: _li } = history
    const targetPath = _li[_ind + 1]
    setCurrentPath(targetPath)
    fetchPath(targetPath)
    updateHistory(1)
  }, [history, updateHistory, fetchPath])

  const handleRefresh = useCallback(() => {
    fetchPath(currentPath)
  }, [fetchPath, currentPath])

  const handleBackToTop = useCallback(() => {
    const list = currentPath.split('/')
    list.pop()
    const newPath = list.join('/')
    setCurrentPath(newPath)
    fetchPath(newPath)
    updateHistory(1, newPath)
  }, [currentPath, fetchPath, setCurrentPath, updateHistory])

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
            {volumeList.map(({ label, mount }, volumeIndex) => {
              const title = `${mount} (${label})`
              const isActive = mount === currentVolume
              const canGoVolume = currentPath !== mount
              return (
                <div
                  key={volumeIndex}
                  title={title}
                  className={`
                    mb-1 p-1 text-xs flex items-center rounded cursor-pointer
                    ${isActive
                      ? 'bg-gray-300 text-black'
                      : 'text-gray-500 hover:bg-gray-200 hover:text-black'
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
              <span>{loading ? '-' : dirCount}</span>
              &emsp;
              <DocumentBlank16 />
              &nbsp;
              <span>{loading ? '-' : fileCount}</span>
            </div>
          </div>
          {/* tool bar */}
          <div className="h-8 flex-shrink-0 border-b flex">
            <ToolButton
              title="后退"
              disabled={history.indicator <= 0}
              onClick={handleNavBack}
            >
              <ChevronLeft16 />
            </ToolButton>
            <ToolButton
              title="前进"
              disabled={history.list.length === history.indicator + 1}
              onClick={handleNavForward}
            >
              <ChevronRight16 />
            </ToolButton>
            <ToolButton
              title="刷新"
              disabled={loading || !currentPath}
              onClick={handleRefresh}
            >
              <Renew16 />
            </ToolButton>
            <ToolButton
              title="返回上级"
              disabled={!currentPath || volumeMountList.includes(currentPath)}
              onClick={handleBackToTop}
            >
              <ArrowUp16 />
            </ToolButton>

            <ToolButton
              title="新建文件夹"
              className="border-l"
            >
              <FolderAdd16 />
            </ToolButton>
            <ToolButton
              title="重命名"
            >
              <Edit16 />
            </ToolButton>
            <ToolButton
              title="上传"
            >
              <Export16 />
            </ToolButton>
            <ToolButton
              title="下载"
            >
              <Download16 />
            </ToolButton>
            <ToolButton
              title="收藏"
            >
              <Star16 />
            </ToolButton>
            <ToolButton
              title="删除"
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
            >
              <Checkmark16 />
            </ToolButton>
            <ToolButton
              title="显隐"
            >
              <View16 />
            </ToolButton>
            <ToolButton
              title="展示方式"
            >
              <Grid16 />
            </ToolButton>
          </div>
          <div
            className={`
              relative p-2 flex-grow overflow-x-hidden overflow-y-auto
              ${loading ? 'bg-loading' : ''}
            `}
          >
            {(!loading && dirItems.length === 0) && (
              <div className="absolute inset-0 p-10 flex justify-end items-end text-gray-200">
                <CropGrowth32 />
              </div>
            )}
            <div className="flex flex-wrap">
              {dirItems.map(({ name, type, hidden, hasChildren }) => {
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
                        itemName={
                          type === 1
                            ? hasChildren
                              ? `${name}._dir`
                              : `${name}._dir_empty`
                            : name
                        }
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
  onClick?: () => void
  disabled?: boolean
}

function ToolButton(props: ToolButtonProps) {

  const {
    title,
    children,
    className = '',
    onClick = () => {},
    disabled = false,
  } = props

  return (
    <div
      title={title}
      className={`
        w-8 h-full flex justify-center items-center
        ${disabled
          ? 'cursor-not-allowed text-gray-200'
          : 'cursor-pointer bg-white text-gray-500 hover:text-black hover:bg-gray-100 active:bg-gray-200'
        }
        ${className}
      `}
      onClick={() => !disabled && onClick()}
    >
      {children}
    </div>
  )
}
