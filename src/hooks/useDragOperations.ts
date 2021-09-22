import { useEffect } from 'react'

interface useDragOperationsProps {
  containerInnerRef: any
  onEnterContainer: () => void
  onLeaveContainer: () => void
  onUpload: (files: File[]) => void
}

export default function useDragOperations(props: useDragOperationsProps) {

  const {
    containerInnerRef,
    onEnterContainer,
    onLeaveContainer,
    onUpload,
  } = props

  useEffect(() => {
    const containerInner: any = containerInnerRef.current
    if (!containerInner) return

    const listener = (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      const { type, dataTransfer } = e
      if (type === 'dragenter') {
        onEnterContainer()
      } else if (type === 'dragleave') {
        onLeaveContainer()
      } else if (type === 'drop') {
        onUpload(dataTransfer.files)
      }
    }

    const bind = () => {
      containerInner.addEventListener('dragenter', listener)
      containerInner.addEventListener('dragover', listener)
      containerInner.addEventListener('dragleave', listener)
      containerInner.addEventListener('dragend', listener)
      containerInner.addEventListener('drop', listener)

    }

    const unbind = () => {
      containerInner.removeEventListener('dragenter', listener)
      containerInner.removeEventListener('dragover', listener)
      containerInner.removeEventListener('dragleave', listener)
      containerInner.removeEventListener('dragend', listener)
      containerInner.removeEventListener('drop', listener)
    }

    bind()
    return unbind
  }, [containerInnerRef, onEnterContainer, onLeaveContainer, onUpload])

}
