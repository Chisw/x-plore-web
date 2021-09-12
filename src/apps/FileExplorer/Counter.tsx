import { Checkmark16, DocumentBlank16, Folder16 } from '@carbon/icons-react'

interface CounterProps {
  loading: boolean
  selectedNameLen: number
  dirCount: number
  fileCount: number
}

export default function Counter(props: CounterProps) {

  const {
    loading,
    selectedNameLen,
    dirCount,
    fileCount,
  } = props

  return (
    <div className="flex-shrink-0 flex items-center pl-4 font-din">
      {!!selectedNameLen && (
        <>
          <Checkmark16 />&nbsp;<span>{loading ? '-' : selectedNameLen}</span>
          &emsp;
        </>
      )}
      <Folder16 />&nbsp;<span>{loading ? '-' : dirCount}</span>
      &emsp;
      <DocumentBlank16 />&nbsp;<span>{loading ? '-' : fileCount}</span>
    </div>
  )
}