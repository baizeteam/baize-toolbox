import { BrowserWindow, ipcMain, screen } from "electron";
import { spawn } from "child_process";
import { getFfmpegPath } from "./ffmpeg";

let ffmpegProcess = null;

ipcMain.handle("SCREEN_GET_CURRENT_INFO", async (e, data) => {
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
  bounds.x = windowX * scaleFactor;
  bounds.y = windowY * scaleFactor;
  bounds.width *= scaleFactor;
  bounds.height *= scaleFactor;
  return bounds;
});

// 开始录屏
ipcMain.handle("SCREEN_RECORD_START", async (e, params) => {
  const { ffmpegPath } = getFfmpegPath();
  console.log(params.command);
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
  ffmpegProcess.on("exit", (code, signal) => {
    console.log(`FFmpeg进程退出，退出码：${code}，信号：${signal}`);
  });
  ffmpegProcess.stdin.write("q\n");
});
