import { runningAppListState } from '../utils/state'
import { useRecoilState } from 'recoil'
import Window from '../components/Window'


export default function WindowContainer() {

  const [runningAppList] = useRecoilState(runningAppListState)

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
        {runningAppList.map((app, appIndex) => (
          <Window
            key={app.runningId}
            zIndex={appIndex}
            app={app}
          />
        ))}
      </div>
    </>
  )
}