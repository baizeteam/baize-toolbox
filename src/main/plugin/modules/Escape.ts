import { app, globalShortcut, BrowserWindow } from "electron";

app.whenReady().then(() => {
  escape();
});

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
