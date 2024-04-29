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
import { InjectData } from "./utils/inject";
import { getSystemInfo } from "./utils/systemHelper";

let mainWindow: BrowserWindow;
let loadingWin: BrowserWindow;
const a = {
  '测试':                         'git-hook + prettier'
}
export enum START_STATUS {
  pedding = "pedding",
  success = "success",
  fail = "fail",
}
const mainWinStart = {
  web: START_STATUS.pedding,
  ffmpeg: START_STATUS.pedding,
};
const handler = {
  set(target, p, value) {
    Reflect.set(target, p, value);
    onMainWinStartChange();
    return true;
  },
};
export const mainWinStartProxy = new Proxy(mainWinStart, handler);
export function onMainWinStartChange() {
  let tag = true;
  Object.keys(mainWinStart).forEach((key) => {
    if (mainWinStart[key] !== START_STATUS.success) {
      tag = false;
    }
  });
  if (tag) {
    // console.log('loading hide')
    mainWindow.show();
    loadingWin.hide();
  }else{
    // console.log('loading...')
  }
  // console.log(mainWinStartProxy, 'mainWinStartProxy')
}

export function createloadingWin() {
  loadingWin = new BrowserWindow({
    width: 300,
    height: 100,
    frame: false, // 隐藏窗口边框
    transparent: true, // 设置窗口背景透明
    alwaysOnTop: true, // 置顶显示
    hasShadow: false, // 隐藏窗口阴影
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: join(__dirname, "../preload/index.js"),
    },
  });

  initWinUrl(loadingWin, "/siteElectronLoading/index.html");
}

// 加载的url
export function initWinUrl(win: BrowserWindow, url: string) {
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}${url}`);
  } else {
    win.loadFile(join(__dirname, `../renderer${url}`));
  }
}

interface ICreateWin {
  config: BrowserWindowConstructorOptions;
  url: string;
  injectData?: any;
}

export async function createWin({
  config,
  url,
  injectData,
}: ICreateWin): Promise<BrowserWindow> {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      sandbox: false,
      webSecurity: false,
      preload: join(__dirname, "../preload/index.js"),
      experimentalFeatures: true,
      enableBlinkFeatures: "MediaStreamTrack.getDisplayMedia",
    },
    ...config,
  });
  InjectData({
    webContents: win.webContents,
    data: {
      system: await getSystemInfo(),
      ...injectData,
    },
  });
  initWinUrl(win, url);
  return win;
}

export async function createMainWin(): Promise<void> {
  mainWindow = await createWin({
    config: {
      width: 1200,
      height: 720,
      show: false,
      minWidth: 800,
      minHeight: 600,
      autoHideMenuBar: true,
      frame: false,
      ...(process.platform === "linux" ? { icon } : {}),
    },
    url: "/siteMain/index.html",
  });
  mainWindow["customId"] = "main";
  mainWindow.on("ready-to-show", () => {
    showCustomMenu(mainWindow);
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("did-start-loading", () => {
    if (!loadingWin) {
      createloadingWin();
    }
    if (mainWinStartProxy.web === START_STATUS.pedding) {
      loadingWin.show();
    }
  });
  mainWindow.webContents.on("did-stop-loading", () => {
    if (loadingWin && mainWinStart.web !== START_STATUS.success) {
      setTimeout(() => {
        mainWinStartProxy.web = START_STATUS.success;
      }, 200);
    }
  });
  // initWinUrl(mainWindow, "/siteMain/index.html");
}

export function mainLogSend(data) {
  const allWindows = BrowserWindow.getAllWindows();
  allWindows.forEach((window) => {
    window.webContents.send("MAIN_LOG", data);
  });
}

// 进入全屏模式
export function enterWinFullScreen(win: BrowserWindow) {
  win.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  });
  win.setSimpleFullScreen(true);
}

// 退出全屏模式
export function exitWinFullScreen(win: BrowserWindow) {
  win.setVisibleOnAllWorkspaces(false, {
    visibleOnFullScreen: false,
  });
  win.setSimpleFullScreen(false);
}
