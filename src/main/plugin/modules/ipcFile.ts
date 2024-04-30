import { app, ipcMain, dialog } from "electron"
import { promisify } from "node:util"
import { openFile, deleteFile, checkFolderExists } from "../../utils/fileHelper"
import fs from "fs"
import path from "path"

app.on("ready", () => {
  // 选择文件
  ipcMain.handle("WIN_SELECT_FILE", async (e, data) => {
    return dialog
      .showOpenDialog({
        properties: ["openFile"],
      })
      .then((result) => {
        if (!result.canceled) {
          return result.filePaths
        } else {
          return null
        }
      })
  })

  // 选择文件夹
  ipcMain.handle("WIN_SELECT_FOLDER", async (e, data) => {
    return dialog
      .showOpenDialog({
        properties: ["openDirectory"],
      })
      .then((result) => {
        if (!result.canceled) {
          return result.filePaths
        } else {
          return null
        }
      })
  })

  // 打开文件
  ipcMain.handle("WIN_OPEN_FILE", async (e, data) => {
    return openFile(data.path)
  })

  // 删除文件
  ipcMain.handle("WIN_DELETE_FILE", async (e, data) => {
    return deleteFile(data.path)
  })

  // 下载base64文件
  ipcMain.handle("WIN_DOWNLOAD_BASE64", async (e, data) => {
    return new Promise((resolve) => {
      const { base64, fileName, filePath } = data
      checkFolderExists(filePath)
      const buffer = Buffer.from(base64, "base64")
      const downloadPath = path.join(filePath, fileName)
      fs.writeFile(downloadPath, buffer, (err) => {
        console.log("err", err)
        if (err) {
          resolve(err)
        } else {
          resolve(true)
        }
      })
    })
  })

  ipcMain.handle("WIN_DOWNLOAD_FILE", async (event, data) => {
    console.log(data)
    const { path, file } = data
    const writeFile = promisify(fs.writeFile)
    try {
      await writeFile(path, file)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  })
})
