import { CropGrowth32, Delete32, Download32, ChevronRight16 } from '@carbon/icons-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import Icon from './Icon'
import useFetch from '../../hooks/useFetch'
import { getBytesSize, getDownloadInfo, getIsContained, isSameEntry, entrySorter, line, getMatchAppId } from '../../utils'
import { deleteEntry, downloadEntries, getDirSize, getPathEntries, uploadFile } from '../../utils/api'
import { entryConverter } from '../../utils/converters'
import { openedEntryListState, rootInfoState, sizeMapState } from '../../utils/state'
import { AppComponentProps, IEntry, IHistory, IRectInfo, IFilePack } from '../../utils/types'
import PathLink from './PathLink'
import ToolBar, { IToolBarDisabledMap } from './ToolBar'
import NameLine, { NameFailType } from './NameLine'
import { DateTime } from 'luxon'
import Toast from '../../components/EasyToast'
import Confirmor, { ConfirmorProps } from '../../components/Confirmor'
import VirtualEntries from './VirtualEntries'
import Side from './Side'
import useDragSelect from '../../hooks/useDragSelect'
import useDragOperations from '../../hooks/useDragOperations'
import useShortcuts from '../../hooks/useShortcuts'
import { pick } from 'lodash'
import { ContextMenu } from '@blueprintjs/core'
import Menus from './Menus'


export default function FileExplorer(props: AppComponentProps) {

  const { isTopWindow, setWindowTitle, setWindowLoading } = props

  const [rootInfo] = useRecoilState(rootInfoState)
  const [sizeMap, setSizeMap] = useRecoilState(sizeMapState)
  const [, setOpenedEntryList] = useRecoilState(openedEntryListState)
  const [sideCollapse, setSideCollapse] = useState(false)
  const [currentDirPath, setCurrentPath] = useState('')
  const [activeVolume, setActiveVolume] = useState('')
  const [gridMode, setGridMode] = useState(true)
  const [history, setHistory] = useState<IHistory>({ position: -1, list: [] })
  const [selectedEntryList, setSelectedEntryList] = useState<IEntry[]>([])
  const [newDirMode, setNewDirMode] = useState(false)
  const [newTxtMode, setNewTxtMode] = useState(false)
  const [renameMode, setRenameMode] = useState(false)
  const [filterMode, setFilterMode] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [waitScrollToSelected, setWaitScrollToSelected] = useState(false)
  const [waitDropToCurrentPath, setWaitDropToCurrentPath] = useState(false)
  const [downloadConfirmorProps, setDownloadConfirmorProps] = useState<ConfirmorProps>({ isOpen: false })
  const [deleteConfirmorProps, setDeleteConfirmorProps] = useState<ConfirmorProps>({ isOpen: false })
  const [virtualEntries, setVirtualEntries] = useState<File[]>([])
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

  const isInVolumeRoot = useMemo(() => volumeMountList.includes(currentDirPath), [volumeMountList, currentDirPath])

  useEffect(() => {
    const title = isInVolumeRoot ? currentDirPath : currentDirPath.split('/').pop() as string
    setWindowTitle(title)
  }, [currentDirPath, setWindowTitle, isInVolumeRoot])

  const { fetch: fetchPath, loading: fetching, data, setData } = useFetch((path: string) => getPathEntries(path))
  const { fetch: deletePath, loading: deleting } = useFetch((path: string) => deleteEntry(path))
  const { fetch: uploadFileToPath } = useFetch((path: string, filePack: IFilePack) => uploadFile(path, filePack))
  const { fetch: getSize, loading: getting } = useFetch((path: string) => getDirSize(path))

  const { entryList, isEntryListEmpty, dirCount, fileCount } = useMemo(() => {
    const list = data ? entryConverter(data).sort(entrySorter) : []
    const entryList = list
      .filter(o => o.name.toLowerCase().includes(filterText.toLowerCase()))
      .filter(o => hiddenShow ? true : !o.hidden)
    let dirCount = 0
    let fileCount = 0
    entryList.forEach(({ type }) => type === 'directory' ? dirCount++ : fileCount++)
    const isEntryListEmpty = entryList.length === 0
    return { entryList, isEntryListEmpty, dirCount, fileCount }
  }, [data, filterText, hiddenShow])

  const disabledMap: IToolBarDisabledMap = useMemo(() => {
    const { position, list } = history
    return {
      navBack: position <= 0,
      navForward: list.length === position + 1,
      refresh: fetching || !currentDirPath,
      backToTop: !currentDirPath || isInVolumeRoot,
      newDir: newDirMode || newTxtMode,
      newTxt: newDirMode || newTxtMode,
      rename: selectedEntryList.length !== 1,
      upload: false,
      download: isEntryListEmpty,
      store: false,
      delete: !selectedEntryList.length,
      filter: false,
      selectAll: isEntryListEmpty,
      showHidden: false,
      gridMode: false,
    }
  }, [history, fetching, currentDirPath, isInVolumeRoot, newDirMode, newTxtMode, selectedEntryList, isEntryListEmpty])

  const fetchPathData = useCallback((path: string, keepData?: boolean) => {
    !keepData && setData(null)
    fetchPath(path)
    setNewDirMode(false)
  }, [setData, fetchPath])

  const updateHistory = useCallback((direction: 'forward' | 'back', path?: string) => {
    const map = { forward: 1, back: -1 }
    const { position: pos, list: li } = history
    const position: number = pos + map[direction]
    let list = [...li]
    if (direction === 'forward' && path) {
      list = list.filter((i, index) => index < position)
      list.push(path)
    }
    setHistory({ position, list })
  }, [history])

  const handlePathChange = useCallback((props: {
    path: string
    direction: 'forward' | 'back'
    pushPath?: boolean
    updateVolume?: boolean
  }) => {
    const { path, direction, pushPath, updateVolume } = props
    setCurrentPath(path)
    fetchPathData(path)
    updateHistory(direction, pushPath ? path : undefined)
    if (updateVolume) {
      const mount = volumeMountList.find(m => path.startsWith(m))!
      setActiveVolume(mount)
    }
  }, [fetchPathData, volumeMountList, updateHistory])

  const handleVolumeClick = useCallback((path: string) => {
    handlePathChange({ path, direction: 'forward', pushPath: true, updateVolume: true })
  }, [handlePathChange])

  const handleDirOpen = useCallback((dirName: string) => {
    const path = `${currentDirPath}/${dirName}`
    handlePathChange({ path, direction: 'forward', pushPath: true })
  }, [handlePathChange, currentDirPath])

  const handleGoFullPath = useCallback((path: string) => {
    handlePathChange({ path, direction: 'forward', pushPath: true })
  }, [handlePathChange])

  const handleNavBack = useCallback(() => {
    const { position, list } = history
    const path = list[position - 1]
    handlePathChange({ path, direction: 'back', updateVolume: true })
  }, [history, handlePathChange])

  const handleNavForward = useCallback(() => {
    const { position, list } = history
    const path = list[position + 1]
    handlePathChange({ path, direction: 'forward', updateVolume: true })
  }, [history, handlePathChange])

  const handleRefresh = useCallback(() => {
    setSelectedEntryList([])
    fetchPathData(currentDirPath, true)
  }, [fetchPathData, currentDirPath])

  const handleBackToTop = useCallback(() => {
    const list = currentDirPath.split('/')
    list.pop()
    const path = list.join('/')
    handlePathChange({ path, direction: 'forward', pushPath: true })
  }, [currentDirPath, handlePathChange])

  const handleCreate = useCallback((create: 'dir' | 'txt') => {
    setSelectedEntryList([])
    create === 'dir' ? setNewDirMode(true) : setNewTxtMode(true)
  }, [])

  const handleRename = useCallback(() => setRenameMode(true), [])

  const handleUploadStart = useCallback(async (filePackList: IFilePack[], destDir?: string) => {
    if (!filePackList.length) {
      Toast.toast('无有效文件', 2000)
      return
    }
    if (!destDir) {
      setVirtualEntries(filePackList.filter(p => '/' + p.file.name === p.fullPath).map(p => p.file))
    }
    const okList: boolean[] = []
    for (const filePack of filePackList) {
      const data = await uploadFileToPath(`${currentDirPath}${destDir ? `/${destDir}` : ''}`, filePack)
      const isUploaded = !!data?.hasDon
      if (isUploaded) {
        document.querySelector(`[data-name="${filePack.file.name}"]`)?.setAttribute('style', 'opacity:1;')
      }
      okList.push(isUploaded)
    }
    if (okList.every(Boolean)) {
      handleRefresh()
      Toast.toast('上传成功', 2000)
      setVirtualEntries([])
    }
    ;(uploadInputRef.current as any).value = ''
  }, [currentDirPath, uploadFileToPath, handleRefresh])

  const handleCancelSelect = useCallback((e: any) => {
    if (e.button === 2) return  // oncontextmenu
    if (  // avoid multiple select and rename
      e.metaKey || e.ctrlKey || e.shiftKey ||
      document.getElementById('file-explorer-name-input')
    ) return
    setSelectedEntryList([])
  }, [])

  const handleNameSuccess = useCallback((entry: IEntry) => {
    setNewDirMode(false)
    setNewTxtMode(false)
    setRenameMode(false)
    handleRefresh()
    setSelectedEntryList([entry])
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

  const handleDownloadClick = useCallback((contextEntryList?: IEntry[]) => {
    const processList = contextEntryList || selectedEntryList
    const { msg, downloadName, cmd } = getDownloadInfo(currentDirPath, processList)
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
        downloadEntries(currentDirPath, downloadName, cmd)
      },
    })
  }, [currentDirPath, selectedEntryList])

  const handleDeleteClick = useCallback(async (contextEntryList?: IEntry[]) => {
    const processList = contextEntryList || selectedEntryList
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
        for (const entry of processList) {
          const { name } = entry
          const { ok } = await deletePath(`${currentDirPath}/${name}`)
          document.querySelector(`.entry-node[data-name="${name}"]`)?.setAttribute('style', 'opacity:0;')
          okList.push(ok)
        }
        if (okList.every(Boolean)) {
          handleRefresh()
          Toast.toast('删除成功', 2000)
        }
      },
    })
  }, [deletePath, currentDirPath, selectedEntryList, handleRefresh])

  useEffect(() => setWindowLoading(fetching), [setWindowLoading, fetching])

  useEffect(() => {
    if (!currentDirPath && volumeList.length) {
      handleVolumeClick(volumeList[0].mount)
    }
  }, [currentDirPath, volumeList, handleVolumeClick])

  useEffect(() => {
    const container: any = containerRef.current
    if (container && waitScrollToSelected && !fetching) {
      const target: any = document.querySelector('.entry-node[data-selected="true"]')
      const top = target ? target.offsetTop - 10 : 0
      container!.scrollTo({ top, behavior: 'smooth' })
      setWaitScrollToSelected(false)
    }
  }, [waitScrollToSelected, fetching])

  useEffect(() => {
    setRenameMode(false)
    setSelectedEntryList([])
    setFilterMode(false)
    setFilterText('')
  }, [currentDirPath])

  useEffect(() => setSelectedEntryList([]), [filterText])

  const updateDirSize = useCallback(async (name: string) => {
    const path = `${currentDirPath}/${name}`
    const { hasDon, size } = await getSize(path)
    hasDon && setSizeMap({ ...sizeMap, [path]: size })
  }, [currentDirPath, getSize, sizeMap, setSizeMap])

  const handleEntryClick = useCallback((e: any, entry: IEntry) => {
    if (newDirMode || newTxtMode || renameMode) return
    let list = [...selectedEntryList]
    const { metaKey, ctrlKey, shiftKey } = e
    const selectedLen = selectedEntryList.length
    if (metaKey || ctrlKey) {
      list = list.find(o => isSameEntry(o, entry))
        ? list.filter(o => !isSameEntry(o, entry))
        : list.concat(entry)
    } else if (shiftKey) {
      if (selectedLen) {
        const lastSelectedEntry = selectedEntryList[selectedLen - 1]
        const range: number[] = []
        entryList.forEach((_entry, _entryIndex) => {
          if ([entry, lastSelectedEntry].find(o => isSameEntry(o, _entry))) {
            range.push(_entryIndex)
          }
        })
        range.sort((a, b) => a > b ? 1 : -1)
        const [start, end] = range
        list = entryList.slice(start, end + 1)
      } else {
        list = [entry]
      }
    } else {
      list = [entry]
      entry.type === 'directory' && updateDirSize(entry.name)
    }
    setSelectedEntryList(list)
  }, [newDirMode, newTxtMode, renameMode, selectedEntryList, entryList, updateDirSize])

  const handleEntryDoubleClick = useCallback((entry: IEntry) => {
    const { type, name } = entry
    const isDir = type === 'directory'
    if (isDir) {
      handleDirOpen(name)
    } else {
      const appId = getMatchAppId(entry)
      if (appId) {
        setOpenedEntryList([{ ...entry, parentDirPath: currentDirPath, openAppId: appId, isOpen: false }])
      } else {
        handleDownloadClick()
      }
    }
  }, [currentDirPath, handleDirOpen, handleDownloadClick, setOpenedEntryList])

  const handleSelectAll = useCallback((force?: boolean) => {
    const isSelectAll = force || !selectedEntryList.length
    setSelectedEntryList(isSelectAll ? entryList : [])
  }, [setSelectedEntryList, entryList, selectedEntryList])

  const handleRectSelect = useCallback((info: IRectInfo) => {
    const entryElements = document.querySelectorAll('.entry-node')
    if (!entryElements.length) return
    const indexList: number[] = []
    entryElements.forEach((el: any, elIndex) => {
      const isContained = getIsContained({
        ...info,
        ...pick(el, 'offsetTop', 'offsetLeft', 'offsetWidth', 'offsetHeight'),
      })
      isContained && indexList.push(elIndex)
    })
    const names = entryList.filter((n, nIndex) => indexList.includes(nIndex))
    setSelectedEntryList(names)
  }, [setSelectedEntryList, entryList])

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
    onUpload: (filePackList, destDir) => {
      setWaitDropToCurrentPath(false)
      handleUploadStart(filePackList, destDir)
    },
  })

  useShortcuts({
    type: 'keyup',
    bindCondition: isTopWindow && !newDirMode && !newTxtMode && !renameMode && !filterMode && !ContextMenu.isOpen(),
    shortcutMap: {
      'Delete': disabledMap.delete ? null : handleDeleteClick,
      'Escape': () => setSelectedEntryList([]),
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
      'Shift+ArrowDown': (selectedEntryList.length === 1 && selectedEntryList[0].type === 'directory')
        ? () => handleDirOpen(selectedEntryList[0].name)
        : null,
    },
  })

  const handleContextMenu = useCallback((event: any) => {
    event.preventDefault()
    event.stopPropagation()
    const { target, clientX: left, clientY: top } = event
    const menuProps = {
      target, currentDirPath, entryList, selectedEntryList,
      setOpenedEntryList,
      setNewDirMode, setNewTxtMode, setSelectedEntryList,
      handleRefresh, handleRename, handleUploadClick, handleDownloadClick, handleDeleteClick,
    }
    ContextMenu.show(<Menus {...menuProps} />, { top, left })
  }, [
    currentDirPath, entryList, selectedEntryList,
    setOpenedEntryList,
    handleRefresh, handleRename, handleUploadClick, handleDownloadClick, handleDeleteClick,
  ])

  return (
    <>
      <div className="absolute inset-0 flex">
        {/* side */}
        <Side
          {...{ sideCollapse, currentDirPath, activeVolume, volumeList }}
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
          <div
            title={sideCollapse ? '展开' : '收起'}
            className={line(`
              absolute z-10 top-1/2 left-0 w-3 h-12 bg-gray-200 rounded-r-lg
              opacity-40 hover:bg-gray-300
              transition-all duration-200 transform -translate-y-1/2 cursor-pointer
              flex justify-center items-center
            `)}
            onClick={() => setSideCollapse(!sideCollapse)}
          >
            <ChevronRight16 className={sideCollapse ? '' : 'transform -rotate-180'} />
          </div>
          <div
            ref={containerRef}
            data-drag-hover={waitDropToCurrentPath}
            className="relative flex-grow overflow-x-hidden overflow-y-auto"
            onMouseDownCapture={handleCancelSelect}
          >
            <div
              ref={rectRef}
              className="hidden absolute z-10 border box-content border-gray-400 bg-black-100"
            />
            {/* empty tip */}
            {(!fetching && isEntryListEmpty) && (
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
                    entry={{
                      name: 'virtual-entry',
                      type: newDirMode ? 'directory' : 'file',
                      extension: newDirMode ? '_dir_new' : '_txt_new',
                    }}
                  />
                  <NameLine
                    showInput
                    create={newDirMode ? 'dir' : 'txt'}
                    gridMode={gridMode}
                    currentDirPath={currentDirPath}
                    onSuccess={handleNameSuccess}
                    onFail={handleNameFail}
                  />
                </div>
              )}
              {/* entries */}
              {entryList.map(entry => {
                const { name, type, hidden, size, lastModified } = entry
                const isSelected = !!selectedEntryList.find(o => isSameEntry(o, entry))
                const small = !gridMode
                const _size = size === undefined ? sizeMap[`${currentDirPath}/${name}`] : size
                const sizeLabel = _size === undefined ? '--' : getBytesSize(_size)
                const dateLabel = lastModified ? DateTime.fromMillis(lastModified).toFormat('yyyy-MM-dd HH:mm') : ''
                return (
                  <div
                    key={encodeURIComponent(name)}
                    data-name={name}
                    data-dir={type === 'directory'}
                    data-selected={isSelected}
                    draggable
                    className={line(`
                      entry-node overflow-hidden rounded select-none transition-opacity duration-300
                      ${gridMode ? 'm-2 px-1 py-3 w-28' : 'mb-1 px-2 py-1 w-full flex items-center'}
                      ${!gridMode && isSelected ? 'bg-blue-600' : 'hover:bg-gray-100'}
                      ${isSelected ? 'bg-gray-100' : ''}
                      ${(isSelected && deleting) ? 'bg-loading' : ''}
                      ${hidden ? 'opacity-50' : 'opacity-100'}
                    `)}
                    onClick={e => handleEntryClick(e, entry)}
                    onDoubleClick={() => handleEntryDoubleClick(entry)}
                  >
                    <Icon {...{ small, entry, currentDirPath }} />
                    <NameLine
                      showInput={renameMode && isSelected}
                      entry={entry}
                      isSelected={isSelected}
                      gridMode={gridMode}
                      currentDirPath={currentDirPath}
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

              <VirtualEntries {...{ virtualEntries, gridMode }} />

            </div>
          </div>
          <PathLink
            {...{ dirCount, fileCount, currentDirPath, activeVolume, selectedEntryList }}
            loading={fetching}
            onDirClick={handleGoFullPath}
            onVolumeClick={handleVolumeClick}
          />
        </div>
      </div>

      <input
        multiple
        ref={uploadInputRef}
        type="file"
        className="hidden"
        onChange={(e: any) => {
          const filePackList = [...e.target.files].map((file: File) => ({ file }))
          handleUploadStart(filePackList)
        }}
      />

      <Confirmor {...downloadConfirmorProps} />
      <Confirmor {...deleteConfirmorProps} />
      
    </>
  )
}
