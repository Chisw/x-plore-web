import { Catalog32, DataBase32, DocumentBlank32, DocumentPdf32, Folder32, Image32, Music32, Video32, Zip32 } from '@carbon/icons-react'
import { get } from 'lodash'

const ICON_NAME_MAP = {
  'folder': { bg: 'from-yellow-400 to-yellow-500 border-yellow-500', icon: <Folder32 /> },
  'image': { bg: 'from-orange-400 to-orange-500 border-orange-500', icon: <Image32 /> },
  'music': { bg: 'from-pink-600 to-pink-700 border-pink-700', icon: <Music32 /> },
  'video': { bg: 'from-blue-400 to-blue-500 border-blue-500', icon: <Video32 /> },
  'zip': { bg: 'from-amber-600 to-amber-700 border-amber-700', icon: <Zip32 /> },
  'pdf': { bg: 'from-red-800 to-red-900 border-red-900', icon: <DocumentPdf32 /> },
  'data': { bg: 'from-gray-300 to-gray-400  border-gray-400', icon: <DataBase32 /> },
  'log': { bg: 'from-gray-300 to-gray-400  border-gray-400', icon: <Catalog32 /> },
  'unknown': { bg: 'from-gray-300 to-gray-400 border-gray-400', icon: <DocumentBlank32 /> },
}

const getIconName = (itemName: string) => {
  if (itemName.includes('.')) {
    const ext = itemName.split('.').reverse()[0].toLowerCase()
    if (ext === '_dir') {
      return 'folder'
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'insp'].includes(ext)) {
      return 'image'
    } else if (['mp3', 'flac'].includes(ext)) {
      return 'music'
    } else if (['mp4', 'mov', 'wmv', 'insv'].includes(ext)) {
      return 'video'
    } else if (['zip'].includes(ext)) {
      return 'zip'
    } else if (['dat', 'db'].includes(ext)) {
      return 'data'
    } else if (['log'].includes(ext)) {
      return 'log'
    } else if (['pdf'].includes(ext)) {
      return 'pdf'
    } else {
      return 'unknown'
    }

  } else {
    return 'unknown'
  }
}

interface IconProps {
  itemName: string
  className?: string
}


export default function Icon(props: IconProps) {

  const {
    itemName,
    className,
  } = props

  const { bg, icon } = get(ICON_NAME_MAP, getIconName(itemName))

  return (
    <div
      className={`
        inline-flex justify-center items-center rounded-lg
        w-12 h-12 text-white bg-gradient-to-b border
        ${bg}
        ${className}
      `}
    >
      {icon}
    </div>
  )
}