import { useEffect } from 'react'
import { AppComponentProps } from '../utils/types'

export default function PQINA(props: AppComponentProps) {

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
          src="https://pqina.nl/photo-editor/"
          onLoad={() => setHeaderLoading(false)}
        />
      </div>
    </>
  )
}
