import { app, globalShortcut, BrowserWindow } from "electron";

app.whenReady().then(() => {
  escape();
});

// 退出
const escape = () => {
  globalShortcut.register("Escape", () => {
    console.log("Escape is pressed");
    const allWin = BrowserWindow.getAllWindows();
    allWin.forEach((win) => {
      if (win["tag"] === "captureWin") {
        win.hide();
      }
    });
  });
};
