import { ContextMenu, Menu, MenuItem } from '@blueprintjs/core'
import { Application16, DocumentAdd16, Download16, Edit16, Export16, FolderAdd16, Renew16, TrashCan16 } from '@carbon/icons-react'
import { IDirItem } from '../../utils/types'
import iconTextEditor from '../../img/icons/app-text-editor.png'
import iconPhotoGallery from '../../img/icons/app-photo-gallery.png'
import iconMusicPlayer from '../../img/icons/app-music-player.png'
import iconVideoPlayer from '../../img/icons/app-video-player.png'

interface MenusProps {
  target: any
  dirItemList: IDirItem[]
  selectedItemList: IDirItem[]
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

  const targetItem = target.closest('.dir-item')
  if (targetItem) {
    isOnBlank = false
    const isDir = targetItem.getAttribute('data-dir') === 'true'
    if (isDir) isOnDir = true
    const itemName = targetItem.getAttribute('data-name')
    const item = dirItemList.find(o => o.name === itemName)
    if (contextItemList.length <= 1 && item) {
      contextItemList = [item]
      setSelectedItemList(contextItemList)
    }
  } else {
    setSelectedItemList([])
  }

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
      isShow: !isOnBlank && contextItemList.length === 1,
      onClick: () => setTimeout(handleRename, 1),
    },
    {
      icon: <Application16 />,
      text: '打开方式',
      isShow: !isOnBlank && !isOnDir,
      onClick: () => { },
      children: [
        {
          icon: <img src={iconTextEditor} alt="app" className="w-4 h-4" />,
          text: '文本编辑器',
          onClick: () => {},
        },
        {
          icon: <img src={iconPhotoGallery} alt="app" className="w-4 h-4" />,
          text: '图片查看器',
          onClick: () => { },
        },
        {
          icon: <img src={iconMusicPlayer} alt="app" className="w-4 h-4" />,
          text: '音乐播放器',
          onClick: () => { },
        },
        {
          icon: <img src={iconVideoPlayer} alt="app" className="w-4 h-4" />,
          text: '视频播放器',
          onClick: () => { },
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
