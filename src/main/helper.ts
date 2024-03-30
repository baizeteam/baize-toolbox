import {
  BrowserWindow,
  screen,
  shell,
  BrowserWindowConstructorOptions,
} from "electron";
import { join } from "path";
import { is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { showCustomMenu } from "./plugin/modules/MenuManger";

// 注入数据
function InjectData(webContents, data) {
  webContents.on("did-finish-load", () => {
    webContents.executeJavaScript(`
      window.injectData = ${JSON.stringify(data)};
    `);
  });
}

// 加载的url
const initWinUrl = (win: BrowserWindow) => {
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}`);
  } else {
    win.loadFile(join(__dirname, `../renderer/index.html`));
  }
};

interface ICreateWin {
  config: BrowserWindowConstructorOptions;
  url: string;
  injectData?: any;
}

export function createWin({
  config,
  url,
  injectData,
}: ICreateWin): BrowserWindow {
  const win = new BrowserWindow({
    ...config,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: join(__dirname, "../preload/index.js"),
    },
  });
  InjectData(win.webContents, injectData);
  showCustomMenu(win);
  initWinUrl(win);
  return win;
}

export function createMainWin(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      webSecurity: false,
    },
  });
  mainWindow["customId"] = "main";
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    showCustomMenu(mainWindow);
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  initWinUrl(mainWindow);
}

export const mainLogSend = (data) => {
  const allWindows = BrowserWindow.getAllWindows();
  allWindows.forEach((window) => {
    window.webContents.send("MAIN_LOG", data);
  });
};
