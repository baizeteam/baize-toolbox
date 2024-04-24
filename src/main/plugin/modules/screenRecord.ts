import { BrowserWindow, ipcMain, screen } from "electron";
import { spawn } from "child_process";
import { getFfmpegPath } from "./ffmpeg";
import { checkFolderExists } from "../../utils/fileHelper";
import { queueStoreAdd, queueStoreUpdate } from "../../utils/storeHelper";

let ffmpegProcess = null;

ipcMain.handle("SCREEN_RECORD_GET_CURRENT_INFO", async (e, data) => {
  const cur = BrowserWindow.fromWebContents(e.sender);
  const bounds = cur.getBounds();
  const currentDisplay = screen.getDisplayNearestPoint({
    x: bounds.x,
    y: bounds.y,
  });
  const scaleFactor = currentDisplay.scaleFactor;
  const windowX =
    currentDisplay.nativeOrigin.x - currentDisplay.bounds.x + bounds.x;
  const windowY =
    currentDisplay.nativeOrigin.y - currentDisplay.bounds.y + bounds.y;
  bounds.x = windowX;
  bounds.y = windowY;
  bounds["scaleFactor"] = scaleFactor;
  return bounds;
});

// 开始录屏
ipcMain.handle("SCREEN_RECORD_START", async (e, params) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  win.setResizable(false);
  win.setMovable(false);
  const { ffmpegPath } = getFfmpegPath();
  checkFolderExists(params.outputFloaderPath);
  queueStoreAdd({
    params: { ...params },
    key: `${params.code}List`,
  });

  const allWindows = BrowserWindow.getAllWindows();
  allWindows.forEach((window) => {
    if (window["customId"] === "main") {
      window.webContents.send("SCREEN_RECORD_DATA_CHANGE");
    }
  });

  ffmpegProcess = spawn(ffmpegPath, params.command);
  ffmpegProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });
  ffmpegProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
  ffmpegProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

// 结束录屏
ipcMain.handle("SCREEN_RECORD_STOP", async (e, data) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  win.setResizable(true);
  win.setMovable(true);
  ffmpegProcess.on("exit", (code, signal) => {
    console.log(`FFmpeg进程退出，退出码：${code}，信号：${signal}`);
  });
  ffmpegProcess.stdin.write("q\n");
});
