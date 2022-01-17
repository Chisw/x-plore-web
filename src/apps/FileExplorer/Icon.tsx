import { useMemo, useState } from 'react'
import { IEntry, IEntryIcon } from '../../utils/types'
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
import { DOUBLE_CLICK_OPEN_APP_LIST } from '../../utils/appList'
import {
  App32,
  Catalog32,
  DataBase32,
  DocumentAdd32,
  DocumentBlank32,
  DocumentPdf32,
  Folder32,
  FolderAdd32,
  Image32,
  Music32,
  Txt32,
  Video32,
  Zip32,
} from '@carbon/icons-react'


const VIDEO_MATCH_LIST = ['mp4', 'mkv', 'avi', 'rm', 'rmvb']
const THUMBNAIL_MATCH_LIST = [
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'pbm', 'bmp',
  'mp4', 'mkv', 'avi', 'rm', 'rmvb',
]

const DEFAULT_ENTRY_ICON: IEntryIcon = {
  type: 'unknown',
  icon: <DocumentBlank32 />,
  bg: 'from-gray-300 to-gray-400 border-gray-400',
  matchList: [],
}

const ENTRY_ICON_LIST: IEntryIcon[] = [
  {
    type: 'folder',
    icon: <Folder32 />,
    bg: 'from-yellow-300 to-yellow-500 border-yellow-400',
    matchList: ['_dir'],
  },
  {
    type: 'folder',
    icon: <FolderAdd32 />,
    bg: 'from-yellow-200 to-yellow-400 border-yellow-300',
    matchList: ['_dir_new'],
  },
  {
    type: 'folder',
    icon: <Folder32 />,
    bg: 'from-yellow-300 to-yellow-500 border-yellow-400',
    matchList: ['_dir_empty'],
  },
  {
    type: 'document',
    icon: <DocumentAdd32 />,
    bg: 'from-gray-200 to-gray-400 border-gray-300',
    matchList: ['_txt_new'],
  },
  {
    type: 'image',
    icon: <Image32 />,
    bg: 'from-orange-400 to-orange-500 border-orange-500',
    matchList: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'insp', 'svg'],
  },
  {
    type: 'music',
    icon: <Music32 />,
    bg: 'from-pink-600 to-pink-700 border-pink-700',
    matchList: ['mp3', 'flac', 'wav', 'aac'],
  },
  {
    type: 'video',
    icon: <Video32 />,
    bg: 'from-blue-400 to-blue-500 border-blue-500',
    matchList: ['mp4', 'mov', 'wmv', 'insv', 'mkv', 'avi', 'rm', 'rmvb'],
  },
  {
    type: 'zip',
    icon: <Zip32 />,
    bg: 'from-amber-600 to-amber-700 border-amber-700',
    matchList: ['zip'],
  },
  {
    type: 'pdf',
    icon: <DocumentPdf32 />,
    bg: 'from-red-800 to-red-900 border-red-900',
    matchList: ['pdf'],
  },
  {
    type: 'data',
    icon: <DataBase32 />,
    bg: 'from-gray-300 to-gray-400 border-gray-400',
    matchList: ['dat', 'db', 'sql', 'json'],
  },
  {
    type: 'text',
    icon: <Txt32 />,
    bg: 'from-gray-300 to-gray-400 border-gray-400',
    matchList: ['txt'],
  },
  {
    type: 'log',
    icon: <Catalog32 />,
    bg: 'from-gray-300 to-gray-400 border-gray-400',
    matchList: ['log'],
  },
  {
    type: 'application',
    icon: <App32 />,
    bg: 'from-lime-400 to-lime-500 border-lime-500',
    matchList: ['apk'],
  }
]

const getIcon = (extension: string | undefined) => {
  return extension
    ? (ENTRY_ICON_LIST.find(o => o.matchList.includes(extension)) || DEFAULT_ENTRY_ICON)
    : DEFAULT_ENTRY_ICON
}

const getDirSubIcon: (dirName: string) => string | undefined = dirName => {
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

const getFileOpenAppIcon = (extension: string | undefined) => {
  return DOUBLE_CLICK_OPEN_APP_LIST.find(({ matchList }) => matchList.includes(extension!))?.icon
}

interface IconProps {
  entry: IEntry
  virtual?: boolean
  small?: boolean
}

export default function Icon(props: IconProps) {

  const {
    entry: {
      name,
      type,
      parentPath,
      extension,
    },
    virtual = false,
    small = false,
  } = props

  const [thumbnailError, setThumbnailError] = useState(false)

  const { useThumbnail, isVideo } = useMemo(() => {
    const useThumbnail = !virtual && THUMBNAIL_MATCH_LIST.some(ext => extension === ext)
    const isVideo = VIDEO_MATCH_LIST.some(ext => extension === ext)
    return { useThumbnail, isVideo }
  }, [extension, virtual])

  const { bg, icon, dirSubIcon, fileOpenAppIcon } = useMemo(() => {
    const { type, bg, icon } = getIcon(extension)
    const dirSubIcon = type === 'folder' ? getDirSubIcon(name) : undefined
    const fileOpenAppIcon = (type !== 'folder' && extension) ? getFileOpenAppIcon(extension) : undefined
    return { bg, icon, dirSubIcon, fileOpenAppIcon }
  }, [extension, name])

  const isDir = type === 'directory'
  const showThumbnail = useThumbnail && !thumbnailError

  return (
    <div className="flex justify-center items-center pointer-events-none">
      <div
        className={line(`
          relative inline-flex justify-center items-center
          ${showThumbnail ? '' : `text-white bg-gradient-to-b border ${bg}`}
          ${small
            ? `rounded-sm ${isDir ? 'w-7' : 'w-5 rounded-tr'} h-6`
            : (showThumbnail
              ? 'w-20 h-12'
              : `${isDir ? 'w-14 rounded-lg' : 'w-10 rounded rounded-tr-lg'} h-12`
            )
          }
        `)}
      >
        {showThumbnail ? (
          <img
            alt="thumbnail"
            className={line(`
              max-w-full max-h-full bg-white shadow-md
              ${isVideo
                ? 'border-l-4 border-r-4 border-black'
                : `border ${small ? 'p-1px' : 'p-2px'}`
              }
            `)}
            src={getThumbnailUrl(`${parentPath}/${name}`)}
            onError={() => setThumbnailError(true)}
          />
        ) : icon}
        {dirSubIcon && (
          <div
            className={line(`
              absolute left-0 bottom-0 bg-center bg-no-repeat bg-contain
              ${small ? 'w-3 h-3' : 'w-5 h-5'}
            `)}
            style={{ backgroundImage: `url("${dirSubIcon}")` }}
          />
        )}
        {fileOpenAppIcon && (
          <div
            className={line(`
              absolute right-0 bottom-0 bg-center bg-no-repeat bg-contain border-white rounded shadow
              ${small ? 'border w-3 h-3 -m-1' : 'border-2 -m-2 w-4 h-4'}
            `)}
            style={{ backgroundImage: `url("${fileOpenAppIcon}")` }}
          />
        )}
      </div>
    </div>
  )
}
