import { VmdkDisk16, DocumentBlank16,Folder16, CropGrowth32, Checkmark16 } from '@carbon/icons-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import Icon from './Icon'
import useFetch from '../../hooks/useFetch'
import { itemSorter } from '../../utils'
import { getDirItems } from '../../utils/api'
import { dirItemConverter } from '../../utils/converters'
import { rootInfoState } from '../../utils/state'
import { AppComponentProps, IHistory } from '../../utils/types'
import PathLinkList from './PathLinkList'
import ToolBar, { IToolBarDisabledMap } from './ToolBar'
import NameInput from './NameInput'


export default function FileExplorer(props: AppComponentProps) {

  const { setWindowTitle } = props

  const [rootInfo] = useRecoilState(rootInfoState)
  const [currentVolume, setCurrentVolume] = useState('')
  const [currentPath, setCurrentPath] = useState('')
  const [history, setHistory] = useState<IHistory>({ indicator: -1, list: [] })
  const [newDirShow, setNewDirShow] = useState(false)
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const [renameShow, setRenameShow] = useState(false)

  const { volumeList, volumeMountList } = useMemo(() => {
    const { volumeList } = rootInfo
    const volumeMountList = volumeList.map(v => v.mount)
    return { volumeList, volumeMountList }
  }, [rootInfo])

  const isCurrentPathVolume = useMemo(() => volumeMountList.includes(currentPath), [volumeMountList, currentPath])

  useEffect(() => {
    const title = isCurrentPathVolume ? currentPath : currentPath.split('/').pop() as string
    setWindowTitle(title)
  }, [currentPath, setWindowTitle, isCurrentPathVolume])

  const { fetch, loading, data, setData } = useFetch((path: string) => getDirItems(path))

  const fetchPath = useCallback((path) => {
    setData(null)
    fetch(path)
    setNewDirShow(false)
  }, [setData, fetch])

  const toolBarDisabledMap: IToolBarDisabledMap = useMemo(() => {
    const { indicator, list } = history
    return {
      navBack: indicator <= 0,
      navForward: list.length === indicator + 1,
      refresh: loading || !currentPath,
      backToTop: !currentPath || isCurrentPathVolume,
      newDir: newDirShow,
      rename: selectedNames.length !== 1,
    }
  }, [history, loading, currentPath, isCurrentPathVolume, newDirShow, selectedNames])

  const updateHistory = useCallback((direction: 1 | -1, path?: string) => {
    const { indicator: ind, list: li } = history
    const indicator: number = ind + direction
    let list = [...li]
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

  const handleDirOpen = useCallback((dirMount: string) => {
    const newPath = `${currentPath}/${dirMount}`
    setCurrentPath(newPath)
    fetchPath(newPath)
    updateHistory(1, newPath)
  }, [fetchPath, currentPath, updateHistory])

  const handleGoFullPath = useCallback((fullPath: string) => {
    setCurrentPath(fullPath)
    fetchPath(fullPath)
    updateHistory(1, fullPath)
  }, [fetchPath, updateHistory])

  const handleNavBack = useCallback(() => {
    const { indicator, list } = history
    const targetPath = list[indicator - 1]
    setCurrentPath(targetPath)
    fetchPath(targetPath)
    updateHistory(-1)
  }, [history, updateHistory, fetchPath])

  const handleNavForward = useCallback(() => {
    const { indicator, list } = history
    const targetPath = list[indicator + 1]
    setCurrentPath(targetPath)
    fetchPath(targetPath)
    updateHistory(1)
  }, [history, updateHistory, fetchPath])

  const handleRefresh = useCallback(() => {
    setSelectedNames([])
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

  const handleNewDir = useCallback(() => {
    setNewDirShow(true)
  }, [])

  const handleItemSelect = useCallback((name: string) => {
    // const names = [...selectedNames]
    setSelectedNames([name])
  }, [])

  const handleRename = useCallback(() => {
    setRenameShow(true)
  }, [])

  useEffect(() => {
    if (!currentPath && volumeList.length) {
      handleVolumeClick(volumeList[0].mount)
    }
  }, [currentPath, volumeList, handleVolumeClick])

  useEffect(() => setSelectedNames([]), [currentPath])

  const { dirItems, dirCount, fileCount } = useMemo(() => {
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
    return { dirItems, dirCount, fileCount }
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
              const canVolumeClick = currentPath !== mount
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
                  onClick={() => canVolumeClick && handleVolumeClick(mount)}
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
          <div className="flex-shrink-0 border-b px-2 py-1 text-xs text-gray-400 select-none flex justify-between items-center">
            <PathLinkList
              currentPath={currentPath}
              currentVolume={currentVolume}
              onDirClick={handleGoFullPath}
              onVolumeClick={handleVolumeClick}
            />
            <div className="flex-shrink-0 flex items-center pl-4">
              {!!selectedNames.length && (
                <>
                  <Checkmark16 />&nbsp;<span>{loading ? '-' : selectedNames.length}</span>
                  &emsp;
                </>
              )}
              <Folder16 />&nbsp;<span>{loading ? '-' : dirCount}</span>
              &emsp;
              <DocumentBlank16 />&nbsp;<span>{loading ? '-' : fileCount}</span>
            </div>
          </div>
          <ToolBar
            toolBarDisabledMap={toolBarDisabledMap}
            handleNavBack={handleNavBack}
            handleNavForward={handleNavForward}
            handleRefresh={handleRefresh}
            handleBackToTop={handleBackToTop}
            handleNewDir={handleNewDir}
            handleRename={handleRename}
          />
          <div
            className={`
              relative p-2 flex-grow overflow-x-hidden overflow-y-auto
              ${loading ? 'bg-loading' : ''}
            `}
            onClick={() => {
              setSelectedNames([])
            }}
          >
            {(!loading && dirItems.length === 0) && (
              <div className="absolute inset-0 p-10 flex justify-end items-end text-gray-200">
                <CropGrowth32 />
              </div>
            )}
            <div className="flex flex-wrap">
              {newDirShow && (
                <div className="m-2 px-1 py-4 w-28 overflow-hidden hover:bg-gray-100 rounded select-none">
                  <div className="text-center">
                    <Icon itemName="template._dir_new"/>
                  </div>
                  <NameInput
                    currentPath={currentPath}
                    onSuccess={name => {
                      setNewDirShow(false)
                      handleRefresh()
                      setSelectedNames([name])
                    }}
                    onFail={msg => ['cancel', 'empty'].includes(msg) && setNewDirShow(false)}
                  />
                </div>
              )}
              {dirItems.map(({ name, type, hidden, hasChildren }) => {
                const isDir = type === 1
                const isSelected = selectedNames.includes(name)
                return (
                  <div
                    key={encodeURIComponent(name)}
                    className={`
                      m-2 px-1 py-4 w-28 overflow-hidden rounded select-none hover:bg-gray-100
                      ${hidden ? 'opacity-50' : ''}
                      ${isSelected ? 'bg-gray-100' : ''}
                    `}
                    onClick={e => {
                      e.stopPropagation()
                      setRenameShow(false)
                      handleItemSelect(name)
                    }}
                    onDoubleClick={() => isDir && handleDirOpen(name)}
                  >
                    <div className="text-center">
                      <Icon
                        itemName={
                          isDir
                            ? `${name}._dir${hasChildren ? '' : '_empty'}`
                            : name
                        }
                      />
                    </div>
                    {(isSelected &&renameShow) ? (
                      <NameInput
                        oldName={name}
                        currentPath={currentPath}
                        onSuccess={name => {
                          setRenameShow(false)
                          handleRefresh()
                          setSelectedNames([name])
                        }}
                        onFail={msg => ['cancel', 'empty'].includes(msg) && setRenameShow(false)}
                      />
                    ) : (
                      <div
                        title={name}
                        className="mt-2 text-center"
                      >
                        <span
                          className={`
                            inline-block px-2 max-w-full rounded truncate text-xs
                            ${isSelected ? 'bg-blue-600 text-white' : 'text-gray-700'}
                          `}
                        >
                          {name}
                        </span>
                      </div>
                    )}
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

