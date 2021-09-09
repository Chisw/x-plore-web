import { ReactNode } from 'react'
import { ArrowUp16, Checkmark16, ArrowLeft16, ArrowRight16, Download16, Edit16, Export16, Filter16, FolderAdd16, Grid16, Renew16, Star16, TrashCan16, View16 } from '@carbon/icons-react'

export interface IToolBarDisabledMap {
  navBack: boolean
  navForward: boolean
  refresh: boolean
  backToTop: boolean
  newDir: boolean
}

interface ToolBarProps {
  toolBarDisabledMap: IToolBarDisabledMap
  handleNavBack: () => void
  handleNavForward: () => void
  handleRefresh: () => void
  handleBackToTop: () => void
  handleNewDir: () => void
}

export default function ToolBar(props: ToolBarProps) {

  const {
    toolBarDisabledMap,
    handleNavBack,
    handleNavForward,
    handleRefresh,
    handleBackToTop,
    handleNewDir,
  } = props

  return (
    <>
      <div className="h-8 flex-shrink-0 border-b flex">
        <ToolButton
          title="后退"
          disabled={toolBarDisabledMap.navBack}
          onClick={handleNavBack}
        >
          <ArrowLeft16 />
        </ToolButton>
        <ToolButton
          title="前进"
          disabled={toolBarDisabledMap.navForward}
          onClick={handleNavForward}
        >
          <ArrowRight16 />
        </ToolButton>
        <ToolButton
          title="刷新"
          disabled={toolBarDisabledMap.refresh}
          onClick={handleRefresh}
        >
          <Renew16 />
        </ToolButton>
        <ToolButton
          title="返回上级"
          disabled={toolBarDisabledMap.backToTop}
          onClick={handleBackToTop}
        >
          <ArrowUp16 />
        </ToolButton>

        <ToolButton
          title="新建文件夹"
          className="border-l"
          disabled={toolBarDisabledMap.newDir}
          onClick={handleNewDir}
        >
          <FolderAdd16 />
        </ToolButton>
        <ToolButton
          title="重命名"
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
      className={`
        w-8 h-full flex justify-center items-center
        ${disabled
          ? 'cursor-not-allowed text-gray-200'
          : 'cursor-pointer bg-white text-gray-500 hover:text-black hover:bg-gray-100 active:bg-gray-200'
        }
        ${className}
      `}
      onClick={() => !disabled && onClick()}
    >
      {children}
    </div>
  )
}
