import ElectronStore from "electron-store";
import { app, ipcMain, BrowserWindow } from "electron";
import { queueStoreDelete } from "../../utils/storeHelper";

export const store = new ElectronStore();
const configIgnoreKeys = ["ttsList", "transcodeList", "extractList"];

// 设置 store
ipcMain.handle("SET_STORE", (_, key, value) => {
  store.set(key, value);
});

// 获取 store
ipcMain.handle("GET_STORE", (_, key) => {
  return store.get(key);
});

// 设置 store 并发送通知
ipcMain.on("SET_STORE_SEND", (_, { key, value, code }) => {
  store.set(key, value);
  const allWindows = BrowserWindow.getAllWindows();
  allWindows.forEach((window) => {
    window.webContents.send(`STORE_${code}_CHANGE`);
  });
});

// 根据id，删除store中的数据
ipcMain.handle("QUEUE_STORE_DELETE", (_, params) => {
  return queueStoreDelete(params);
});

// 恢复默认设置
ipcMain.handle("STORE_RESOTRE_CONFIG", () => {
  Object.keys(store.store).forEach((key) => {
    if (!configIgnoreKeys.includes(key)) {
      store.set(key, defaultStore[key]);
    }
  });
  electronRestart();
});

// 恢复所有设置
ipcMain.handle("STORE_RESOTRE_ALL", () => {
  Object.keys(store.store).forEach((key) => {
    store.set(key, defaultStore[key]);
  });
  electronRestart();
});

const DEFAULT_OUTPUT_PATH = app.getPath("documents") + "\\output";

const electronRestart = () => {
  app.relaunch();
  app.quit();
};

// 默认设置
const defaultStore = {
  defaultOutPath: DEFAULT_OUTPUT_PATH,
  defaultSetting: "default",
  theme: "system",
  i18n: "zhCN",
  ttsList: [],
  transcodeList: [],
  extractList: [],
};

const init = () => {
  const allWindows = BrowserWindow.getAllWindows();
  const sendChange = (key) => {
    allWindows.forEach((window) => {
      window.webContents.send(key);
    });
  };
  const changeObj = {
    theme: "STORE_THEME_CHANGE",
    i18n: "STORE_I18N_CHANGE",
  };
  Object.keys(defaultStore).forEach((key) => {
    if (store.get(key) === undefined) {
      store.set(key, defaultStore[key]);
      changeObj[key] && sendChange(changeObj[key]);
    }
  });
};

init();
