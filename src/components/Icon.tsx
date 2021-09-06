import { DataBase32, DocumentBlank32, Folder32, Image32, Music32, Video32, Zip32 } from '@carbon/icons-react'
import { get } from 'lodash'

const ICON_NAME_MAP = {
  'folder': { bg: 'bg-yellow-400', icon: <Folder32 /> },
  'image': { bg: 'bg-orange-400', icon: <Image32 /> },
  'music': { bg: 'bg-red-400', icon: <Music32 /> },
  'video': { bg: 'bg-blue-400', icon: <Video32 /> },
  'zip': { bg: 'bg-amber-700', icon: <Zip32 /> },
  'data': { bg: 'bg-gray-300', icon: <DataBase32 /> },
  'unknown': { bg: 'bg-gray-200', icon: <DocumentBlank32 /> },
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
    } else if (['mp4', 'wmv', 'insv'].includes(ext)) {
      return 'video'
    } else if (['zip'].includes(ext)) {
      return 'zip'
    } else if (['dat', 'db'].includes(ext)) {
      return 'data'
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
        w-12 h-12 text-white
        ${bg}
        ${className}
      `}
    >
      {icon}
    </div>
  )
}