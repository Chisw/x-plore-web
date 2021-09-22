import { line } from "../../utils"
import Icon from "./Icon"
import { NameText } from "./NameLine"

interface VirtualItemsProps {
  virtualFiles: File[]
  gridMode: boolean
}

export default function VirtualItems(props: VirtualItemsProps) {

 const {
   virtualFiles,
   gridMode,
 } = props

  return (
    <>
      {Array.from(virtualFiles).map(({ name }) => (
        <div
          key={encodeURIComponent(name)}
          data-name={name}
          className={line(`
            opacity-60 bg-loading
            overflow-hidden rounded select-none hover:bg-gray-100
            ${gridMode ? 'm-2 px-1 py-3 w-28' : 'mb-1 px-2 py-1 w-full flex items-center'}
          `)}
        >
          <div className="flex justify-center items-center">
            <Icon small={!gridMode} itemName={name} />
          </div>
          <div className={`${gridMode ? 'mt-2 text-center' : 'ml-4 flex justify-center items-center'}`}>
            <NameText
              itemName={name}
              gridMode={gridMode}
            />
          </div>
        </div>
      ))}
    </>
  )
}