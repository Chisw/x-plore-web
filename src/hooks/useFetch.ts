import { useCallback, useState } from 'react'

export default function useFetch(fn: (mount?: string) => any) {

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async (mount?: string) => {
    try {
      setLoading(true)
      const data = await fn(mount)
      setData(data)
      setLoading(false)
      return data
    } catch (error) {
      setLoading(false)
    }
  }, [fn])

  return { fetch, loading, data, setData }
}
