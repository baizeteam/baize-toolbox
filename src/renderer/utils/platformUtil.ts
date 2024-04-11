class PlatformUtil {
  get isMac() {
    // return window.injectData.system.patform === "darwin";
    return navigator.userAgent.match(/Macintosh/i);
  }
  get isWin() {
    // return window.injectData.system.patform === "win32";
    return navigator.userAgent.match(/Windows/i);
  }
  get isLinux() {
    return navigator.userAgent.match(/Linux/i);
    // return window.injectData.system.patform === "linux";
  }
}

const platformUtil = new PlatformUtil();

export default platformUtil;
