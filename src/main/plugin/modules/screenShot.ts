import { app, globalShortcut, BrowserWindow, desktopCapturer, screen, ipcMain } from "electron"
import { createWin, enterWinFullScreen, exitWinFullScreen } from "../../helper"
import { showCustomMenu } from "./MenuManger"

let screenShotWin: BrowserWindow | null = null
// 隐藏截图窗口
const hideScreenShotWin = () => {
  if (screenShotWin) {
    exitWinFullScreen(screenShotWin)
    screenShotWin.hide()
  }
}

// 显示截图窗口
const showScreenShotWin = async () => {
  if (screenShotWin) {
    const mousePoint = screen.getCursorScreenPoint()
    const display = screen.getDisplayNearestPoint(mousePoint)
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: display.size,
    })
    const source = sources.find((source) => {
      return source.display_id === String(display.id)
    })
    // screenShotWin.setBounds(display.bounds);
    screenShotWin.setSize(display.size.width, display.size.height)
    screenShotWin.setPosition(display.bounds.x, display.bounds.y)
    enterWinFullScreen(screenShotWin)
    screenShotWin.show()
    screenShotWin.webContents.send("GET_SCREEN_SHOT_STREAM", {
      source: source,
      display: display,
    })
  }
}

// 创建图片窗口
const createImageWin = async (data) => {
  const { width, height, base64, x, y } = data
  const config = {
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    skipTaskbar: true,
    show: false,
  }
  if (x !== undefined && y !== undefined) {
    config["x"] = x
    config["y"] = y
  }
  const imageWin = await createWin({
    config,
    url: "/siteAssistTransprent/index.html#/image-win",
    injectData: { base64 },
  })
  imageWin.setSize(width + 12, height + 12)
  imageWin.show()
}

app.whenReady().then(async () => {
  screenShotWin = await createWin({
    config: {
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      show: false,
    },
    url: "/siteAssistTransprent/index.html#/screen-shot-win",
  })
  screenShotWin.on("ready-to-show", () => {
    showCustomMenu(screenShotWin)
  })

  // 隐藏截图窗口
  ipcMain.handle("SCREEN_SHOT_WIN_HIDE", () => {
    hideScreenShotWin()
    return true
  })

  // 显示截图窗口
  ipcMain.handle("SCREEN_SHOT_WIN_SHOW", () => {
    showScreenShotWin()
    return true
  })

  // 创建图片窗口
  ipcMain.handle("SCREEN_SHOT_CREATE_IMAGE_WIN", async (event, data) => {
    hideScreenShotWin()
    const { display, cutInfo, base64 } = data
    createImageWin({
      width: cutInfo.width,
      height: cutInfo.height,
      base64,
      x: display.bounds.x + cutInfo.startX,
      y: display.bounds.y + cutInfo.startY,
    })
    return true
  })

  // 打开图片窗口
  ipcMain.handle("SCREEN_SHOT_OPEN_IMAGE_WIN", async (event, data) => {
    const { cutInfo, base64 } = data
    createImageWin({
      width: cutInfo.width,
      height: cutInfo.height,
      base64,
    })
    return true
  })

  escape()
  registerScreenShot()
})

// 退出
const escape = () => {
  globalShortcut.register("Escape", () => {
    hideScreenShotWin()
  })
}

const registerScreenShot = () => {
  // 注册截图快捷键
  globalShortcut.register("Alt+S", () => {
    showScreenShotWin()
  })
}
