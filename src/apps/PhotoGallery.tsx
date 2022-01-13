import { Spinner } from '@blueprintjs/core'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { getBinFileUrl } from '../utils/api'
import { openedEntryListState } from '../utils/state'
import { AppComponentProps, IOpenedEntry } from '../utils/types'


export default function PhotoGallery(props: AppComponentProps) {

  const { setWindowTitle, setWindowLoading } = props

  const [openedEntryList, setOpenedEntryList] = useRecoilState(openedEntryListState)
  const [currentEntry, setCurrentEntry] = useState<IOpenedEntry | null>(null)
  const [fileUrl, setFileUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => setWindowLoading(loading), [setWindowLoading, loading])

  useEffect(() => {
    const openedEntry = openedEntryList[0]
    if (openedEntry && !openedEntry.isOpen && openedEntry.openAppId === 'photo-gallery') {
      setCurrentEntry(openedEntry)
      setOpenedEntryList([])
    }

  }, [openedEntryList, setOpenedEntryList])

  useEffect(() => {
    if (currentEntry) {
      setLoading(true)
      const { entryPath, name, isOpen } = currentEntry
      const fileUrl = getBinFileUrl(`${entryPath}/${name}`)
      setFileUrl(fileUrl)

      if (!isOpen) {
        setWindowTitle(name)
        setCurrentEntry({ ...currentEntry, isOpen: true })
      }
    }
  }, [currentEntry, setWindowTitle])

  return (
    <>
      <div className="absolute inset-0 bg-black flex justify-center items-center">
        {loading && <Spinner />}
        <img
          src={fileUrl}
          alt="img"
          className={loading ? 'hidden' : 'max-w-full max-h-full'}
          onLoad={() => setLoading(false)}
          onError={() => { }}
        />
      </div>
    </>
  )
}
