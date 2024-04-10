class PlatformUtil {
  get isMac() {
    return window.injectData.system.patform === "darwin";
  }
  get isWin() {
    return window.injectData.system.patform === "win32";
  }
  get isLinux() {
    return window.injectData.system.patform === "linux";
  }
}

const platformUtil = new PlatformUtil();

export default platformUtil;
