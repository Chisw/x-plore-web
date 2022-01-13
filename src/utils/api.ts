import { IFilePack } from "./types"

const { fetch } = window
const BASE_URL = process.env.REACT_APP_BASE_URL || ''

export const getRootInfo = async () => {
  const data = await fetch(`${BASE_URL}/?cmd=list_root&filter=dirs`, { method: 'GET' }).then(res => res.json())
  return data
}

export const getPathEntries = async (path: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=list`, { method: 'GET' }).then(res => res.json())
  return data
}

export const getIsExist = async (path: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=exists`, { method: 'GET' }).then(res => res.json())
  return data
}

export const getDirSize = async (path: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=dir_size`).then(res => res.json())
  return data
}

export const addNewDir = async (path: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=new_dir`, { method: 'PUT' }).then(res => res.json())
  return data
}

export const renameEntry = async (path: string, newPath: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=rename&n=${encodeURIComponent(newPath)}`, { method: 'PUT' }).then(res => res.json())
  return data
}

export const deleteEntry = async (path: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=delete`, { method: 'DELETE' }).then(res => res.json())
  return data
}

export const downloadEntries = (path: string, downloadName: string, cmd: string) => {
  window.open(`${BASE_URL}${path}/${downloadName}?${cmd}`, '_self')
}

export const uploadFile = async (path: string, filePack: IFilePack) => {
  const { file, fullPath } = filePack
  const { name, size, lastModified } = file
  const targetFileName = fullPath || `/${name}`

  const data = await fetch(`${BASE_URL}${path}${targetFileName}?cmd=file&size=${size}&file_date=${lastModified}`, {
    method: 'POST',
    body: file,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  }).then(res => res.json())
  return data
}

export const getThumbnailUrl = (path: string, name: string) => {
  return `${BASE_URL}${path}/${name}?cmd=thumbnail`
}

export const getTextFile = async (path: string) => {
  const data = await fetch(`${BASE_URL}${path}?cmd=text_file`, { method: 'GET' }).then(res => res.text())
  return data
}