import {
  app,
  globalShortcut,
  BrowserWindow,
  desktopCapturer,
  screen,
} from "electron";
import { createWin } from "../../helper";
import { showCustomMenu } from "./MenuManger";

let screenShotWin: BrowserWindow | null = null;
app.whenReady().then(async () => {
  screenShotWin = await createWin({
    config: {
      frame: false,
      // resizable: false,
      transparent: true,
      alwaysOnTop: true,
      show: false,
    },
    url: "/siteAssistTransprent/index.html#/screen-shot-win",
  });
  screenShotWin.on("ready-to-show", () => {
    showCustomMenu(screenShotWin);
  });
  escape();
  registerScreenShot();
});

// 退出
const escape = () => {
  globalShortcut.register("Escape", () => {
    console.log("Escape is pressed");
    screenShotWin.hide();
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
    screenShotWin.setBounds(display.bounds);
    screenShotWin.show();
    screenShotWin.webContents.send(
      "GET_SCREEN_SHOT_IMG",
      source.thumbnail.toDataURL(),
    );
  });
};
