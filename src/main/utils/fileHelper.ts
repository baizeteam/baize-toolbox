import fs from "fs";
import { shell } from "electron";

// 检测文件夹，如果不存在，创建文件夹
export const checkFolderExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

// 打开文件夹
export const openFolder = (folderPath: string) => {
  // 检查文件夹是否存在
  fs.access(folderPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("文件夹不存在:", err);
      return;
    }
    shell.openPath(folderPath);
  });
};
