import { app, ipcMain, BrowserWindow } from "electron"
import { createWin } from "@main/helper"
import { showCustomMenu } from "@main/plugin/modules/MenuManger"
import { autoLaunch } from "@main/utils/autoLaunch"

app.on("ready", async () => {
  let recordWin: BrowserWindow | null = null

  // 创建窗口
  ipcMain.on("WIN_CREATE", (e, data) => {
    createWin(data)
  })

  // 隐藏窗口
  ipcMain.on("HIDE_WIN", (e, data) => {
    BrowserWindow.fromWebContents(e.sender)?.hide()
  })

  // 获取窗口位置
  ipcMain.handle("WIN_GET_POSITION", (e, data) => {
    return BrowserWindow.fromWebContents(e.sender)?.getPosition()
  })

  // 获取窗口状态
  ipcMain.handle("WIN_GET_MAXIMIZED_STATE", (e, data) => {
    return BrowserWindow.fromWebContents(e.sender)?.isMaximized()
  })

  // 最小化窗口
  ipcMain.on("WIN_MINIMIZE", (e, data) => {
    BrowserWindow.fromWebContents(e.sender)?.minimize()
  })

  // 最大化和还原窗口
  ipcMain.handle("WIN_MAXIMIZE", (e, data) => {
    return BrowserWindow.fromWebContents(e.sender)?.isMaximized()
      ? BrowserWindow.fromWebContents(e.sender)?.unmaximize()
      : BrowserWindow.fromWebContents(e.sender)?.maximize()
  })

  // 关闭窗口
  ipcMain.on("WIN_HIDE", (e, data) => {
    BrowserWindow.fromWebContents(e.sender)?.hide()
  })

  // 关闭窗口
  ipcMain.on("WIN_CLOSE", (e, data) => {
    BrowserWindow.fromWebContents(e.sender)?.close()
    // 退出应用
    app.quit()
  })

  // 打开录制窗口
  ipcMain.on("OPEN_RECORD_WIN", async (e, data) => {
    if (!recordWin) {
      recordWin = await createWin({
        config: {
          width: 800,
          height: 600,
          frame: false,
          minWidth: 300,
          minHeight: 240,
          // resizable: false,
          transparent: true,
          alwaysOnTop: true,
        },
        url: "/siteAssistTransprent/index.html",
        route: "record-win",
      })
      recordWin.on("ready-to-show", () => {
        recordWin && showCustomMenu(recordWin)
      })
      recordWin.webContents.on("context-menu", (e) => {
        console.log("context-menu", e)
        e.preventDefault()
      })
    }
    recordWin.show()
  })

  // 开机自启动
  // ipcMain.handle("SET_AUTO_LAUNCH", (_, bool) => {
  //   autoLaunch(bool === "true")
  // })
})
