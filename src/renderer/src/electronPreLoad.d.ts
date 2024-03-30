import { ElectronAPI } from "@electron-toolkit/preload/dist";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: any;
    injectData: any;
    windowBounds?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }
}
