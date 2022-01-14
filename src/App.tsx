import './css/index.css'
import Desktop from './components/Desktop'
import TopBar from './components/TopBar'
import WindowContainer from './components/WindowContainer'
import Dock from './components/Dock'
import { FocusStyleManager } from '@blueprintjs/core'

FocusStyleManager.onlyShowFocusOnTabs()

function App() {
  return (
    <div onContextMenuCapture={e => e.preventDefault()}>
      <TopBar />
      <Desktop>
        <WindowContainer />
        <Dock />
      </Desktop>
    </div>
  )
}

export default App
