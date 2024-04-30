import { app, BrowserWindow } from "electron"

// 重新加载页面
export function electronReload() {
  const allWindows = BrowserWindow.getAllWindows()
  allWindows.forEach((window) => {
    window.webContents.reload()
  })
}

// 重新启动应用
export function electronRestart() {
  if (process.env.NODE_ENV === "production") {
    app.relaunch()
    app.quit()
  } else {
    const allWindows = BrowserWindow.getAllWindows()
    allWindows.forEach((window) => {
      window.webContents.reload()
    })
    console.log("开发环境，不重启应用，直接刷新页面")
  }
}
