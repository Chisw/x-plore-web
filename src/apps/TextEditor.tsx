import { Reset16, Save16, TextAllCaps16 } from '@carbon/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import Toast from '../components/EasyToast'
import ToolButton from '../components/ToolButton'
import useFetch from '../hooks/useFetch'
import { getTextFile, uploadFile } from '../utils/api'
import { openedEntryListState } from '../utils/state'
import { AppComponentProps, IFilePack, IOpenedEntry } from '../utils/types'

export default function TextEditor(props: AppComponentProps) {

  const { setWindowTitle, setWindowLoading } = props

  const [openedEntryList, setOpenedEntryList] = useRecoilState(openedEntryListState)
  const [currentEntry, setCurrentEntry] = useState<IOpenedEntry | null>(null)
  const [value, setValue] = useState('')
  const [monoMode, setMonoMode] = useState(false)

  const { fetch: fetchText, loading: fetching, data: textContent, setData: setTextContent } = useFetch((path: string) => getTextFile(path))
  const { fetch: uploadFileToPath, loading: saving } = useFetch((path: string, filePack: IFilePack) => uploadFile(path, filePack))

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

  useEffect(() => {
    setValue(textContent)
  }, [textContent])

  const handleSave = useCallback(async () => {
    if (currentEntry) {
      const blob = new Blob([value], { type: 'text/plain;charset=utf-8' })
      const file = new File([blob], currentEntry.name)
      const data = await uploadFileToPath(currentEntry.entryPath, { file })
      const isUploaded = !!data?.hasDon
      if (isUploaded) {
        Toast.toast('保存成功')
        setTextContent(value)
      }
    }
  }, [value, currentEntry, uploadFileToPath, setTextContent])

  return (
    <>
      <div className="absolute inset-0 flex flex-col">
        <div className="h-8 flex-shrink-0 flex items-center border-b bg-white">
          <ToolButton
            title="保存"
            icon={<Save16 />}
            disabled={value === textContent && !saving}
            loading={saving}
            onClick={handleSave}
          />
          <ToolButton
            title="重置"
            icon={<Reset16 />}
            disabled={value === textContent}
            onClick={() => setValue(textContent)}
          />
          <ToolButton
            title="等宽"
            icon={<TextAllCaps16 />}
            onClick={() => setMonoMode(!monoMode)}
          />
        </div>
        <div className="flex-grow">
          <code style={monoMode ? undefined : { fontFamily: 'unset' }}>
            <textarea
              className="p-2 w-full h-full outline-none resize-none bg-transparent"
              value={value}
              onChange={e => setValue(e.target.value)}
            />
          </code>
        </div>
      </div>
    </>
  )
}
