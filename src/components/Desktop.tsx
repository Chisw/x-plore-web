import { ReactNode } from 'react'
import bg from '../img/bg.jpg'

interface DesktopProps {
  children: ReactNode
}

export default function Desktop(props: DesktopProps) {

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url("${bg}")` }}
      >
        {props.children}
      </div>
    </>
  )
}
