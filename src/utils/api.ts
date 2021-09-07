const BASE_URL = process.env.REACT_APP_BASE_URL || ''

export const getRootInfo = async () => {
  const data = await fetch(`${BASE_URL}/?cmd=list_root&filter=dirs`, { method: 'GET' }).then(res => res.json())
  return data
}

export const getDirItems = async (mount: string) => {
  const data = await fetch(`${BASE_URL}${mount}?cmd=list`, { method: 'GET' }).then(res => res.json())
  return data
}
