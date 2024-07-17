import { app, BrowserWindow } from "electron"
import { electronApp, optimizer } from "@electron-toolkit/utils"
import "@main/plugin/mainModule"
import { createMainWin } from "@main/helper"

const addSubModel = () => {
  setTimeout(() => {
    import("@main/plugin/subModule")
  }, 1000)
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId("com.electron")
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createMainWin().then((win) => {
    win.on("show", addSubModel)
  })
  app.on("activate", async function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWin().then((win) => {
        addSubModel()
      })
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
