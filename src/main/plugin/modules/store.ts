import ElectronStore from "electron-store"
import { app, ipcMain, BrowserWindow } from "electron"
import { queueStoreDelete } from "@main/utils/storeHelper"
import { electronReload, electronRestart } from "@main/utils/reload"
import i18n from "@main/i18n"
import { tray, initTray } from "@main/plugin/modules/tray"

export const store = new ElectronStore()
const configIgnoreKeys = ["ttsList", "transcodeList", "extractList", "compressList"]

// 设置 store
ipcMain.handle("SET_STORE", (_, key, value) => {
  store.set(key, value)
})

// 获取 store
ipcMain.handle("GET_STORE", (_, key) => {
  return store.get(key)
})

// 设置 store 并刷新页面
ipcMain.handle("SET_STORE_RELOAD", (_, { key, value, code }) => {
  store.set(key, value)
  const allWindows = BrowserWindow.getAllWindows()
  if (key === "i18n") {
    // 如果是语言切换，则需要重新初始化托盘图标
    i18n.changeLanguage(value)
    initTray(tray)
  }
  allWindows.forEach((window) => {
    electronReload()
    // window.webContents.send(`STORE_${code}_CHANGE`);
  })
})

// 根据id，删除store中的数据
ipcMain.handle("QUEUE_STORE_DELETE", (_, params) => {
  return queueStoreDelete(params)
})

// 重置store某个字段
ipcMain.handle("RESET_STORE_BY_KEY", (_, key) => {
  store.set(key, defaultStore[key])
  return
})

// 恢复默认设置
ipcMain.handle("STORE_RESTORE_CONFIG", () => {
  Object.keys(store.store).forEach((key) => {
    if (!configIgnoreKeys.includes(key)) {
      store.set(key, defaultStore[key])
    }
  })
  electronRestart()
})

// 恢复所有设置
ipcMain.handle("STORE_RESTORE_ALL", () => {
  Object.keys(store.store).forEach((key) => {
    store.set(key, defaultStore[key])
  })
  electronRestart()
})

const DEFAULT_OUTPUT_PATH = app.getPath("documents") + "\\output"

// 默认设置
const defaultStore = {
  defaultOutPath: DEFAULT_OUTPUT_PATH,
  whisperModelPath: "",
  defaultSetting: "default",
  theme: "system",
  isAutoLaunch: "false",
  i18n: "zhCN",
  ttsList: [],
  transcodeList: [],
  extractList: [],
  screenRecordList: [],
  screenShotList: [],
  compressList: [],
}

const init = () => {
  let reloadTag = false
  Object.keys(defaultStore).forEach((key) => {
    if (store.get(key) === undefined) {
      store.set(key, defaultStore[key])
      reloadTag = true
    }
  })
  if (reloadTag) {
    electronReload()
  }
}

init()
