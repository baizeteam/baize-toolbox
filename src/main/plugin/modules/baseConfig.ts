import { app, session } from "electron"

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
app.commandLine.appendSwitch("max-old-space-size", "16384")
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors")
app.commandLine.appendSwitch("disable-web-security")
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors") // 允许跨域
app.commandLine.appendSwitch("--ignore-certificate-errors", "true") // 忽略证书相关错误
// app.commandLine.appendSwitch('high-dpi-support', '1');
// app.commandLine.appendSwitch("force-device-scale-factor", "1");

app.on("ready", () => {
  const ses = session.defaultSession

  // 检查是否已授权访问麦克风
  ses.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === "media") {
      callback(true) // 授予权限
    } else {
      callback(false) // 拒绝其他权限
    }
  })
})
