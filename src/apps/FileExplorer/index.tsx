import { CropGrowth32, Delete32, Download32 } from '@carbon/icons-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import Icon from './Icon'
import useFetch from '../../hooks/useFetch'
import { convertItemName, getBytesSize, getDownloadInfo, isSameItem, itemSorter, line } from '../../utils'
import { deleteItem, downloadItems, getDirItems, uploadFile } from '../../utils/api'
import { dirItemConverter } from '../../utils/converters'
import { rootInfoState } from '../../utils/state'
import { AppComponentProps, IDirItem, IHistory } from '../../utils/types'
import PathLink from './PathLink'
import ToolBar, { IToolBarDisabledMap } from './ToolBar'
import NameLine, { NameFailType } from './NameLine'
import { DateTime } from 'luxon'
import Toast from '../../components/EasyToast'
import Confirmor, { ConfirmorProps } from '../../components/Confirmor'
import VirtualItems from './VirtualItems'
import { THUMBNAIL_MATCH_LIST } from '../../utils/constant'
import Thumbnail from './Thumbnail'
import Side from './Side'
import useDragSelect from '../../hooks/useDragSelect'
import useDragOperations from '../../hooks/useDragOperations'
import useShortcuts from '../../hooks/useShortcuts'


export default function FileExplorer(props: AppComponentProps) {

  const { isTopWindow, setWindowTitle } = props

  const [rootInfo] = useRecoilState(rootInfoState)
  const [currentVolume, setCurrentVolume] = useState('')
  const [currentPath, setCurrentPath] = useState('')
  const [gridMode, setGridMode] = useState(true)
  const [history, setHistory] = useState<IHistory>({ position: -1, list: [] })
  const [selectedItemList, setSelectedItemList] = useState<IDirItem[]>([])
  const [newDirMode, setNewDirMode] = useState(false)
  const [renameMode, setRenameMode] = useState(false)
  const [waitScrollToSelected, setWaitScrollToSelected] = useState(false)
  const [waitDropToCurrentPath, setWaitDropToCurrentPath] = useState(false)
  const [downloadConfirmorProps, setDownloadConfirmorProps] = useState<ConfirmorProps>({ isOpen: false })
  const [deleteConfirmorProps, setDeleteConfirmorProps] = useState<ConfirmorProps>({ isOpen: false })
  const [virtualFiles, setVirtualFiles] = useState<File[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [hiddenShow, setHiddenShow] = useState(false)

  const rectRef = useRef(null)
  const containerRef = useRef(null)
  const containerInnerRef = useRef(null)
  const uploadInputRef = useRef(null)

  const { volumeList, volumeMountList } = useMemo(() => {
    const { volumeList } = rootInfo
    const volumeMountList = volumeList.map(v => v.mount)
    return { volumeList, volumeMountList }
  }, [rootInfo])

  const isInVolumeRoot = useMemo(() => volumeMountList.includes(currentPath), [volumeMountList, currentPath])

  useEffect(() => {
    const title = isInVolumeRoot ? currentPath : currentPath.split('/').pop() as string
    setWindowTitle(title)
  }, [currentPath, setWindowTitle, isInVolumeRoot])

  const { fetch, loading, data, setData } = useFetch((path: string) => getDirItems(path))
  const { fetch: fetchDelete, loading: deleting } = useFetch((path: string) => deleteItem(path))
  const { fetch: fetchUpload } = useFetch((path: string, file: File) => uploadFile(path, file))

  const { dirItemList, isItemListEmpty, dirCount, fileCount } = useMemo(() => {
    const list = data ? dirItemConverter(data).sort(itemSorter) : []
    const dirItemList = list
      .filter(o => o.name.toLowerCase().includes(filterText.toLowerCase()))
      .filter(o => hiddenShow ? true : !o.hidden)
    let dirCount = 0
    let fileCount = 0
    dirItemList.forEach(({ type }) => type === 1 ? dirCount++ : fileCount++)
    const isItemListEmpty = dirItemList.length === 0
    return { dirItemList, isItemListEmpty, dirCount, fileCount }
  }, [data, filterText, hiddenShow])

  const disabledMap: IToolBarDisabledMap = useMemo(() => {
    const { position, list } = history
    return {
      navBack: position <= 0,
      navForward: list.length === position + 1,
      refresh: loading || !currentPath,
      backToTop: !currentPath || isInVolumeRoot,
      newDir: newDirMode,
      rename: selectedItemList.length !== 1,
      upload: false,
      download: isItemListEmpty,
      store: false,
      delete: !selectedItemList.length,
      filter: false,
      selectAll: isItemListEmpty,
      showHidden: false,
      gridMode: false,
    }
  }, [history, loading, currentPath, isInVolumeRoot, newDirMode, selectedItemList, isItemListEmpty])

  const fetchPath = useCallback((path: string, keepData?: boolean) => {
    !keepData && setData(null)
    fetch(path)
    setNewDirMode(false)
  }, [setData, fetch])

  const updateHistory = useCallback((direction: 1 | -1, path?: string) => {
    const { position: pos, list: li } = history
    const position: number = pos + direction
    let list = [...li]
    if (direction === 1 && path) {
      list = list.filter((i, index) => index < position)
      list.push(path)
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

  const handleRename = useCallback(() => setRenameMode(true), [])

  const handleUploadStart = useCallback(async (files: File[]) => {
    setVirtualFiles(files)
    const okList: boolean[] = []
    for (const file of files) {
      const data = await fetchUpload(currentPath, file)
      const isUploaded = !!data?.hasDon
      if (isUploaded) {
        document.querySelector(`[data-name="${file.name}"]`)!.setAttribute('style', 'opacity:1;')
      }
      okList.push(isUploaded)
    }
    if (okList.every(Boolean)) {
      handleRefresh()
      Toast.toast('上传成功', 2000)
      setVirtualFiles([])
    }
    (uploadInputRef.current as any).value = ''
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

  const handleNameFail = useCallback((failType: NameFailType) => {
    if (['cancel', 'empty', 'no_change'].includes(failType)) {
      setNewDirMode(false)
      setRenameMode(false)
    }
  }, [])

  const handleUploadClick = useCallback(() => {
    (uploadInputRef.current as any)?.click()
  }, [])

  const handleDownloadClick = useCallback(() => {

    const { msg, downloadName, cmd } = getDownloadInfo(currentPath, selectedItemList)
    const close = () => setDownloadConfirmorProps({ isOpen: false })

    setDownloadConfirmorProps({
      isOpen: true,
      content: (
        <div className="p-4 text-center">
          <div className="p-4 flex justify-center">
            <Download32 />
          </div>
          <p className="mt-2 text-base break-all">{msg} ？</p>
        </div>
      ),
      onCancel: close,
      onConfirm: () => {
        close()
        downloadItems(currentPath, downloadName, cmd)
      },
    })

  }, [currentPath, selectedItemList])

  const handleDeleteClick = useCallback(async () => {
    const len = selectedItemList.length
    if (!len) return
    const msg = len === 1 ? selectedItemList[0].name : `${len} 个项目`
    const close = () => setDeleteConfirmorProps({ isOpen: false })

    setDeleteConfirmorProps({
      isOpen: true,
      content: (
        <div className="p-4 text-center">
          <div className="p-4 flex justify-center">
            <Delete32 />
          </div>
          <p className="mt-2 text-base break-all">删除 <span className="font-bold">{msg}</span> ？</p>
        </div>
      ),
      onCancel: close,
      onConfirm: async () => {
        close()
        const okList: boolean[] = []
        for (const item of selectedItemList) {
          const { name } = item
          const { ok } = await fetchDelete(`${currentPath}/${name}`)
          document.querySelector(`.dir-item[data-name="${name}"]`)?.setAttribute('style', 'opacity:0;')
          okList.push(ok)
        }
        if (okList.every(Boolean)) {
          handleRefresh()
          Toast.toast('删除成功', 2000)
        }
      },
    })
  }, [fetchDelete, currentPath, selectedItemList, handleRefresh])

  useEffect(() => {
    if (!currentPath && volumeList.length) {
      handleVolumeClick(volumeList[0].mount)
    }
  }, [currentPath, volumeList, handleVolumeClick])

  useEffect(() => {
    const container: any = containerRef.current
    if (container && waitScrollToSelected && !loading) {
      const target: any = document.querySelector('.dir-item[data-selected="true"]')
      const top = target ? target.offsetTop - 10 : 0
      container!.scrollTo({ top, behavior: 'smooth' })
      setWaitScrollToSelected(false)
    }
  }, [waitScrollToSelected, loading])

  useEffect(() => {
    setRenameMode(false)
    setSelectedItemList([])
    setFilterOpen(false)
    setFilterText('')
  }, [currentPath])

  useEffect(() => {
    setSelectedItemList([])
  }, [filterText])

  const handleItemClick = useCallback((e: any, item: IDirItem) => {
    if (newDirMode || renameMode) return
    let list = [...selectedItemList]
    const { metaKey, ctrlKey, shiftKey } = e
    const selectedLen = selectedItemList.length
    if (metaKey || ctrlKey) {
      list = list.find(o => isSameItem(o, item))
        ? list.filter(o => !isSameItem(o, item))
        : list.concat(item)
    } else if (shiftKey) {
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
    const isSelectAll = force || !selectedItemList.length
    setSelectedItemList(isSelectAll ? dirItemList : [])
  }, [setSelectedItemList, dirItemList, selectedItemList])

  const handleRectSelect = useCallback((info: { startX: number, startY: number, endX: number, endY: number }) => {
    const items = document.querySelectorAll('.dir-item')
    if (!items.length) return
    const { startX, startY, endX, endY } = info
    const indexList: number[] = []
    items.forEach((item: any, itemIndex) => {
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = item
      const isContained = offsetLeft + offsetWidth > startX &&
        offsetTop + offsetHeight > startY &&
        offsetLeft < endX &&
        offsetTop < endY
      isContained && indexList.push(itemIndex)
    })
    const names = dirItemList.filter((n, nIndex) => indexList.includes(nIndex))
    setSelectedItemList(names)
  }, [setSelectedItemList, dirItemList])

  useDragSelect({
    rectRef,
    containerRef,
    containerInnerRef,
    onDragging: handleRectSelect,
  })

  useDragOperations({
    containerInnerRef,
    onEnterContainer: () => {
      setWaitDropToCurrentPath(true)
    },
    onLeaveContainer: () => {
      setWaitDropToCurrentPath(false)
    },
    onUpload: files => {
      setWaitDropToCurrentPath(false)
      handleUploadStart(files)
    },
  })

  useShortcuts({
    type: 'keyup',
    bindCondition: isTopWindow && !newDirMode && !renameMode,
    shortcutFnMap: {
      'Delete': disabledMap.delete ? null : handleDeleteClick,
      'Escape': () => setSelectedItemList([]),
      'Shift+A': disabledMap.selectAll ? null : () => handleSelectAll(true),
      'Shift+D': disabledMap.download ? null : handleDownloadClick,
      'Shift+E': disabledMap.rename ? null : handleRename,
      'Shift+F': disabledMap.filter ? null : () => setFilterOpen(true),
      'Shift+H': disabledMap.showHidden ? null : () => setHiddenShow(!hiddenShow),
      'Shift+N': disabledMap.newDir ? null : handleNewDir,
      'Shift+R': disabledMap.refresh ? null : handleRefresh,
      'Shift+S': disabledMap.store ? null : null,
      'Shift+U': disabledMap.upload ? null : handleUploadClick,
      'Shift+V': disabledMap.showHidden ? null : () => setGridMode(!gridMode),
      'Shift+ArrowUp': disabledMap.backToTop ? null : handleBackToTop,
      'Shift+ArrowRight': disabledMap.navForward ? null : handleNavForward,
      'Shift+ArrowLeft': disabledMap.navBack ? null : handleNavBack,
    },
  })

  return (
    <>
      <div className="absolute inset-0 flex">
        {/* side */}
        <Side
          {...{ currentPath, currentVolume, volumeList }}
          onVolumeClick={handleVolumeClick}
        />
        {/* main */}
        <div className="relative flex-grow h-full bg-white flex flex-col">
          <ToolBar
            {...{ disabledMap, gridMode, filterOpen, filterText, hiddenShow }}
            {...{ setGridMode, setFilterOpen, setFilterText, setHiddenShow }}
            onNavBack={handleNavBack}
            onNavForward={handleNavForward}
            onRefresh={handleRefresh}
            onBackToTop={handleBackToTop}
            onNewDir={handleNewDir}
            onRename={handleRename}
            onUpload={handleUploadClick}
            onDownload={handleDownloadClick}
            onDelete={handleDeleteClick}
            onSelectAll={handleSelectAll}
          />
          <PathLink
            {...{ loading, dirCount, fileCount, currentPath, currentVolume }}
            selectedLen={selectedItemList.length}
            onDirClick={handleGoFullPath}
            onVolumeClick={handleVolumeClick}
          />
          <div
            ref={containerRef}
            className={line(`
              relative flex-grow overflow-x-hidden overflow-y-auto
              ${loading ? 'bg-loading' : ''}
              ${waitDropToCurrentPath ? 'outline-wait-drop' : ''}
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
              ref={containerInnerRef}
              className={line(`
                relative min-h-full flex flex-wrap content-start
                ${gridMode ? 'p-2' : 'p-4'}
              `)}
            >
              {/* new dir */}
              {newDirMode && (
                <div
                  className={line(`
                    overflow-hidden rounded select-none hover:bg-gray-100
                    ${gridMode ? 'm-2 px-1 py-3 w-28' : 'mb-1 px-2 py-1 w-full flex items-center'}
                  `)}
                >
                  <div className="flex justify-center items-center">
                    <Icon small={!gridMode} itemName="fake._dir_new" />
                  </div>
                  <div className={`${gridMode ? 'mt-2 text-center' : 'ml-4 flex justify-center items-center'}`}>
                    <NameLine
                      showInput
                      gridMode={gridMode}
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
                const small = !gridMode
                const itemName = convertItemName(item)
                const useThumbnail = THUMBNAIL_MATCH_LIST.some(ext => name.toLowerCase().endsWith(ext))
                return (
                  <div
                    key={encodeURIComponent(name)}
                    data-name={name}
                    data-selected={isSelected}
                    draggable
                    className={line(`
                      dir-item
                      overflow-hidden rounded select-none transition-opacity duration-300
                      ${gridMode ? 'm-2 px-1 py-3 w-28' : 'mb-1 px-2 py-1 w-full flex items-center'}
                      ${!gridMode && isSelected ? 'bg-blue-600' : 'hover:bg-gray-100'}
                      ${isSelected ? 'bg-gray-100' : ''}
                      ${(isSelected && deleting) ? 'bg-loading' : ''}
                      ${hidden ? 'opacity-50' : 'opacity-100'}
                    `)}
                    onClick={e => handleItemClick(e, item)}
                    onDoubleClick={() => isDir && handleDirOpen(name)}
                  >
                    <div className="flex justify-center items-center">
                      {useThumbnail ? (
                        <Thumbnail {...{ small, itemName, currentPath }} />
                      ) : (
                        <Icon {...{ small, itemName }} />
                      )}
                    </div>
                    <div className={`${gridMode ? 'mt-2 text-center' : 'ml-4 flex justify-center items-center'}`}>
                      <NameLine
                        showInput={renameMode && isSelected}
                        item={item}
                        isSelected={isSelected}
                        gridMode={gridMode}
                        currentPath={currentPath}
                        onSuccess={handleNameSuccess}
                        onFail={handleNameFail}
                      />
                    </div>
                    {!gridMode && (
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

              <VirtualItems {...{ virtualFiles, gridMode }} />

            </div>
          </div>
        </div>
      </div>

      <input
        multiple
        ref={uploadInputRef}
        type="file"
        className="hidden"
        onChange={(e: any) => handleUploadStart(e.target.files)}
      />

      <Confirmor {...downloadConfirmorProps} />
      <Confirmor {...deleteConfirmorProps} />
      
    </>
  )
}
