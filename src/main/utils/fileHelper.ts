import fs from "fs";

// 检测文件夹，如果不存在，创建文件夹
export const checkFolderExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};
