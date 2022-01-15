import { getFileNameExtension } from '.'
import { IEntry, IRootInfo, IVolume } from './types'

export const rootInfoConverter: (data: any) => IRootInfo = data => {
  const { device_name: deviceName, files } = data
  const volumeList: IVolume[] = files
    .sort((a: any, b: any) => a.mount.length > b.mount.length ? -1 : 1)
    .map(({
      label,
      n: name,
      mount,
      has_children: hasChildren,
      fs,
      space_free: spaceFree,
      space_total: spaceTotal,
    }: any) => ({
      label,
      name,
      mount,
      hasChildren,
      fileSystem: fs,
      spaceFree,
      spaceTotal,
    }))

  return {
    deviceName,
    volumeList,
  }
}

export const entryConverter = (data: { files: any[] }) => {
  const { files } = data
  return files.map(({
    n: name,
    t,
    size,
    mime,
    hidden,
    time,
    has_children: hasChildren,
  }: any) => {
    // 0: volume  1: directory 2: file
    const type = t === 1 ? 'directory' : 'file'
    const extension = type === 'directory'
      ? `_dir${hasChildren ? '' : '_empty'}`
      : getFileNameExtension(name)

    const entry: IEntry = {
      name,
      type,
      extension,
      size,
      mime,
      hidden,
      lastModified: time,
      hasChildren,
    }
    return entry
  })
}
