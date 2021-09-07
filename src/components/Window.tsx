import { IApp } from '../utils/types'
import Draggable from 'react-draggable'
import { Close16, FitToScreen16, Subtract16 } from '@carbon/icons-react'
import { useCallback, useState } from 'react'
import { useRecoilState } from 'recoil'
import { runningAppListState } from '../utils/state'

interface WindowProps {
  // zIndex: number
  app: IApp
  topWindowIndex: number
  setTopWindowIndex: (i: number) => void
}

export default function Window(props: WindowProps) {

  const {
    // zIndex,
    app: {
      runningId,
      title,
      icon,
      bgImg,
      defaultSize: {
        width,
        height,
      },
      AppComponent,
    },
    topWindowIndex,
    setTopWindowIndex,
  } = props

  const [runningAppList, setRunningAppList] = useRecoilState(runningAppListState)
  const [initIndex] = useState(topWindowIndex)
  const [currentIndex, setCurrentIndex] = useState(initIndex)

  // const isTopWindow = zIndex === runningAppList.length - 1

  // const handleMoveToFront = useCallback((e) => {
  //   if (e.target.closest('[prevent-to-front]')) return
  //   const appIndex = runningAppList.findIndex(a => a.runningId === runningId)
  //   const list = [...runningAppList]
  //   const activeApp = list.splice(appIndex, 1)[0]
  //   list.push(activeApp)
  //   setRunningAppList(list)
  // }, [runningAppList, setRunningAppList, runningId])

  const isTopWindow = currentIndex === topWindowIndex

  const handleMoveToFront = useCallback((e) => {
    if (e.target.closest('[prevent-to-front]')) return
    const newTopIndex = topWindowIndex + 1
    setCurrentIndex(newTopIndex)
    setTopWindowIndex(newTopIndex)
    document.getElementById(`app-${runningId}`)!.style.zIndex = String(newTopIndex)
  }, [runningId, topWindowIndex, setTopWindowIndex])

  const handleCloseApp = useCallback(() => {
    const list = runningAppList.filter(a => a.runningId !== runningId)
    setRunningAppList(list)
  }, [runningAppList, setRunningAppList, runningId])

  return (
    <>
      <Draggable
        handle=".drag-handler"
        bounds="#app-container"
        defaultPosition={{
          x: (window.innerWidth * 3 - width) / 2,
          y: (window.innerHeight - 100 - height) / 2,
        }}
      >
        <div
          id={`app-${runningId}`}
          className={`
            absolute bg-white-800 bg-hazy-100 rounded-lg overflow-hidden
            border border-gray-500 border-opacity-30 bg-clip-padding
            transition-box-shadow duration-200 flex flex-col
            ${isTopWindow ? 'shadow-xl' : 'shadow'}
          `}
          style={{
            width,
            height,
            zIndex: initIndex,
          }}
          onMouseDownCapture={handleMoveToFront}
        >
          {/* header */}
          <div className="w-full h-8 bg-white flex items-center select-none border-b">
            <div className="drag-handler flex items-center flex-grow px-2 h-full cursor-move">
              <div
                className="w-4 h-4 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url("${icon}")` }}
              />
              <span className="ml-2 text-gray-500 text-sm">{title}</span>
            </div>
            {/* Mask: prevent out of focus in iframe */}
            <div
              className={`
                drag-handler-hover-mask absolute z-10 inset-0 mt-8
                ${isTopWindow ? 'hidden' : ''}
              `}
            />
            <div className="flex items-center">
              <span
                prevent-to-front="true"
                className="w-8 h-8 flex justify-center items-center cursor-pointer transition-all duration-300 text-gray-400 hover:bg-gray-200 hover:text-black active:bg-gray-400"
              >
                <Subtract16 />
              </span>
              <span
                className="w-8 h-8 flex justify-center items-center cursor-pointer transition-all duration-300 text-gray-400 hover:bg-gray-200 hover:text-black active:bg-gray-400"
              >
                <FitToScreen16 />
              </span>
              <span
                prevent-to-front="true"
                className="w-8 h-8 flex justify-center items-center cursor-pointer transition-all duration-300 text-red-500 hover:bg-red-500 hover:text-white active:bg-red-700"
                onClick={handleCloseApp}
              >
                <Close16 />
              </span>
            </div>
          </div>
          {/* main */}
          <div
            className="relative flex-grow overflow-hidden bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: bgImg ? `url("${bgImg}")` : undefined }}
          >
            <AppComponent />
          </div>
        </div>
      </Draggable>
    </>
  )
}
