import { VmdkDisk16, CropGrowth32 } from '@carbon/icons-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import Icon from './Icon'
import useFetch from '../../hooks/useFetch'
import { convertItemName, getBytesSize, isSameItem, itemSorter, line } from '../../utils'
import { deleteItem, downloadItems, getDirItems, uploadFile } from '../../utils/api'
import { dirItemConverter } from '../../utils/converters'
import { rootInfoState } from '../../utils/state'
import { AppComponentProps, IDirItem, IHistory } from '../../utils/types'
import PathLinkList from './PathLinkList'
import ToolBar, { IToolBarDisabledMap } from './ToolBar'
import NameLine, { NameFailType } from './NameLine'
import Counter from './Counter'
import { throttle } from 'lodash'
import { DateTime } from 'luxon'

export type ViewShapeType = 'grid' | 'list'

export default function FileExplorer(props: AppComponentProps) {

  const { isTopWindow, setWindowTitle } = props

  const [rootInfo] = useRecoilState(rootInfoState)
  const [currentVolume, setCurrentVolume] = useState('')
  const [currentPath, setCurrentPath] = useState('')
  const [gridViewMode, setGridMode] = useState(true)
  const [history, setHistory] = useState<IHistory>({ position: -1, list: [] })
  const [selectedItemList, setSelectedItemList] = useState<IDirItem[]>([])
  const [newDirMode, setNewDirMode] = useState(false)
  const [renameMode, setRenameMode] = useState(false)
  const [waitScrollToSelected, setWaitScrollToSelected] = useState(false)

  const rectRef = useRef(null)
  const containerRef = useRef(null)
  const containerInnerRef = useRef(null)
  const uploadInputRef = useRef(null)

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
  const { fetch: fetchDelete, loading: deleting } = useFetch((path: string) => deleteItem(path))
  const { fetch: fetchUpload, loading: uploading } = useFetch((path: string, file: File) => uploadFile(path, file))

  const fetchPath = useCallback((path: string, keepData?: boolean) => {
    !keepData && setData(null)
    fetch(path)
    setNewDirMode(false)
  }, [setData, fetch])

  const updateHistory = useCallback((direction: 1 | -1, path?: string) => {
    const { position: pos, list: li } = history
    const position: number = pos + direction
    let list = [...li]
    if (direction === 1) {
      if (path) {
        list = list.filter((i, index) => index < position)
        list.push(path)
      }
    }
    setHistory({ position, list })
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
    const { position, list } = history
    const targetPath = list[position - 1]
    setCurrentPath(targetPath)
    fetchPath(targetPath)
    updateHistory(-1)
  }, [history, updateHistory, fetchPath])

  const handleNavForward = useCallback(() => {
    const { position, list } = history
    const targetPath = list[position + 1]
    setCurrentPath(targetPath)
    fetchPath(targetPath)
    updateHistory(1)
  }, [history, updateHistory, fetchPath])

  const handleRefresh = useCallback(async (cb?: () => void) => {
    setSelectedItemList([])
    await fetchPath(currentPath, true)
   cb && cb()
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
    setSelectedItemList([])
    setNewDirMode(true)
  }, [])

  const handleUploadChange = useCallback(async (e) => {
    const data = await fetchUpload(currentPath, e.target.files[0])
    if (data && data.hasDon) {
      handleRefresh()
    } else {
      alert(JSON.stringify(data))
    }
  }, [currentPath, fetchUpload, handleRefresh])

  const handleCancelSelect = useCallback((e: any) => {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      document.getElementById('file-explorer-name-input')
    ) return
    setSelectedItemList([])
  }, [])

  const handleNameSuccess = useCallback((item: IDirItem) => {
    setNewDirMode(false)
    setRenameMode(false)
    handleRefresh()
    setSelectedItemList([item])
    setWaitScrollToSelected(true)
  }, [handleRefresh])

  useEffect(() => {
    if (waitScrollToSelected && !loading) {
      const scroll = document.getElementById('dir-items-container')
      const target: any = document.querySelector('#dir-items-container .selected-item')
      const top = target ? target.offsetTop - 10 : 0
      scroll!.scrollTo({ top, behavior: 'smooth' })
      setWaitScrollToSelected(false)
    }
  }, [waitScrollToSelected, loading])

  const handleNameFail = useCallback((failType: NameFailType) => {
    if (['cancel', 'empty', 'no_change'].includes(failType)) {
      setNewDirMode(false)
      setRenameMode(false)
    }
  }, [])

  const handleDelete = useCallback(async () => {
    const msg = selectedItemList.length === 1 ? selectedItemList[0].name : `${selectedItemList.length} 个项目`
    if (window.confirm(`删除 ${msg} ？`)) {
      const okList: boolean[] = []
      for (const item of selectedItemList) {
        const { ok } = await fetchDelete(`${currentPath}/${item.name}`)
        okList.push(ok)
      }
      if (okList.every(Boolean)) handleRefresh()
    }
  }, [fetchDelete, currentPath, selectedItemList, handleRefresh])

  useEffect(() => {
    if (!currentPath && volumeList.length) {
      handleVolumeClick(volumeList[0].mount)
    }
  }, [currentPath, volumeList, handleVolumeClick])

  useEffect(() => {
    setRenameMode(false)
    setSelectedItemList([])
  }, [currentPath])

  const { dirItemList, isItemListEmpty, dirCount, fileCount } = useMemo(() => {
    const dirItemList = data ? dirItemConverter(data).sort(itemSorter) : []
    let dirCount = 0
    let fileCount = 0
    dirItemList.forEach(({ type, name }) => {
      if (type === 1) {
        dirCount++
      } else {
        fileCount++
      }
    })
    return { dirItemList, isItemListEmpty: dirItemList.length === 0, dirCount, fileCount }
  }, [data])

  const toolBarDisabledMap: IToolBarDisabledMap = useMemo(() => {
    const { position, list } = history
    return {
      navBack: position <= 0,
      navForward: list.length === position + 1,
      refresh: loading || !currentPath,
      backToTop: !currentPath || isCurrentPathVolume,
      newDir: newDirMode,
      rename: selectedItemList.length !== 1,
      download: isItemListEmpty,
      delete: !selectedItemList.length,
      selectAll: isItemListEmpty,
    }
  }, [history, loading, currentPath, isCurrentPathVolume, newDirMode, selectedItemList, isItemListEmpty])

  const handleDirItemClick = useCallback((e: any, item: IDirItem) => {
    if (newDirMode || renameMode) return
    let list = [...selectedItemList]
    const selectedLen = selectedItemList.length
    if (e.metaKey || e.ctrlKey) {
      list = list.find(o => isSameItem(o, item))
        ? list.filter(o => !isSameItem(o, item))
        : list.concat(item)
    } else if (e.shiftKey) {
      if (selectedLen) {
        const lastSelectedItem = selectedItemList[selectedLen - 1]
        const range: number[] = []
        dirItemList.forEach((_item, _itemIndex) => {
          if ([item, lastSelectedItem].find(o => isSameItem(o, _item))) {
            range.push(_itemIndex)
          }
        })
        range.sort((a, b) => a > b ? 1 : -1)
        const [start, end] = range
        list = dirItemList.slice(start, end + 1)
      } else {
        list = [item]
      }
    } else {
      list = [item]
    }
    setSelectedItemList(list)
  }, [newDirMode, renameMode, selectedItemList, dirItemList])

  const handleSelectAll = useCallback((force?: boolean) => {
    if (!force && selectedItemList.length) {
      setSelectedItemList([])
    } else {
      setSelectedItemList(dirItemList)
    }
  }, [setSelectedItemList, dirItemList, selectedItemList])

  useEffect(() => {
    const listener = (e: any) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        handleSelectAll(true)
      }
    }
    if (isTopWindow && !newDirMode && !renameMode) {
      document.addEventListener('keydown', listener)
    } else {
      document.removeEventListener('keydown', listener)
    }
    return () => document.removeEventListener('keydown', listener)
  }, [isTopWindow, handleSelectAll, newDirMode, renameMode])

  const handleRectSelect = useCallback((rectArea: { startX: number, startY: number, endX: number, endY: number }) => {
    const items = document.querySelectorAll('.dir-item')
    if (!items.length) return
    const { startX, startY, endX, endY } = rectArea
    const indexList: number[] = []
    items.forEach((item: any, itemIndex) => {
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = item
      if (
        offsetLeft + offsetWidth > startX &&
        offsetTop + offsetHeight > startY &&
        offsetLeft < endX &&
        offsetTop < endY
      ) {
        indexList.push(itemIndex)
      }
    })
    const names = dirItemList.filter((n, nIndex) => indexList.includes(nIndex))
    setSelectedItemList(names)
  }, [setSelectedItemList, dirItemList])

  useEffect(() => {
    const rect: any = rectRef.current
    const container: any = containerRef.current
    const containerInner: any = containerInnerRef.current
    if (!rect || !container || !containerInner) return

    const throttleHandleRectSelect = throttle(handleRectSelect, 100)

    let isMouseDown = false
    let startX = 0
    let startY = 0
    let endX = 0
    let endY = 0
    let rectTop = 0
    let rectLeft = 0
    let rectWidth = 0
    let rectHeight = 0
    let containerTop = 0
    let containerLeft = 0
    let containerInnerWidth = 0
    let containerInnerHeight = 0

    const mousedownListener = (e: any) => {

      const isLeftClick = e.which === 1
      const isInInner = e.target.getAttribute('id') === 'dir-items-container-inner'  // prevent start moving on items

      if (!isLeftClick || !isInInner) return

      isMouseDown = true

      const event = window.event || e
      const { top, left } = container.getBoundingClientRect()
      const { width, height } = containerInner.getBoundingClientRect()

      containerTop = top
      containerLeft = left
      containerInnerWidth = width
      containerInnerHeight = height

      startX = (event.x || event.clientX) - containerLeft
      startY = (event.y || event.clientY) - containerTop + container.scrollTop
      rect.style.left = `${startX}px`
      rect.style.top = `${startY}px`
    }

    const mousemoveListener = (e: any) => {
      if (isMouseDown) {
        const event: any = window.event || e
        endX = (event.x || event.clientX) - containerLeft
        endY = (event.y || event.clientY) - containerTop + container.scrollTop

        const borderOffset = -2
        const maxWidth = endX > startX
          ? containerInnerWidth - startX + borderOffset
          : startX
        const maxHeight = endY > startY
          ? containerInnerHeight - startY + borderOffset
          : startY

        rectTop = Math.max(Math.min(endY, startY), 0)
        rectLeft = Math.max(Math.min(endX, startX), 0)
        rectWidth = Math.min(Math.abs(endX - startX), maxWidth)
        rectHeight = Math.min(Math.abs(endY - startY), maxHeight)

        rect.style.top = `${rectTop}px`
        rect.style.left = `${rectLeft}px`
        rect.style.width = `${rectWidth}px`
        rect.style.height = `${rectHeight}px`
        rect.style.display = 'block'

        throttleHandleRectSelect({
          startX: rectLeft,
          startY: rectTop,
          endX: rectLeft + rectWidth,
          endY: rectTop + rectHeight,
        })
      }
    }

    const mouseupListener = (e: any) => {
      if (!isMouseDown) return
      isMouseDown = false
      rect.style.display = 'none'
    }

    const bind = () => {
      container.addEventListener('mousedown', mousedownListener)
      document.addEventListener('mousemove', mousemoveListener)
      document.addEventListener('mouseup', mouseupListener)
    }

    const unbind = () => {
      container.removeEventListener('mousedown', mousedownListener)
      document.removeEventListener('mousemove', mousemoveListener)
      document.removeEventListener('mouseup', mouseupListener)
    }

    bind()
    return unbind
  }, [handleRectSelect])

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
                  className={line(`
                    mb-1 p-1 text-xs flex items-center rounded cursor-pointer
                    ${isActive
                      ? 'bg-gray-300 text-black'
                      : 'text-gray-500 hover:bg-gray-200 hover:text-black'
                    }
                  `)}
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
              {...{ currentPath, currentVolume }}
              onDirClick={handleGoFullPath}
              onVolumeClick={handleVolumeClick}
            />
            <Counter
              {...{ loading, dirCount, fileCount }}
              selectedNameLen={selectedItemList.length}
            />
          </div>
          <ToolBar
            toolBarDisabledMap={toolBarDisabledMap}
            gridViewMode={gridViewMode}
            setGridMode={setGridMode}
            onNavBack={handleNavBack}
            onNavForward={handleNavForward}
            onRefresh={handleRefresh}
            onBackToTop={handleBackToTop}
            onNewDir={handleNewDir}
            onRename={() => setRenameMode(true)}
            onUpload={() => (uploadInputRef.current as any)?.click()}
            onDownload={() => downloadItems(currentPath, selectedItemList)}
            onDelete={handleDelete}
            onSelectAll={handleSelectAll}
          />
          <div
            id="dir-items-container"
            ref={containerRef}
            className={line(`
              relative flex-grow overflow-x-hidden overflow-y-auto
              ${(loading || uploading) ? 'bg-loading' : ''}
            `)}
            onMouseDownCapture={handleCancelSelect}
          >
            <div
              ref={rectRef}
              className="hidden absolute z-10 border box-content border-gray-400 bg-black-100"
            />
            {/* empty tip */}
            {(!loading && isItemListEmpty) && (
              <div className="absolute inset-0 p-10 flex justify-end items-end text-gray-200">
                <CropGrowth32 />
              </div>
            )}
            <div
              id="dir-items-container-inner"
              ref={containerInnerRef}
              className={line(`
                relative min-h-full flex flex-wrap content-start
                ${gridViewMode ? 'p-2' : 'p-4'}
              `)}
            >
              {/* new dir */}
              {newDirMode && (
                <div
                  className={line(`
                    overflow-hidden rounded select-none hover:bg-gray-100
                    ${gridViewMode ? 'm-2 px-1 py-3 w-28' : 'mb-1 px-2 py-1 w-full flex items-center'}
                  `)}
                >
                  <div className="flex justify-center items-center">
                    <Icon small={!gridViewMode} itemName="fake._dir_new" />
                  </div>
                  <div className={`${gridViewMode ? 'mt-2 text-center' : 'ml-4 flex justify-center items-center'}`}>
                    <NameLine
                      showInput
                      gridViewMode={gridViewMode}
                      currentPath={currentPath}
                      onSuccess={handleNameSuccess}
                      onFail={handleNameFail}
                    />
                  </div>
                </div>
              )}
              {/* items */}
              {dirItemList.map(item => {
                const { name, type, hidden, size, timestamp } = item
                const isDir = type === 1
                const isSelected = !!selectedItemList.find(o => isSameItem(o, item))
                return (
                  <div
                    key={encodeURIComponent(name)}
                    className={line(`
                      dir-item
                      overflow-hidden rounded select-none
                      ${gridViewMode ? 'm-2 px-1 py-3 w-28' : 'mb-1 px-2 py-1 w-full flex items-center'}
                      ${!gridViewMode && isSelected ? 'bg-blue-600' : 'hover:bg-gray-100'}
                      ${isSelected ? 'selected-item bg-gray-100' : ''}
                      ${(isSelected && deleting) ? 'bg-loading' : ''}
                      ${hidden ? 'opacity-50' : ''}
                    `)}
                    onClick={e => handleDirItemClick(e, item)}
                    onDoubleClick={() => isDir && handleDirOpen(name)}
                  >
                    <div className="flex justify-center items-center">
                      <Icon small={!gridViewMode} itemName={convertItemName(item)} />
                    </div>
                    <div className={`${gridViewMode ? 'mt-2 text-center' : 'ml-4 flex justify-center items-center'}`}>
                      <NameLine
                        showInput={renameMode && isSelected}
                        item={item}
                        isSelected={isSelected}
                        gridViewMode={gridViewMode}
                        currentPath={currentPath}
                        onSuccess={handleNameSuccess}
                        onFail={handleNameFail}
                      />
                    </div>
                    {!gridViewMode && (
                      <>
                        <div className={`w-full text-right text-xs ${isSelected ? 'text-white' : 'text-gray-400'} font-din`}>
                          {size ? getBytesSize(size) : '--'}
                        </div>
                        <div className={`w-full text-right text-xs ${isSelected ? 'text-white' : 'text-gray-400'} font-din`}>
                          {timestamp ? DateTime.fromMillis(timestamp).toFormat('yyyy-MM-dd HH:mm:ss') : '--'}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <input
        multiple
        ref={uploadInputRef}
        type="file"
        className="hidden"
        onChange={handleUploadChange}
      />
    </>
  )
}

