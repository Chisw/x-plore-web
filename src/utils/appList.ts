import { IApp } from './types'
import iconFileExplorer from '../img/icons/app-file-explorer.png'
import iconTransfer from '../img/icons/app-transfer.png'
import iconTextEditor from '../img/icons/app-text-editor.png'
import iconPhotoGallery from '../img/icons/app-photo-gallery.png'
import iconMusicPlayer from '../img/icons/app-music-player.png'
import iconVideoPlayer from '../img/icons/app-video-player.png'
import iconSettings from '../img/icons/app-settings.png'
import iconBaiduMap from '../img/icons/app-baidu-map.png'
import iconPQINA from '../img/icons/app-pqina.png'
import iconPS from '../img/icons/app-ps.png'
import bgMusic from '../img/bg-music.jpg'
import FileExplorer from '../apps/FileExplorer'
import Transfer from '../apps/Transfer'
import TextEditor from '../apps/TextEditor'
import PhotoGallery from '../apps/PhotoGallery'
import MusicPlayer from '../apps/MusicPlayer'
import VideoPlayer from '../apps/VideoPlayer'
import Settings from '../apps/Settings'
import BaiduMap from '../apps/BaiduMap'
import PQINA from '../apps/PQINA'
import PS from '../apps/PS'

export const APP_ID_MAP = {
  fileExplorer: 'file-explorer',
  transfer: 'transfer',
  textEditor: 'text-editor',
  photoGallery: 'photo-gallery',
  musicPlayer: 'music-player',
  videoPlayer: 'video-player',
  settings: 'settings',
  baiduMap: 'baidu-map',
  pqina: 'pqina',
  ps: 'ps',
}

export const DOUBLE_CLICK_OPEN_APP_LIST = [
  {
    id: APP_ID_MAP.textEditor,
    icon: iconTextEditor,
    matchList: ['txt', 'md', 'html', 'css', 'ps', 'php', 'java', 'sh'],
  },
  {
    id: APP_ID_MAP.photoGallery,
    icon: iconPhotoGallery,
    matchList: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  },
  {
    id: APP_ID_MAP.musicPlayer,
    icon: iconMusicPlayer,
    matchList: ['mp3', 'aac', 'flac'],
  },
  {
    id: APP_ID_MAP.videoPlayer,
    icon: iconVideoPlayer,
    matchList: ['mp4', 'mkv'],
  },
]

const APP_LIST: IApp[] = [
  {
    id: APP_ID_MAP.fileExplorer,
    runningId: 0,
    title: '文件管理器',
    icon: iconFileExplorer,
    width: 960,
    height: 640,
    resizeRange: {
      minWidth: 640,
      minHeight: 480,
    },
    AppComponent: FileExplorer,
  },
  {
    id: APP_ID_MAP.transfer,
    runningId: 0,
    title: '传输助手',
    icon: iconTransfer,
    width: 400,
    height: 400,
    resizeRange: {
      minWidth: 400,
      minHeight: 400,
      maxWidth: 400,
    },
    AppComponent: Transfer,
  },
  {
    id: APP_ID_MAP.textEditor,
    runningId: 0,
    title: '文本编辑器',
    icon: iconTextEditor,
    width: 640,
    height: 480,
    resizeRange: {
      minWidth: 240,
      minHeight: 100,
    },
    AppComponent: TextEditor,
  },
  {
    id: APP_ID_MAP.photoGallery,
    runningId: 0,
    title: '图片查看器',
    icon: iconPhotoGallery,
    width: 640,
    height: 480,
    resizeRange: {
      minWidth: 240,
      minHeight: 200,
    },
    AppComponent: PhotoGallery,
  },
  {
    id: APP_ID_MAP.musicPlayer,
    runningId: 0,
    title: '音乐播放器',
    icon: iconMusicPlayer,
    bgImg: bgMusic,
    width: 400,
    height: 200,
    resizeRange: {
      maxWidth: 400,
      maxHeight: 800,
      minWidth: 400,
      minHeight: 200,
    },
    AppComponent: MusicPlayer,
  },
  {
    id: APP_ID_MAP.videoPlayer,
    runningId: 0,
    title: '视频播放器',
    icon: iconVideoPlayer,
    width: 1280,
    height: 720,
    resizeRange: {
      minWidth: 320,
      minHeight: 240,
    },
    AppComponent: VideoPlayer,
  },
  {
    id: APP_ID_MAP.settings,
    runningId: 0,
    title: '偏好设置',
    icon: iconSettings,
    width: 500,
    height: 500,
    resizeRange: {
      minWidth: 500,
      minHeight: 300,
    },
    AppComponent: Settings,
  },
  {
    id: APP_ID_MAP.baiduMap,
    runningId: 0,
    title: '百度地图',
    icon: iconBaiduMap,
    width: 800,
    height: 600,
    resizeRange: {
      minWidth: 480,
      minHeight: 320,
    },
    AppComponent: BaiduMap,
  },
  {
    id: APP_ID_MAP.pqina,
    runningId: 0,
    title: 'PQINA',
    icon: iconPQINA,
    width: 800,
    height: 600,
    resizeRange: {
      minWidth: 800,
      minHeight: 600,
    },
    AppComponent: PQINA,
  },
  {
    id: APP_ID_MAP.ps,
    runningId: 0,
    title: 'PS',
    icon: iconPS,
    width: 1000,
    height: 800,
    resizeRange: {
      minWidth: 800,
      minHeight: 600,
    },
    AppComponent: PS,
  },
]

export default APP_LIST
