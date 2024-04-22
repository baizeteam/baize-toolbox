import {
  app,
  globalShortcut,
  BrowserWindow,
  desktopCapturer,
  screen,
} from "electron";

app.whenReady().then(() => {
  escape();
  registerScreenShot();
});

// 退出
const escape = () => {
  globalShortcut.register("Escape", () => {
    console.log("Escape is pressed");
  });
};

const registerScreenShot = () => {
  // 注册截图快捷键
  globalShortcut.register("Alt+S", async () => {
    console.log("Alt+S is pressed");
    const mousePoint = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(mousePoint);
    console.log(display);
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: display.size,
    });
    const source = sources.find((source) => {
      return source.display_id === String(display.id);
    });
    console.log(source);
  });
};
