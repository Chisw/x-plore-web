import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import useFetch from '../hooks/useFetch'
import { getTextFile } from '../utils/api'
import { transferItemListState } from '../utils/state'
import { AppComponentProps, ITransferItem } from '../utils/types'

export default function TextEditor(props: AppComponentProps) {

  const { setWindowTitle, setWindowLoading } = props

  const [transferItemList, setTransferItemList] = useRecoilState(transferItemListState)
  const [currentItem, setCurrentItem] = useState<ITransferItem | null>(null)

  const { fetch: fetchText, loading: fetching, data: textContent } = useFetch((path: string) => getTextFile(path))

  useEffect(() => {
    setWindowLoading(fetching)
  }, [setWindowLoading, fetching])

  useEffect(() => {
    const item = transferItemList[0]
    if (!textContent && item && item.appId === 'text-editor') {
      setCurrentItem(item)
      setTransferItemList([])
    }
  }, [textContent, transferItemList, setTransferItemList])

  useEffect(() => {
    if (currentItem) {
      const { path, name } = currentItem
      fetchText(`${path}/${name}`)
      setWindowTitle(name)
    }
  }, [currentItem, fetchText, setWindowTitle])

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
