import { line } from "../../utils"
import Icon from "./Icon"
import { NameText } from "./NameLine"

interface VirtualUploadItemsProps {
  virtualFiles: File[]
  gridViewMode: boolean
}

export default function VirtualUploadItems(props: VirtualUploadItemsProps) {

 const {
   virtualFiles,
   gridViewMode,
 } = props

  return (
    <>
      {Array.from(virtualFiles).map(({ name }) => (
        <div
          key={encodeURIComponent(name)}
          data-name={name}
          className={line(`
            opacity-70 bg-loading
            overflow-hidden rounded select-none hover:bg-gray-100
            ${gridViewMode ? 'm-2 px-1 py-3 w-28' : 'mb-1 px-2 py-1 w-full flex items-center'}
          `)}
        >
          <div className="flex justify-center items-center">
            <Icon small={!gridViewMode} itemName={name} />
          </div>
          <div className={`${gridViewMode ? 'mt-2 text-center' : 'ml-4 flex justify-center items-center'}`}>
            <NameText
              itemName={name}
              gridViewMode={gridViewMode}
            />
          </div>
        </div>
      ))}
    </>
  )
}