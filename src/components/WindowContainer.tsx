import { runningAppListState } from '../utils/state'
import { useRecoilState } from 'recoil'
import Window from '../components/Window'


export default function WindowContainer() {

  const [runningAppList] = useRecoilState(runningAppListState)

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
          />
        ))}
      </div>
    </>
  )
}