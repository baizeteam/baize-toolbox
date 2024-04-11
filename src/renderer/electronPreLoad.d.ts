import { ElectronAPI } from "@electron-toolkit/preload/dist";

declare global {
  interface Window {
    electron: ElectronAPI;
    injectData: any;
    windowBounds?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }
}
