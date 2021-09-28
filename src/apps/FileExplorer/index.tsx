import { CropGrowth32, Delete32, Download32 } from '@carbon/icons-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import Icon from './Icon'
import useFetch from '../../hooks/useFetch'
import { convertItemName, getBytesSize, getDownloadInfo, getIsContained, isSameItem, itemSorter, line } from '../../utils'
import { deleteItem, downloadItems, getDirSize, getPathItems, uploadFile } from '../../utils/api'
import { dirItemConverter } from '../../utils/converters'
import { rootInfoState, sizeMapState } from '../../utils/state'
import { AppComponentProps, DirectionType, IDirItem, IHistory, IRectInfo } from '../../utils/types'
import PathLink from './PathLink'
import ToolBar, { IToolBarDisabledMap } from './ToolBar'
import NameLine, { NameFailType } from './NameLine'
import { DateTime } from 'luxon'
import Toast from '../../components/EasyToast'
import Confirmor, { ConfirmorProps } from '../../components/Confirmor'
import VirtualItems from './VirtualItems'
import Side from './Side'
import useDragSelect from '../../hooks/useDragSelect'
import useDragOperations from '../../hooks/useDragOperations'
import useShortcuts from '../../hooks/useShortcuts'
import { pick } from 'lodash'
import { ContextMenu } from '@blueprintjs/core'
import Menus from './Menus'


export default function FileExplorer(props: AppComponentProps) {

  const { isTopWindow, setWindowTitle } = props

  const [rootInfo] = useRecoilState(rootInfoState)
  const [sizeMap, setSizeMap] = useRecoilState(sizeMapState)
  const [currentPath, setCurrentPath] = useState('')
  const [activeVolume, setActiveVolume] = useState('')
  const [gridMode, setGridMode] = useState(true)
  const [history, setHistory] = useState<IHistory>({ position: -1, list: [] })
  const [selectedItemList, setSelectedItemList] = useState<IDirItem[]>([])
  const [newDirMode, setNewDirMode] = useState(false)
  const [newTxtMode, setNewTxtMode] = useState(false)
  const [renameMode, setRenameMode] = useState(false)
  const [filterMode, setFilterMode] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [waitScrollToSelected, setWaitScrollToSelected] = useState(false)
  const [waitDropToCurrentPath, setWaitDropToCurrentPath] = useState(false)
  const [downloadConfirmorProps, setDownloadConfirmorProps] = useState<ConfirmorProps>({ isOpen: false })
  const [deleteConfirmorProps, setDeleteConfirmorProps] = useState<ConfirmorProps>({ isOpen: false })
  const [virtualFiles, setVirtualFiles] = useState<File[]>([])
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

  const { fetch: fetchPath, loading: fetching, data, setData } = useFetch((path: string) => getPathItems(path))
  const { fetch: deletePath, loading: deleting } = useFetch((path: string) => deleteItem(path))
  const { fetch: uploadFileToPath } = useFetch((path: string, file: File) => uploadFile(path, file))
  const { fetch: getSize, loading: getting } = useFetch((path: string) => getDirSize(path))

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
      refresh: fetching || !currentPath,
      backToTop: !currentPath || isInVolumeRoot,
      newDir: newDirMode || newTxtMode,
      newTxt: newDirMode || newTxtMode,
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
  }, [history, fetching, currentPath, isInVolumeRoot, newDirMode, newTxtMode, selectedItemList, isItemListEmpty])

  const fetchPathData = useCallback((path: string, keepData?: boolean) => {
    !keepData && setData(null)
    fetchPath(path)
    setNewDirMode(false)
  }, [setData, fetchPath])

  const updateHistory = useCallback((direction: DirectionType, path?: string) => {
    const { position: pos, list: li } = history
    const position: number = pos + direction
    let list = [...li]
    if (direction === 1 && path) {
      list = list.filter((i, index) => index < position)
      list.push(path)
    }
    setHistory({ position, list })
  }, [history])

  const handlePathChange = useCallback((props: {
    path: string
    direction: DirectionType
    needPushPath?: boolean
    needUpdateVolume?: boolean
  }) => {
    const { path, direction, needPushPath, needUpdateVolume } = props
    setCurrentPath(path)
    fetchPathData(path)
    updateHistory(direction, needPushPath ? path : undefined)
    if (needUpdateVolume) {
      const mount = volumeMountList.find(m => path.startsWith(m))!
      setActiveVolume(mount)
    }
  }, [fetchPathData, volumeMountList, updateHistory])

  const handleVolumeClick = useCallback((path: string) => {
    handlePathChange({ path, direction: 1, needPushPath: true, needUpdateVolume: true })
  }, [handlePathChange])

  const handleDirOpen = useCallback((dirName: string) => {
    const path = `${currentPath}/${dirName}`
    handlePathChange({ path, direction: 1, needPushPath: true })
  }, [handlePathChange, currentPath])

  const handleGoFullPath = useCallback((path: string) => {
    handlePathChange({ path, direction: 1, needPushPath: true })
  }, [handlePathChange])

  const handleNavBack = useCallback(() => {
    const { position, list } = history
    const path = list[position - 1]
    handlePathChange({ path, direction: -1, needUpdateVolume: true })
  }, [history, handlePathChange])

  const handleNavForward = useCallback(() => {
    const { position, list } = history
    const path = list[position + 1]
    handlePathChange({ path, direction: 1, needUpdateVolume: true })
  }, [history, handlePathChange])

  const handleRefresh = useCallback(() => {
    setSelectedItemList([])
    fetchPathData(currentPath, true)
  }, [fetchPathData, currentPath])

  const handleBackToTop = useCallback(() => {
    const list = currentPath.split('/')
    list.pop()
    const path = list.join('/')
    handlePathChange({ path, direction: 1, needPushPath: true })
  }, [currentPath, handlePathChange])

  const handleCreate = useCallback((create: 'dir' | 'txt') => {
    setSelectedItemList([])
    create === 'dir' ? setNewDirMode(true) : setNewTxtMode(true)
  }, [])

  const handleRename = useCallback(() => setRenameMode(true), [])

  const handleUploadStart = useCallback(async (files: File[], dir?: string) => {
    !dir && setVirtualFiles(files)
    const okList: boolean[] = []
    for (const file of files) {
      const data = await uploadFileToPath(`${currentPath}${dir ? `/${dir}` : ''}`, file)
      const isUploaded = !!data?.hasDon
      if (isUploaded) {
        document.querySelector(`[data-name="${file.name}"]`)?.setAttribute('style', 'opacity:1;')
      }
      okList.push(isUploaded)
    }
    if (okList.every(Boolean)) {
      handleRefresh()
      Toast.toast('上传成功', 2000)
      setVirtualFiles([])
    }
    ;(uploadInputRef.current as any).value = ''
  }, [currentPath, uploadFileToPath, handleRefresh])

  const handleCancelSelect = useCallback((e: any) => {
    if (e.button === 2) return  // oncontextmenu
    if (  // avoid multiple select and rename
      e.metaKey || e.ctrlKey || e.shiftKey ||
      document.getElementById('file-explorer-name-input')
    ) return
    setSelectedItemList([])
  }, [])

  const handleNameSuccess = useCallback((item: IDirItem) => {
    setNewDirMode(false)
    setNewTxtMode(false)
    setRenameMode(false)
    handleRefresh()
    setSelectedItemList([item])
    setWaitScrollToSelected(true)
  }, [handleRefresh])

  const handleNameFail = useCallback((failType: NameFailType) => {
    if (['cancel', 'empty', 'no_change'].includes(failType)) {
      setNewDirMode(false)
      setNewTxtMode(false)
      setRenameMode(false)
    }
  }, [])

  const handleUploadClick = useCallback(() => {
    (uploadInputRef.current as any)?.click()
  }, [])

  const handleDownloadClick = useCallback((contextItemList?: IDirItem[]) => {
    const processList = contextItemList || selectedItemList
    const { msg, downloadName, cmd } = getDownloadInfo(currentPath, processList)
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

  const handleDeleteClick = useCallback(async (contextItemList?: IDirItem[]) => {
    const processList = contextItemList || selectedItemList
    const len = processList.length
    if (!len) return
    const msg = len === 1 ? processList[0].name : `${len} 个项目`
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
        for (const item of processList) {
          const { name } = item
          const { ok } = await deletePath(`${currentPath}/${name}`)
          document.querySelector(`.dir-item[data-name="${name}"]`)?.setAttribute('style', 'opacity:0;')
          okList.push(ok)
        }
        if (okList.every(Boolean)) {
          handleRefresh()
          Toast.toast('删除成功', 2000)
        }
      },
    })
  }, [deletePath, currentPath, selectedItemList, handleRefresh])

  useEffect(() => {
    if (!currentPath && volumeList.length) {
      handleVolumeClick(volumeList[0].mount)
    }
  }, [currentPath, volumeList, handleVolumeClick])

  useEffect(() => {
    const container: any = containerRef.current
    if (container && waitScrollToSelected && !fetching) {
      const target: any = document.querySelector('.dir-item[data-selected="true"]')
      const top = target ? target.offsetTop - 10 : 0
      container!.scrollTo({ top, behavior: 'smooth' })
      setWaitScrollToSelected(false)
    }
  }, [waitScrollToSelected, fetching])

  useEffect(() => {
    setRenameMode(false)
    setSelectedItemList([])
    setFilterMode(false)
    setFilterText('')
  }, [currentPath])

  useEffect(() => setSelectedItemList([]), [filterText])

  const updateDirSize = useCallback(async (name: string) => {
    const path = `${currentPath}/${name}`
    const { hasDon, size } = await getSize(path)
    hasDon && setSizeMap({ ...sizeMap, [path]: size })
  }, [currentPath, getSize, sizeMap, setSizeMap])

  const handleItemClick = useCallback((e: any, item: IDirItem) => {
    if (newDirMode || newTxtMode || renameMode) return
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
      item.type === 1 && updateDirSize(item.name)
    }
    setSelectedItemList(list)
  }, [newDirMode, newTxtMode, renameMode, selectedItemList, dirItemList, updateDirSize])

  const handleItemDoubleClick = useCallback((item: IDirItem) => {
    const { type, name } = item
    const isDir = type === 1
    if (isDir) {
      handleDirOpen(name)
    } else {
      handleDownloadClick()
    }
  }, [handleDirOpen, handleDownloadClick])

  const handleSelectAll = useCallback((force?: boolean) => {
    const isSelectAll = force || !selectedItemList.length
    setSelectedItemList(isSelectAll ? dirItemList : [])
  }, [setSelectedItemList, dirItemList, selectedItemList])

  const handleRectSelect = useCallback((info: IRectInfo) => {
    const itemElements = document.querySelectorAll('.dir-item')
    if (!itemElements.length) return
    const indexList: number[] = []
    itemElements.forEach((el: any, elIndex) => {
      const isContained = getIsContained({
        ...info,
        ...pick(el, 'offsetTop', 'offsetLeft', 'offsetWidth', 'offsetHeight'),
      })
      isContained && indexList.push(elIndex)
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
    onUpload: (files, dir) => {
      setWaitDropToCurrentPath(false)
      handleUploadStart(files, dir)
    },
  })

  useShortcuts({
    type: 'keyup',
    bindCondition: isTopWindow && !newDirMode && !newTxtMode && !renameMode && !filterMode && !ContextMenu.isOpen(),
    shortcutMap: {
      'Delete': disabledMap.delete ? null : handleDeleteClick,
      'Escape': () => setSelectedItemList([]),
      'Shift+A': disabledMap.selectAll ? null : () => handleSelectAll(true),
      'Shift+D': disabledMap.download ? null : handleDownloadClick,
      'Shift+E': disabledMap.rename ? null : handleRename,
      'Shift+F': disabledMap.filter ? null : () => setFilterMode(true),
      'Shift+G': disabledMap.showHidden ? null : () => setGridMode(true),
      'Shift+H': disabledMap.showHidden ? null : () => setHiddenShow(!hiddenShow),
      'Shift+L': disabledMap.showHidden ? null : () => setGridMode(false),
      'Shift+N': disabledMap.newDir ? null : () => handleCreate('dir'),
      'Shift+R': disabledMap.refresh ? null : handleRefresh,
      'Shift+S': disabledMap.store ? null : null,
      'Shift+T': disabledMap.newTxt ? null : () => handleCreate('txt'),
      'Shift+U': disabledMap.upload ? null : handleUploadClick,
      'Shift+ArrowUp': disabledMap.backToTop ? null : handleBackToTop,
      'Shift+ArrowRight': disabledMap.navForward ? null : handleNavForward,
      'Shift+ArrowLeft': disabledMap.navBack ? null : handleNavBack,
      'Shift+ArrowDown': (selectedItemList.length === 1 && selectedItemList[0].type === 1)
        ? () => handleDirOpen(selectedItemList[0].name)
        : null,
    },
  })

  const handleContextMenu = useCallback((event: any) => {
    event.preventDefault()
    event.stopPropagation()
    const { target, clientX: left, clientY: top } = event
    const menuProps = {
      target, dirItemList, selectedItemList,
      setNewDirMode, setNewTxtMode, setSelectedItemList,
      handleRefresh, handleRename, handleUploadClick, handleDownloadClick, handleDeleteClick,
    }
    ContextMenu.show(<Menus {...menuProps} />, { top, left })
  }, [dirItemList, selectedItemList, handleRefresh, handleRename, handleUploadClick, handleDownloadClick, handleDeleteClick])

  return (
    <>
      <div className="absolute inset-0 flex">
        {/* side */}
        <Side
          {...{ currentPath, activeVolume, volumeList }}
          onVolumeClick={handleVolumeClick}
        />
        {/* main */}
        <div className="relative flex-grow h-full bg-white flex flex-col">
          <ToolBar
            {...{ disabledMap, gridMode, filterMode, filterText, hiddenShow }}
            {...{ setGridMode, setFilterMode, setFilterText, setHiddenShow }}
            onNavBack={handleNavBack}
            onNavForward={handleNavForward}
            onRefresh={handleRefresh}
            onBackToTop={handleBackToTop}
            onNewDir={() => handleCreate('dir')}
            onNewTxt={() => handleCreate('txt')}
            onRename={handleRename}
            onUpload={handleUploadClick}
            onDownload={handleDownloadClick}
            onDelete={handleDeleteClick}
            onSelectAll={handleSelectAll}
          />
          <PathLink
            {...{ dirCount, fileCount, currentPath, activeVolume }}
            loading={fetching}
            selectedLen={selectedItemList.length}
            onDirClick={handleGoFullPath}
            onVolumeClick={handleVolumeClick}
          />
          <div
            ref={containerRef}
            data-drag-hover={waitDropToCurrentPath}
            className={line(`
              relative flex-grow overflow-x-hidden overflow-y-auto
              ${fetching ? 'bg-loading' : ''}
            `)}
            onMouseDownCapture={handleCancelSelect}
          >
            <div
              ref={rectRef}
              className="hidden absolute z-10 border box-content border-gray-400 bg-black-100"
            />
            {/* empty tip */}
            {(!fetching && isItemListEmpty) && (
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
              onContextMenu={handleContextMenu}
            >
              {/* create */}
              {(newDirMode || newTxtMode) && (
                <div
                  className={line(`
                    overflow-hidden rounded select-none hover:bg-gray-100
                    ${gridMode ? 'm-2 px-1 py-3 w-28' : 'mb-1 px-2 py-1 w-full flex items-center'}
                  `)}
                >
                  <Icon
                    small={!gridMode}
                    itemName={newDirMode ? 'fake._dir_new' : 'fake._txt_new'}
                  />
                  <NameLine
                    showInput
                    create={newDirMode ? 'dir' : 'txt'}
                    gridMode={gridMode}
                    currentPath={currentPath}
                    onSuccess={handleNameSuccess}
                    onFail={handleNameFail}
                  />
                </div>
              )}
              {/* items */}
              {dirItemList.map(item => {
                const { name, type, hidden, size, lastModified } = item
                const isSelected = !!selectedItemList.find(o => isSameItem(o, item))
                const small = !gridMode
                const itemName = convertItemName(item)
                const _size = size === undefined ? sizeMap[`${currentPath}/${name}`] : size
                const sizeLabel = _size === undefined ? '--' : getBytesSize(_size)
                const dateLabel = lastModified ? DateTime.fromMillis(lastModified).toFormat('yyyy-MM-dd HH:mm') : ''
                return (
                  <div
                    key={encodeURIComponent(name)}
                    data-name={name}
                    data-dir={type === 1}
                    data-selected={isSelected}
                    draggable
                    className={line(`
                      dir-item overflow-hidden rounded select-none transition-opacity duration-300
                      ${gridMode ? 'm-2 px-1 py-3 w-28' : 'mb-1 px-2 py-1 w-full flex items-center'}
                      ${!gridMode && isSelected ? 'bg-blue-600' : 'hover:bg-gray-100'}
                      ${isSelected ? 'bg-gray-100' : ''}
                      ${(isSelected && deleting) ? 'bg-loading' : ''}
                      ${hidden ? 'opacity-50' : 'opacity-100'}
                    `)}
                    onClick={e => handleItemClick(e, item)}
                    onDoubleClick={() => handleItemDoubleClick(item)}

                  >
                    <Icon {...{ small, itemName, currentPath }} />
                    <NameLine
                      showInput={renameMode && isSelected}
                      item={item}
                      isSelected={isSelected}
                      gridMode={gridMode}
                      currentPath={currentPath}
                      onSuccess={handleNameSuccess}
                      onFail={handleNameFail}
                    />
                    <div
                      className={line(`
                        w-full text-xs whitespace-nowrap font-din
                        ${isSelected && !gridMode ? 'text-white' : 'text-gray-400'}
                        ${gridMode ? 'hidden' : 'pl-2 text-right'}
                      `)}
                    >
                      {dateLabel}
                    </div>
                    <div
                      className={line(`
                        w-full text-xs whitespace-nowrap font-din min-w-16
                        ${isSelected && !gridMode ? 'text-white' : 'text-gray-400'}
                        ${gridMode ? 'text-center' : 'pl-2 text-right'}
                        ${(isSelected && getting) ? 'animate-pulse' : ''}
                      `)}
                    >
                      {sizeLabel}
                    </div>
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
