import { Cube16, DocumentBlank32, Folder32, Renew32 } from '@carbon/icons-react'
import { useCallback, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import useFetch from '../hooks/useFetch'
import { getDirectoryItems } from '../utils/api'
import { directoryItemConverter } from '../utils/converters'
import { rootInfoState } from '../utils/state'

const IconDirectory = (
  <div className="mx-auto w-12 h-12 bg-yellow-400 text-white flex justify-center items-center rounded-lg">
    <Folder32 />
  </div>
)

const IconFile = (
  <div className="mx-auto w-12 h-12 bg-gray-300 text-white flex justify-center items-center rounded-lg">
    <DocumentBlank32 />
  </div>
)

export default function FileExplorer() {

  const [activePath, setActivePath] = useState('')

  const [rootInfo] = useRecoilState(rootInfoState)

  const { fetch, loading, data } = useFetch(mount => getDirectoryItems(mount as string))

  const handleVolumeClick = useCallback((mount: string) => {
    fetch(mount)
    setActivePath(mount)
  }, [fetch])

  const handleDirectoryClick = useCallback((mount: string) => {
    fetch(activePath + '/' + mount)
    setActivePath(activePath + '/' + mount)
  }, [fetch, activePath])

  const directoryItems = useMemo(() => {
    return data ? directoryItemConverter(data) : []
  }, [data])

  return (
    <>
      <div className="absolute inset-0 flex">
        {/* side */}
        <div className="p-4 w-64 h-full flex-shrink-0 overflow-x-hidden overflow-y-auto border-r">
          {rootInfo.volumeList.map(({ label, mount }, volumeIndex) => {
            return (
              <div
                key={volumeIndex}
                className="text-sm text-gray-700 flex items-center"
                onClick={() => handleVolumeClick(mount)}
              >
                <Cube16 />
                <span className="ml-1">{label}</span>
              </div>
            )
          })}
        </div>
        {/* main */}
        <div className="flex-grow p-4 h-full overflow-x-hidden overflow-y-auto bg-white">
          {loading && <Renew32 className="animate-spin" />}
          <div className="flex flex-wrap">
            {directoryItems.map(({ name, type }) => {
              return (
                <div
                  key={encodeURIComponent(name)}
                  className="px-1 py-4 w-32 overflow-hidden cursor-pointer hover:bg-gray-100 rounded"
                  onClick={() => type === 1 && handleDirectoryClick(name)}
                >
                  <div>
                    {type === 1 ? IconDirectory : IconFile}
                  </div>
                  <p className="mt-2 text-sm text-center text-gray-700 truncate">{name}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
