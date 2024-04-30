import { contextBridge, BrowserWindow, ipcRenderer } from "electron"
import { electronAPI } from "@electron-toolkit/preload"

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("ipcSend", electronAPI.ipcRenderer.send)
    contextBridge.exposeInMainWorld("ipcOn", electronAPI.ipcRenderer.on)
    contextBridge.exposeInMainWorld("ipcInvoke", electronAPI.ipcRenderer.invoke)
    // contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.ipcSend = electronAPI.ipcRenderer.send
  // @ts-ignore (define in dts)
  window.ipcOn = electronAPI.ipcRenderer.on
  // @ts-ignore (define in dts)
  window.ipcInvoke = electronAPI.ipcRenderer.invoke
}
