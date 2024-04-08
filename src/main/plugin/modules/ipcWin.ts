import { ipcMain, BrowserWindow } from "electron";
import { createWin } from "../../helper";

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
