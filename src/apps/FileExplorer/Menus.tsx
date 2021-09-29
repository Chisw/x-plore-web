import { ContextMenu, Menu, MenuItem } from '@blueprintjs/core'
import { Application16, DocumentAdd16, Download16, Edit16, Export16, FolderAdd16, Renew16, TrashCan16 } from '@carbon/icons-react'
import { IApp, IItem, ITransferItem } from '../../utils/types'
import APP_LIST from '../../utils/appList'
import { useCallback, useMemo } from 'react'

const availableAppIdList = ['text-editor', 'image-previewer', 'music-player', 'video-player']

interface MenusProps {
  target: any
  currentPath: string
  itemList: IItem[]
  selectedItemList: IItem[]
  setTransferItemList: (items: ITransferItem[]) => void
  setSelectedItemList: (item: IItem[]) => void
  setNewDirMode: (mode: boolean) => void
  setNewTxtMode: (mode: boolean) => void
  handleRefresh: () => void
  handleRename: () => void
  handleUploadClick: () => void
  handleDownloadClick: (items?: IItem[]) => void
  handleDeleteClick: (items?: IItem[]) => void
}

export default function Menus(props: MenusProps) {

  const {
    target,
    currentPath,
    itemList,
    selectedItemList,
    setTransferItemList,
    setSelectedItemList,
    setNewDirMode,
    setNewTxtMode,
    handleRefresh,
    handleRename,
    handleUploadClick,
    handleDownloadClick,
    handleDeleteClick,
  } = props

  const availableAppMap = useMemo(() => {
    const availableAppMap: { [KEY: string]: IApp } = {}
    APP_LIST.forEach(app => {
      if (availableAppIdList.includes(app.id)) {
        availableAppMap[app.id] = app
      }
    })
    return availableAppMap
  }, [])

  const {
    isOnBlank,
    isOnDir,
    contextItemList,
    isSingleConfirmed,
  } = useMemo(() => {
    let isOnBlank = true
    let isOnDir = false
    let contextItemList: IItem[] = [...selectedItemList]

    const unconfirmedLen = contextItemList.length
    const targetItem = target.closest('.dir-item')

    if (targetItem) {
      isOnBlank = false

      const isDir = targetItem.getAttribute('data-dir') === 'true'
      const itemName = targetItem.getAttribute('data-name')
      const item = itemList.find(o => o.name === itemName)

      if (isDir) isOnDir = true
      if (unconfirmedLen <= 1 && item) {
        contextItemList = [item]
        setSelectedItemList(contextItemList)
      }
    } else {
      setSelectedItemList([])
    }

    const confirmedLen = contextItemList.length
    const isSingleConfirmed = confirmedLen === 1

    return {
      isOnBlank,
      isOnDir,
      contextItemList,
      isSingleConfirmed,
    }
  }, [target, selectedItemList, itemList, setSelectedItemList])

  const transfer = useCallback((appId: string) => {
    const list = contextItemList.map(item => ({ ...item, path: currentPath, appId }))
    setTransferItemList(list)
  }, [contextItemList, currentPath, setTransferItemList])

  const actions = useMemo(() => {
    return [
      {
        icon: <FolderAdd16 />,
        text: '新建文件夹',
        isShow: isOnBlank,
        onClick: () => setNewDirMode(true),
      },
      {
        icon: <DocumentAdd16 />,
        text: '新建文本文件',
        isShow: isOnBlank,
        onClick: () => setNewTxtMode(true),
      },
      {
        icon: <Renew16 />,
        text: '刷新',
        isShow: isOnBlank,
        onClick: handleRefresh,
      },
      {
        icon: <Edit16 />,
        text: '重命名',
        isShow: isSingleConfirmed,
        onClick: () => setTimeout(handleRename, 0),
      },
      {
        icon: <Application16 />,
        text: '打开方式',
        isShow: !isOnDir && isSingleConfirmed,
        onClick: () => { },
        children: availableAppIdList.map(appId => ({
          icon: <img src={availableAppMap[appId].icon} alt="app" className="w-4 h-4" />,
          text: availableAppMap[appId].title,
          onClick: () => transfer(appId),
        })),
      },
      {
        icon: <Export16 />,
        text: '上传',
        isShow: isOnBlank,
        onClick: handleUploadClick,
      },
      {
        icon: <Download16 />,
        text: '下载',
        isShow: true,
        onClick: () => handleDownloadClick(contextItemList),
      },
      // {
      //   icon: <></>,
      //   text: '收藏',
      //   isShow: isOnDir,
      //   onClick: () => { },
      // },
      {
        icon: <TrashCan16 />,
        text: '删除',
        isShow: !isOnBlank,
        onClick: () => handleDeleteClick(contextItemList),
      },
    ]
  }, [
    availableAppMap, contextItemList, isOnBlank, isOnDir, isSingleConfirmed,
    setNewDirMode, setNewTxtMode, transfer,
    handleDeleteClick, handleDownloadClick, handleRefresh, handleRename, handleUploadClick,
  ])

  return (
    <Menu className="force-outline-none">
      {actions
        .filter(({ isShow }) => isShow)
        .map(({ icon, text, onClick, children }) => (
          <MenuItem
            key={encodeURIComponent(text)}
            icon={<span className="bp3-icon">{icon}</span>}
            text={text}
            onClick={() => {
              onClick()
              !children && ContextMenu.hide()
            }}
          >
            {children && children.map(({ icon, text, onClick }) => (
              <MenuItem
                key={encodeURIComponent(text)}
                icon={<span className="bp3-icon">{icon}</span>}
                text={text}
                onClick={() => {
                  onClick()
                  ContextMenu.hide()
                }}
              />
            ))}
          </MenuItem>
        ))
      }
    </Menu>
  )
}
