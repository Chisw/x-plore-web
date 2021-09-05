import { LogoGithub16, Wifi16 } from '@carbon/icons-react'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import useFetch from '../hooks/useFetch'
import { getRootInfo } from '../utils/api'
import { rootInfoConverter } from '../utils/converters'
import { rootInfoState } from '../utils/state'

export default function TopBar() {

  const [rootInfo, setRootInfo] = useRecoilState(rootInfoState)

  const { fetch, loading, data } = useFetch(getRootInfo)

  useEffect(() => {
    fetch()
  }, [fetch])

  useEffect(() => {
    if (data) {
      setRootInfo(rootInfoConverter(data))
    }
  }, [data, setRootInfo])

  return (
    <>
      <div className="fixed z-50 top-0 right-0 left-0 px-2 h-6 bg-black-300 bg-hazy-100 shadow-md text-xs text-white flex justify-between items-center select-none">
        <div className="flex items-center">
          <Wifi16 />&nbsp;&nbsp;
          <span className="">{loading ? '系统加载中' : `${rootInfo.deviceName} 已连接`}</span>
        </div>
        <div>
          <a
            href="https://github.com/Chisw/x-plore-web"
            target="_blank"
            rel="noreferrer"
            
          >
            <LogoGithub16 />
          </a>
        </div>
      </div>
    </>
  )
}