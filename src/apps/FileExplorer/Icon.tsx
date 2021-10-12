import {
  App32,
  Catalog32,
  DataBase32,
  DocumentAdd32,
  DocumentBlank32,
  DocumentPdf32,
  Folder32,
  FolderAdd32,
  // FolderDetails32,
  Image32,
  Music32,
  Pen32,
  Video32,
  Zip32,
} from '@carbon/icons-react'
import { useMemo, useState } from 'react'
import { IItemIcon } from '../../utils/types'
import dirAndroid from '../../img/icons/dir-android.png'
import dirAlipay from '../../img/icons/dir-alipay.png'
import dirAutonavi from '../../img/icons/dir-autonavi.png'
import dirBackup from '../../img/icons/dir-backup.png'
import dirBaidu from '../../img/icons/dir-baidu.png'
import dirBrowser from '../../img/icons/dir-browser.png'
import dirCamera from '../../img/icons/dir-camera.png'
import dirDownload from '../../img/icons/dir-download.png'
import dirDuokan from '../../img/icons/dir-duokan.png'
import dirFonts from '../../img/icons/dir-fonts.png'
import dirMovies from '../../img/icons/app-video-player.png'
import dirMusic from '../../img/icons/app-music-player.png'
import dirPictures from '../../img/icons/app-photo-gallery.png'
import dirRetroArch from '../../img/icons/dir-retroarch.png'
import dirSogou from '../../img/icons/dir-sogou.png'
import dirTencent from '../../img/icons/dir-tencent.png'
import dirWeiXin from '../../img/icons/dir-weixin.png'
import dirMi from '../../img/icons/dir-mi.png'
import dirQQBrowser from '../../img/icons/dir-qq-browser.png'
import { get } from 'lodash'
import { line } from '../../utils'
import { getThumbnailUrl } from '../../utils/api'
import { THUMBNAIL_MATCH_LIST } from '../../utils/constant'

const DEFAULT_ITEM_ICON: IItemIcon = {
  type: 'unknown',
  icon: <DocumentBlank32 />,
  bg: 'from-gray-300 to-gray-400 border-gray-400',
  match: [],
}

const ITEM_ICON_LIST: IItemIcon[] = [
  {
    type: 'folder',
    icon: <Folder32 />,
    bg: 'from-yellow-300 to-yellow-500 border-yellow-400',
    match: ['_dir'],
  },
  {
    type: 'folder',
    icon: <FolderAdd32 />,
    bg: 'from-yellow-200 to-yellow-400 border-yellow-300',
    match: ['_dir_new'],
  },
  {
    type: 'folder',
    icon: <Folder32 />,
    bg: 'from-yellow-300 to-yellow-500 border-yellow-400',
    match: ['_dir_empty'],
  },
  {
    type: 'document',
    icon: <DocumentAdd32 />,
    bg: 'from-gray-200 to-gray-400 border-gray-300',
    match: ['_txt_new'],
  },
  {
    type: 'image',
    icon: <Image32 />,
    bg: 'from-orange-400 to-orange-500 border-orange-500',
    match: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'insp'],
  },
  {
    type: 'music',
    icon: <Music32 />,
    bg: 'from-pink-600 to-pink-700 border-pink-700',
    match: ['mp3', 'flac', 'wav'],
  },
  {
    type: 'video',
    icon: <Video32 />,
    bg: 'from-blue-400 to-blue-500 border-blue-500',
    match: ['mp4', 'mov', 'wmv', 'insv'],
  },
  {
    type: 'zip',
    icon: <Zip32 />,
    bg: 'from-amber-600 to-amber-700 border-amber-700',
    match: ['zip'],
  },
  {
    type: 'pdf',
    icon: <DocumentPdf32 />,
    bg: 'from-red-800 to-red-900 border-red-900',
    match: ['pdf'],
  },
  {
    type: 'data',
    icon: <DataBase32 />,
    bg: 'from-gray-300 to-gray-400 border-gray-400',
    match: ['dat', 'db', 'sql', 'json'],
  },
  {
    type: 'text',
    icon: <Pen32 />,
    bg: 'from-gray-300 to-gray-400 border-gray-400',
    match: ['txt'],
  },
  {
    type: 'log',
    icon: <Catalog32 />,
    bg: 'from-gray-300 to-gray-400 border-gray-400',
    match: ['log'],
  },
  {
    type: 'application',
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

const getDirSubIcon: (name: string) => string | undefined = name => {
  const dirName = name.replace('._dir', '')
  const map = {
    'alipay': dirAlipay,
    'Android': dirAndroid,
    'autonavi': dirAutonavi,
    'backups': dirBackup,
    'baidu': dirBaidu,
    'browser': dirBrowser,
    'DCIM': dirCamera,
    'DuoKan': dirDuokan,
    'Download': dirDownload,
    'Fonts': dirFonts,
    'Movies': dirMovies,
    'Music': dirMusic,
    'Pictures': dirPictures,
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
  fake?: boolean
  small?: boolean
  itemName: string
  currentPath?: string
}

export default function Icon(props: IconProps) {

  const {
    fake = false,
    small = false,
    itemName,
    currentPath = '',
  } = props

  const [thumbnailError, setThumbnailError] = useState(false)

  const { useThumbnail, isVideo } = useMemo(() => {
    const lowerName = itemName.toLowerCase()
    const useThumbnail = !fake && THUMBNAIL_MATCH_LIST.some(ext => lowerName.endsWith(ext))
    const isVideo = lowerName.endsWith('.mp4')
    return { useThumbnail, isVideo }
  }, [itemName, fake])

  const { bg, icon, dirSubIcon } = useMemo(() => {
    const { type, bg, icon } = getIcon(itemName)
    const dirSubIcon = type === 'folder' ? getDirSubIcon(itemName) : undefined
    return { bg, icon, dirSubIcon }
  }, [itemName])

  const showThumbnail = useThumbnail && !thumbnailError

  return (
    <div className="flex justify-center items-center pointer-events-none">
      <div
        className={line(`
          relative inline-flex justify-center items-center
          ${showThumbnail ? '' : `text-white bg-gradient-to-b border ${bg}`}
          ${small
            ? 'w-6 h-6 rounded'
            : showThumbnail
              ? 'w-20 h-12'
              : 'w-12 h-12 rounded-lg'
          }
        `)}
      >
        {showThumbnail ? (
          <img
            alt="thumbnail"
            className={line(`
              max-w-full max-h-full bg-white shadow-md
              ${isVideo ? '' : `border ${small ? 'p-1px' : 'p-2px'}`}
            `)}
            src={getThumbnailUrl(currentPath, itemName)}
            onError={() => setThumbnailError(true)}
          />
        ) : icon}
        {dirSubIcon && (
          <div
            className={line(`
              absolute left-0 bottom-0 bg-center bg-no-repeat bg-contain
              ${small ? 'w-3 h-3' : 'm-1px w-5 h-5'}
            `)}
            style={{ backgroundImage: `url("${dirSubIcon}")` }}
          />
        )}
      </div>
    </div>
  )
}
