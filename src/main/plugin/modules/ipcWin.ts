import { ipcMain, BrowserWindow } from "electron";
import { createWin } from "../../helper";

ipcMain.on("CREATE_WIN", (e, data) => {
  createWin(data);
});

ipcMain.on("HIDE_WIN", (e, data) => {
  BrowserWindow.fromWebContents(e.sender)?.hide();
});

ipcMain.on("DRAG_WIN", (e, data) => {
  if (e?.sender && !isNaN(data.x) && !isNaN(data.y)) {
    BrowserWindow.fromWebContents(e.sender)?.setPosition(data.x, data.y);
  }
});

ipcMain.handle("GET_WIN_POSITION", (e, data) => {
  return BrowserWindow.fromWebContents(e.sender)?.getPosition();
});

ipcMain.on("CLOSE_WIN", (e, data) => {
  BrowserWindow.fromWebContents(e.sender)?.close();
});
