import axios, { AxiosError } from 'axios'
import { IFilePack } from './types'
import getPass from './pass'

const PASS_KEY = 'PASS_KEY'
const BASE_URL = process.env.REACT_APP_BASE_URL || ''

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 20 * 1000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
})

instance.interceptors.request.use(request => {
  const pass = localStorage.getItem(PASS_KEY)
  if (pass) request.url += `&pass=${pass}`
  return request
})

instance.interceptors.response.use(response => response, (error: AxiosError) => {
  if (!error.response) return
  if (error.response.status === 401) {
    const password = window.prompt('请输入访问密码？')
    if (password) {
      const pass = getPass(password)
      localStorage.setItem(PASS_KEY, pass)
    }
  }
})

export const getRootInfo = async () => {
  const { data } = await instance.get('/?cmd=list_root&filter=dirs')
  return data
}

export const getPathEntries = async (path: string) => {
  const { data } = await instance.get(`${path}?cmd=list`)
  return data
}

export const getIsExist = async (path: string) => {
  const { data } = await instance.get(`${path}?cmd=exists`)
  return data
}

export const getDirSize = async (path: string) => {
  const { data } = await instance.get(`${path}?cmd=dir_size`)
  return data
}

export const addNewDir = async (path: string) => {
  const { data } = await instance.put(`${path}?cmd=new_dir`)
  return data
}

export const renameEntry = async (path: string, newPath: string) => {
  const { data } = await instance.put(`${path}?cmd=rename&n=${encodeURIComponent(newPath)}`)
  return data
}

export const deleteEntry = async (path: string) => {
  const { data } = await instance.delete(`${path}?cmd=delete`)
  return data
}

export const uploadFile = async (parentPath: string, filePack: IFilePack) => {
  const { file, fullPath } = filePack
  const { name, size, lastModified } = file
  const targetFileName = fullPath || `/${name}`

  const { data } = await instance.post(`${parentPath}${targetFileName}?cmd=file&size=${size}&file_date=${lastModified}`, file)
  return data
}

export const getTextFileContent = async (path: string) => {
  const { data } = await instance.get(`${path}?cmd=text_file`)
  return data
}


export const downloadEntries = (parentPath: string, downloadName: string, cmd: string) => {
  window.open(`${BASE_URL}${parentPath}/${downloadName}?${cmd}`, '_self')
}

export const getThumbnailUrl = (path: string) => {
  return `${BASE_URL}${path}?cmd=thumbnail`
}

export const getBinFileUrl = (path: string) => {
  return `${BASE_URL}${path}?cmd=file`
}
