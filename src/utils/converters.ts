import { IDirItem, IRootInfo, IVolume } from './types'

export const rootInfoConverter: (data: any) => IRootInfo = data => {
  const { device_name, files } = data
  const volumeList: IVolume[] = files
    .sort((a: any, b: any) => a.mount.length > b.mount.length ? -1 : 1)
    .map(({ label, n, t, mount, has_children, fs, space_free, space_total }: any) => ({
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

export const dirItemConverter: (data: any) => IDirItem[] = data => {
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
