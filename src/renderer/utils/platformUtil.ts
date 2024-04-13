class PlatformUtil {
  get isMac() {
    return window.electron.process.platform === "darwin";
  }
  get isWin() {
    return window.electron.process.platform === "win32";
  }
  get isLinux() {
    return window.electron.process.platform === "linux";
  }
}

const platformUtil = new PlatformUtil();

export default platformUtil;
