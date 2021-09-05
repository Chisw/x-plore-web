import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { runningAppListState } from '../utils/state'
import { APP_LIST } from '../utils/constant'
import { IApp } from '../utils/types'

export default function Dock() {

  const [runningAppList, setRunningAppList] = useRecoilState(runningAppListState)

  const handleOpenApp = useCallback((app: IApp) => {
    const list = [...runningAppList, { ...app, runningId: Date.now() }]
    setRunningAppList(list)
  }, [runningAppList, setRunningAppList])

  return (
    <>
      <div
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 m-4 p-3 bg-white-500 rounded-lg shadow-lg flex bg-hazy-100 border border-white"
        style={{ zIndex: runningAppList.length }}
      >
        {APP_LIST.map(app => (
          <div
            key={app.id}
            className="mx-2 w-12 h-12 bg-no-repeat bg-center bg-contain cursor-pointer transform hover:-translate-y-1 transition-all duration-200"
            title={app.title}
            style={{ backgroundImage: `url("${app.icon}")` }}
            onClick={() => handleOpenApp(app)}
          >

          </div>
        ))}
      </div>
    </>
  )
}
