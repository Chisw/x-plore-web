import { IDirItem } from './types'

const { fetch } = window
const BASE_URL = process.env.REACT_APP_BASE_URL || ''

export const getRootInfo = async () => {
  const data = await fetch(`${BASE_URL}/?cmd=list_root&filter=dirs`, { method: 'GET' }).then(res => res.json())
  return data
}

export const getDirItems = async (path: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=list`, { method: 'GET' }).then(res => res.json())
  return data
}

export const getIsDirExist = async (path: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=exists`, { method: 'GET' }).then(res => res.json())
  return data
}

export const addNewDir = async (path: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=new_dir`, { method: 'PUT' }).then(res => res.json())
  return data
}

export const renameItem = async (path: string, newPath: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=rename&n=${encodeURIComponent(newPath)}`, { method: 'PUT' }).then(res => res.json())
  return data
}

export const deleteItem = async (path: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=delete`, { method: 'DELETE' }).then(res => res.json())
  return data
}

export const downloadItems = (path: string, items: IDirItem[]) => {
  const pathName = path.split('/').reverse()[0]
  const len = items.length
  const firstItem: IDirItem | undefined = items[0]
  const isDownloadAll = !len
  const isDownloadSingle = len === 1
  const isDownloadSingleDir = isDownloadSingle && firstItem.type === 1
  const singleItemName = firstItem?.name

  const downloadName = isDownloadAll
    ? `${pathName}.zip`
    : isDownloadSingle
      ? isDownloadSingleDir
        ? `${singleItemName}/${singleItemName}.zip`
        : `${singleItemName}`
      : `${pathName}.zip`

  const msg = isDownloadAll
    ? `下载当前整个目录为 ${downloadName}`
    : isDownloadSingle
      ? isDownloadSingleDir
        ? `下载 ${singleItemName} 为 ${singleItemName}.zip`
        : `下载 ${downloadName}`
      : `下载 ${items.length} 个项目为 ${downloadName}`

  const cmd = isDownloadAll
    ? 'cmd=zip'
    : isDownloadSingle
      ? isDownloadSingleDir
        ? 'cmd=zip'
        : 'cmd=file&mime=application%2Foctet-stream'
      : `cmd=zip${items.map(o => `&f=${o.name}`).join('')}`

  if (window.confirm(`${msg} ？`)) {
    window.open(`${BASE_URL}${path}/${downloadName}?${cmd}`, '_self')
  }
}

export const uploadFile = async (path: string, file: File) => {
  const data = await fetch(`${BASE_URL}${path}/${file.name}?cmd=file&size=${file.size}&file_date=${file.lastModified}`, {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  }).then(res => res.json())
  return data
}