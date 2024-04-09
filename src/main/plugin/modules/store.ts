import ElectronStore from "electron-store";
import { app, ipcMain, BrowserWindow } from "electron";

export const store = new ElectronStore();

ipcMain.handle("SET_STORE", (_, key, value) => {
  store.set(key, value);
});

ipcMain.handle("GET_STORE", (_, key) => {
  return store.get(key);
});

ipcMain.on("SET_STORE_SEND", (_, { key, value, code }) => {
  store.set(key, value);
  const allWindows = BrowserWindow.getAllWindows();
  allWindows.forEach((window) => {
    window.webContents.send(`STORE_${code}_CHANGE`);
  });
});

const DEFAULT_OUTPUT_PATH = app.getPath("documents") + "\\output";

// 默认设置
const defaultStore = {
  defaultOutPath: DEFAULT_OUTPUT_PATH,
  defaultSetting: "default",
  theme: "system",
  ttsList: [],
  i18n: "zhCN",
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
