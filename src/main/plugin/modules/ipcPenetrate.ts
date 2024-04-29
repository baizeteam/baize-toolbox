import { ipcMain, BrowserWindow } from "electron"

// 开启鼠标穿透
ipcMain.handle("WIN_PENTRATE_OPEN", (event, arg) => {
  BrowserWindow.fromWebContents(event.sender).setIgnoreMouseEvents(true, {
    forward: true
  })
})

// 关闭鼠标穿透
ipcMain.handle("WIN_PENTRATE_CLOSE", (event, arg) => {
  BrowserWindow.fromWebContents(event.sender).setIgnoreMouseEvents(false)
})
