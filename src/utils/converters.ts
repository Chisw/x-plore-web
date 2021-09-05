import { IDirectoryItem, IRootInfo, IVolume } from './types'

export const rootInfoConverter: (data: any) => IRootInfo = data => {
  const { device_name, files } = data
  const volumeList: IVolume[] = files.map(({ label, n, t, mount, has_children, fs, space_free, space_total }: any) => ({
    label,
    name: n,
    type: t,
    mount,
    hasChildren: has_children,
    fileSystem: fs,
    spaceFree: space_free,
    spaceTotal: space_total,
  }))
  return {
    deviceName: device_name,
    volumeList,
  }
}

export const directoryItemConverter: (data: any) => IDirectoryItem[] = data => {
  const { files } = data
  return files.map(({ n, t, size, mime, hidden, time, has_children }: any) => ({
    name: n,
    type: t,
    size,
    mime,
    hidden,
    timestamp: time,
    hasChildren: has_children,
  }))
}
