import { app, ipcMain, BrowserWindow } from "electron";
import { createWin } from "../../helper";

app.on("ready", () => {
  // 创建窗口
  ipcMain.on("WIN_CREATE", (e, data) => {
    createWin(data);
  });

  // 隐藏窗口
  ipcMain.on("HIDE_WIN", (e, data) => {
    BrowserWindow.fromWebContents(e.sender)?.hide();
  });

  // 获取窗口位置
  ipcMain.handle("WIN_GET_POSITION", (e, data) => {
    return BrowserWindow.fromWebContents(e.sender)?.getPosition();
  });

  // 获取窗口状态
  ipcMain.handle("WIN_GET_MAXIMIZED_STATE", (e, data) => {
    return BrowserWindow.fromWebContents(e.sender)?.isMaximized();
  });

  // 最小化窗口
  ipcMain.on("WIN_MINIMIZE", (e, data) => {
    BrowserWindow.fromWebContents(e.sender)?.minimize();
  });

  // 最大化和还原窗口
  ipcMain.handle("WIN_MAXIMIZE", (e, data) => {
    console.log(BrowserWindow.fromWebContents(e.sender)?.isMaximized());
    return BrowserWindow.fromWebContents(e.sender)?.isMaximized()
      ? BrowserWindow.fromWebContents(e.sender)?.restore()
      : BrowserWindow.fromWebContents(e.sender)?.maximize();
  });

  // 关闭窗口
  ipcMain.on("WIN_CLOSE", (e, data) => {
    BrowserWindow.fromWebContents(e.sender)?.close();
    // 退出应用
    app.quit();
  });
});
