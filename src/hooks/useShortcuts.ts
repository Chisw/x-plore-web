import { useEffect } from 'react'

interface useShortcutsProps {
  type: 'keydown' | 'keyup'
  bindCondition: boolean
  shortcutFnMap: {[KEY: string]: any}  // null | () => void
}

export default function useShortcuts(props: useShortcutsProps) {

  const {
    type,
    bindCondition,
    shortcutFnMap,
  } = props

  useEffect(() => {
    const shortcutKeys = Object.keys(shortcutFnMap)
    const listener = (e: any) => {
      const { key, shiftKey } = e
      const shortcut = `${shiftKey ? 'Shift+' : ''}${key}`
      // console.log('shortcut:', shortcut)
      if (shortcutKeys.includes(shortcut)) {
        const fn = shortcutFnMap[shortcut]
        fn && fn()
      }
    }
    const bind = () => document.addEventListener(type, listener)
    const unbind = () => document.removeEventListener(type, listener)
    bindCondition ? bind() : unbind()
    return unbind
  }, [type, bindCondition, shortcutFnMap])
}
