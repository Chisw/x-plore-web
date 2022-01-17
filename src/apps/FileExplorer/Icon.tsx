import { Application24, DataBase24, Document24, DocumentBlank24, Folder32, Image24, Music24, Pen24, Video24, Box24, Code24 } from '@carbon/icons-react'
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


const VIDEO_MATCH_LIST = ['mp4', 'mkv', 'avi', 'rm', 'rmvb']

const THUMBNAIL_MATCH_LIST = [
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'pbm', 'bmp',
  ...VIDEO_MATCH_LIST,
]

const DEFAULT_ENTRY_ICON: IEntryIcon = {
  type: 'unknown',
  icon: <DocumentBlank24 />,
  iconBg: 'from-gray-300 to-gray-400 border-gray-400',
  matchList: [],
}

const ENTRY_ICON_LIST: IEntryIcon[] = [
  {
    type: 'folder',
    icon: <Folder32 />,
    iconBg: 'from-yellow-300 to-yellow-500 border-yellow-400',
    matchList: ['_dir'],
  },
  {
    type: 'folder',
    icon: <Folder32 />,
    iconBg: 'from-yellow-200 to-yellow-400 border-yellow-300',
    matchList: ['_dir_new'],
  },
  {
    type: 'folder',
    icon: <Folder32 />,
    iconBg: 'from-yellow-300 to-yellow-500 border-yellow-400',
    matchList: ['_dir_empty'],
  },
  {
    type: 'document',
    icon: <Pen24 />,
    iconBg: 'from-gray-200 to-gray-400 border-gray-300',
    matchList: ['_txt_new'],
  },
  {
    type: 'image',
    icon: <Image24 />,
    iconBg: 'from-orange-400 to-orange-500 border-orange-500',
    matchList: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'insp', 'svg', 'ico'],
  },
  {
    type: 'audio',
    icon: <Music24 />,
    iconBg: 'from-pink-600 to-pink-700 border-pink-700',
    matchList: ['mp3', 'flac', 'wav', 'aac'],
  },
  {
    type: 'video',
    icon: <Video24 />,
    iconBg: 'from-blue-400 to-blue-500 border-blue-500',
    matchList: ['mp4', 'mov', 'wmv', 'insv', 'mkv', 'avi', 'rm', 'rmvb'],
  },
  // {
  //   type: 'font',
  //   icon: <TextFont24 />,
  //   iconBg: 'from-purple-400 to-purple-500 border-purple-500',
  //   matchList: ['ttf', 'woff'],
  // },
  {
    type: 'archive',
    icon: <Box24 />,
    iconBg: 'from-amber-600 to-amber-700 border-amber-700',
    matchList: ['zip', 'rar', '.7z'],
  },
  {
    type: 'pdf',
    icon: <Document24 />,
    iconBg: 'from-red-800 to-red-900 border-red-900',
    matchList: ['pdf'],
  },
  {
    type: 'code',
    icon: <Code24 />,
    iconBg: 'from-gray-800 to-gray-900 border-black',
    matchList: ['html', 'css', 'js', 'php'],
  },
  {
    type: 'data',
    icon: <DataBase24 />,
    iconBg: 'from-gray-400 to-gray-500 border-gray-500',
    matchList: ['dat', 'db', 'sql', 'json', 'log'],
  },
  {
    type: 'text',
    icon: <Pen24 />,
    iconBg: 'from-gray-400 to-gray-500 border-gray-500',
    matchList: ['txt', 'md'],
  },
  {
    type: 'application',
    icon: <Application24 />,
    iconBg: 'from-lime-400 to-lime-500 border-lime-500',
    matchList: ['apk'],
  }
]

const DIR_SUB_ICON_MAP = {
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

const getIconInfo = (entry: IEntry) => {
  const { name, type, extension } = entry
  const isDir = type === 'directory'
  const entryIcon = extension
    ? (ENTRY_ICON_LIST.find(o => o.matchList.includes(extension)) || DEFAULT_ENTRY_ICON)
    : DEFAULT_ENTRY_ICON

  const dirSubIcon = isDir
    ? get(DIR_SUB_ICON_MAP, name)
    : undefined

  const fileSubIcon = isDir
    ? undefined
    : DOUBLE_CLICK_OPEN_APP_LIST.find(({ matchList }) => matchList.includes(extension!))?.icon

  return {
    isDir,
    entryIcon,
    dirSubIcon,
    fileSubIcon,
  }
}

interface IconProps {
  entry: IEntry
  virtual?: boolean
  small?: boolean
}

export default function Icon(props: IconProps) {

  const {
    entry,
    virtual = false,
    small = false,
  } = props

  const {
    name,
    parentPath,
    extension,
  } = entry

  const [thumbnailLoaded, setThumbnailLoaded] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)

  const { useThumbnail, isVideo } = useMemo(() => {
    const useThumbnail = !virtual && extension && THUMBNAIL_MATCH_LIST.includes(extension)
    const isVideo = extension && VIDEO_MATCH_LIST.includes(extension)
    return { useThumbnail, isVideo }
  }, [extension, virtual])

  const { isDir, icon, iconBg, dirSubIcon, fileSubIcon } = useMemo(() => {
    const { isDir, entryIcon: { icon, iconBg }, dirSubIcon, fileSubIcon } = getIconInfo(entry)
    return { isDir, iconBg, icon, dirSubIcon, fileSubIcon }
  }, [entry])

  const showThumbnail = useThumbnail && !thumbnailError

  return (
    <div className="flex justify-center items-center pointer-events-none">
      <div
        className={line(`
          relative inline-flex justify-center items-center
          ${showThumbnail ? '' : `text-white bg-gradient-to-b border ${iconBg}`}
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
              max-w-full max-h-full min-w-6 min-h-6 bg-white shadow-md
              ${thumbnailLoaded ? '' : 'bg-loading'}
              ${isVideo
                ? 'border-l-4 border-r-4 border-black'
                : `border ${small ? 'p-1px' : 'p-2px'}`
              }
            `)}
            src={getThumbnailUrl(`${parentPath}/${name}`)}
            onLoad={() => setThumbnailLoaded(true)}
            onError={() => setThumbnailError(true)}
          />
        ) : (
          small ? icon : (
            <div>
              <div>{icon}</div>
              {!isDir && (
                <div className="font-din text-center text-xs">
                    {extension?.replace('_txt_new', 'txt').toUpperCase()}
                </div>
              )}
            </div>
          )
        )}
        {dirSubIcon && (
          <div
            className={line(`
              absolute left-0 bottom-0 bg-center bg-no-repeat bg-contain
              ${small ? 'w-3 h-3' : 'w-5 h-5'}
            `)}
            style={{ backgroundImage: `url("${dirSubIcon}")` }}
          />
        )}
        {fileSubIcon && (
          <div
            className={line(`
              absolute right-0 bottom-0 bg-center bg-no-repeat bg-contain border-white rounded shadow
              ${small ? 'border w-3 h-3 -m-1' : 'border-2 -m-2 w-4 h-4'}
            `)}
            style={{ backgroundImage: `url("${fileSubIcon}")` }}
          />
        )}
      </div>
    </div>
  )
}
