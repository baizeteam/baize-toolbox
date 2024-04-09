import fs from "fs";
import { shell } from "electron";

// 检测文件夹，如果不存在，创建文件夹
export const checkFolderExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

// 打开文件、文件夹
export const openFile = (filePath: string) => {
  // 检查文件夹是否存在
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else {
        shell.openPath(filePath);
        resolve(true);
      }
    });
  });
};

// 删除文件
export const deleteFile = (filePath: string) => {
  return new Promise((resolve) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
