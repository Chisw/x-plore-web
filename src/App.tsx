import './css/index.css'
import Desktop from './components/Desktop'
import TopBar from './components/TopBar'
import WindowContainer from './components/WindowContainer'
import Dock from './components/Dock'

function App() {
  return (
    <>
      <TopBar />
      <Desktop>
        <WindowContainer />
        <Dock />
      </Desktop>
    </>
  )
}

export default App
