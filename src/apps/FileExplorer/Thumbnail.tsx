import { line } from '../../utils'
import { getThumbnailUrl } from '../../utils/api'

interface ThumbnailProps {
  small: boolean
  itemName: string
  currentPath: string
}

export default function Thumbnail(props: ThumbnailProps) {

  const {
    small,
    itemName,
    currentPath,
  } = props

  return (
    <div
      className={line(`
        relative inline-flex justify-center items-center
        ${small ? 'w-6 h-6' : 'w-12 h-12'}
      `)}
    >
      <img
        alt="thumbnail"
        className="max-w-full max-h-full p-2px bg-white shadow-md border"
        src={getThumbnailUrl(currentPath, itemName)}
      />
    </div>
  )
}