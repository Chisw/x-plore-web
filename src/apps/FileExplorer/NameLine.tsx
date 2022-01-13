import { WarningAltFilled16 } from '@carbon/icons-react'
import { useCallback, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { line } from '../../utils'
import { getIsExist, addNewDir, renameEntry, uploadFile } from '../../utils/api'
import { IEntry, IFilePack } from '../../utils/types'

export type NameFailType = 'cancel' | 'empty' | 'exist' | 'no_change' | 'net_error'

interface NameLineProps {
  create?: 'dir' | 'txt' 
  showInput?: boolean
  entry?: IEntry,
  isSelected?: boolean
  gridMode: boolean
  currentPath: string
  onSuccess: (entry: IEntry) => void
  onFail: (failType: NameFailType) => void
}

export default function NameLine(props: NameLineProps) {

  const {
    create,
    showInput = false,
    entry = undefined,
    isSelected = false,
    gridMode,
    currentPath,
    onSuccess,
    onFail,
  } = props

  const entryName = entry?.name
  const [isExist, setIsExist] = useState(false)
  const [inputValue, setInputValue] = useState(entryName)

  const handleInputChange = useCallback((e: any) => {
    setIsExist(false)
    setInputValue(e.target.value)
  }, [])

  const { fetch: fetchExist, loading: loadingExist } = useFetch((path: string) => getIsExist(path))
  const { fetch: fetchNewDir, loading: loadingNewDir } = useFetch((path: string) => addNewDir(path))
  const { fetch: fetchRename, loading: loadingRename } = useFetch((path: string, newPath: string) => renameEntry(path, newPath))
  const { fetch: uploadFileToPath } = useFetch((path: string, filePack: IFilePack) => uploadFile(path, filePack))

  const handleName = useCallback(async (e: any) => {
    const oldName = entry?.name
    const newName = e.target.value as string

    if (newName) {
      if (oldName && newName === oldName) onFail('no_change')  // no change no request

      const newPath = `${currentPath}/${newName}`
      const { exists } = await fetchExist(newPath)
      if (exists) {
        onFail('exist')
        setIsExist(true)
      } else {
        if (oldName) {  // rename
          const oldPath = `${currentPath}/${oldName}`
          const { ok } = await fetchRename(oldPath, newPath)
          if (ok) {
            onSuccess({ ...entry!, name: newName })
          } else {
            onFail('net_error')
          }
        } else {  // new dir
          if (create === 'dir') {
            const { ok } = await fetchNewDir(newPath)
            if (ok) {
              onSuccess({ type: 1, name: newName })
            } else {
              onFail('net_error')
            }
          } else if (create === 'txt') {
            const blob = new Blob([''], { type: 'text/plain;charset=utf-8' })
            const suffix = newName.endsWith('.txt') ? '' : '.txt'
            const file = new File([blob], newName + suffix)
            const data = await uploadFileToPath(currentPath, { file })
            const isUploaded = !!data?.hasDon
            if (isUploaded) {
              onSuccess({ type: 2, name: newName })
            } else {
              onFail('net_error')
            }
          }
        }
      }
    } else {
      onFail('empty')
    }
  }, [entry, currentPath, create, fetchExist, fetchNewDir, fetchRename, uploadFileToPath, onSuccess, onFail])

  return (
    <div className={`leading-none ${gridMode ? 'mt-2 text-center' : 'ml-4 flex justify-center items-center'}`}>
      {showInput ? (
        <div
          className={line(`
            relative h-5 bg-white border border-gray-300 rounded
            ${(loadingExist || loadingNewDir || loadingRename) ? 'bg-loading' : ''}
          `)}
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
            id="file-explorer-name-input"
            autoFocus
            placeholder="请输入名称"
            className="block px-1 max-w-full h-full bg-transparent text-xs text-left text-gray-700 border-none shadow-inner"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => {
              setIsExist(false)
              ;(document.getElementById('file-explorer-name-input') as any)?.select()
            }}
            onBlur={handleName}
            onKeyUp={e => {
              const { key } = e
              if (key === 'Enter') {
                handleName(e)
              } else if (key === 'Escape') {
                onFail('cancel')
              }
            }}
          />
        </div>
      ) : (
        <NameLabel {...{ entryName, gridMode, isSelected }} />
      )}
    </div>
  )
}

interface NameLabelProps {
  entryName?: string
  isSelected?: boolean
  gridMode: boolean
}

export function NameLabel(props: NameLabelProps) {

  const {
    entryName,
    gridMode,
    isSelected,
  } = props

  return (
    <span
      title={entryName}
      className={line(`
        inline-block px-2 rounded truncate text-xs
        ${isSelected ? 'bg-blue-600 text-white' : 'text-gray-700'}
        ${gridMode ? 'max-w-full' : 'w-72'}
      `)}
    >
      {entryName}
    </span>
  )
}
