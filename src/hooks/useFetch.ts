import { useCallback, useState } from 'react'

export default function useFetch(fn: (...args: any) => any) {

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async (...args) => {
    try {
      setLoading(true)
      const data = await fn(...args)
      setData(data)
      setLoading(false)
      return data
    } catch (error) {
      setLoading(false)
    }
  }, [fn])

  return { fetch, loading, data, setData }
}
