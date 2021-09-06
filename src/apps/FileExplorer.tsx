import { ArrowUp20, ChevronLeft20, ChevronRight20, Cube16, Download20, Edit20, Export20, Filter20, FolderAdd20, Renew32, Star20, TrashCan20 } from '@carbon/icons-react'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import Icon from '../components/Icon'
import useFetch from '../hooks/useFetch'
import { itemSorter } from '../utils'
import { getDirectoryItems } from '../utils/api'
import { directoryItemConverter } from '../utils/converters'
import { rootInfoState } from '../utils/state'


export default function FileExplorer() {

  const [activePath, setActivePath] = useState('')

  const [rootInfo] = useRecoilState(rootInfoState)

  const { fetch, loading, data } = useFetch(mount => getDirectoryItems(mount as string))

  const handleVolumeClick = useCallback((mount: string) => {
    fetch(mount)
    setActivePath(mount)
  }, [fetch])

  const handleDirectoryClick = useCallback((mount: string) => {
    fetch(activePath + '/' + mount)
    setActivePath(activePath + '/' + mount)
  }, [fetch, activePath])

  const directoryItems = useMemo(() => {
    return data ? directoryItemConverter(data).sort(itemSorter) : []
  }, [data])

  return (
    <>
      <div className="absolute inset-0 flex">
        {/* side */}
        <div className="p-2 w-64 h-full flex-shrink-0 overflow-x-hidden overflow-y-auto border-r select-none">
          <p className="p-1 text-xs text-gray-400">宗卷</p>
          <div>
            {rootInfo.volumeList.map(({ label, mount }, volumeIndex) => {
              const title = `${mount} (${label})`
              return (
                <div
                  key={volumeIndex}
                  title={title}
                  className="p-1 text-sm text-gray-700 flex items-center hover:bg-gray-200 rounded cursor-pointer"
                  onClick={() => handleVolumeClick(mount)}
                >
                  <Cube16 className="flex-shrink-0" />
                  <span className="ml-1 truncate">{title}</span>
                </div>
              )
            })}
          </div>
          <p className="mt-3 p-1 text-xs text-gray-400">收藏</p>
        </div>
        {/* main */}
        <div className="relative flex-grow h-full bg-white flex flex-col">
          {/* tool bar */}
          <div className="h-8 bg-gray-100 flex-shrink-0 border-b flex">
            <ToolButton
              title="后退"
              className="border-r"
            >
              <ChevronLeft20 />
            </ToolButton>
            <ToolButton
              title="前进"
              className="border-r"
            >
              <ChevronRight20 />
            </ToolButton>
            <ToolButton
              title="返回上级"
              className="border-r"
            >
              <ArrowUp20 />
            </ToolButton>

            <ToolButton
              title="新建文件夹"
              className="ml-2 border-l border-r"
            >
              <FolderAdd20 />
            </ToolButton>
            <ToolButton
              title="重命名"
              className="border-r"
            >
              <Edit20 />
            </ToolButton>
            <ToolButton
              title="上传"
              className="border-r"
            >
              <Export20 />
            </ToolButton>
            <ToolButton
              title="下载"
              className="border-r"
            >
              <Download20 />
            </ToolButton>
            <ToolButton
              title="收藏"
              className="border-r"
            >
              <Star20 />
            </ToolButton>
            <ToolButton
              title="删除"
              className="border-r"
            >
              <TrashCan20 />
            </ToolButton>

            <div className="flex-grow" />

            <ToolButton
              title="筛选"
              className="border-l"
            >
              <Filter20 />
            </ToolButton>
          </div>
          <div className="p-4 flex-grow overflow-x-hidden overflow-y-auto">
            {loading && (
              <span className="absolute top-0 right-0">
                <Renew32 className="animate-spin" />
              </span>
            )}
            <div className="flex flex-wrap">
              {directoryItems.map(({ name, type }) => {
                return (
                  <div
                    key={encodeURIComponent(name)}
                    title={name}
                    className="px-1 py-4 w-32 overflow-hidden cursor-pointer hover:bg-gray-100 rounded select-none"
                    onDoubleClick={() => type === 1 && handleDirectoryClick(name)}
                  >
                    <div className="text-center">
                      <Icon
                        itemName={type === 1 ? `${name}._dir` : name}
                      />
                    </div>
                    <p className="mt-2 text-sm text-center text-gray-700 truncate">{name}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface ToolButtonProps {
  title: string
  children: ReactNode
  className?: string
}

function ToolButton(props: ToolButtonProps) {

  const {
    title,
    children,
    className = '',
  } = props

  return (
    <div
      title={title}
      className={`
        w-8 h-full flex justify-center items-center cursor-pointer
        bg-white text-gray-500 hover:text-black active:bg-gray-200
        ${className}
      `}
    >
      {children}
    </div>
  )
}
