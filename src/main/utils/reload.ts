import { app, BrowserWindow } from "electron";

export function electronReload() {
  if (process.env.NODE_ENV === "production") {
    app.relaunch();
    app.quit();
  } else {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((window) => {
      window.webContents.reload();
    });
    console.log("开发环境，不重启应用，直接刷新页面");
  }
}
