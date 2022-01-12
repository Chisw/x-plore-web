import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import useFetch from '../hooks/useFetch'
import { getTextFile } from '../utils/api'
import { transferEntryListState } from '../utils/state'
import { AppComponentProps, ITransferEntry } from '../utils/types'

export default function TextEditor(props: AppComponentProps) {

  const { setWindowTitle, setWindowLoading } = props

  const [transferEntryList, setTransferEntryList] = useRecoilState(transferEntryListState)
  const [currentEntry, setCurrentEntry] = useState<ITransferEntry | null>(null)

  const { fetch: fetchText, loading: fetching, data: textContent } = useFetch((path: string) => getTextFile(path))

  useEffect(() => {
    setWindowLoading(fetching)
  }, [setWindowLoading, fetching])

  useEffect(() => {
    const entry = transferEntryList[0]
    if (!textContent && entry && entry.appId === 'text-editor') {
      setCurrentEntry(entry)
      setTransferEntryList([])
    }
  }, [textContent, transferEntryList, setTransferEntryList])

  useEffect(() => {
    if (currentEntry) {
      const { path, name } = currentEntry
      fetchText(`${path}/${name}`)
      setWindowTitle(name)
    }
  }, [currentEntry, fetchText, setWindowTitle])

  return (
    <>
      <div className="absolute inset-0 bg-white">
        <div className="p-1">
          {textContent}
        </div>
      </div>
    </>
  )
}
