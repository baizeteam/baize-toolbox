import { app } from "electron"

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors")
app.commandLine.appendSwitch("disable-web-security")
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors") // 允许跨域
app.commandLine.appendSwitch("--ignore-certificate-errors", "true") // 忽略证书相关错误
// app.commandLine.appendSwitch('high-dpi-support', '1');
// app.commandLine.appendSwitch("force-device-scale-factor", "1");
