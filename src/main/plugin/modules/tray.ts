import { app, Tray, Menu, BrowserWindow } from "electron";
import { is } from "@electron-toolkit/utils";
import { join } from "path";

// todo: 系统托盘i18n接入

// 系统托盘
app.on("ready", () => {
  const tray = new Tray(join(app.getAppPath(), "resources", "icon.png")); // 换成你的系统托盘图标的路径
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "主页",
      type: "normal",
      click: () => {
        showMainPage("/siteMain/index.html#/home");
      },
    },
    {
      label: "设置",
      type: "normal",
      click: () => {
        showMainPage("/siteMain/index.html#/setting");
      },
    },
    { label: "退出", type: "normal", click: () => app.quit() },
  ]);
  tray.setToolTip("白泽工具箱"); // 鼠标悬停时的提示文本
  tray.setContextMenu(contextMenu);
});

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
