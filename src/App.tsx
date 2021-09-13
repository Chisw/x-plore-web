import './css/index.css'
import Desktop from './components/Desktop'
import TopBar from './components/TopBar'
import WindowContainer from './components/WindowContainer'
import Dock from './components/Dock'
import Notification from './components/Notification'

function App() {
  return (
    <>
      <TopBar />
      <Notification />
      <Desktop>
        <WindowContainer />
        <Dock />
      </Desktop>
    </>
  )
}

export default App
