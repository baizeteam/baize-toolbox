import ElectronStore from "electron-store";
import { ipcMain, BrowserWindow } from "electron";

const store = new ElectronStore();

ipcMain.on("SET_STORE", (_, key, value) => {
  store.set(key, value);
});

ipcMain.handle("GET_STORE", (_, key) => {
  return store.get(key);
});

ipcMain.on("SET_STORE_SEND", (_, key, value) => {
  store.set(key, value);
  const allWindows = BrowserWindow.getAllWindows();
  allWindows.forEach((window) => {
    window.webContents.send("THEME_CHANGE");
  });
});

// 默认设置
const defaultStore = {
  defaultSetting: "default",
  theme: "system",
};

if (!store.get("defaultSetting")) {
  Object.keys(defaultStore).forEach((key) => {
    store.set(key, defaultStore[key]);
  });
  const allWindows = BrowserWindow.getAllWindows();
  allWindows.forEach((window) => {
    window.webContents.send("THEME_CHANGE");
  });
}
