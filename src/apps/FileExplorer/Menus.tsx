import { ContextMenu, Menu, MenuItem } from '@blueprintjs/core'
import { Application16, DocumentAdd16, Download16, Edit16, Export16, FolderAdd16, Renew16, TrashCan16 } from '@carbon/icons-react'
import { IApp, IDirItem } from '../../utils/types'
import APP_LIST from '../../utils/appList'

const availableAppMap: {[KEY: string]: IApp} = {}

APP_LIST.forEach(app => {
  if (['text-editor', 'image-previewer', 'music-player', 'video-player'].includes(app.id)) {
    availableAppMap[app.id] = app
  }
})

interface MenusProps {
  target: any
  dirItemList: IDirItem[]
  selectedItemList: IDirItem[]
  setTransferItemList: (items: IDirItem[]) => void
  setSelectedItemList: (item: IDirItem[]) => void
  setNewDirMode: (mode: boolean) => void
  setNewTxtMode: (mode: boolean) => void
  handleRefresh: () => void
  handleRename: () => void
  handleUploadClick: () => void
  handleDownloadClick: (items?: IDirItem[]) => void
  handleDeleteClick: (items?: IDirItem[]) => void
}

export default function Menus(props: MenusProps) {

  const {
    target,
    dirItemList,
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

  let isOnBlank = true
  let isOnDir = false
  let contextItemList: IDirItem[] = [...selectedItemList]

  const defaultContextItemListLen = contextItemList.length

  const targetItem = target.closest('.dir-item')

  if (targetItem) {
    isOnBlank = false

    const isDir = targetItem.getAttribute('data-dir') === 'true'
    const itemName = targetItem.getAttribute('data-name')
    const item = dirItemList.find(o => o.name === itemName)

    if (isDir) isOnDir = true
    if (defaultContextItemListLen <= 1 && item) {
      contextItemList = [item]
      setSelectedItemList(contextItemList)
    }
  } else {
    setSelectedItemList([])
  }

  const confirmedContextItemListLen = contextItemList.length
  const isSingleConfirmed = confirmedContextItemListLen === 1

  const actions = [
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
      children: [
        {
          icon: <img src={availableAppMap['text-editor'].icon} alt="app" className="w-4 h-4" />,
          text: availableAppMap['text-editor'].title,
          onClick: () => {
            setTransferItemList(contextItemList)
          },
        },
        {
          icon: <img src={availableAppMap['image-previewer'].icon} alt="app" className="w-4 h-4" />,
          text: availableAppMap['image-previewer'].title,
          onClick: () => {
            setTransferItemList(contextItemList)

          },
        },
        {
          icon: <img src={availableAppMap['music-player'].icon} alt="app" className="w-4 h-4" />,
          text: availableAppMap['music-player'].title,
          onClick: () => {
            setTransferItemList(contextItemList)

          },
        },
        {
          icon: <img src={availableAppMap['video-player'].icon} alt="app" className="w-4 h-4" />,
          text: availableAppMap['video-player'].title,
          onClick: () => {
            setTransferItemList(contextItemList)

          },
        },
      ],
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
