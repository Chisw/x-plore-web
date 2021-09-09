import { WarningAltFilled16 } from '@carbon/icons-react'
import { useCallback, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { getIsDirExist, addNewDir, renameItem } from '../../utils/api'

interface NameInputProps {
  oldName?: string,
  currentPath: string
  onSuccess: (name: string) => void
  onFail: (msg: 'cancel' | 'empty' | 'exist' | 'error') => void
}

export default function NameInput(props: NameInputProps) {

  const {
    oldName = '',
    currentPath,
    onSuccess,
    onFail,
  } = props

  const [isExist, setIsExist] = useState(false)
  const [inputValue, setInputValue] = useState(oldName)

  const handleInputChange = useCallback((e: any) => {
    setIsExist(false)
    setInputValue(e.target.value)
  }, [])

  const { fetch: fetchExist, loading: loadingExist } = useFetch((path: string) => getIsDirExist(path))
  const { fetch: fetchNewDir, loading: loadingNewDir } = useFetch((path: string) => addNewDir(path))
  const { fetch: fetchRename, loading: loadingRename } = useFetch((path: string, newPath: string) => renameItem(path, newPath))

  const handleDirNameBlur = useCallback(async (e: any) => {
    const { value: newName } = e.target
    if (!newName) {
      onFail('empty')
    } else {
      const path = `${currentPath}/${newName}`
      const { exists } = await fetchExist(path)
      if (exists) {
        onFail('exist')
        setIsExist(true)
      } else {
        if (oldName) {  // rename
          const oldPath = `${currentPath}/${oldName}`
          const { ok } = await fetchRename(oldPath, path)
          if (ok) {
            onSuccess(newName)
          } else {
            onFail('error')
          }
        } else {  // new dir
          const { ok } = await fetchNewDir(path)
          if (ok) {
            onSuccess(newName)
          } else {
            onFail('error')
          }
        }
      }
    }
  }, [oldName, currentPath, fetchExist, fetchNewDir, fetchRename, onSuccess, onFail])

  return (
    <div
      className={`
        relative mt-2 h-5 bg-white border border-gray-300 rounded
        ${(loadingExist || loadingNewDir || loadingRename) ? 'bg-loading' : ''}
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
        value={inputValue}
        onChange={handleInputChange}
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
