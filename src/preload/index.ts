import { contextBridge, BrowserWindow, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
  createWin: (params) => {
    ipcRenderer.send("CREATE_WIN", params);
  },
  hideWin: () => {
    ipcRenderer.send("HIDE_WIN");
  },
  dragWin: (params) => {
    ipcRenderer.send("DRAG_WIN", params);
  },
  getWinPosition: async () => {
    return await ipcRenderer.invoke("GET_WIN_POSITION");
  },
  closeWin: () => {
    ipcRenderer.send("CLOSE_WIN");
  },
  selectFile: async () => {
    return await ipcRenderer.invoke("SELECT_FILE");
  },
  setStore: (key, value) => {
    ipcRenderer.send("SET_STORE", key, value);
  },
  setStoreSend: (key, value) => {
    ipcRenderer.send("SET_STORE_SEND", key, value);
  },
  getStore: async (key) => {
    return await ipcRenderer.invoke("GET_STORE", key);
  },
  ffmpegCommand: async (params) => {
    return await ipcRenderer.send("FFMPEG_COMMAND", params);
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
