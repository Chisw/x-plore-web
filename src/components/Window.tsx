import { IApp } from '../utils/types'
import Draggable from 'react-draggable'
import { Close16, Maximize16, Subtract16 } from '@carbon/icons-react'
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { runningAppListState } from '../utils/state'

interface WindowProps {
  zIndex: number
  app: IApp
}

export default function Window(props: WindowProps) {

  const {
    zIndex,
    app: {
      runningId,
      title,
      icon,
      defaultSize: {
        width,
        height,
      },
    },
  } = props

  const [runningAppList, setRunningAppList] = useRecoilState(runningAppListState)

  const isTopWindow = zIndex === runningAppList.length - 1

  const handleMoveWindowToTop = useCallback((e) => {
    if (e.target.closest('[prevent-top]')) return
    const appIndex = runningAppList.findIndex(a => a.runningId === runningId)
    const list = [...runningAppList]
    const activeApp = list.splice(appIndex, 1)[0]
    list.push(activeApp)
    setRunningAppList(list)
  }, [runningAppList, setRunningAppList, runningId])

  const handleCloseApp = useCallback(() => {
    const list = runningAppList.filter(a => a.runningId !== runningId)
    setRunningAppList(list)
  }, [runningAppList, setRunningAppList, runningId])

  return (
    <>
      <Draggable
        handle=".drag-handler"
        bounds="html"
        defaultPosition={{
          x: - width / 2,
          y: - height / 2,
        }}
      >
        <div
          className={`
            fixed top-1/2 left-1/2 bg-white-700 bg-hazy-100 rounded-lg overflow-hidden border-white
            transition-box-shadow duration-200
            ${isTopWindow ? 'shadow-lg' : 'shadow'}
          `}
          style={{
            width,
            height,
            zIndex,
          }}
          onMouseDownCapture={handleMoveWindowToTop}
        >
          <div className="w-full h-8 bg-white flex items-center select-none border-b overflow-hidden">
            <div className="drag-handler flex items-center flex-grow px-2 h-full cursor-move">
              <img src={icon} alt="icon" className="w-4 h-4" />
              <span className="ml-2 text-gray-500 text-sm">{title}</span>
            </div>
            <div className="flex items-center">
              <span
                prevent-top="true"
                className="w-8 h-8 flex justify-center items-center cursor-pointer transition-all duration-300 text-gray-400 hover:bg-gray-200 hover:text-black active:bg-gray-400"
              >
                <Subtract16 />
              </span>
              <span
                className="w-8 h-8 flex justify-center items-center cursor-pointer transition-all duration-300 text-gray-400 hover:bg-gray-200 hover:text-black active:bg-gray-400"
              >
                <Maximize16 />
              </span>
              <span
                prevent-top="true"
                className="w-8 h-8 flex justify-center items-center cursor-pointer transition-all duration-300 text-red-500 hover:bg-red-500 hover:text-white active:bg-red-700"
                onClick={handleCloseApp}
              >
                <Close16 />
              </span>
            </div>
          </div>
          <div>
            {runningId}
          </div>
        </div>
      </Draggable>
    </>
  )
}
