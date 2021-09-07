import { useEffect } from 'react'
import { AppComponentProps } from '../utils/types'

export default function PS(props: AppComponentProps) {

  const { setHeaderLoading } = props

  useEffect(() => {
    setHeaderLoading(true)
  }, [setHeaderLoading])

  return (
    <>
      <div className="absolute inset-0">
        <iframe
          title="app"
          className="w-full h-full"
          src="https://ps.gaoding.com"
          onLoad={() => setHeaderLoading(false)}
        />
      </div>
    </>
  )
}
