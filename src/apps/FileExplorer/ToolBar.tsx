import { ReactNode } from 'react'
import { ArrowUp16, Checkmark16, ArrowLeft16, ArrowRight16, Download16, Edit16, Export16, Filter16, FolderAdd16, Grid16, Renew16, Star16, TrashCan16, View16 } from '@carbon/icons-react'
import { line } from '../../utils'

export interface IToolBarDisabledMap {
  navBack: boolean
  navForward: boolean
  refresh: boolean
  backToTop: boolean
  newDir: boolean
  rename: boolean
  download: boolean
  delete: boolean
  selectAll: boolean
}

interface ToolBarProps {
  toolBarDisabledMap: IToolBarDisabledMap
  onNavBack: () => void
  onNavForward: () => void
  onRefresh: () => void
  onBackToTop: () => void
  onNewDir: () => void
  onRename: () => void
  onDownload: () => void
  onDelete: () => void
  onSelectAll: () => void
}

export default function ToolBar(props: ToolBarProps) {

  const {
    toolBarDisabledMap,
    onNavBack,
    onNavForward,
    onRefresh,
    onBackToTop,
    onNewDir,
    onRename,
    onDownload,
    onDelete,
    onSelectAll,
  } = props

  return (
    <>
      <div className="h-8 flex-shrink-0 border-b flex">
        <ToolButton
          title="后退"
          disabled={toolBarDisabledMap.navBack}
          onClick={onNavBack}
        >
          <ArrowLeft16 />
        </ToolButton>
        <ToolButton
          title="前进"
          disabled={toolBarDisabledMap.navForward}
          onClick={onNavForward}
        >
          <ArrowRight16 />
        </ToolButton>
        <ToolButton
          title="刷新"
          disabled={toolBarDisabledMap.refresh}
          onClick={onRefresh}
        >
          <Renew16 />
        </ToolButton>
        <ToolButton
          title="返回上级"
          disabled={toolBarDisabledMap.backToTop}
          onClick={onBackToTop}
        >
          <ArrowUp16 />
        </ToolButton>

        <ToolButton
          title="新建文件夹"
          className="border-l"
          disabled={toolBarDisabledMap.newDir}
          onClick={onNewDir}
        >
          <FolderAdd16 />
        </ToolButton>
        <ToolButton
          title="重命名"
          disabled={toolBarDisabledMap.rename}
          onClick={onRename}
        >
          <Edit16 />
        </ToolButton>
        <ToolButton
          title="上传"
        >
          <Export16 />
        </ToolButton>
        <ToolButton
          title="下载"
          onClick={onDownload}
        >
          <Download16 />
        </ToolButton>
        <ToolButton
          title="收藏"
        >
          <Star16 />
        </ToolButton>
        <ToolButton
          title="删除"
          disabled={toolBarDisabledMap.delete}
          onClick={onDelete}
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
          disabled={toolBarDisabledMap.selectAll}
          onClick={onSelectAll}
        >
          <Checkmark16 />
        </ToolButton>
        <ToolButton
          title="显隐"
        >
          <View16 />
        </ToolButton>
        <ToolButton
          title="展示方式"
        >
          <Grid16 />
        </ToolButton>
      </div>
    </>
  )
}


interface ToolButtonProps {
  title: string
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

function ToolButton(props: ToolButtonProps) {

  const {
    title,
    children,
    className = '',
    onClick = () => { },
    disabled = false,
  } = props

  return (
    <div
      title={title}
      className={line(`
        w-8 h-full flex justify-center items-center
        ${disabled
          ? 'cursor-not-allowed text-gray-200'
          : 'cursor-pointer bg-white text-gray-500 hover:text-black hover:bg-gray-100 active:bg-gray-200'
        }
        ${className}
      `)}
      onClick={() => !disabled && onClick()}
    >
      {children}
    </div>
  )
}
