import {
  App32,
  Catalog32,
  DataBase32,
  DocumentBlank32,
  DocumentPdf32,
  Folder32,
  FolderDetails32,
  Image32,
  Music32,
  Video32,
  Zip32,
} from '@carbon/icons-react'
import { useMemo } from 'react'
import { IDirItemIcon } from '../utils/types'
import dirAndroid from '../img/icons/dir-android.png'
import dirAlipay from '../img/icons/dir-alipay.png'
import dirAutonavi from '../img/icons/dir-autonavi.png'
import dirBackup from '../img/icons/dir-backup.png'
import dirBrowser from '../img/icons/dir-browser.png'
import dirCamera from '../img/icons/dir-camera.png'
import dirDownload from '../img/icons/dir-download.png'
import dirDuokan from '../img/icons/dir-duokan.png'
import dirRetroArch from '../img/icons/dir-retroarch.png'
import dirSogou from '../img/icons/dir-sogou.png'
import dirTencent from '../img/icons/dir-tencent.png'
import dirWeiXin from '../img/icons/dir-weixin.png'
import dirMi from '../img/icons/dir-mi.png'
import dirQQBrowser from '../img/icons/dir-qq-browser.png'
import { get } from 'lodash'

const DEFAULT_ITEM_ICON: IDirItemIcon = {
  name: 'unknown',
  icon: <DocumentBlank32 />,
  bg: 'from-gray-300 to-gray-400 border-gray-400',
  match: [],
}

const ITEM_ICON_LIST: IDirItemIcon[] = [
  {
    name: 'folder',
    icon: <FolderDetails32 />,
    bg: 'from-yellow-300 to-yellow-500 border-yellow-400',
    match: ['_dir'],
  },
  {
    name: 'folder',
    icon: <Folder32 />,
    bg: 'from-yellow-300 to-yellow-500 border-yellow-400',
    match: ['_dir_empty'],
  },
  {
    name: 'image',
    icon: <Image32 />,
    bg: 'from-orange-400 to-orange-500 border-orange-500',
    match: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'insp'],
  },
  {
    name: 'music',
    icon: <Music32 />,
    bg: 'from-pink-600 to-pink-700 border-pink-700',
    match: ['mp3', 'flac'],
  },
  {
    name: 'video',
    icon: <Video32 />,
    bg: 'from-blue-400 to-blue-500 border-blue-500',
    match: ['mp4', 'mov', 'wmv', 'insv'],
  },
  {
    name: 'zip',
    icon: <Zip32 />,
    bg: 'from-amber-600 to-amber-700 border-amber-700',
    match: ['zip'],
  },
  {
    name: 'pdf',
    icon: <DocumentPdf32 />,
    bg: 'from-red-800 to-red-900 border-red-900',
    match: ['pdf'],
  },
  {
    name: 'data',
    icon: <DataBase32 />,
    bg: 'from-gray-300 to-gray-400 border-gray-400',
    match: ['dat', 'db', 'sql'],
  },
  {
    name: 'log',
    icon: <Catalog32 />,
    bg: 'from-gray-300 to-gray-400 border-gray-400',
    match: ['log'],
  },
  {
    name: 'application',
    icon: <App32 />,
    bg: 'from-lime-400 to-lime-500 border-lime-500',
    match: ['apk'],
  }
]

const getIcon = (itemName: string) => {
  if (itemName.includes('.')) {
    const ext = itemName.split('.').reverse()[0].toLowerCase()
    return ITEM_ICON_LIST.find(o => o.match.includes(ext)) || DEFAULT_ITEM_ICON
  } else {
    return DEFAULT_ITEM_ICON
  }
}

const getDirSubIcon: (name: string) => string | undefined = itemName => {
  const dirName = itemName.replace('._dir', '')
  const map = {
    'alipay': dirAlipay,
    'Android': dirAndroid,
    'autonavi': dirAutonavi,
    'backups': dirBackup,
    'browser': dirBrowser,
    'DCIM': dirCamera,
    'DuoKan': dirDuokan,
    'Download': dirDownload,
    'QQBrowser': dirQQBrowser,
    'RetroArch': dirRetroArch,
    'sogou': dirSogou,
    'Tencent': dirTencent,
    'MIUI': dirMi,
    'miad': dirMi,
    'WeiXin': dirWeiXin,
  }
  const dirSubIcon = get(map, dirName)
  return dirSubIcon
}

interface IconProps {
  itemName: string
  className?: string
}


export default function Icon(props: IconProps) {

  const {
    itemName,
    className = '',
  } = props

  const { bg, icon, dirSubIcon } = useMemo(() => {
    const { name, bg, icon } = getIcon(itemName)
    const dirSubIcon = name === 'folder' ? getDirSubIcon(itemName) : undefined
    return { bg, icon, dirSubIcon }
  }, [itemName])

  return (
    <div
      className={`
        relative inline-flex justify-center items-center rounded-lg
        w-12 h-12 text-white bg-gradient-to-b border
        ${bg}
        ${className}
      `}
    >
      {icon}
      {dirSubIcon && (
        <div
          className="absolute right-0 bottom-0 -mr-1 -mb-1 w-5 h-5 bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url("${dirSubIcon}")` }}
        />
      )}
    </div>
  )
}