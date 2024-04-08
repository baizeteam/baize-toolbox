import { app, ipcMain, dialog } from "electron";
import { openFolder } from "../../utils/fileHelper";
import fs from "fs";
import path from "path";

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

// 下载文件
ipcMain.handle("WIN_DOWNLOAD_FILE", async (e, data) => {
  return new Promise((resolve) => {
    const { base64, fileName, filePath } = data;
    const buffer = Buffer.from(base64, "base64");
    const downloadPath = path.join(filePath, fileName);
    fs.writeFile(downloadPath, buffer, (err) => {
      console.log("err", err);
      if (err) {
        resolve(err);
      } else {
        resolve(true);
      }
    });
  });
});
