import { ElectronAPI } from "@electron-toolkit/preload/dist"

declare global {
  interface Window {
    electron: ElectronAPI
    injectData: any
    windowBounds?: {
      x: number
      y: number
      width: number
      height: number
    }
    ipcInvoke: (channel: string, ...args: any[]) => Promise<any>
    ipcOn: (channel: string, listener: (event: any, data: any) => void) => void
    ipcSend: (channel: string, data?: any) => void
  }
}
