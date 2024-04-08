import { ipcMain, BrowserWindow, dialog } from "electron";
import { createWin } from "../../helper";
import { openFolder } from "../../utils/fileHelper";

// 创建窗口
ipcMain.on("WIN_CREATE", (e, data) => {
  createWin(data);
});

// 隐藏窗口
ipcMain.on("HIDE_WIN", (e, data) => {
  BrowserWindow.fromWebContents(e.sender)?.hide();
});

// 窗口拖拽
ipcMain.on("WIN_DRAG", (e, data) => {
  if (e?.sender && !isNaN(data.x) && !isNaN(data.y)) {
    BrowserWindow.fromWebContents(e.sender)?.setPosition(data.x, data.y);
  }
});

// 获取窗口位置
ipcMain.handle("WIN_GET_POSITION", (e, data) => {
  return BrowserWindow.fromWebContents(e.sender)?.getPosition();
});

// 关闭窗口
ipcMain.on("WIN_CLOSE", (e, data) => {
  BrowserWindow.fromWebContents(e.sender)?.close();
});

// 选择文件
ipcMain.handle("WIN_SELECT_FILE", async (e, data) => {
  return dialog
    .showOpenDialog({
      properties: ["openFile"],
    })
    .then((result) => {
      if (!result.canceled) {
        return result.filePaths;
      } else {
        return null;
      }
    });
});

// 选择文件夹
ipcMain.handle("WIN_SELECT_FOLDER", async (e, data) => {
  return dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((result) => {
      if (!result.canceled) {
        return result.filePaths;
      } else {
        return null;
      }
    });
});

// 打开文件夹
ipcMain.on("WIN_OPEN_FOLDER", async (e, data) => {
  console.log(data);
  openFolder(data.path);
});
