import { runningAppListState } from '../utils/state'
import { useRecoilState } from 'recoil'
import Window from '../components/Window'
import { useState } from 'react'


export default function WindowContainer() {

  const [runningAppList] = useRecoilState(runningAppListState)
  const [topWindowIndex, setTopWindowIndex] = useState(0)

  return (
    <>
      <div
        id="app-container"
        style={{
          position: 'absolute',
          width: '300%',
          height: '200%',
          top: '1.5rem',
          left: '-100%',
        }}
      >
        {runningAppList.map(app => (
          <Window
            key={app.runningId}
            // zIndex={appIndex}
            app={app}
            topWindowIndex={topWindowIndex}
            setTopWindowIndex={setTopWindowIndex}
          />
        ))}
      </div>
    </>
  )
}