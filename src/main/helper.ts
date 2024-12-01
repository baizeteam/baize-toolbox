import { BrowserWindow, screen, shell, BrowserWindowConstructorOptions, app } from "electron"
import { join, dirname } from "path"
import { is } from "@electron-toolkit/utils"
import icon from "@resources/icon.png?asset"
import { showCustomMenu } from "@main/plugin/modules/MenuManger"
import { InjectData } from "@main/utils/inject"
import { getSystemInfo } from "@main/utils/systemHelper"

let mainWindow: BrowserWindow
export enum START_STATUS {
  pending = "pending",
  success = "success",
  fail = "fail",
}

// 加载的url
export function initWinUrl(win: BrowserWindow, url: string) {
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}${url}`)
  } else {
    win.loadFile(join(__dirname, `../renderer${url}`))
  }
}

interface ICreateWin {
  config: BrowserWindowConstructorOptions
  url: string
  injectData?: any
  route?: string
}

export async function createWin({ config, url, injectData, route }: ICreateWin): Promise<BrowserWindow> {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: false,
      preload: join(__dirname, "../preload/index.js"),
      experimentalFeatures: true,
      enableBlinkFeatures: "MediaStreamTrack.getDisplayMedia",
    },
    ...config,
  })
  const resourcesDir = dirname(app.getAppPath())
  InjectData({
    webContents: win.webContents,
    data: {
      system: await getSystemInfo(),
      unpackedResourcePath: is.dev ? app.getAppPath() : join(resourcesDir, "app.asar.unpacked"),
      ...injectData,
    },
  })
  if (route) {
    win.webContents.on("did-finish-load", () => {
      win.webContents.send("INIT_ROUTE", route)
    })
  }
  initWinUrl(win, url)
  return win
}

export async function createMainWin(): Promise<BrowserWindow> {
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
  })
  mainWindow["customId"] = "main"
  mainWindow.on("ready-to-show", () => {
    showCustomMenu(mainWindow)
    mainWindow.show()
  })
  return mainWindow
  // initWinUrl(mainWindow, "/siteMain/index.html");
}

export function mainLogSend(data) {
  const allWindows = BrowserWindow.getAllWindows()
  allWindows.forEach((window) => {
    window.webContents.send("MAIN_LOG", data)
  })
}

// 进入全屏模式
export function enterWinFullScreen(win: BrowserWindow) {
  win.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  })
  win.setSimpleFullScreen(true)
}

// 退出全屏模式
export function exitWinFullScreen(win: BrowserWindow) {
  win.setVisibleOnAllWorkspaces(false, {
    visibleOnFullScreen: false,
  })
  win.setSimpleFullScreen(false)
}

// 主窗口通信
export function mainWinSend(key, data) {
  mainWindow.webContents.send(key, data)
}
