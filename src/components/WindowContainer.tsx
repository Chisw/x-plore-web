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
        className="z-10"
        style={{
          position: 'absolute',
          zIndex: 10,
          top: '1.5rem',
          left: '-100%',
          width: '300%',
          height: '200%',
        }}
      >
        {runningAppList.map(app => (
          <Window
            key={app.runningId}
            app={app}
            topWindowIndex={topWindowIndex}
            setTopWindowIndex={setTopWindowIndex}
          />
        ))}
      </div>
    </>
  )
}