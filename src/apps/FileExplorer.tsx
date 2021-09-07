import { ArrowUp16, Checkmark16, ChevronLeft16, ChevronRight16, Cube16, Download16, Edit16, Export16, Filter16, FolderAdd16, Grid16, Renew16, Star16, TrashCan16, View16 } from '@carbon/icons-react'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import Icon from '../components/Icon'
import useFetch from '../hooks/useFetch'
import { itemSorter } from '../utils'
import { getDirectoryItems } from '../utils/api'
import { directoryItemConverter } from '../utils/converters'
import { rootInfoState } from '../utils/state'
import { AppComponentProps } from '../utils/types'


export default function FileExplorer(props: AppComponentProps) {

  const { setHeaderTitle } = props

  const [activePath, setActivePath] = useState('')

  const [rootInfo] = useRecoilState(rootInfoState)

  const { fetch, loading, data, setData } = useFetch(mount => getDirectoryItems(mount as string))

  const handleVolumeClick = useCallback((mount: string) => {
    setData(null)
    fetch(mount)
    setActivePath(mount)
  }, [fetch, setData])

  const handleDirectoryClick = useCallback((mount: string) => {
    setData(null)
    fetch(activePath + '/' + mount)
    setActivePath(activePath + '/' + mount)
    setHeaderTitle(mount)
  }, [fetch, activePath, setData, setHeaderTitle])

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
              <ChevronLeft16 />
            </ToolButton>
            <ToolButton
              title="前进"
              className="border-r"
            >
              <ChevronRight16 />
            </ToolButton>
            <ToolButton
              title="返回上级"
              className="border-r"
            >
              <ArrowUp16 />
            </ToolButton>

            <ToolButton
              title="新建文件夹"
              className="ml-2 border-l border-r"
            >
              <FolderAdd16 />
            </ToolButton>
            <ToolButton
              title="重命名"
              className="border-r"
            >
              <Edit16 />
            </ToolButton>
            <ToolButton
              title="上传"
              className="border-r"
            >
              <Export16 />
            </ToolButton>
            <ToolButton
              title="下载"
              className="border-r"
            >
              <Download16 />
            </ToolButton>
            <ToolButton
              title="收藏"
              className="border-r"
            >
              <Star16 />
            </ToolButton>
            <ToolButton
              title="删除"
              className="border-r"
            >
              <TrashCan16 />
            </ToolButton>

            <div className="flex-grow" />

            <ToolButton
              title="筛选"
              className="border-l"
            >
              <Filter16 />
            </ToolButton>
            <ToolButton
              title="选择"
              className="border-l"
            >
              <Checkmark16 />
            </ToolButton>
            <ToolButton
              title="显隐"
              className="border-l"
            >
              <View16 />
            </ToolButton>
            <ToolButton
              title="展示方式"
              className="border-l"
            >
              <Grid16 />
            </ToolButton>
            <ToolButton
              title="刷新"
              className="border-l"
            >
              <Renew16 />
            </ToolButton>
          </div>
          <div
            className={`
              p-4 flex-grow overflow-x-hidden overflow-y-auto
              ${loading ? 'bg-loading' : ''}
            `}
          >
            <div className="flex flex-wrap">
              {directoryItems.map(({ name, type, hidden }) => {
                return (
                  <div
                    key={encodeURIComponent(name)}
                    title={name}
                    className={`
                      px-1 py-4 w-32 overflow-hidden hover:bg-gray-100 rounded select-none
                      ${hidden ? 'opacity-50' : ''}
                    `}
                    onDoubleClick={() => type === 1 && handleDirectoryClick(name)}
                  >
                    <div className="text-center">
                      <Icon
                        itemName={type === 1 ? `${name}._dir` : name}
                      />
                    </div>
                    <p className="mt-2 text-xs text-center text-gray-700 truncate">{name}</p>
                  </div>
                )
              })}
            </div>
          </div>
          {activePath && (
            <div className="flex-shrink-0 border-t px-2 py-1 text-xs text-gray-500 select-none">
              {activePath}
            </div>
          )}
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
