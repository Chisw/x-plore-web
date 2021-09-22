import { ReactNode } from 'react'
import {
  ArrowUp16,
  Checkmark16,
  ArrowLeft16,
  ArrowRight16,
  Download16,
  Edit16,
  Export16,
  Filter16,
  FolderAdd16,
  Grid16,
  Renew16,
  Star16,
  TrashCan16,
  View16,
  List16,
  ViewOff16,
} from '@carbon/icons-react'
import { line } from '../../utils'
import { Button, InputGroup } from '@blueprintjs/core'

export interface IToolBarDisabledMap {
  navBack: boolean
  navForward: boolean
  refresh: boolean
  backToTop: boolean
  newDir: boolean
  rename: boolean
  upload: boolean
  download: boolean
  store: boolean
  delete: boolean
  filter: boolean
  selectAll: boolean
  showHidden: boolean
  gridMode: boolean
}

interface ToolBarProps {
  disabledMap: IToolBarDisabledMap
  gridMode: boolean
  filterOpen: boolean
  filterText: string
  hiddenShow: boolean
  setGridMode: (mode: boolean) => void
  setFilterOpen: (open: boolean) => void
  setFilterText: (text: string) => void
  setHiddenShow: (show: boolean) => void
  onNavBack: () => void
  onNavForward: () => void
  onRefresh: () => void
  onBackToTop: () => void
  onNewDir: () => void
  onRename: () => void
  onUpload: () => void
  onDownload: () => void
  onDelete: () => void
  onSelectAll: () => void
}

export default function ToolBar(props: ToolBarProps) {

  const {
    disabledMap,
    gridMode,
    filterOpen,
    filterText,
    hiddenShow,
    setGridMode,
    setFilterOpen,
    setFilterText,
    setHiddenShow,
    onNavBack,
    onNavForward,
    onRefresh,
    onBackToTop,
    onNewDir,
    onRename,
    onUpload,
    onDownload,
    onDelete,
    onSelectAll,
  } = props

  const cancel = () => {
    setFilterOpen(false)
    setFilterText('')
  }

  return (
    <>
      <div className="h-8 flex-shrink-0 border-b flex">
        <ToolButton
          title="后退 [Shift + ←]"
          disabled={disabledMap.navBack}
          onClick={onNavBack}
        >
          <ArrowLeft16 />
        </ToolButton>
        <ToolButton
          title="前进 [Shift + →]"
          disabled={disabledMap.navForward}
          onClick={onNavForward}
        >
          <ArrowRight16 />
        </ToolButton>
        <ToolButton
          title="刷新 [Shift + R]"
          disabled={disabledMap.refresh}
          onClick={onRefresh}
        >
          <Renew16 />
        </ToolButton>
        <ToolButton
          title="返回上级 [Shift + ↑]"
          disabled={disabledMap.backToTop}
          onClick={onBackToTop}
        >
          <ArrowUp16 />
        </ToolButton>

        <ToolButton
          title="新建文件夹 [Shift + N]"
          className="border-l"
          disabled={disabledMap.newDir}
          onClick={onNewDir}
        >
          <FolderAdd16 />
        </ToolButton>
        <ToolButton
          title="重命名 [Shift + E]"
          disabled={disabledMap.rename}
          onClick={onRename}
        >
          <Edit16 />
        </ToolButton>
        <ToolButton
          title="上传 [Shift + U]"
          onClick={onUpload}
        >
          <Export16 />
        </ToolButton>
        <ToolButton
          title="下载 [Shift + D]"
          disabled={disabledMap.download}
          onClick={onDownload}
        >
          <Download16 />
        </ToolButton>
        <ToolButton
          title="收藏 [Shift + S]"
        >
          <Star16 />
        </ToolButton>
        <ToolButton
          title="删除 [Del]"
          disabled={disabledMap.delete}
          onClick={onDelete}
        >
          <TrashCan16 />
        </ToolButton>

        <div className="flex-grow border-r" />

        <div className={`${filterOpen ? 'w-40' : 'w-8'} transition-all duration-200`}>
          {filterOpen ? (
            <div className="px-1 h-full flex items-center">
              <InputGroup
                small
                autoFocus
                placeholder="在当前目录筛选"
                leftIcon={(
                  <span className="bp3-icon text-gray-400">
                    <Filter16 />
                  </span>
                )}
                rightElement={(
                  <Button
                    minimal
                    icon="cross"
                    onClick={cancel}
                  />
                )}
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                onBlur={e => !e.target.value && setFilterOpen(false)}
                onKeyUp={e => e.key === 'Escape' && cancel()}
              />
            </div>
          ) : (
            <ToolButton
              title="筛选 [Shift + F]"
              disabled={disabledMap.filter}
              onClick={() => setFilterOpen(true)}
            >
              <Filter16 />
            </ToolButton>
          )}
        </div>

        <ToolButton
          title="全选 [Shift + A]"
          disabled={disabledMap.selectAll}
          onClick={onSelectAll}
        >
          <Checkmark16 />
        </ToolButton>
        <ToolButton
          title={`${hiddenShow ? '不' : ''}显示隐藏项 [Shift + H]`}
          onClick={() => setHiddenShow(!hiddenShow)}
        >
          {hiddenShow ? <ViewOff16 /> : <View16 />}
        </ToolButton>
        <ToolButton
          title="展示方式 [Shift + V]"
          onClick={() => setGridMode(!gridMode)}
        >
          {gridMode ? <List16 /> : <Grid16 />}
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
        w-8 h-full
        flex justify-center items-center flex-shrink-0
        transition-all duration-50
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
