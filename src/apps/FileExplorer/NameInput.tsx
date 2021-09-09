import { WarningAltFilled16 } from '@carbon/icons-react'
import { useCallback, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { getIsDirExist, putNewDir } from '../../utils/api'

interface NameInputProps {
  currentPath: string
  onSuccess: () => void
  onFail: (msg: 'cancel' | 'empty' | 'exist') => void
}

export default function NameInput(props: NameInputProps) {

  const {
    currentPath,
    onSuccess,
    onFail,
  } = props

  const [isExist, setIsExist] = useState(false)

  const { fetch: fetchExist, loading: loadingExist } = useFetch(path => getIsDirExist(path as string))
  const { fetch: fetchNewDir, loading: loadingNewDir } = useFetch(path => putNewDir(path as string))

  const handleDirNameBlur = useCallback(async (e: any) => {
    const { value } = e.target
    if (!value) {
      onFail('empty')
    } else {
      const path = `${currentPath}/${value}`
      const { exists } = await fetchExist(path)
      if (exists) {
        onFail('exist')
        setIsExist(true)
      } else {
        const { ok } = await fetchNewDir(path)
        if (ok) {
          onSuccess()
        }
      }
    }
  }, [currentPath, fetchExist, fetchNewDir, onSuccess, onFail])

  return (
    <div
      className={`
        relative mt-1 h-5 bg-white border border-gray-300 rounded
        ${loadingExist || loadingNewDir ? 'bg-loading' : ''}
      `}
    >
      {isExist && (
        <span
          title="已存在"
          className="absolute top-0 right-0 bottom-0 flex items-center mr-1 text-center text-xs text-yellow-500"
        >
          <WarningAltFilled16 />
        </span>
      )}
      <input
        autoFocus
        placeholder="文件夹名称"
        className="block px-1 max-w-full h-full bg-transparent text-xs text-left text-gray-700 border-none shadow-inner"
        onChange={() => setIsExist(false)}
        onFocus={() => setIsExist(false)}
        onBlur={handleDirNameBlur}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            handleDirNameBlur(e)
          } else if (e.key === 'Escape') {
            onFail('cancel')
          }
        }}
      />
    </div>
  )
}
