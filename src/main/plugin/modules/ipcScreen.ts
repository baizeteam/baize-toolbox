import {
  app,
  BrowserWindow,
  dialog,
  desktopCapturer,
  ipcMain,
  screen,
} from "electron";
import { writeFile } from "fs";
import { execFile, spawn } from "child_process";
import path, { resolve } from "path";
import { checkFolderExists } from "../../utils/fileHelper";
import { queueStoreAdd, queueStoreUpdate } from "../../utils/storeHelper";
import { mainWinStartProxy, START_STATUS } from "../../helper";
import { getFfmpegPath } from "./ffmpeg";

let ffmpegProcess = null;
let isRecordingPaused = false;

ipcMain.handle("SCREEN_GET_CURRENT_INFO", async (e, data) => {
  // return screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  return BrowserWindow.fromWebContents(e.sender).getBounds();
});

// 开始录屏
ipcMain.handle("SCREEN_RECORD_START", async (e, params) => {
  const { ffmpegPath } = getFfmpegPath();
  // const captureProcess = spawn("screencapture", [
  //   "-x",
  //   "-R0,0,1280,720",
  //   "-t",
  //   "mov",
  //   "-r",
  //   "30",
  //   "-",
  // ]);
  // captureProcess.stdout.pipe(ffmpegProcess.stdin);
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

// 暂停录屏
ipcMain.handle("SCREEN_RECORD_PAUSE", async (e, data) => {
  isRecordingPaused = true;
  ffmpegProcess.kill("SIGSTOP");
  return isRecordingPaused;
});

// 恢复录屏
ipcMain.handle("SCREEN_RECORD_RESUME", async (e, data) => {
  isRecordingPaused = false;
  ffmpegProcess.kill("SIGCONT");
  return isRecordingPaused;
});

// 结束录屏
ipcMain.handle("SCREEN_RECORD_STOP", async (e, data) => {
  ffmpegProcess.kill("SIGINT");
  ffmpegProcess = null;
});

// ipcMain.handle("SCREEN_RECORD_START", async (e, data) => {
//   return await startRecording();
// });

// async function startRecording() {
//   const currentScreen = screen.getDisplayNearestPoint(
//     screen.getCursorScreenPoint(),
//   );
//   const sources = await desktopCapturer.getSources({ types: ["screen"] });
//   return sources.find(
//     (source) => source.display_id === String(currentScreen.id),
//   );
// }
