import LinuxAutoLaunch from "easy-auto-launch"
import { app } from "electron"

export const autoLaunch = async (isAutoLaunchEnabled: boolean = true) => {
  const electronIsDev = !app.isPackaged

  if (electronIsDev) {
    return
  }

  if (process.platform === "linux") {
    const autoLauncher = new LinuxAutoLaunch({
      name: app.getName(),
      isHidden: false,
      path: process.env.APPIMAGE,
    })

    if (isAutoLaunchEnabled) {
      await autoLauncher.enable()
    } else {
      await autoLauncher.disable()
    }

    return
  }

  app.setLoginItemSettings({
    openAtLogin: isAutoLaunchEnabled,
    openAsHidden: false,
  })
}
