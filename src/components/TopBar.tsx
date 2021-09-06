import { LogoGithub16, Wifi16 } from '@carbon/icons-react'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import useFetch from '../hooks/useFetch'
import { getRootInfo } from '../utils/api'
import { rootInfoConverter } from '../utils/converters'
import { rootInfoState } from '../utils/state'


export default function TopBar() {

  const [timeStr, setTimerStr] = useState('')
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

  useEffect(() => {
    const timer = setInterval(() => {
      const now = DateTime.local()
      const str = now.toFormat('M 月 d 日 周几 HH:mm')
      const day = '一二三四五六日'[+now.toFormat('c') - 1]
      setTimerStr(str.replace('周几', `周${day}`))
    }, 1000)
    return () => clearInterval(timer)
  }, [])
 
  return (
    <>
      <div className="fixed z-50 top-0 right-0 left-0 h-6 bg-black-300 bg-hazy-100 shadow-md text-xs text-white flex justify-between items-center select-none">
        <div className="flex items-center px-2 h-full cursor-pointer hover:bg-white-700 hover:text-black active:bg-white-500">
          <Wifi16 />&nbsp;&nbsp;
          <span className="">{loading ? '系统加载中' : `${rootInfo.deviceName} 已连接`}</span>
          <div className="hidden">
            <a
              href="https://github.com/Chisw/x-plore-web"
              target="_blank"
              rel="noreferrer"
            >
              <LogoGithub16 />
            </a>
          </div>
        </div>
        <div className="px-2">
          <span>{timeStr}</span>
        </div>
      </div>
    </>
  )
}