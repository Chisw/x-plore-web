import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { transferItemListState } from '../utils/state'

export default function TextEditor () {

  const [transferItemList] = useRecoilState(transferItemListState)

  useEffect(() => {
    console.log('transferItemList', transferItemList)
  }, [transferItemList])

  return (
    <>
      <div className="absolute inset-0">

      </div>
    </>
  )
}
