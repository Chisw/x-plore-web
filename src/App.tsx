import './css/index.css'
import Desktop from './components/Desktop'
import Dock from './components/Dock'
import { runningAppListState } from './utils/state'
import { useRecoilState } from 'recoil'
import Window from './components/Window'

function App() {

  const [runningAppList] = useRecoilState(runningAppListState)

  return (
    <>
      <Desktop>
        {runningAppList.map((app, appIndex) => (
          <Window
            key={app.runningId}
            zIndex={appIndex}
            app={app}
          />
        ))}
        <Dock />
      </Desktop>
    </>
  )
}

export default App
