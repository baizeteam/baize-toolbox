import { app, Tray, Menu, BrowserWindow } from "electron";
import { is } from "@electron-toolkit/utils";
import { join } from "path";
import i18n from "../../i18n";

export let tray: Tray;
// 系统托盘
app.on("ready", () => {
  tray = new Tray(join(app.getAppPath(), "resources", "icon.png"));
  initTray(tray);
});

export const initTray = (tray) => {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: i18n.t("tray.home"),
      type: "normal",
      click: () => {
        showMainPage("/siteMain/index.html#/home");
      },
    },
    {
      label: i18n.t("tray.setting"),
      type: "normal",
      click: () => {
        showMainPage("/siteMain/index.html#/setting");
      },
    },
    { label: i18n.t("tray.exit"), type: "normal", click: () => app.quit() },
  ]);
  tray.setToolTip(i18n.t("appTitle")); // 鼠标悬停时的提示文本
  tray.setContextMenu(contextMenu);
};

// 找到指定id的窗口
const findWindow = (customId: string) => {
  const allWindows = BrowserWindow.getAllWindows();
  return allWindows.find((window) => window["customId"] === customId);
};

// 显示主窗口中的指定页面
const showMainPage = (url) => {
  const mainWindow = findWindow("main");
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow?.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}${url}`);
  } else {
    mainWindow?.loadFile(join(__dirname, `../renderer${url}`));
  }
  mainWindow?.show();
};
