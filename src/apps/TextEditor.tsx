import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import useFetch from '../hooks/useFetch'
import { getTextFile } from '../utils/api'
import { openedEntryListState } from '../utils/state'
import { AppComponentProps, IOpenedEntry } from '../utils/types'

export default function TextEditor(props: AppComponentProps) {

  const { setWindowTitle, setWindowLoading } = props

  const [openedEntryList, setOpenedEntryList] = useRecoilState(openedEntryListState)
  const [currentEntry, setCurrentEntry] = useState<IOpenedEntry | null>(null)

  const { fetch: fetchText, loading: fetching, data: textContent } = useFetch((path: string) => getTextFile(path))

  useEffect(() => setWindowLoading(fetching), [setWindowLoading, fetching])

  useEffect(() => {
    const openedEntry = openedEntryList[0]
    if (openedEntry && !openedEntry.isOpen && openedEntry.openAppId === 'text-editor') {
      setCurrentEntry(openedEntry)
      setOpenedEntryList([])
    }

  }, [openedEntryList, setOpenedEntryList])

  useEffect(() => {
    if (currentEntry) {
      const { entryPath, name, isOpen } = currentEntry
      if (!isOpen) {
        fetchText(`${entryPath}/${name}`)
        setWindowTitle(name)
        setCurrentEntry({ ...currentEntry, isOpen: true })
      }
    }
  }, [currentEntry, fetchText, setWindowTitle])

  return (
    <>
      <div className="absolute inset-0 bg-white p-2">
        <div dangerouslySetInnerHTML={{ __html: (textContent || '').replaceAll('\n', '<br>') }}></div>
      </div>
    </>
  )
}
