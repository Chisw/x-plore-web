import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { runningAppListState, topWindowIndexState } from '../utils/state'
import { APP_LIST } from '../utils/constant'
import { IApp } from '../utils/types'
import { line } from '../utils'


export default function Dock() {

  const [topWindowIndex, setTopWindowIndex] = useRecoilState(topWindowIndexState)
  const [runningAppList, setRunningAppList] = useRecoilState(runningAppListState)

  const handleOpenApp = useCallback((app: IApp) => {
    const sameRunningAppList = runningAppList.filter(a => a.id === app.id)
    const isRunning = !!sameRunningAppList.length
    if (isRunning) {
      sameRunningAppList.forEach(app => {
        const trigger = document.querySelector(`#window-${app.runningId} .move-to-front-trigger`) as Element
        const mouseDownEvent = new MouseEvent('mousedown')
        trigger.dispatchEvent(mouseDownEvent)
      })
    } else {
      setTopWindowIndex(topWindowIndex + 1)
      const list = [...runningAppList, { ...app, runningId: Date.now() }]
      setRunningAppList(list)
    }
  }, [topWindowIndex, setTopWindowIndex, runningAppList, setRunningAppList])

  return (
    <>
      <div className="fixed z-20 bottom-0 left-1/2 transform -translate-x-1/2 mb-2 p-3 pb-4 bg-white-500 rounded-lg shadow-lg flex bg-hazy-100 border border-gray-500 border-opacity-20 bg-clip-padding">
        {APP_LIST.map(app => {
          const isRunning = !!runningAppList.find(a => a.id === app.id)
          return (
            <div
              key={app.id}
              className="relative mx-2 w-10 h-10"
            >
              <div
                className={line(`
                  w-full h-full bg-no-repeat bg-center bg-contain cursor-pointer
                  transform transition-all duration-200
                  ${isRunning ? '' : 'hover:-translate-y-1'}
                `)}
                title={app.title}
                style={{ backgroundImage: `url("${app.icon}")` }}
                onClick={() => handleOpenApp(app)}
              />
              <span
                className={line(`
                  absolute left-1/2 bottom-0 w-1 h-1 rounded-full bg-black-600
                  transform -translate-x-1/2 translate-y-2
                  transition-all duration-300
                  ${isRunning ? 'opacity-100' : 'opacity-0'}
                `)}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}
